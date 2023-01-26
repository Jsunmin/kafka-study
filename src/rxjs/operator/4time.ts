import * as rxjs from 'rxjs'
import * as rxjsAjax from 'rxjs/ajax'

const delayOperator = () => {
	const { interval, fromEvent } = rxjs
	const { delay, tap, take } = rxjs

	interval(1000)
		.pipe(
			take(5),
			tap((x) => console.log(x + ' 발행시작')),
			delay(1500), // 발행 완료까지 1.5초 지연
		)
		.subscribe((x) => console.log(x + ' 발행완료'))
}

const timestampOperator = () => {
	const { timestamp, interval } = rxjs

	interval(1000)
		.pipe(timestamp())
		.subscribe((x) => {
			console.log(x.value, x.timestamp, new Date(x.timestamp).toString()) // epoch형
		})
}

const timeIntervalOperator = () => {
	const { fromEvent, interval } = rxjs
	const { timeInterval, pluck } = rxjs

	// 이전 클릭과의 시간차
	// fromEvent(document, 'click').pipe(pluck('x'), timeInterval()).subscribe(console.log)

	// 실제 1초보단 차이가 있게 시간차가 찍힘
	interval(1000).pipe(timeInterval()).subscribe(console.log)
}

const timeoutOperator = () => {
	const { fromEvent } = rxjs
	const { ajax } = rxjsAjax
	const { timeout, pluck } = rxjs

	// 스트림이 (클릭 이벤트) 인자 타임아웃내에 이벤트가 시작되지 않으면 에러
	// fromEvent(document, 'click')
	// 	.pipe(timeout(3000))
	// 	.subscribe(
	// 		(_) => console.log('OK'),
	// 		(err) => console.error(err),
	// 	)

	// 응답 시간이 0.5s 넘어가면 에러!
	ajax('http://127.0.0.1:3000/people/name/random').pipe(pluck('response'), timeout(500)).subscribe(console.log, console.error)
}

const timeoutWithOperator = () => {
	const { fromEvent, interval, of } = rxjs
	const { ajax } = rxjsAjax
	const { timeoutWith, pluck, scan } = rxjs

	// 주어지 시간내에 이벤트 미발행시 인자 옵저버블 실행
	// fromEvent(document, 'click')
	// 	.pipe(
	// 		timeoutWith(3000, interval(1000)), // 3초동안 클릭하지 않으면, 인터벌이 실행됨
	// 		scan((acc, x) => {
	// 			return acc + 1
	// 		}, 0),
	// 	)
	// 	.subscribe(console.log)

	ajax('http://127.0.0.1:3000/people/name/random')
		.pipe(
			pluck('response'),
			timeoutWith(
				500,
				of({
					// 0.5s안에 오지 않으면, of로 만든 대체 객체를 리턴!
					id: 0,
					first_name: 'Hong',
					last_name: 'Gildong',
					role: 'substitute',
				}),
			),
		)
		.subscribe(console.log, console.error)
}

// delayOperator()
// timestampOperator()
// timeIntervalOperator()
// timeoutOperator()
// timeoutWithOperator()

{
	const { fromEvent } = rxjs
	const { timeInterval, pluck, scan, tap } = rxjs

	const clicks$ = fromEvent(document, 'click').pipe(
		timeInterval(),
		pluck('interval'),
		scan((acc, i) => acc + i, 0),
		tap((x) => console.log('CLICKED: ' + x)), // 이벤트 시작부터 클릭한 시간의 타임스탬프를 기록
	)

	clicks$.subscribe()

	const debounceTimeOperator = () => {
		const { debounceTime } = rxjs
		// 마지막 발행물이 주어지고, 주어진 시간까지 마지막 발행물이면 (다음 값X) 출력! (이벤트가 시작되어야 작동)
		clicks$.pipe(debounceTime(1000)).subscribe((x) => console.log('OUTPUT: -------- ' + x))
	}
	const auditTimeOperator = () => {
		const { auditTime } = rxjs
		// 이벤트가 시작되고, 주어진 시간안에 주어진 마지막 값이 출력 (이벤트가 시작되어야 작동)
		clicks$.pipe(auditTime(1000)).subscribe((x) => console.log('OUTPUT: -------- ' + x))
	}
	const sampleTimeOperator = () => {
		const { sampleTime } = rxjs
		// 주어진 시간안에 주어진 마지막 값이 출력 (무조건 해당 초마다 나타남)
		clicks$.pipe(sampleTime(1000), timeInterval()).subscribe((x) => console.log('OUTPUT: -------- ' + x.value + ' :' + x.interval))
	}
	const throttleTimeOperator = () => {
		const { throttleTime } = rxjs

		// 이벤트가 시작되고, 주어진 시간안에 처음 시작한 이벤트만 출력
		clicks$
			.pipe(
				throttleTime(1000, undefined, {
					// 2번째인자는 스케줄러
					leading: true,
					trailing: false,
				}),
			)
			.subscribe((x) => console.log('OUTPUT: -------- ' + x))

		// 이벤트가 시작되고, 주어진 시간안에 가장 마지막 이벤트만 출력
		clicks$
			.pipe(
				throttleTime(1000, undefined, {
					leading: false,
					trailing: true,
				}),
			)
			.subscribe((x) => console.log('OUTPUT: -------- ' + x))

		// leading: true & trailing: true ~ 맨 앞, 맨 뒤 둘다 출력
	}

	// 	debounceTimeOperator()
	// auditTimeOperator()
	// sampleTimeOperator()
	// throttleTimeOperator()
}
