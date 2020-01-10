class UserHooks {
  constructor(eventsBus, services, logger) {
    this._services = services
    this._logger = logger

    eventsBus.on('mutation#signup', this.onSignup())
    eventsBus.on('mutation#updateEmail', this.onUpdateEmail())
    eventsBus.on('mutation#updatePassword', this.onUpdatePassword())
  }

  onSignup() {
    return async user => {
      const logger = this._logger

      logger.info(user)
      const { mailerService } = this._services

      return mailerService.send({
        template: 'signup',
        to: user.user.email,
        data: Buffer.from(JSON.stringify(user.user))
      })
    }
  }

  onUpdateEmail() {
    return async user => {
      const logger = this._logger

      logger.info(user)
      const { mailerService } = this._services

      return mailerService.send({
        template: 'update-email',
        to: user.user.email,
        data: Buffer.from(JSON.stringify(user.user))
      })
    }
  }

  onUpdatePassword() {
    return async user => {
      const logger = this._logger

      logger.info(user)
      const { mailerService } = this._services

      return mailerService.send({
        template: 'update-password',
        to: user.user.email,
        data: Buffer.from(JSON.stringify(user.user))
      })
    }
  }
}

export default UserHooks
