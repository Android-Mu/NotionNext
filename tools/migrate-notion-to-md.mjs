/**
 * Notion 数据 → 本地 Markdown 内容迁移脚本
 * 输入: data_clean.json(site数据) + cache_pages/*.json(页面recordMap)
 * 输出: content/site-data.json, content/posts/*.md, content/pages/*.md, public/images/posts/*
 * 用法: node tools/migrate-notion-to-md.mjs
 */
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const ROOT = process.cwd()
const OUT_CONTENT = path.join(ROOT, 'content')
const OUT_POSTS = path.join(OUT_CONTENT, 'posts')
const OUT_PAGES = path.join(OUT_CONTENT, 'pages')
const OUT_IMGS = path.join(ROOT, 'public', 'images', 'posts')

fs.mkdirSync(OUT_POSTS, { recursive: true })
fs.mkdirSync(OUT_PAGES, { recursive: true })
fs.mkdirSync(OUT_IMGS, { recursive: true })

const clean = JSON.parse(fs.readFileSync(path.join(ROOT, 'data_clean.json'), 'utf-8'))
const siteKey = Object.keys(clean).find(k => k.startsWith('site_'))
const S = clean[siteKey]
const allPages = S.allPages || []

/* ---------- 工具 ---------- */
const esc = s => String(s ?? '')
function fmValue(v) {
  if (Array.isArray(v)) return '[' + v.map(x => fmValue(x)).join(', ') + ']'
  const s = esc(v)
  if (/[":#\n\[\]{},]/.test(s) || s.startsWith(' ') || s.endsWith(' ') || s === '') {
    return JSON.stringify(s)
  }
  return s
}

function segsToText(segs) {
  // Notion title 段落 → 纯文本(去装饰)
  if (!Array.isArray(segs)) return ''
  return segs.map(s => (Array.isArray(s) ? esc(s[0]) : '')).join('')
}

function segsToMd(segs) {
  // Notion title 段落 → Markdown 行内格式
  if (!Array.isArray(segs)) return ''
  let out = ''
  for (const seg of segs) {
    if (!Array.isArray(seg)) continue
    let text = esc(seg[0])
    const decs = seg[1] || []
    let link = null
    for (const d of decs) {
      if (!Array.isArray(d) || !d[0]) continue
      const [k, v] = d
      if (k === 'a') link = v
      else if (k === 'b') text = `**${text}**`
      else if (k === 'i' && text.trim()) text = `*${text}*`
      else if (k === 'c') text = '`' + text + '`'
      else if (k === 's') text = `~~${text}~~`
    }
    out += link ? `[${text}](${link})` : text
  }
  return out
}

/* ---------- recordMap 辅助 ---------- */
function loadRecordMap(pageId) {
  const f = path.join(ROOT, 'cache_pages', pageId.replace(/-/g, '') + '.json')
  if (!fs.existsSync(f)) return null
  const rm = JSON.parse(fs.readFileSync(f, 'utf-8'))
  const blocks = {}
  for (const [bid, bw] of Object.entries(rm.block || {})) {
    const v = bw?.value
    const b = v?.value && v.value.id ? v.value : v?.id ? v : null
    if (b) blocks[bid] = b
  }
  const signedUrls = rm.signed_urls || {}
  return { blocks, signedUrls }
}

/* ---------- 图片处理 ---------- */
const imgMap = new Map() // attachment ref -> local path
const imgReport = []
async function downloadImage(ref, blockId, signedUrls) {
  if (imgMap.has(ref)) return imgMap.get(ref)
  const safeName = ref
    .replace(/^attachment:/, '')
    .replace(/^[0-9a-f-]{36}:/, '')
    .replace(/[\\/:*?"<>|\s]/g, '_')
  let ok = false
  const targets = []
  // 1) signed url (file id)
  const fileId = ref.replace(/^attachment:/, '').split(':')[0]
  const su = signedUrls[fileId]
  if (su) targets.push(su)
  // 2) notion 图片代理
  targets.push(
    'https://www.notion.so/image/' +
      encodeURIComponent(ref) +
      '?table=block&id=' +
      blockId
  )
  for (const url of targets) {
    try {
      const resp = await fetch(url, {
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/*,*/*'
        }
      })
      if (!resp.ok) continue
      const buf = Buffer.from(await resp.arrayBuffer())
      if (buf.length < 1000) continue
      const ct = resp.headers.get('content-type') || ''
      let ext = path.extname(safeName).toLowerCase()
      if (!ext || ext.length > 5) {
        if (ct.includes('png')) ext = '.png'
        else if (ct.includes('webp')) ext = '.webp'
        else if (ct.includes('gif')) ext = '.gif'
        else if (ct.includes('jpeg') || ct.includes('jpg')) ext = '.jpg'
        else if (ct.includes('svg')) ext = '.svg'
        else ext = '.png'
      }
      const local = '/images/posts/' + fileId.slice(0, 8) + '-' + (safeName + ext).slice(0, 80)
      fs.writeFileSync(path.join(ROOT, 'public', local), buf)
      imgMap.set(ref, local)
      imgReport.push({ ref, url, local, bytes: buf.length })
      ok = true
      break
    } catch (e) {
      /* 尝试下一个 */
    }
  }
  if (!ok) {
    // 失败兜底：直接用 notion 代理地址（保持线上可显示）
    const fallback =
      'https://www.notion.so/image/' +
      encodeURIComponent(ref) +
      '?table=block&id=' +
      blockId
    imgMap.set(ref, fallback)
    imgReport.push({ ref, url: fallback, local: null, failed: true })
  }
  return imgMap.get(ref)
}

/* ---------- 块树 → Markdown ---------- */
async function blocksToMd(blocks, rootId, signedUrls, ctx) {
  const lines = []
  const emitted = new Set()

  async function renderInline(b) {
    const t = b.type
    const p = b.properties || {}
    const text = segsToMd(p.title)
    if (t === 'header') return '## ' + text // 文章标题本身不占 h1，正文大标题用 h2 起
    if (t === 'sub_header') return '### ' + text
    if (t === 'sub_sub_header') return '#### ' + text
    if (t === 'bulleted_list') return '- ' + text
    if (t === 'numbered_list') return '1. ' + text
    if (t === 'quote') return '> ' + text
    if (t === 'divider') return '---'
    if (t === 'equation') return '$$' + segsToText(p.title) + '$$'
    if (t === 'text') return text || ''
    if (t === 'code') {
      const lang = segsToText(p.language) || ''
      return '```' + lang + '\n' + segsToText(p.title) + '\n```'
    }
    if (t === 'image') {
      let src = (b.format || {}).display_source || segsToText(p.source)
      const caption = segsToText(p.title)
      if (src.startsWith('attachment:')) {
        src = await downloadImage(src, b.id, signedUrls)
      } else if (src.startsWith('/')) {
        src = 'https://www.notion.so' + src
      }
      ctx.hasImage = true
      return `![${caption}](${src})`
    }
    if (t === 'column_list' || t === 'column') return null // 子块照常渲染，容器折叠
    if (t === 'page' || t === 'collection_view' || t === 'collection_view_page') return null
    // 未覆盖类型降级为文本
    if (text) return text
    return null
  }

  async function renderTable(b) {
    const order = (b.format || {}).table_block_column_order || []
    const rows = (b.content || []).map(cid => blocks[cid]).filter(Boolean)
    const cell = (row, colId) => {
      const v = (row.properties || {})[colId]
      return segsToMd(v).replace(/\|/g, '\\|').replace(/\n/g, ' ')
    }
    if (!rows.length) return null
    const headerRow = rows[0]
    const cols = order.length
      ? order
      : Object.keys(headerRow.properties || {})
    const head = '| ' + cols.map(c => cell(headerRow, c)).join(' | ') + ' |'
    const sep = '| ' + cols.map(() => '---').join(' | ') + ' |'
    const body = rows.slice(1).map(r => '| ' + cols.map(c => cell(r, c)).join(' | ') + ' |')
    return [head, sep, ...body].join('\n')
  }

  async function walk(bid, depth) {
    const b = blocks[bid]
    if (!b || emitted.has(bid)) return
    emitted.add(bid)
    if (b.type === 'table') {
      const md = await renderTable(b)
      if (md) lines.push(md, '')
      return
    }
    const md = await renderInline(b)
    if (md !== null && md !== '') {
      if ((b.type === 'bulleted_list' || b.type === 'numbered_list') && depth > 0) {
        lines.push('  '.repeat(depth - 0) + md)
      } else {
        lines.push(md, '')
      }
    }
    for (const cid of b.content || []) await walk(String(cid), depth + 1)
  }

  const root = blocks[rootId]
  if (root?.content) for (const cid of root.content) await walk(String(cid), 0)
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

/* ---------- 主流程 ---------- */
async function main() {
  // 1) site-data.json：冻结站点配置
  const siteData = {
    NOTION_CONFIG: S.NOTION_CONFIG,
    siteInfo: S.siteInfo,
    notice: S.notice || null,
    categoryOptions: S.categoryOptions || [],
    tagOptions: S.tagOptions || [],
    customNav: S.customNav || [],
    customMenu: S.customMenu || null
  }
  fs.writeFileSync(
    path.join(OUT_CONTENT, 'site-data.json'),
    JSON.stringify(siteData, null, 1)
  )

  // 2) 每页 → MD
  let ok = 0, fail = 0, skipped = 0
  const manifest = []
  for (const p of allPages) {
    const type = p.type
    if (!['Post', 'Page'].includes(type)) { skipped++; continue } // Menu/Config/Notice/SubMenu 不迁移正文
    const rm = loadRecordMap(p.id)
    if (!rm || !rm.blocks[p.id]) {
      if (p.status === 'Published') {
        console.log('!! 缺失recordMap:', p.slug || p.title)
        fail++
      }
      continue
    }
    const ctx = { hasImage: false }
    let body = ''
    try {
      body = await blocksToMd(rm.blocks, p.id, rm.signedUrls, ctx)
    } catch (e) {
      console.log('!! 转换失败:', p.slug, String(e).slice(0, 80))
      fail++
      continue
    }
    // slug 处理：Post 的 slug 带 article/ 前缀；Page 直接用
    const slug = (p.slug || p.title || 'untitled').replace(/^article\//, '')
    const dir = type === 'Post' ? OUT_POSTS : OUT_PAGES
    const fm = [
      '---',
      'id: ' + p.id,
      'title: ' + fmValue(p.title),
      'slug: ' + fmValue(p.slug || slug),
      'type: ' + type,
      'status: ' + (p.status || 'Published'),
      'category: ' + fmValue(p.category || ''),
      'tags: ' + (Array.isArray(p.tags) ? p.tags.map(t => fmValue(t)).join(', ') : fmValue(p.tags)),
      'date: ' + ((p.date && p.date.start_date) || p.publishDay || ''),
      p.lastEditedDate ? 'lastEditedDate: ' + p.lastEditedDate : '',
      'summary: ' + fmValue(p.summary || ''),
      p.pageIcon ? 'icon: ' + fmValue(p.pageIcon) : '',
      p.pageCover ? 'cover: ' + fmValue(p.pageCover) : '',
      p.password ? 'password: ' + fmValue(p.password) : '',
      '---'
    ].filter(Boolean).join('\n')
    fs.writeFileSync(path.join(dir, slug.replace(/[\/\\]/g, '_') + '.md'), fm + '\n\n' + body + '\n')
    manifest.push({ slug: p.slug, file: slug + '.md', status: p.status, hasImage: ctx.hasImage })
    ok++
    if (ok % 20 === 0) console.log(`... ${ok} 页完成`)
  }

  fs.writeFileSync(path.join(OUT_CONTENT, 'manifest.json'), JSON.stringify(manifest, null, 1))
  fs.writeFileSync(path.join(ROOT, 'tools', 'img-report.json'), JSON.stringify(imgReport, null, 1))
  console.log(`\n完成: 成功=${ok} 失败=${fail} 跳过(菜单等)=${skipped}`)
  console.log(`图片: 总=${imgReport.length} 下载=${imgReport.filter(i => i.local).length} 兜底外链=${imgReport.filter(i => i.failed).length}`)
}

main().catch(e => { console.error(e); process.exit(1) })
