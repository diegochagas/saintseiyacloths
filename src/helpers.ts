export function getClothName(t: (key: string) => string, strings?: string[]) {
  return strings ? strings.reduce((acc, curr, index) => 
    acc + (index === 0 ? t(curr) : ` (${t(curr)})`),
  '') : `${t('unknown')} (${t('cloth')})`
}