import { decreaseQuantity, getQuantity } from './db/repositories/stock.repositories'
import { closeDb, initDb } from './db/typeorm'

const requestCnt = 100
main(requestCnt)

// 100 request
async function main(requests: number) {
	await initDb()
	try {
		const id = '1'
		const decreasequantityPerRequest = 1
		for (const _cnt of Array.from({length: requests})) {
			await decreaseQuantity(id, decreasequantityPerRequest)
		}
		const result = await getQuantity(id)
		console.log('result', result)
	} catch (err) {
		console.error(err)
		throw new Error(err)
	} finally {
		await closeDb()
		console.log('done')
	}
}
