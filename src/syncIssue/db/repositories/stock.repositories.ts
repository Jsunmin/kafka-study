import { AppDataSource } from '../typeorm'
import { Stock } from '../entities/stock'
import { sleep } from '../../util'

export async function getQuantity(id: string) {
	const stock = await Stock.findOneByOrFail({id})
	return stock.quantity
}

// 일반 처리
export async function decreaseQuantity(id: string, quantity: number) {
	const stock = await Stock.findOneByOrFail({id})
	stock.decrease(quantity)
	return stock.save()
}

// 비관적 라킹 처리 (데드락에 대한 retry 정책 추가)
export async function pessimisticLockDecreaseQuantity(id: string, quantity: number) {
	let tryTx = true
	let retryCnt = 0
	let exponenetialBackoffWait = Math.random() * 100
	while (tryTx && retryCnt <= 10) {
		try {
			const result = await AppDataSource.manager.transaction('SERIALIZABLE', async txm => {
				const stock = await txm.getRepository(Stock).findOneByOrFail({id})
				stock.decrease(quantity)
				return txm.getRepository(Stock).save(stock)
			})
			tryTx = false
			return result
		} catch(err) {
			if (err.message === 'Deadlock found when trying to get lock; try restarting transaction') {
				await sleep(exponenetialBackoffWait)
				exponenetialBackoffWait *= 2
				retryCnt++
			} else {
				console.log(err.message, '????????')
				throw new Error(err)
			}
		}
	}
	throw new Error('Deadlock Retry Failed')
}

// 동시성 영향 안받는 아토픽 메서드로 처리
export async function atomicDecreaseQuantity(id: string, quantity: number) {
	return AppDataSource.manager.transaction(async txm => {
		const result = await txm.getRepository(Stock).decrement({id}, 'quantity', quantity)
		return result
	})
}
