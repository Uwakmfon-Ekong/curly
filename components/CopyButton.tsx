'use client'

import { useState } from 'react'

interface CopyButtonProps {
  getText: () => string
  className?: string
}

export function CopyButton({ getText, className = '' }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText())
      setState('copied')
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-xs px-3 py-1.5 rounded-md border transition-all duration-150 font-mono ${
        state === 'copied'
          ? 'border-accent text-accent bg-accent/10'
          : state === 'error'
          ? 'border-danger text-danger bg-danger/10'
          : 'border-border2 text-muted hover:text-white hover:border-white/20 bg-transparent'
      } ${className}`}
    >
      {state === 'copied' ? 'copied ✓' : state === 'error' ? 'failed' : 'copy'}
    </button>
  )
}
