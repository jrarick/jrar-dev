// @ts-ignore - React is required for JSX in Satori
import React from "react"
import { colors } from "../lib/satori-config.mjs"

/**
 * Terminal window container component
 * Creates a terminal-style UI with header, border, and content area
 */
export const TerminalWindow = ({
  title,
  badge,
  children,
}: {
  title: string
  badge: string
  children: React.ReactNode
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 1200,
        height: 630,
        backgroundColor: colors.background,
        color: colors.accent,
        fontFamily: "Monaspace Neon",
        padding: 0,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 32px",
          borderBottom: `2px solid ${colors.primaryBackground}`,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: colors.primaryAccent,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: colors.primaryVivid,
            backgroundColor: colors.primaryBackground,
            padding: "4px 12px",
          }}
        >
          {badge}
        </span>
      </div>

      {/* Content area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "48px 32px",
          gap: 32,
          flex: 1,
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface TerminalTextProps {
  prompt: string
  children: React.ReactNode
}

/**
 * Terminal command prompt and output
 */
export const TerminalText = ({ prompt, children }: TerminalTextProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: colors.primaryVivid,
          fontSize: 18,
          fontWeight: 500,
        }}
      >
        <span style={{ marginRight: 8 }}>$</span>
        <span>{prompt}</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          color: colors.accent,
          fontSize: 18,
          fontWeight: 400,
          paddingLeft: 24,
        }}
      >
        <span style={{ marginRight: 8, color: colors.primaryMuted }}>&gt;</span>
        <span style={{ flex: 1 }}>{children}</span>
      </div>
    </div>
  )
}

interface TerminalTitleProps {
  children: React.ReactNode
}

/**
 * Terminal title/heading
 */
export const TerminalTitle = ({ children }: TerminalTitleProps) => {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 36,
        fontWeight: 700,
        color: colors.primaryAccent,
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  )
}

interface TerminalCodeProps {
  children: React.ReactNode
}

/**
 * JSON-style code block
 */
export const TerminalCode = ({ children }: TerminalCodeProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: 16,
        fontWeight: 400,
        color: colors.vivid,
        fontFamily: "Monaspace Neon",
      }}
    >
      {children}
    </div>
  )
}
