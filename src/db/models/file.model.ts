import path from 'path';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { User } from './user.model';
// We don't recommend doing this. Read on for the new way of declaring Model typings.

type FileAttributes = {
  id: number;
  userId: number;
  status: FileStatusEnum;
  fileName: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

enum FileStatusEnum {
  PENDING = 'pending',
  PROCESSING = 'processing',
  FAILED = 'failed',
  SUCCESS = 'success',
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type FileCreationAttributes = Optional<
  FileAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

class File extends Model<FileAttributes, FileCreationAttributes> {
  declare id: number;
  declare userId: number;
  declare status: FileStatusEnum;
  declare fileName: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate() {
    // File принадлежит User
    File.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }

  static initialize(sequelize: Sequelize) {
    File.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(
            FileStatusEnum.PENDING,
            FileStatusEnum.PROCESSING,
            FileStatusEnum.FAILED,
            FileStatusEnum.SUCCESS
          ),
          allowNull: false,
        },
        fileName: {
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
        tableName: 'Files',
      }
    );
  }

  get path() {
    return path.resolve(
      __dirname,
      '../../../uploads',
      `${this.userId}-${this.fileName}`
    );
  }
  // other attributes...
}

export { File, FileStatusEnum };
