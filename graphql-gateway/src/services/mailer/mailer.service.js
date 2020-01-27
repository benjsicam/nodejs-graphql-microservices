import Aigle from 'aigle'

class MailerService {
  constructor(client, logger) {
    this._serviceName = 'MailerService'
    this._client = Aigle.promisifyAll(client)
    this._logger = logger
  }

  async send(details) {
    this._logger.info(`${this._serviceName}#sendMail.call`, details)

    const result = await this._client.sendAsync(details)

    this._logger.info(`${this._serviceName}#sendMail.result`, result)

    return result
  }
}

export default MailerService
