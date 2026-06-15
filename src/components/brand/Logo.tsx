import { Link } from '@/i18n/navigation'
import { LogoMark } from './LogoMark'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={36} />
      {showText ? (
        <span className="text-xl font-semibold tracking-wide text-slate-900 dark:text-white">
          Ventrys
        </span>
      ) : null}
    </Link>
  )
}
