'use client'

import type { NavbarProps } from 'sanity'

/** Default navbar only — styling handled in simple-studio.css (no extra rows). */
export function SimpleStudioNavbar(props: NavbarProps) {
  return <div className="simple-studio-navbar">{props.renderDefault(props)}</div>
}
