import type { ParsedCurl } from '@/lib/parser'

interface ParsedInfoProps {
  parsed: ParsedCurl
}

const METHOD_COLORS: Record<string, string> = {
  GET:    'text-accent border-accent/30 bg-accent/10',
  POST:   'text-info border-info/30 bg-info/10',
  PUT:    'text-warn border-warn/30 bg-warn/10',
  PATCH:  'text-warn border-warn/30 bg-warn/10',
  DELETE: 'text-danger border-danger/30 bg-danger/10',
}

export function ParsedInfo({ parsed }: ParsedInfoProps) {
  const methodColor = METHOD_COLORS[parsed.method] ?? 'text-muted border-border2 bg-surface2'
  const headerCount = Object.keys(parsed.headers).length

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${methodColor}`}>
        {parsed.method}
      </span>
      <span className="text-xs text-muted font-mono truncate max-w-xs" title={parsed.url}>
        {parsed.url}
      </span>
      {headerCount > 0 && (
        <span className="text-xs text-muted font-mono">
          · {headerCount} header{headerCount > 1 ? 's' : ''}
        </span>
      )}
      {parsed.body && (
        <span className="text-xs text-muted font-mono">· body</span>
      )}
    </div>
  )
}
