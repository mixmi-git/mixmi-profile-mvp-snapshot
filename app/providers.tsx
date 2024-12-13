'use client'

import { useRouter } from 'next/router'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  if (!router.isReady) {
    return null
  }

  return <>{children}</>
} 