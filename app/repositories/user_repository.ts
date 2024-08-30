import User from '#models/user';
import { RegisterPayload } from '#interfaces/auth'

export default class UserRepository {
  public async create(payload: RegisterPayload) {
    return await User.create(payload);
  }

  public async verifyCredentials(email: string, password: string) {
    return await User.verifyCredentials(email, password);
  }

  public async deleteAccessToken(user: User, tokenId: string) {
    return await User.accessTokens.delete(user, tokenId);
  }
}