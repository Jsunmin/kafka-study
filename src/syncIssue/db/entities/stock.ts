import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'

@Entity({name: 'stock'})
export class Stock extends BaseEntity {
	@PrimaryGeneratedColumn('increment', {type: 'bigint', unsigned: true})
	public id: string

	@Column({type: 'varchar', nullable: false})
	public name: string

	@Column({type: 'varchar', nullable: false})
	public quantity: number

	@CreateDateColumn()
	public createdAt: Date

	@UpdateDateColumn()
	public updatedAt: Date

	decrease(quantity: number) {
		if (this.quantity < quantity) {
			throw new Error('Invalid quantity input')
		}
		this.quantity -= quantity
	}
}
