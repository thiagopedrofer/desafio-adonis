import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class NotFoundException extends Exception {
  static status = 404

  constructor(message: string) {
    super(message)
    this.status = NotFoundException.status
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      message: error.message,
    })
  }
}