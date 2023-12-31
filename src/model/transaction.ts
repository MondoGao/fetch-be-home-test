import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: 'The name of the payer.',
    nullable: false,
  })
  payer: string;

  @Column({
    comment: 'The intial points user earned from payer by one transaction.',
    nullable: false,
  })
  points: number;

  @Column({
    comment: 'The points user used for this transaction',
    default: 0,
    nullable: false,
  })
  spent: number;

  @Column({ comment: 'Timestamp received from request.', nullable: false })
  timestamp: Date;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
