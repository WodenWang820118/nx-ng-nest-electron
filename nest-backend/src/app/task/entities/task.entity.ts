import { Column, Table, Model, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'Tasks' })
export class Task extends Model {
  @PrimaryKey
  @Column
  id: string;
  @Column
  text: string;
  @Column
  day: string;
  @Column
  reminder: boolean;
}
