/* eslint-disable nuxt/no-cjs-in-config */
// Lambda with NodeJS runtime not currently support import/export
const StoryblokClient = require('storyblok-js-client')
const nuxtConfig = require('./nuxt.config')

module.exports = {
  ...nuxtConfig,
  target: 'static',
  ssr: true,

  // Generate configuration: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-generate
  generate: {
    fallback: process.env.STORYBLOK_FRONTEND_FETCH_ENABLED === 'yes' ? 'index.html' : '404.html',
    routes: async () => {
      if (process.env.STORYBLOK_FRONTEND_FETCH_ENABLED === 'yes') {
        return []
      }

      // Initialize Storyblok client
      const client = new StoryblokClient({
        accessToken: process.env.STORYBLOK_API_TOKEN
      })

      // Retrieve all pages
      /** @todo handle pagination */
      const response = await client.get('cdn/stories', {
        version: process.env.STORYBLOK_VERSION
      })
      const { stories: pages } = response.data

      // return an array of pages routes
      return pages
        .filter((page) => {
          return page.content.component === 'page'
        })
        .map(page => page.full_slug === 'home' ? '/' : page.full_slug)
    }
  }
}
