/**
 * Markdown 正文 → Notion 内部块格式 recordMap
 * 输出与 notion-client 抓取的数据同构，供 react-notion-x 直接渲染
 * 块 id 由内容哈希确定性生成（同一文章多次构建 id 稳定）
 */
import crypto from 'crypto'

function uuidFrom(seed) {
  const h = crypto.createHash('md5').update(String(seed)).digest('hex')
  return (
    h.slice(0, 8) + '-' + h.slice(8, 12) + '-4' + h.slice(13, 16) +
    '-8' + h.slice(17, 20) + '-' + h.slice(20, 32)
  )
}

/* ---------- 行内 Markdown → Notion 富文本段落 ---------- */
// Notion 装饰: ["b"]加粗 ["i"]斜体 ["c"]行内代码 ["s"]删除线 ["a",url]链接
const INLINE_RE =
  /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|~~[^~]+~~|`[^`\n]+`|\[[^\]\n]*\]\([^)\n]+\))/g

export function mdInlineToSegments(text) {
  // 字面转义字符(\* 等)先换成占位符，避免再被识别为格式语法，最后还原
  const ESC = {
    '\\\\': '\u0001',
    '\\*': '\u0002',
    '\\`': '\u0003',
    '\\~': '\u0004',
    '\\[': '\u0005',
    '\\]': '\u0006'
  }
  text = String(text)
  for (const [k, v] of Object.entries(ESC)) {
    text = text.split(k).join(v)
  }
  const restore = s =>
    s
      .split('\u0001').join('\\')
      .split('\u0002').join('*')
      .split('\u0003').join('`')
      .split('\u0004').join('~')
      .split('\u0005').join('[')
      .split('\u0006').join(']')
  const segs = []
  let last = 0
  for (const m of text.matchAll(INLINE_RE)) {
    const tok = m[0]
    const start = m.index
    if (start > last) segs.push([restore(text.slice(last, start)), []])
    let inner = tok
    let dec = null
    if (tok.startsWith('**') || tok.startsWith('__')) {
      inner = tok.slice(2, -2)
      dec = [['b']]
    } else if (tok.startsWith('~~')) {
      inner = tok.slice(2, -2)
      dec = [['s']]
    } else if (tok.startsWith('`')) {
      inner = tok.slice(1, -1)
      dec = [['c']]
    } else if (tok.startsWith('[')) {
      const lm = /\[([^\]]*)\]\(([^)]+)\)/.exec(tok)
      if (lm) {
        // 链接文字内可能嵌套加粗等格式，递归解析后再附加链接装饰
        const inner = mdInlineToSegments(lm[1] || lm[2])
        for (const seg of inner) {
          segs.push([seg[0], [...(seg[1] || []), ['a', lm[2]]]])
        }
        last = start + tok.length
        continue
      }
    } else if (tok.startsWith('*')) {
      inner = tok.slice(1, -1)
      dec = [['i']]
    }
    segs.push(dec ? [restore(inner), dec] : [restore(tok), []])
    last = start + tok.length
  }
  if (last < text.length) segs.push([restore(text.slice(last)), []])
  return segs.filter(s => s[0] !== '' || (s[1] && s[1].length))
}

/* ---------- Markdown → recordMap ---------- */
export function mdToRecordMap(
  mdBody,
  { rootId, title, createdTime, lastEditedTime, collectionCtx, rootProperties } = {}
) {
  const root = rootId || uuidFrom('root')
  const now = createdTime || Date.now()
  const edited = lastEditedTime || now
  const blocks = {}

  const mkBlock = (id, type, props, extra = {}) => {
    const b = {
      id,
      version: 1,
      type,
      properties: props,
      created_time: now,
      last_edited_time: edited,
      parent_id: root,
      parent_table: 'block',
      alive: true,
      ...extra
    }
    if (!b.properties || Object.keys(b.properties).length === 0) delete b.properties
    blocks[id] = b
    return b
  }

  const lines = String(mdBody || '').replace(/\r\n/g, '\n').split('\n')
  const topLevel = []
  let i = 0
  let counter = 0
  const nextId = () => uuidFrom(root + ':' + counter++)

  // 列表嵌套: 返回 [id, children]
  const parseListBlock = (lineText, indent, listMarker) => {
    const id = nextId()
    const type = listMarker === '-' ? 'bulleted_list' : 'numbered_list'
    mkBlock(id, type, { title: mdInlineToSegments(lineText) })
    // 子内容（更深缩进）
    const children = []
    while (i < lines.length) {
      const l = lines[i]
      if (!l.trim()) {
        i++
        // 列表中的空行：如果下一行还是更深缩进则继续，否则结束
        if (i < lines.length && /^[ ]{2,}/.test(lines[i]) && /^[ ]+([-]|\d+\.)\s/.test(lines[i])) continue
        break
      }
      const m = /^([ ]*)((?:-|\d+\.)\s+)(.*)$/.exec(l)
      if (!m) break
      const ind = m[1].length
      if (ind <= indent) break
      i++
      children.push(parseListBlock(m[3], ind, m[2].trim() === '-' ? '-' : '1'))
    }
    if (children.length) {
      blocks[id].content = children.map(c => c.id)
      for (const c of children) blocks[c.id].parent_id = id
    }
    return { id, children }
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    // 代码块
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim()
      i++
      const codeLines = []
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // 跳过结束 ```
      const id = nextId()
      const props = { title: [[codeLines.join('\n') + (codeLines.length ? '\n' : '')]] }
      if (lang) props.language = [[lang]]
      mkBlock(id, 'code', props)
      topLevel.push(id)
      continue
    }

    // 数学公式块
    if (trimmed.startsWith('$$')) {
      i++
      const eq = []
      while (i < lines.length && !lines[i].trim().startsWith('$$')) {
        eq.push(lines[i])
        i++
      }
      i++
      const id = nextId()
      mkBlock(id, 'equation', { title: [[eq.join('\n')]] })
      topLevel.push(id)
      continue
    }

    // 表格
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim())
        i++
      }
      const rows = tableLines
        .filter(l => !/^\|(\s*:?-{2,}:?\s*\|)+$/.test(l))
        .map(l =>
          l
            .slice(1, -1)
            .split(/(?<!\\)\|/)
            .map(c => c.trim().replace(/\\\|/g, '|'))
        )
      if (rows.length) {
        const nCols = Math.max(...rows.map(r => r.length))
        const colIds = Array.from({ length: nCols }, (_, c) => 'col' + c)
        const tableId = nextId()
        const rowIds = rows.map(r => {
          const rid = nextId()
          const props = {}
          colIds.forEach((cid, c) => {
            props[cid] = mdInlineToSegments(r[c] || '')
          })
          mkBlock(rid, 'table_row', props)
          blocks[rid].parent_id = tableId
          return rid
        })
        mkBlock(tableId, 'table', null, {
          content: rowIds,
          format: { table_block_column_order: colIds, table_block_column_header: true }
        })
        topLevel.push(tableId)
      }
      continue
    }

    // 分隔线（避免误吞 frontmatter，正文解析时已剥离）
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      const id = nextId()
      mkBlock(id, 'divider', null)
      topLevel.push(id)
      i++
      continue
    }

    // 引用
    if (trimmed.startsWith('> ')) {
      const quoteLines = []
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().slice(2))
        i++
      }
      const id = nextId()
      mkBlock(id, 'quote', { title: mdInlineToSegments(quoteLines.join('\n')) })
      topLevel.push(id)
      continue
    }

    // 标题
    const hm = /^(#{1,6})\s+(.*)$/.exec(trimmed)
    if (hm) {
      const level = hm[1].length
      // 站点正文规范: h2=header(大) h3=sub_header h4=sub_sub_header；h1 降为 header
      const type =
        level <= 2 ? 'header' : level === 3 ? 'sub_header' : 'sub_sub_header'
      const id = nextId()
      mkBlock(id, type, { title: mdInlineToSegments(hm[2]) })
      topLevel.push(id)
      i++
      continue
    }

    // 列表（含嵌套）
    const lm = /^([ ]*)((?:-|\d+\.)\s+)(.*)$/.exec(line)
    if (lm && !(trimmed.startsWith('- ') === false && !/^\d+\.\s/.test(trimmed))) {
      if (lm) {
        i++
        const node = parseListBlock(lm[3], lm[1].length, lm[2].trim() === '-' ? '-' : '1')
        topLevel.push(node.id)
        continue
      }
    }

    // 独立行图片
    const im = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/.exec(trimmed)
    if (im) {
      const id = nextId()
      const src = im[2]
      const props = { source: [[src]] }
      if (im[1]) props.title = [[im[1]]]
      mkBlock(id, 'image', props, { format: { display_source: src } })
      topLevel.push(id)
      i++
      continue
    }

    // 普通段落（连续非空行合并）
    const para = [trimmed]
    i++
    while (i < lines.length) {
      const nl = lines[i]
      const nt = nl.trim()
      if (
        !nt ||
        nt.startsWith('```') ||
        nt.startsWith('|') ||
        nt.startsWith('> ') ||
        nt.startsWith('#') ||
        nt.startsWith('![') ||
        /^([ ]*)(?:-|\d+\.)\s+/.test(nl) ||
        /^(-{3,}|\*{3,}|_{3,})$/.test(nt)
      ) {
        break
      }
      para.push(nt)
      i++
    }
    const pid = nextId()
    mkBlock(pid, 'text', { title: mdInlineToSegments(para.join('\n')) })
    topLevel.push(pid)
  }

  // 根页面块
  const rootProps = { title: [[title || '']], ...(rootProperties || {}) }
  blocks[root] = {
    id: root,
    version: 1,
    type: 'page',
    properties: rootProps,
    content: topLevel,
    created_time: now,
    last_edited_time: edited,
    parent_id: collectionCtx?.collectionId || '',
    parent_table: collectionCtx ? 'collection' : 'workspace',
    alive: true,
    permissions: [{ role: 'reader', type: 'public' }]
  }

  const wrapped = {}
  // 注意: react-notion-x 用 block 映射的第一个键作为渲染根块，根页面必须最先插入
  wrapped[root] = { value: blocks[root] }
  for (const [id, b] of Object.entries(blocks)) {
    if (id !== root) {
      wrapped[id] = { value: b }
    }
  }

  return {
    __version__: 3,
    block: wrapped,
    // collection 上下文：让 react-notion-x 渲染与 Notion 版一致的页面属性表(date/summary/category/tags)
    collection: collectionCtx?.collection || {},
    collection_view: collectionCtx?.collectionView || {},
    notion_user: {},
    collection_query: collectionCtx?.collection_query || {},
    signed_urls: {}
  }
}
