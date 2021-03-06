'use strict'

const Shared = require('@mojaloop/central-services-shared')

class UnmetConditionError extends Shared.BaseError {
  constructor (message = 'Fulfillment does not match any condition') {
    super(Shared.ErrorCategory.UNPROCESSABLE, message)
  }
}

module.exports = UnmetConditionError
