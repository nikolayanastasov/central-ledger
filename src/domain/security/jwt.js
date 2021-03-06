'use strict'

const JWT = require('jsonwebtoken')
const Promise = require('bluebird')
const Config = require('../../lib/config')
const Errors = require('../../errors')
const SecurityService = require('./index')

const create = (key) => {
  const expiresIn = (Config.TOKEN_EXPIRATION || 3600000) / 1000
  return SecurityService.getUserByKey(key)
    .then(user => JWT.sign({ userInfo: { userId: user.userId } }, Config.ADMIN_SECRET, { algorithm: 'HS512', expiresIn, issuer: Config.HOSTNAME }))
}

const verify = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, Config.ADMIN_SECRET, { algorithm: ['HS512'], issuer: Config.HOSTNAME }, (err, decoded) => {
      if (err) {
        return reject(new Errors.UnauthorizedError('Invalid token'))
      }
      return resolve(decoded)
    })
  })
  .then(decoded => {
    const userId = decoded.userInfo.userId
    return Promise.props({
      user: SecurityService.getUserById(userId),
      roles: SecurityService.getUserRoles(userId)
    })
  })
  .catch(Errors.NotFoundError, () => {
    throw new Errors.UnauthorizedError('Invalid token')
  })
}

module.exports = {
  create,
  verify
}
