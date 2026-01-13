// @ts-ignore - React is required for JSX in Satori
import React from "react"
import { TerminalWindow, TerminalText, TerminalCode } from "./terminal-base.tsx"
import { colors } from "../lib/satori-config.mjs"

/**
 * Blog post OG image template
 * Shows post title with site branding
 */
export const BlogPostTemplate = ({
  title,
  date,
}: {
  title: string
  date?: string | null
}) => {
  return (
    <TerminalWindow title="jrar.dev/blog" badge="[POST]">
      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {/* Post title */}
        <div
          style={{
            display: "flex",
            fontSize: 42,
            fontWeight: 700,
            color: colors.primaryAccent,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {/* Metadata in JSON style */}
        <TerminalText prompt="cat info.json">
          <TerminalCode>
            <span>{"{"}</span>
            <span style={{ paddingLeft: 24 }}>"author": "Josh Rarick",</span>
            {date && <span style={{ paddingLeft: 24 }}>"date": "{date}",</span>}
            <span style={{ paddingLeft: 24 }}>"site": "jrar.dev"</span>
            <span>{"}"}</span>
          </TerminalCode>
        </TerminalText>
      </div>
    </TerminalWindow>
  )
}
