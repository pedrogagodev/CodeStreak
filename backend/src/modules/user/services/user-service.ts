import { IUserRepository } from "../interfaces/user";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async getUserByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
