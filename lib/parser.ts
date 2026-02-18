export interface ParsedCurl {
  method: string
  url: string
  headers: Record<string, string>
  body: string | null
}

function tokenize(str: string): string[] {
  const tokens: string[] = []
  let i = 0

  while (i < str.length) {
    // skip whitespace
    while (i < str.length && /\s/.test(str[i])) i++
    if (i >= str.length) break

    if (str[i] === '"' || str[i] === "'") {
      const quote = str[i++]
      let token = ''
      while (i < str.length && str[i] !== quote) {
        if (str[i] === '\\' && str[i + 1] === quote) {
          token += quote
          i += 2
        } else {
          token += str[i++]
        }
      }
      i++ // closing quote
      tokens.push(token)
    } else {
      let token = ''
      while (i < str.length && !/\s/.test(str[i])) token += str[i++]
      tokens.push(token)
    }
  }

  return tokens
}

export function parseCurl(raw: string): ParsedCurl {
  // Normalize line continuations
  let curl = raw.replace(/\\\s*\n\s*/g, ' ').trim()

  if (!curl.toLowerCase().startsWith('curl')) {
    throw new Error('Input must start with "curl"')
  }

  const result: ParsedCurl = {
    method: 'GET',
    url: '',
    headers: {},
    body: null,
  }

  // Strip leading "curl"
  curl = curl.slice(4).trim()

  const tokens = tokenize(curl)
  let i = 0

  const next = () => tokens[i++]

  while (i < tokens.length) {
    const tok = next()

    if (tok === '-X' || tok === '--request') {
      result.method = next().toUpperCase()
    } else if (tok === '-H' || tok === '--header') {
      const hdr = next()
      const colon = hdr.indexOf(':')
      if (colon !== -1) {
        const key = hdr.slice(0, colon).trim()
        const val = hdr.slice(colon + 1).trim()
        result.headers[key] = val
      }
    } else if (
      tok === '-d' ||
      tok === '--data' ||
      tok === '--data-raw' ||
      tok === '--data-binary' ||
      tok === '--data-urlencode'
    ) {
      result.body = next()
      if (result.method === 'GET') result.method = 'POST'
    } else if (tok === '-u' || tok === '--user') {
      const creds = next()
      result.headers['Authorization'] = 'Basic ' + btoa(creds)
    } else if (tok === '-A' || tok === '--user-agent') {
      result.headers['User-Agent'] = next()
    } else if (tok === '-e' || tok === '--referer') {
      result.headers['Referer'] = next()
    } else if (
      tok === '--compressed' ||
      tok === '-L' ||
      tok === '--location' ||
      tok === '-s' ||
      tok === '--silent' ||
      tok === '-k' ||
      tok === '--insecure' ||
      tok === '-v' ||
      tok === '--verbose' ||
      tok === '-i' ||
      tok === '--include'
    ) {
      // intentionally ignored flags
    } else if (!tok.startsWith('-') && !result.url) {
      result.url = tok.replace(/^['"]|['"]$/g, '')
    }
  }

  if (!result.url) throw new Error('No URL found in cURL command')

  return result
}

function isJson(body: string): boolean {
  try {
    JSON.parse(body)
    return true
  } catch {
    return false
  }
}

export function generateFetch(parsed: ParsedCurl): string {
  const { method, url, headers, body } = parsed
  const bodyIsJson = body ? isJson(body) : false
  let bodyParsed: unknown = null
  if (body && bodyIsJson) {
    try { bodyParsed = JSON.parse(body) } catch { /* noop */ }
  }

  const lines: string[] = []
  lines.push(`const response = await fetch('${url}', {`)
  lines.push(`  method: '${method}',`)

  if (Object.keys(headers).length > 0) {
    lines.push(`  headers: {`)
    for (const [k, v] of Object.entries(headers)) {
      lines.push(`    '${k}': '${v}',`)
    }
    lines.push(`  },`)
  }

  if (body) {
    if (bodyIsJson && bodyParsed) {
      const formatted = JSON.stringify(bodyParsed, null, 2)
        .split('\n')
        .join('\n  ')
      lines.push(`  body: JSON.stringify(${formatted}),`)
    } else {
      lines.push(`  body: '${body}',`)
    }
  }

  lines.push(`})`)
  lines.push(``)
  lines.push(bodyIsJson ? `const data = await response.json()` : `const data = await response.text()`)
  lines.push(`console.log(data)`)

  return lines.join('\n')
}

export function generateAxios(parsed: ParsedCurl): string {
  const { method, url, headers, body } = parsed
  const bodyIsJson = body ? isJson(body) : false
  let bodyParsed: unknown = null
  if (body && bodyIsJson) {
    try { bodyParsed = JSON.parse(body) } catch { /* noop */ }
  }

  const hasHeaders = Object.keys(headers).length > 0
  const hasBody = !!body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

  const lines: string[] = []
  lines.push(`import axios from 'axios'`)
  lines.push(``)
  lines.push(`const { data } = await axios.${method.toLowerCase()}(`)
  lines.push(`  '${url}',`)

  if (hasBody) {
    if (bodyIsJson && bodyParsed) {
      const formatted = JSON.stringify(bodyParsed, null, 2)
        .split('\n')
        .join('\n  ')
      lines.push(`  ${formatted},`)
    } else {
      lines.push(`  '${body}',`)
    }
  }

  if (hasHeaders) {
    lines.push(`  {`)
    lines.push(`    headers: {`)
    for (const [k, v] of Object.entries(headers)) {
      lines.push(`      '${k}': '${v}',`)
    }
    lines.push(`    },`)
    lines.push(`  }`)
  }

  lines.push(`)`)
  lines.push(``)
  lines.push(`console.log(data)`)

  return lines.join('\n')
}

export const EXAMPLE_CURL = `curl -X POST https://api.example.com/v1/users \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" \\
  -H "Content-Type: application/json" \\
  -H "X-Request-ID: req_abc123" \\
  -d '{"name": "Jane Doe", "email": "jane@example.com", "role": "admin"}'`
