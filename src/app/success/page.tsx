import React, { Suspense } from 'react'
import SuccessClient from './SuccessClient'

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <SuccessClient />
    </Suspense>
  )
}
