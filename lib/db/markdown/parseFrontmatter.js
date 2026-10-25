/**
 * 极简 YAML frontmatter 解析器（无第三方依赖）
 * 支持格式：字符串、引号字符串、逗号分隔列表、[a, b] 列表
 */

function parseValue(raw) {
  let s = raw.trim()
  if (!s) return ''
  // JSON 字符串（迁移脚本用 JSON.stringify 写入带引号/特殊字符的值）
  if (s.startsWith('"') && s.endsWith('"') && s.length > 1) {
    try {
      return JSON.parse(s)
    } catch (e) {
      /* 降级处理 */
    }
  }
  // 去引号
  if (
    (s.startsWith('"') && s.endsWith('"') && s.length > 1) ||
    (s.startsWith("'") && s.endsWith("'") && s.length > 1)
  ) {
    s = s.slice(1, -1)
    return s
  }
  // [a, b, c]
  if (s.startsWith('[') && s.endsWith(']')) {
    return s
      .slice(1, -1)
      .split(',')
      .map(x => x.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }
  return s
}

export function parseFrontmatter(content) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(content)
  if (!m) return { data: {}, body: content }
  const data = {}
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const idx = line.indexOf(':')
    if (idx < 0) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if (!val) {
      data[key] = ''
      continue
    }
    // 逗号分隔的标签列表仅在特定键时拆分，避免误伤正文性文本
    if (['tags'].includes(key) && !val.startsWith('[') && !val.startsWith('"')) {
      data[key] = val
        .split(',')
        .map(x => x.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    } else {
      data[key] = parseValue(val)
    }
  }
  return { data, body: m[2] }
}
