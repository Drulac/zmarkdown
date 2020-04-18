// This is the same as the `html` renderer, but highlight & katex were removed.
// We need to duplicate the file because otherwise Webpack would
// load the modules anyway...
import {mdastParser} from './zmdast'

const rendererForge   = require('../renderers/renderer-forge')

const remark2rehype   = require('remark-rehype')
const rehypeStringify = require('rehype-stringify')

const defaultMdastConfig = require('../config/mdast')
const defaultHtmlConfig  = require('../config/html')

const defaultStringifierList = {
  lineNumbers:      require('../plugins/rehype-line-numbers'),
  slug:             require('rehype-slug'),
  autolinkHeadings: require('rehype-autolink-headings'),
  footnotesTitles:  require('rehype-footnotes-title'),
  htmlBlocks:       require('rehype-html-blocks'),
  postfixFootnotes: require('rehype-postfix-footnote-anchors'),
  sanitize:         require('rehype-sanitize'),
}

const postProcessorList = {
  iframeWrappers:   require('../postprocessors/html-iframe-wrappers'),
  footnotesReorder: require('../postprocessors/html-footnotes-reorder'),
}

export function htmlParser (tokenizer, config) {
  tokenizer
    .use(remark2rehype, config.bridge)

  rendererForge(
    tokenizer,
    defaultStringifierList,
    postProcessorList,
  )(config)

  return tokenizer
    .use(rehypeStringify, config.stringify)
}

export function renderHtml (
  markdown,
  cb,
  mdConfig = defaultMdastConfig,
  htmlConfig = defaultHtmlConfig,
) {
  const parser = mdastParser(mdConfig)
  htmlParser(parser, htmlConfig)

  parser.process(markdown, (err, vfile) => {
    if (err) return cb(err)

    cb(null, vfile)
  })
}
