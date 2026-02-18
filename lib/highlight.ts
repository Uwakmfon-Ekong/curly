const KEYWORDS = new Set([
  'const','let','var','await','async','import','from','export',
  'default','function','return','if','else','new','true','false',
  'null','undefined','typeof','instanceof',
])

type Token =
  | { type: 'string';  value: string }
  | { type: 'comment'; value: string }
  | { type: 'keyword'; value: string }
  | { type: 'fn';      value: string }
  | { type: 'number';  value: string }
  | { type: 'plain';   value: string }

function tokenizeCode(code: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < code.length) {
    if (code[i] === '/' && code[i + 1] === '/') {
      let val = ''
      while (i < code.length && code[i] !== '\n') val += code[i++]
      tokens.push({ type: 'comment', value: val })
      continue
    }

    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i]
      let val = quote
      i++
      while (i < code.length) {
        if (code[i] === '\\') { val += code[i] + (code[i + 1] ?? ''); i += 2; continue }
        val += code[i]
        if (code[i] === quote) { i++; break }
        i++
      }
      tokens.push({ type: 'string', value: val })
      continue
    }

    if (/[a-zA-Z_$]/.test(code[i])) {
      let val = ''
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) val += code[i++]
      let j = i
      while (j < code.length && code[j] === ' ') j++
      if (code[j] === '(') {
        tokens.push({ type: 'fn', value: val })
      } else if (KEYWORDS.has(val)) {
        tokens.push({ type: 'keyword', value: val })
      } else {
        tokens.push({ type: 'plain', value: val })
      }
      continue
    }

    if (/[0-9]/.test(code[i])) {
      let val = ''
      while (i < code.length && /[0-9.]/.test(code[i])) val += code[i++]
      tokens.push({ type: 'number', value: val })
      continue
    }

    tokens.push({ type: 'plain', value: code[i++] })
  }

  return tokens
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function highlight(code: string): string {
  const tokens = tokenizeCode(code)

  return tokens.map(tok => {
    const safe = escapeHtml(tok.value)
    switch (tok.type) {
      case 'string':  return `<span class="t-string">${safe}</span>`
      case 'comment': return `<span class="t-comment">${safe}</span>`
      case 'keyword': return `<span class="t-keyword">${safe}</span>`
      case 'fn':      return `<span class="t-fn">${safe}</span>`
      case 'number':  return `<span class="t-num">${safe}</span>`
      default:        return safe
    }
  }).join('')
}