class UserHooks {
  constructor(eventsBus, services, logger) {
    this._services = services
    this._logger = logger

    eventsBus.on('mutation#signup', this.onSignup())
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
}

export default UserHooks
