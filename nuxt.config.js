import StoryblokClient from 'storyblok-js-client/dist/es5/index.es'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: process.env.STORYBLOK_FRONTEND_FETCH_ENABLED !== 'yes',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Nuxt Storyblok',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/storyblok-bridge.client.js',
    '~/plugins/storyblok.js',
    '~/plugins/storyblok-components.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

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
      return pages.map(page => page.full_slug === 'home' ? '/' : page.full_slug)
    }
  },

  // Runtime configuration: https://nuxtjs.org/docs/2.x/directory-structure/nuxt-config#runtimeconfig
  publicRuntimeConfig: {
    storyblokVersion: process.env.STORYBLOK_VERSION,
    storyblokAccessToken: process.env.STORYBLOK_FRONTEND_FETCH_ENABLED === 'yes' ? process.env.STORYBLOK_API_TOKEN : '',
    storyblokBridgeUrl: 'https://app.storyblok.com/f/storyblok-v2-latest.js',
    storyblokBridgeEnabled: process.env.STORYBLOK_BRIDGE_ENABLED === 'yes'
  },
  privateRuntimeConfig: {
    storyblokAccessToken: process.env.STORYBLOK_API_TOKEN
  }
}
