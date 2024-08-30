import User from '#models/user';
import UserRepository from '#repositories/user_repository';
import { inject } from '@adonisjs/core';
import { RegisterPayload } from '#interfaces/auth';

@inject()
export default class AuthService {
  constructor(
    private userRepository: UserRepository
  ) {}

  public async register(payload: RegisterPayload) {
    return await this.userRepository.create(payload);
  }

  public async login(email: string, password: string) {
    const user = await this.userRepository.verifyCredentials(email, password);
    return User.accessTokens.create(user); 
  }

  public async logout(user: User) {
    await this.userRepository.deleteAccessToken(user, user.currentAccessToken.identifier);
  }
}