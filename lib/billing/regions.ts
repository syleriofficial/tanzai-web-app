export type BillingRegion = 'developing' | 'developed'

const DEVELOPING_COUNTRIES = new Set([
  'AF', 'AL', 'DZ', 'AO', 'AR', 'AM', 'AZ', 'BD', 'BJ', 'BT', 'BO', 'BA', 'BW',
  'BR', 'BG', 'BF', 'BI', 'KH', 'CM', 'CV', 'CF', 'TD', 'CL', 'CN', 'CO', 'KM',
  'CG', 'CD', 'CR', 'CI', 'CU', 'DJ', 'DO', 'EC', 'EG', 'SV', 'ET', 'FJ', 'GA',
  'GE', 'GH', 'GT', 'GN', 'GW', 'GY', 'HT', 'HN', 'IN', 'ID', 'IR', 'IQ', 'JM',
  'JO', 'KZ', 'KE', 'KG', 'LA', 'LB', 'LS', 'LR', 'LY', 'MG', 'MW', 'MY', 'MV',
  'ML', 'MR', 'MU', 'MX', 'MD', 'MN', 'MA', 'MZ', 'MM', 'NA', 'NP', 'NI', 'NE',
  'NG', 'PK', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'RW', 'SN', 'RS', 'SL', 'SO',
  'ZA', 'LK', 'SD', 'SY', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TN', 'TR', 'TM', 'UG',
  'UA', 'UZ', 'VE', 'VN', 'YE', 'ZM', 'ZW',
])

export function normalizeCountryCode(value: string | null) {
  const code = value?.trim().toUpperCase()
  return code && /^[A-Z]{2}$/.test(code) ? code : null
}

export function getBillingRegionForCountry(countryCode: string | null): BillingRegion {
  const code = normalizeCountryCode(countryCode)
  if (!code) return 'developed'
  return DEVELOPING_COUNTRIES.has(code) ? 'developing' : 'developed'
}

export function getCountryFromHeaders(headers: Headers) {
  return (
    normalizeCountryCode(headers.get('cf-ipcountry')) ||
    normalizeCountryCode(headers.get('x-vercel-ip-country')) ||
    normalizeCountryCode(headers.get('x-appengine-country')) ||
    normalizeCountryCode(headers.get('x-country-code'))
  )
}
