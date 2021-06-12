/* eslint-disable nuxt/no-cjs-in-config */
// Lambda with NodeJS runtime not currently support import/export
const nuxtConfig = require('./nuxt.config')

module.exports = {
  ...nuxtConfig,
  target: 'server',
  ssr: true,
  buildModules: nuxtConfig.buildModules
    .filter(module => ['@nuxtjs/eslint-module'].includes(module) === false)
}
