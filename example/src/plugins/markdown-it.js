import { mavonEditor } from 'mavon-editor'

const markdownIt = mavonEditor.getMarkdownIt()

// markdownIt.options.highlight = (str, lang) => {
//   if (lang && hljs.getLanguage(lang)) {
//     try {
//       return hljs.highlight(lang, str).value
//     } catch (__) {}
//   }
// }

export default markdownIt
