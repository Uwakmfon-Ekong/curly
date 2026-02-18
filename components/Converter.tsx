'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { parseCurl, generateFetch, generateAxios, EXAMPLE_CURL, type ParsedCurl } from '@/lib/parser'
import { highlight } from '@/lib/highlight'
import { CopyButton } from '@/components/CopyButton'
import { ModeToggle, type OutputMode } from '@/components/ModeToggle'
import { ParsedInfo } from '@/components/ParsedInfo'

export function Converter() {
  const [input, setInput]       = useState('')
  const [output, setOutput]     = useState('')
  const [rawCode, setRawCode]   = useState('')
  const [mode, setMode]         = useState<OutputMode>('fetch')
  const [parsed, setParsed]     = useState<ParsedCurl | null>(null)
  const [error, setError]       = useState('')
  const [status, setStatus]     = useState('')
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('')
  const debounceRef = useRef<NodeJS.Timeout>()

  const showStatus = (msg: string, type: 'success' | 'error') => {
    setStatus(msg)
    setStatusType(type)
    if (type === 'success') {
      setTimeout(() => { setStatus(''); setStatusType('') }, 3000)
    }
  }

  const convert = useCallback((raw: string, currentMode: OutputMode) => {
    if (!raw.trim()) return
    try {
      const p = parseCurl(raw)
      setParsed(p)
      setError('')
      const code = currentMode === 'fetch' ? generateFetch(p) : generateAxios(p)
      setRawCode(code)
      setOutput(highlight(code))
      showStatus('converted ✓', 'success')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Conversion failed')
      setOutput('')
      setRawCode('')
      setParsed(null)
      showStatus('conversion failed', 'error')
    }
  }, [])

  // Debounced auto-convert on input
  useEffect(() => {
    if (!input.trim().toLowerCase().startsWith('curl')) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => convert(input, mode), 600)
    return () => clearTimeout(debounceRef.current)
  }, [input, mode, convert])

  const handleModeChange = (m: OutputMode) => {
    setMode(m)
    if (parsed) {
      const code = m === 'fetch' ? generateFetch(parsed) : generateAxios(parsed)
      setRawCode(code)
      setOutput(highlight(code))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      convert(input, mode)
    }
  }

  const handleLoadExample = () => {
    setInput(EXAMPLE_CURL)
    convert(EXAMPLE_CURL, mode)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setRawCode('')
    setParsed(null)
    setError('')
    setStatus('')
    setStatusType('')
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
    } catch {
      showStatus('allow clipboard access', 'error')
    }
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Action row */}
      <div className="flex items-center gap-3 px-10 pb-5 animate-fade-up [animation-delay:200ms] [animation-fill-mode:both] flex-wrap">
        <button
          onClick={() => convert(input, mode)}
          className="font-display font-bold text-sm px-6 py-3 rounded-lg bg-accent text-bg
                     hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(61,255,192,0.3)]
                     active:translate-y-0 transition-all duration-150"
        >
          Convert →
        </button>
        <button
          onClick={handleClear}
          className="text-xs font-mono px-4 py-2.5 rounded-lg border border-border2 text-muted
                     hover:text-danger hover:border-danger/50 transition-all duration-150"
        >
          Clear
        </button>
        <span
          className={`text-xs font-mono ml-auto transition-all duration-300 ${
            statusType === 'success' ? 'text-accent' :
            statusType === 'error'   ? 'text-danger' : 'text-muted'
          }`}
        >
          {status}
        </span>
      </div>

      {/* Panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 px-10 pb-10 animate-fade-up [animation-delay:250ms] [animation-fill-mode:both]">

        {/* ── Input Panel ── */}
        <div className="flex flex-col rounded-xl border border-border1 bg-surface overflow-hidden transition-colors duration-200 focus-within:border-border2">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border1 bg-surface2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warn shadow-[0_0_6px_rgba(255,209,102,0.8)]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-muted font-mono">
                cURL input
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePaste}
                className="text-xs font-mono px-2.5 py-1 rounded border border-border2 text-muted
                           hover:text-white hover:border-white/20 transition-all duration-150"
              >
                paste
              </button>
              <button
                onClick={handleLoadExample}
                className="text-xs font-mono px-2.5 py-1 rounded border border-border2 text-muted
                           hover:text-white hover:border-white/20 transition-all duration-150"
              >
                example
              </button>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`curl -X POST https://api.example.com/users \\\n  -H "Authorization: Bearer token" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "Jane"}'`}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            className="flex-1 min-h-[360px] w-full bg-transparent border-none outline-none resize-none
                       p-5 text-sm leading-relaxed text-white font-mono placeholder:text-muted/50
                       caret-accent"
          />

          <div className="px-4 py-2 border-t border-border1 flex items-center justify-between">
            <span className="text-xs text-muted/50 font-mono">
              {input ? `${input.split('\n').length} lines` : ''}
            </span>
            <span className="text-xs text-muted/40 font-mono">⌘↵ to convert</span>
          </div>
        </div>

        {/* ── Output Panel ── */}
        <div className="flex flex-col rounded-xl border border-border1 bg-surface overflow-hidden transition-colors duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border1 bg-surface2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_6px_rgba(61,255,192,0.8)]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-muted font-mono">
                output
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle mode={mode} onChange={handleModeChange} />
              <CopyButton getText={() => rawCode} />
            </div>
          </div>

          <div className="flex-1 min-h-[360px] overflow-auto">
            {error ? (
              <div className="p-5 text-sm text-danger font-mono bg-danger/5 border-b border-danger/10">
                ⚠ {error}
              </div>
            ) : output ? (
              <pre
                className="p-5 text-sm leading-relaxed font-mono whitespace-pre overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30 p-10 text-center">
                <span className="text-4xl">⟶</span>
                <span className="text-sm font-mono text-muted">
                  Your converted code<br />will appear here
                </span>
              </div>
            )}
          </div>

          {parsed && (
            <div className="px-4 py-2.5 border-t border-border1 bg-surface2/50">
              <ParsedInfo parsed={parsed} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
