/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

"use client"

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Load NextStudio only on the client and disable SSR to avoid server-side evaluation of Sanity code
const NextStudio = dynamic(
  () => import('next-sanity/studio').then(mod => mod.NextStudio),
  { ssr: false }
)

export default function StudioPageClient() {
  // Minimal local type that matches the exported studio config shape.
  // Use unknown for extra properties to avoid explicit `any`.
  type StudioConfig = {
    projectId: string
    dataset: string
    title?: string
  } & Record<string, unknown>

  const [config, setConfig] = useState<StudioConfig | null>(null)

  useEffect(() => {
    // import the studio config on the client only
    import('../../../../studio/sanity.config')
      .then(mod => setConfig(mod.default as StudioConfig))
      .catch(err => {
        console.error('Failed to load studio config on client', err)
      })
  }, [])

  if (!config) return <div style={{padding:20}}>Loading Studio…</div>

  // NextStudio expects a stricter config type; the runtime object we import is compatible.
  return <NextStudio config={config} />
}
