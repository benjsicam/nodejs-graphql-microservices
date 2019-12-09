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

      return user

      // const { mailer } = this._services

      // return mailer.send({
      //   template: 'signup',
      //   to: user.email,
      //   data: user
      // })
    }
  }
}

export default UserHooks
