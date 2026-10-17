'use client'

import type { LayoutProps } from 'sanity'

/** Wraps Studio so simplified chrome CSS applies for everyone. */
export function SimpleStudioLayout(props: LayoutProps) {
  return <div className="simple-studio">{props.renderDefault(props)}</div>
}
