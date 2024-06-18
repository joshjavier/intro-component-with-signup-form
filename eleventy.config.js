import lightningcss from "./config/lightningcss.js"

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets/images')
  eleventyConfig.addPassthroughCopy('src/assets/fonts')

  eleventyConfig.addPlugin(lightningcss)

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  }
}
