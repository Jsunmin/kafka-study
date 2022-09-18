import { atomicDecreaseQuantity, decreaseQuantity, getQuantity, pessimisticLockDecreaseQuantity } from './db/repositories/stock.repositories'
import { Worker, isMainThread, parentPort , workerData} from 'worker_threads'
import { closeDb, initDb } from './db/typeorm'
import { sleep } from './util'

const requestCnt = 100
main(requestCnt)

const id = '1'
const decreasequantityPerRequest = 1

// 100 request
async function main(requests: number) {
	await initDb()
	try {
		// 1 sync로 작업처리됨
		// for (const _cnt of Array.from({length: requests})) {
		// 	await decreaseQuantity(id, decreasequantityPerRequest)
		// }

		// 2 orm 캐시덕분인지 select 1번만
		// const promises = Array.from({length: requests}).map(async () => {
		// 	await decreaseQuantity(id, decreasequantityPerRequest)
		// })
		// await Promise.all(promises)

		// 3 단일 처리 (스크립트 복수 실행)
		// await decreaseQuantity(id, decreasequantityPerRequest)
		
		// const result = await getQuantity(id)
		// console.log('result', result)

		// 4 워커 처리
		await doWorkerJob(requestCnt)

	} catch (err) {
		console.error(err)
		throw new Error(err)
	} finally {
		await closeDb()
		console.log('done')
	}
}

async function doWorkerJob(workerCnt: number) {
	if (isMainThread) {
		const workerPromises = [];
		let cnt = 0;
		for (let i = 0; i < workerCnt; i++) {
		  workerPromises.push(createWorker(i+1));
		  cnt++
		}
		const threadResults = await Promise.all(workerPromises);
		console.log(cnt, threadResults)

		const result = await getQuantity(id)
		console.log('result', result)
	 } else {
		// 워커스레드 로직
		const {wid, id, decreaseQuantity: decreaseQ} = workerData;
		await sleep()
		// 일반 처리
		// const stock = await decreaseQuantity(id, decreaseQ)
		// parentPort.postMessage({wid, q: stock.quantity});

		// 아토믹 오퍼레이션 처리
		// const stock = await atomicDecreaseQuantity(id, decreaseQ)
		// parentPort.postMessage({wid, q: stock.affected});
	  
		// 비관적락 처리
		const stock = await pessimisticLockDecreaseQuantity(id, decreaseQ)
		parentPort.postMessage({wid, q: stock.quantity});
	 }
}

function createWorker(wid: number) {
	return new Promise(function (resolve, reject) {
	  const worker = new Worker(__filename, {
		workerData: { wid, id: 1, decreaseQuantity: decreasequantityPerRequest },
	  });
	  // 각 Worker에 이벤트를 등록
	  worker.on("message", (data) => {
		resolve(data);
	  });
	  worker.on("error", (msg) => {
		reject(`An error ocurred: ${msg}`);
	  });
	});
}

