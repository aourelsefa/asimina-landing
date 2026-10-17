'use client'

import type { ToolMenuProps } from 'sanity'

/** Single-tool studio: hide Vision etc. from the tool list. */
export function SimpleStudioToolMenu(props: ToolMenuProps) {
  const tools = props.tools.filter((tool) => {
    const name = tool.name ?? ''
    return name === 'structure' || name === 'photos'
  })

  return props.renderDefault({ ...props, tools })
}
