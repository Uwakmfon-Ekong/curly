'use client'

export type OutputMode = 'fetch' | 'axios'

interface ModeToggleProps {
  mode: OutputMode
  onChange: (mode: OutputMode) => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex gap-0 bg-bg rounded-lg p-0.5">
      {(['fetch', 'axios'] as OutputMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-150 tracking-wide font-mono ${
            mode === m
              ? 'bg-surface2 text-white border border-border2'
              : 'text-muted hover:text-white bg-transparent border border-transparent'
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  )
}
