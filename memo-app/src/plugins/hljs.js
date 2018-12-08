import hljs from 'highlight.js/lib/highlight'

const langs = [
  'javascript',
  'ruby'
]

for (const lang of langs) {
  hljs.registerLanguage(lang, require(`highlight.js/lib/languages/${lang}`))
}

export default hljs
