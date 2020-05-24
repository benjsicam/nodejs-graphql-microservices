import EventEmitter from 'events'

class EventsBus extends EventEmitter {
  async publish(event, args) {
    return this.emit(event, args)
  }

  async subscribe(event, handler) {
    this.on(event, handler)
  }
}

export default EventsBus
