import Vue from 'vue'
import GetText from 'vue-gettext'
import languages from '@/assets/data/languages.json'

const translations: any = {}

async function loadTranslations (lang: string): Promise<any> {
  if (lang !== 'en') {
    Object.assign(translations, await import(`../assets/data/locale/${lang}/translation.json`))
  }
}

Object.keys(languages).forEach(loadTranslations)

Vue.use(GetText, {
  availableLanguages: languages,
  translations: translations,
  defaultLanguage: 'en',
  silent: true
})
