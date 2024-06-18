import path from "node:path";
import { bundle } from "lightningcss"

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addTemplateFormats('css')

  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (inputContent, inputPath) => {
      let parsed = path.parse(inputPath)
      let filename = parsed.base
      let baseDir = path.basename(parsed.dir)
      // Do not generate CSS if a file is named with a leading underscore
      // or if it is inside a directory named with a leading underscore.
      if (filename.startsWith('_') || baseDir.startsWith('_')) {
        return undefined
      }

      let result = bundle({
        filename: inputPath
      })

      return async () => {
        return result.code.toString()
      }
    }
  })
}
