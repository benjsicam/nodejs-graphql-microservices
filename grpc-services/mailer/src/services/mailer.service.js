class MailerService {
  constructor(transporter, logger, serviceName) {
    this._transporter = transporter
    this._logger = logger
    this._serviceName = serviceName
  }

  async send({ req, response }) {
    this._logger.info(`${this._serviceName}#send.call`, req)
    try {
      const result = await this._transporter.sendMail({
        from: 'akzdinglasan@gmail.com', // change to support email later
        to: req.to,
        subject: 'Test subject', // change to subject from template later
        html: '<h1>test email</h1>' // change to template later
      })

      this._logger.info(`${this._serviceName}#send.result`, result)

      response.res = { isSent: true }

      return response.res
    } catch (error) {
      this._logger.error(`${this._serviceName}#send.error`, error)

      response.res = { isSent: false }

      return response.res
    }
  }
}

export default MailerService
