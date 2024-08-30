import User from '#models/user';

export default class AuthService {
  async register(payload: any) {
    
    return await User.create(payload);
  }

  async login(email: string, password: string) {
    
    const user = await User.verifyCredentials(email, password);
    return User.accessTokens.create(user);
  }

  async logout(user: User) {
    
    await User.accessTokens.delete(user, user.currentAccessToken.identifier);
  }
}