const dictionaries = {
  en: () => import('./locales/en.json').then((module) => module.default),
  es: () => import('./locales/es.json').then((module) => module.default)
}

export const getDictionary = async (locale: keyof typeof dictionaries) => {
  return dictionaries[locale]()
} 