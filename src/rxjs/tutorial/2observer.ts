import * as rxjs from 'rxjs'

// 옵저버
const observer = () => {
	const obs1$ = rxjs.from([1, 2, 3, 4, 5])

	const observer = {
		next: console.log, // = function(x) { console.log(x) }
		error: (err) => console.error('발행중 오류', err), // 에러 이벤트 콜백
		complete: () => console.log('발행물 완결'), // 옵저버블 완료 이벤트 발행시 콜백
	}

	obs1$.subscribe(observer)

	// 바로 옵저버 등록 (순서대로)
	obs1$.subscribe(
		console.log,
		(err) => console.error('발행중 오류', err),
		() => {
			console.log('발행물 완결')
		},
	)
}

// 옵저버 에러
const observerError = () => {
	const obs$ = new rxjs.Observable((subscriber) => {
		subscriber.next(1)
		subscriber.next(2)
		subscriber.next(3)
		throw new Error('^^')
		subscriber.next(4) // 닿지 않음
	})

	obs$.subscribe(
		console.log,
		(err) => console.error('발행중 오류', err),
		() => {
			console.log('발행물 완결')
		},
	)
}

// 옵저버 완료
const observerComplete = () => {
	const obs$ = new rxjs.Observable((subscriber) => {
		subscriber.next(1)
		subscriber.next(2)
		subscriber.next(3)
		subscriber.complete() // 완료를 처리해줘야 옵저버블 메모리할당 처리!
		subscriber.next(4) // 닿지 않음
	})

	obs$.subscribe(
		console.log,
		(err) => console.error('발행중 오류', err),
		() => {
			console.log('발행물 완결')
		},
	)
}

// 옵저버블에 여러 구독자가 붙어있으면 해당 구독만 완료 처리!
const unsubscribeObserver = () => {
	const obs$ = rxjs.interval(1000)
	const subscription = obs$.subscribe(console.log)
	setTimeout(() => subscription.unsubscribe(), 5500)
}

// observer()
// observerError()
// observerComplete()
unsubscribeObserver()
