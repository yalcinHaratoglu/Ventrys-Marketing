export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:5173'
}

export function getAppLoginUrl(): string {
  return `${getAppUrl()}/login`
}

export function getAppRegisterUrl(): string {
  return `${getAppUrl()}/register`
}
