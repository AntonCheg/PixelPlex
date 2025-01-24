import { User } from '../db/models/user.model';

class AuthService {
  static async register(username: string, password: string) {
    const existingUser = await User.findOne({
      where: {
        username,
      },
    });
    if (existingUser) {
      throw new Error('Username is already taken');
    }

    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    return { username };
  }

  static async login(username: string, password: string) {
    // Ищем пользователя по username
    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Проверяем пароль
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return user;
  }
}

export { AuthService };
