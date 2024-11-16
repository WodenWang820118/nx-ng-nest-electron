import {
  Column,
  Table,
  Model,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'Tasks' })
export class Task extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare text: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare day: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare reminder: boolean;
}
