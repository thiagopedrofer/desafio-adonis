import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class BadRequestException extends Exception {
  static status = 400

  constructor(message: string) {
    super(message)
    this.status = BadRequestException.status
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      message: error.message,
    })
  }
}