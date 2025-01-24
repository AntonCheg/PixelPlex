import { Sequelize } from 'sequelize';
import { User } from './user.model';
import { File, FileStatusEnum } from './file.model';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql', // Укажите ваш диалект
  }
);

User.initialize(sequelize);
File.initialize(sequelize);

// Настройка ассоциаций
User.associate();
File.associate();

export { sequelize, User, File, FileStatusEnum };
