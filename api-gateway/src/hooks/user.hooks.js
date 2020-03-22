class UserHooks {
  constructor(services, pubsub, logger) {
    this._eventsBus = services.eventsBus
    this._pubsub = pubsub
    this._logger = logger

    this._eventsBus.on('mutation#signup', this.onSignup())
    this._eventsBus.on('mutation#updateEmail', this.onUpdateEmail())
    this._eventsBus.on('mutation#updatePassword', this.onUpdatePassword())
  }

  onSignup() {
    return async ({ result }) => {
      this._logger.info('UserHooks#onSignup.call', result.user)

      const { mailerService } = this._services

      return mailerService.send({
        template: 'signup',
        to: result.user.email,
        data: Buffer.from(JSON.stringify(result.user)),
      })
    }
  }

  onUpdateEmail() {
    return async ({ result }) => {
      this._logger.info('UserHooks#onUpdateEmail.call', result.user)

      const { mailerService } = this._services

      return mailerService.send({
        template: 'update-email',
        to: result.user.email,
        data: Buffer.from(JSON.stringify(result.user)),
      })
    }
  }

  onUpdatePassword() {
    return async ({ result }) => {
      this._logger.info('UserHooks#onUpdatePassword.call', result.user)

      const { mailerService } = this._services

      return mailerService.send({
        template: 'update-password',
        to: result.user.email,
        data: Buffer.from(JSON.stringify(result.user)),
      })
    }
  }
}

export default UserHooks
