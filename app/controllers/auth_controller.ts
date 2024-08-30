import type { HttpContext } from '@adonisjs/core/http';
import { LoginValidator } from '#validators/login';
import { registerValidator } from '#validators/users/create';
import AuthService from '#services/auth_service';

export default class AuthController {
  private authService = new AuthService();

  public async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator);
    const user = await this.authService.register(payload);
    return response.status(201).json(user);
  }

  public async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(LoginValidator);
    const token = await this.authService.login(email, password);
    return token;
  }

  public async logout({ auth, response }: HttpContext) {
    const user = auth.user!;
    await this.authService.logout(user);
    return response.json({ message: 'logout success' });
  }
}