const sls = require('serverless-http')
const { Nuxt } = require('nuxt-start')
const NUXT_ROOT_DIR = '/opt/nuxt'

const config = require(`${NUXT_ROOT_DIR}/nuxt.config.server.js`)
const nuxt = new Nuxt({ ...config, rootDir: NUXT_ROOT_DIR, dev: false })
const controller = (req, res) => nuxt.ready().then(() => nuxt.server.app(req, res))

exports.handler = sls(controller, {
  binary: [
    'application/javascript',
    'application/json',
    'application/octet-stream',
    'application/xml',
    'font/eot',
    'font/opentype',
    'font/otf',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'text/comma-separated-values',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/text',
    'text/xml'
  ]
})
