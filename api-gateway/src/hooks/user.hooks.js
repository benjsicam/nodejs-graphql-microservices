class UserHooks {
  constructor(services, pubsub, logger) {
    this._eventsBus = services.eventsBus
    this._services = services
    this._pubsub = pubsub
    this._logger = logger

    this._eventsBus.on('mutation#signup', this.onSignup())
    this._eventsBus.on('mutation#updateEmail', this.onUpdateEmail())
    this._eventsBus.on('mutation#updatePassword', this.onUpdatePassword())
  }

  onSignup() {
    return async ({ result }) => {
      this._logger.info('UserHooks#onSignup.call %o', result.user)

      const { user } = result
      const { mailerService } = this._services

      return mailerService.send({
        template: 'signup',
        to: user.email,
        data: Buffer.from(JSON.stringify(user))
      })
    }
  }

  onUpdateEmail() {
    return async ({ result }) => {
      this._logger.info('UserHooks#onUpdateEmail.call %o', result.user)

      const { user } = result
      const { mailerService } = this._services

      return mailerService.send({
        template: 'update-email',
        to: user.email,
        data: Buffer.from(JSON.stringify(user))
      })
    }
  }

  onUpdatePassword() {
    return async ({ result }) => {
      this._logger.info('UserHooks#onUpdatePassword.call %o', result.user)

      const { user } = result
      const { mailerService } = this._services

      return mailerService.send({
        template: 'update-password',
        to: user.email,
        data: Buffer.from(JSON.stringify(user))
      })
    }
  }
}

export default UserHooks
