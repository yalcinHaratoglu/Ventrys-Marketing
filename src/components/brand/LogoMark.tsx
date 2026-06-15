'use client'

import { cn } from '@/lib/utils'

interface LogoMarkProps {
  className?: string
  size?: number
}

export function LogoMark({ className, size = 40 }: LogoMarkProps) {
  return (
    <>
      <img
        src="/brand/logo-icon-dark.svg"
        alt=""
        width={size}
        height={size}
        className={cn('shrink-0 rounded-lg dark:hidden', className)}
        aria-hidden
      />
      <img
        src="/brand/logo-icon-light.svg"
        alt=""
        width={size}
        height={size}
        className={cn('hidden shrink-0 rounded-lg dark:block', className)}
        aria-hidden
      />
    </>
  )
}
