'use strict'

const Config = require('../../lib/config')

const extractUrls = (request) => {
  const urls = {}
  request.server.table()[0].table.filter(route => {
    return route.settings.id !== undefined &&
      Array.isArray(route.settings.tags) &&
      route.settings.tags.indexOf('api') >= 0
  }).forEach(route => {
    urls[route.settings.id] = `${Config.HOSTNAME}${route.path.replace(/\{/g, ':').replace(/\}/g, '')}`
  })
  const host = Config.HOSTNAME.replace(/^https?:\/\//, '')
  urls['websocket'] = `ws://${host}/websocket`
  return urls
}

exports.metadata = function (request, h) {
  return h.response({
    currency_code: null,
    currency_symbol: null,
    ledger: Config.HOSTNAME,
    urls: extractUrls(request),
    precision: Config.AMOUNT.PRECISION,
    scale: Config.AMOUNT.SCALE,
    connectors: []
  }).code(200)
}
