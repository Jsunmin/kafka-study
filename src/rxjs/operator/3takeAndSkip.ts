import * as rxjs from 'rxjs'
import * as rxjsAjax from 'rxjs/ajax'

const takeOperator = () => {
	const { range, interval, fromEvent } = rxjs
	const { take, filter, pluck } = rxjs

	range(1, 20).pipe(take(5)).subscribe(console.log)
	range(1, 20)
		.pipe(
			filter((x) => x % 2 === 0),
			take(5),
		)
		.subscribe(console.log)

	// 시간에도 take 처리 가능!
	interval(1000)
		.pipe(take(5))
		.subscribe(
			console.log,
			(err) => console.error(err),
			() => console.log('COMPLETE'),
		)

	// 이벤트 + 조건 결합에도 적용!
	// fromEvent(document, 'click')
	// 	.pipe(
	// 		pluck('x'),
	// 		filter((x) => x < 200),
	// 		take(5),
	// 	)
	// 	.subscribe(
	// 		console.log,
	// 		(err) => console.error(err),
	// 		(_) => console.log('COMPLETE'),
	// 	)
}

const takeLastOperator = () => {
	const { range, interval, fromEvent } = rxjs
	const { takeLast, take, pluck } = rxjs

	range(1, 20).pipe(takeLast(5)).subscribe(console.log)
	interval(1000)
		.pipe(
			take(10), // 이렇게 첫 범위를 잘라내야
			takeLast(5), // 마지막 5개를 가져갈 수 있음
		) // 10초 후 (10개 나오고) 다음에 바로 5개 값 출력됨
		.subscribe(
			console.log,
			(err) => console.error(err),
			() => console.log('COMPLETE'),
		)
}

const takeWhileOperator = () => {
	const { range, interval, fromEvent } = rxjs
	const { takeWhile, takeLast, filter, pluck } = rxjs

	range(1, 20)
		.pipe(takeWhile((x) => x <= 10))
		.subscribe(console.log)

	interval(1000)
		.pipe(takeWhile((x) => x < 5))
		.subscribe(
			console.log,
			(err) => console.error(err),
			() => console.log('COMPLETE'),
		)
}

const takeUntilOperator = () => {
	const { interval, timer, fromEvent } = rxjs
	const { ajax } = rxjsAjax
	const { takeUntil, pluck, tap } = rxjs

	const obs1$ = interval(1000)
	const obs2$ = fromEvent(document, 'click')

	obs1$
		.pipe(
			takeUntil(obs2$), // 인자로 스트림을 받고, 인자 스트림이 값 발행하기 전까지만 obs1의 발행물 받음!
		)
		.subscribe(
			console.log,
			(err) => console.error(err),
			() => console.log('COMPLETE'),
		)

	// 다음과 같이 요청을 받아오기 전까지 일정간격마다 특정 스트림 처리를 할 수도 있다!
	// interval(50)
	// 	.pipe(takeUntil(ajax('http://127.0.0.1:3000/people/name/random').pipe(pluck('response'), tap(console.log))))
	// 	.subscribe(console.log)
}

// takeOperator()
// takeLastOperator()
// takeWhileOperator()
// takeUntilOperator()

const skipOperator = () => {
	const { range, interval, fromEvent } = rxjs
	const { skip, filter, pluck } = rxjs
	range(1, 20).pipe(skip(5)).subscribe(console.log) // 5개 제끼고 발행 처리
}

const skipLastOperator = () => {
	const { range, interval, fromEvent } = rxjs
	const { skipLast, pluck } = rxjs

	range(1, 20).pipe(skipLast(5)).subscribe(console.log)

	// 5개를 스킵하는 것을 수행하기 위해, 5번 발행물을 킵해뒀다가 6번째부터 1번째 발행물을 발행시킴!
	interval(1000)
		.pipe(skipLast(5)) // 5초 후에 0부터 출력!
		.subscribe(
			console.log,
			(err) => console.error(err),
			() => console.log('COMPLETE'),
		)
}

const skipWhileOperator = () => {
	const { range, interval, fromEvent } = rxjs
	const { skipWhile, filter, pluck } = rxjs

	range(1, 20)
		.pipe(skipWhile((x) => x <= 10)) // 10 이하일 떄는 스킵
		.subscribe(console.log)

	interval(1000)
		.pipe(skipWhile((x) => x < 5)) // 5초전까지 스킵되다가 발행
		.subscribe(
			console.log,
			(err) => console.error(err),
			() => console.log('COMPLETE'),
		)
}
const skipUntilOperator = () => {
	const { interval, timer, fromEvent } = rxjs
	const { skipUntil, pluck } = rxjs

	const obs1$ = interval(1000)
	const obs2$ = fromEvent(document, 'click')

	// 클릭(obs2)하기 전까지 스킵되다가, 클릭 하면서 obs1 작동!
	obs1$.pipe(skipUntil(obs2$)).subscribe(
		console.log,
		(err) => console.error(err),
		() => console.log('COMPLETE'),
	)
}

// skipOperator()
// skipLastOperator()
// skipWhileOperator()
skipUntilOperator()
