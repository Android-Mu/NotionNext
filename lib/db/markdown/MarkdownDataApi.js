/**
 * 本地 Markdown 数据源
 * 读取 content/ 目录：site-data.json(站点配置冻结) + posts/*.md + pages/*.md
 * 输出与 Notion 数据源（SiteDataApi）同构的数据，供全站使用
 *
 * 目录结构:
 *   content/site-data.json   站点配置（从 Notion 冻结）
 *   content/posts/*.md       文章（type: Post）
 *   content/pages/*.md       单页（type: Page，如 home/aigc/软件安装）
 */
import fs from 'fs'
import path from 'path'
import BLOG from '@/blog.config'
import { parseFrontmatter } from './parseFrontmatter'
import { mdToRecordMap } from './mdToBlocks'
import { processPostData } from '@/lib/utils/post'
import {
  fetchNotionPageBlocks,
  formatNotionBlock
} from '@/lib/db/notion/getPostBlocks'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// 模块级缓存：构建期内只读一次磁盘
let _cache = null

function readJson(f) {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf-8'))
}

function loadContent() {
  if (_cache) return _cache
  const siteData = readJson('site-data.json')
  const pages = []
  for (const dir of ['posts', 'pages']) {
    const full = path.join(CONTENT_DIR, dir)
    if (!fs.existsSync(full)) continue
    for (const f of fs.readdirSync(full)) {
      if (!f.endsWith('.md')) continue
      const { data, body } = parseFrontmatter(
        fs.readFileSync(path.join(full, f), 'utf-8')
      )
      pages.push({ file: dir + '/' + f, data, body })
    }
  }
  // 冻结的 Notion 上下文（保证渲染与 Notion 版完全一致）
  let collectionCtx = null
  let frozenProps = {}
  let frozenPublishDate = {}
  try {
    collectionCtx = readJson('collection-context.json')
  } catch (e) { /* 无则不渲染属性表 */ }
  try {
    frozenProps = readJson('post-properties.json')
  } catch (e) { /* ignore */ }
  try {
    frozenPublishDate = readJson('post-publish-date.json')
  } catch (e) { /* ignore */ }
  _cache = { siteData, pages, collectionCtx, frozenProps, frozenPublishDate }
  return _cache
}

function tagColorMap() {
  const { siteData } = loadContent()
  const m = {}
  for (const t of siteData.tagOptions || []) {
    if (t?.name || t?.tag) m[t.name || t.tag] = t.color || 'blue'
  }
  return m
}

function dayString(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return String(dateStr)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

/** 单篇 MD → NotionNext 文章模型（与 Notion 源字段一一对应） */
function buildPostModel({ data, body }) {
  const { siteData, frozenPublishDate } = loadContent()
  const id = data.id || ''
  const type = data.type === 'Page' ? 'Page' : 'Post'
  const fileSlug = data.slug || ''
  // Post 的 slug 带 article/ 前缀，保持与历史 URL 完全一致
  const slug = fileSlug || (type === 'Post' ? 'article/' + id : id)
  const dateStr = data.date || ''
  // 迁移文章沿用 Notion 原始计算的 publishDate（时区口径一致）；新文章按 +8 区零点
  const publishDate = frozenPublishDate[id] ?? (dateStr ? new Date(dateStr + 'T00:00:00+08:00').getTime() : 0)
  const rawTags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : []
  // 与 Notion 版一致：tags 保留原始值；tagItems 仅保留标签选项(schema)内的（迁移文章）
  const validTags = new Set(
    (siteData.tagOptions || []).map(t => t.name || t.tag).filter(Boolean)
  )
  const isMigrated = id && Object.prototype.hasOwnProperty.call(frozenPublishDate, id)
  const tags = rawTags
  const displayTags = isMigrated ? rawTags.filter(t => validTags.has(t)) : rawTags
  const colors = tagColorMap()
  return {
    id,
    title: data.title || '',
    slug,
    type,
    status: data.status === 'Draft' ? 'Draft' : 'Published',
    category: data.category || '',
    tags,
    summary: data.summary || '',
    date: { start_date: dateStr },
    publishDate,
    publishDay: dayString(dateStr),
    lastEditedDate: data.lastEditedDate || '',
    lastEditedDay: data.lastEditedDate ? dayString(data.lastEditedDate) : '',
    pageIcon: data.icon || '',
    pageCover: data.cover || '',
    pageCoverThumbnail: data.cover || '',
    password: data.password || '',
    comment: '',
    fullWidth: false,
    ext: {},
    tagItems: displayTags.map(t => ({ name: t, color: colors[t] || 'blue' })),
    href: slug.startsWith('http') ? slug : '/' + slug,
    target: '_self'
  }
}

/** 全站数据（与 Notion 版 fetchGlobalAllData 返回同构） */
export async function fetchGlobalAllDataFromMarkdown({ from, locale } = {}) {
  const { siteData, pages } = loadContent()

  const allModels = pages.map(buildPostModel)
  // 排序：沿用迁移时冻结的原始顺序（Notion 里有手动置顶/拖动）；
  // 新文章（不在冻结清单）按发布时间插到最前
  const orderIdx = new Map(
    (siteData.postOrder || []).map((slug, i) => [slug, i])
  )
  const frozen = []
  const fresh = []
  for (const p of allModels) {
    if (orderIdx.has(p.slug)) frozen.push(p)
    else fresh.push(p)
  }
  frozen.sort((a, b) => orderIdx.get(a.slug) - orderIdx.get(b.slug))
  fresh.sort((a, b) => (b.publishDate || 0) - (a.publishDate || 0))
  const allPages = [...fresh, ...frozen]

  const posts = allPages.filter(p => p.type === 'Post' && p.status === 'Published')

  // 分类/标签选项：颜色沿用冻结配置，计数实时重算
  const catColor = new Map(
    (siteData.categoryOptions || []).map(c => [c.name, c.color || 'gray'])
  )
  const catId = new Map((siteData.categoryOptions || []).map(c => [c.name, c.id]))
  const catCount = new Map()
  for (const p of posts) {
    if (p.category) catCount.set(p.category, (catCount.get(p.category) || 0) + 1)
  }
  // 顺序与 Notion 版一致：按冻结的 schema 选项顺序排列，未收录的新分类追加在末尾
  const frozenCats = siteData.categoryOptions || []
  const categoryOptions = []
  const usedCats = new Set(catCount.keys())
  for (const c of frozenCats) {
    if (c?.name && catCount.has(c.name)) {
      categoryOptions.push({
        name: c.name,
        color: c.color || catColor.get(c.name) || 'gray',
        count: catCount.get(c.name)
      })
    }
  }
  for (const name of catCount.keys()) {
    if (!frozenCats.some(c => c?.name === name)) {
      categoryOptions.push({ name, color: catColor.get(name) || 'gray', count: catCount.get(name) })
    }
  }

  const tagCount = new Map()
  for (const p of posts) {
    for (const t of p.tags || []) {
      tagCount.set(t, (tagCount.get(t) || 0) + 1)
    }
  }
  const colors = tagColorMap()
  // 顺序与 Notion 版一致：按冻结的 schema 选项顺序，新标签追加在末尾
  const frozenTags = siteData.tagOptions || []
  const tagOptions = []
  for (const t of frozenTags) {
    const name = t?.name || t?.tag
    if (name && tagCount.has(name)) {
      tagOptions.push({ name, color: t.color || colors[name] || 'blue', count: tagCount.get(name) })
    }
  }
  for (const name of tagCount.keys()) {
    if (!frozenTags.some(t => (t?.name || t?.tag) === name)) {
      tagOptions.push({ name, color: colors[name] || 'blue', count: tagCount.get(name) })
    }
  }

  // allNavPages: 侧栏导航列表（与 Notion 版 shortenIds 后的字段一致）
  const shortId = id => (id && id.includes('-') ? id.substring(14) : id || '')
  const allNavPages = posts.map(p => ({
    title: p.title,
    pageCoverThumbnail: p.pageCoverThumbnail,
    category: p.category,
    tags: p.tags,
    summary: p.summary,
    slug: p.slug,
    href: p.href,
    ext: {},
    pageIcon: p.pageIcon,
    publishDate: p.publishDate,
    lastEditedDate: p.lastEditedDate,
    short_id: shortId(p.id)
  }))

  // latestPosts: 与 Notion 版一致，按最近编辑时间倒序取前6
  const latestPosts = [...posts]
    .sort((a, b) => {
      const da = new Date(a.lastEditedDate || a.publishDate || 0)
      const db = new Date(b.lastEditedDate || b.publishDate || 0)
      return db - da
    })
    .slice(0, 6)

  return {
    NOTION_CONFIG: siteData.NOTION_CONFIG || {},
    siteInfo: siteData.siteInfo || {},
    notice: siteData.notice || null,
    allPages,
    allNavPages,
    latestPosts,
    categoryOptions,
    tagOptions,
    customNav: siteData.customNav || [],
    customMenu: (siteData.customMenu || []).map(m => {
      const { id, ...rest } = m || {}
      return rest
    }),
    postCount: posts.length
  }
}

/** 页面正文块（与 Notion 版 getPostBlocks 同构） */
export async function getPostBlocksFromMarkdown(pageId, from) {
  const { pages, collectionCtx, frozenProps } = loadContent()
  const found = pages.find(p => p.data.id === pageId)
  if (!found) return null

  // 含特殊块（列布局/提示框/公式）的页面使用冻结的原始 recordMap，保证 100% 保真
  const frozenFile = path.join(
    CONTENT_DIR,
    'frozen-blockmaps',
    pageId.replace(/-/g, '') + '.json'
  )
  if (fs.existsSync(frozenFile)) {
    const raw = JSON.parse(fs.readFileSync(frozenFile, 'utf-8'))
    const adapted = adapterNotionBlockMap(raw)
    return { ...adapted, block: formatNotionBlock(adapted.block) }
  }

  const model = buildPostModel(found)
  const edited = found.data.lastEditedDate
    ? new Date(found.data.lastEditedDate).getTime()
    : model.publishDate || Date.now()
  const raw = mdToRecordMap(found.body, {
    rootId: pageId,
    title: model.title,
    createdTime: model.publishDate || edited,
    lastEditedTime: edited,
    collectionCtx,
    rootProperties: frozenProps[pageId]
  })
  // 与 Notion 路径保持一致的后处理（结构归一 + 清理）
  const adapted = adapterNotionBlockMap(raw)
  return {
    ...adapted,
    block: formatNotionBlock(adapted.block)
  }
}

/** 文章页 props（与 Notion 版 resolvePostProps 同构） */
export async function resolvePostPropsFromMarkdown({
  prefix,
  slug,
  suffix,
  locale,
  from
}) {
  const segments = [prefix, slug].filter(Boolean)
  if (Array.isArray(suffix)) segments.push(...suffix)
  const fullSlug = segments.join('/')

  const props = await fetchGlobalAllDataFromMarkdown({ from, locale })

  let post =
    props.allPages.find(
      p => p && !p.type?.includes('Menu') && p.slug === fullSlug
    ) ||
    props.allPages.find(p => p?.id === fullSlug) ||
    null

  if (post) {
    post.blockMap = await getPostBlocksFromMarkdown(post.id, from)
    props.post = post
    try {
      await processPostData(props, from)
    } catch (e) {
      console.warn('[markdown-source] processPostData failed', e)
    }
  } else {
    props.post = null
  }
  delete props.allPages
  return props
}
