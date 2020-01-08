import Email from 'email-templates'
import path from 'path'

class MailerService {
  constructor(transporter, logger, serviceName) {
    this._transporter = transporter
    this._logger = logger
    this._serviceName = serviceName
  }

  async send({ req, response }) {
    let data = Buffer.from(req.data)
    data = JSON.parse(data.toString())
    
    const email = new Email({
      message: {
        from: 'akzdinglasan@gmail.com' // change to support email later
      },
      send: true,
      transport: this._transporter
    })

    this._logger.info(`${this._serviceName}#send.call`, req)

    try {
      const result = await email.send({
        template: path.join(__dirname, '../', 'templates', req.template),
        message: {
          to: req.to
        },
        locals: {
          data: data
        }
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
