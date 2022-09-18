import { Stock } from '../entities/stock'

export async function getQuantity(id: string) {
	const stock = await Stock.findOneByOrFail({id})
	return stock.quantity
}

export async function decreaseQuantity(id: string, quantity: number) {
	const stock = await Stock.findOneByOrFail({id})
	stock.decrease(quantity)
	return stock.save()
}
export async function atomicDecreaseQuantity() {}