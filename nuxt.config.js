/* eslint-disable nuxt/no-cjs-in-config */
// Lambda with NodeJS runtime not currently support import/export

module.exports = {
  target: 'static',
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Nuxt Storyblok',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt Storyblok Demo' }
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
    '~/plugins/storyblok.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '~/components/layout/',
      prefix: 'layout'
    },
    {
      path: '~/components/nested/',
      prefix: 'nested'
    }
  ],

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
