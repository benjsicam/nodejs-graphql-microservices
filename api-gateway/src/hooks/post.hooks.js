class PostHooks {
  constructor(services, pubsub, logger) {
    this._eventBus = services.eventsBus
    this._pubsub = pubsub
    this._logger = logger

    this._eventsBus.on('mutation#createPost', this.onCreate())
    this._eventsBus.on('mutation#updatePost', this.onUpdate())
    this._eventsBus.on('mutation#deletePost', this.onDelete())
  }

  onCreate() {
    return async ({ result }) => {
      this._logger.info('PostHooks#onCreate.call', result)

      this._pubsub.publish('post', {
        mutation: 'CREATED',
        data: result
      })
    }
  }

  onUpdate() {
    return async ({ result }) => {
      this._logger.info('PostHooks#onUpdate.call', result)

      this._pubsub.publish('post', {
        mutation: 'UPDATED',
        data: result
      })
    }
  }

  onDelete() {
    return async ({ args, result }) => {
      this._logger.info('PostHooks#onDelete.call', result)

      if (result >= 1) {
        this._pubsub.publish('post', {
          mutation: 'DELETED',
          data: {
            id: args.id
          }
        })
      }
    }
  }
}

export default PostHooks
