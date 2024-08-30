import User from '#models/user';
import UserRepository from '#repositories/user_repository';
import { inject } from '@adonisjs/core';

@inject()
export default class AuthService {
  constructor(
    private userRepository: UserRepository
  ) {}

  public async register(payload: any) {
    return await this.userRepository.create(payload);
  }

  public async login(email: string, password: string) {
    const user = await this.userRepository.verifyCredentials(email, password);
    return User.accessTokens.create(user); 
  }

  public async logout(user: any) {
    await this.userRepository.deleteAccessToken(user, user.currentAccessToken.identifier);
  }
}