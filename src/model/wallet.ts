import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction';

@Entity()
export class Wallet {
  @PrimaryColumn({
    comment:
      'The name of the payer, in our case treat it as primary key because there is only one user',
  })
  payer: string;

  @Column({ comment: 'The points user earned from payer.', default: 0 })
  points: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.payer)
  transactions: Transaction[];
}
