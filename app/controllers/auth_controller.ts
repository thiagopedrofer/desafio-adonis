import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { LoginValidator } from '#validators/login';
import { registerValidator } from '#validators/users/create';


export default class AuthController {

  public async register({ request, response }: HttpContext) {
    
    const payload = await request.validateUsing(registerValidator)
        
    const user = await User.create(payload)

    return response.status(201).json(user)
}

  async login({ request }: HttpContext) {

    const { email, password } = await request.validateUsing(LoginValidator)
    const user = await User.verifyCredentials(email, password)

    return User.accessTokens.create(user)

  }

  async logout({ auth }: HttpContext) {

    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return { message: 'success' }

  }
}
