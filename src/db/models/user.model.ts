import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { File } from './file.model';
// We don't recommend doing this. Read on for the new way of declaring Model typings.
import bcrypt from 'bcryptjs';

type UserAttributes = {
  id: number;
  username: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  password: string;
};

type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare username: string;
  declare password: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare files?: File[];

  // Хешируем пароль перед сохранением в базу данных
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Генерация соли
    return bcrypt.hash(password, salt); // Хеширование пароля с солью
  }

  // Проверка пароля
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword); // Сравнение пароля с хешом
  }

  static associate() {
    // Один User имеет много Files
    User.hasMany(File, {
      sourceKey: 'id',
      foreignKey: 'userId',
      as: 'files',
    });
  }

  static initialize(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'Users',
      }
    );
  }
}

export { User };
