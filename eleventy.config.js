/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets/images')

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  }
}
