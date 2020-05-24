class PostHooks {
  constructor (services, pubsub, logger) {
    this._eventsBus = services.eventsBus
    this._services = services
    this._pubsub = pubsub
    this._logger = logger

    this._eventsBus.on('mutation#createPost', this.onCreate())
  }

  onCreate () {
    return async ({ result }) => {
      this._logger.info('PostHooks#onCreate.call', result)

      this._pubsub.publish('post', result)
    }
  }
}

export default PostHooks
