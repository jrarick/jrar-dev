// @ts-ignore - React is required for JSX in Satori
import React from 'react'
import { TerminalWindow, TerminalText } from './terminal-base.tsx'

/**
 * Homepage OG image template
 * Terminal welcome screen style
 */
export const HomepageTemplate = () => {
  return (
    <TerminalWindow title="jrar.dev" badge="[LIVE]">
      <TerminalText prompt="whoami">Josh Rarick</TerminalText>

      <TerminalText prompt="cat bio.txt">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span>Product focused engineer</span>
          <span>TypeScript enthusiast</span>
          <span>AI tool user</span>
        </div>
      </TerminalText>

      <TerminalText prompt="ls -la">
        <span>blog/ projects/ components/</span>
      </TerminalText>
    </TerminalWindow>
  )
}
