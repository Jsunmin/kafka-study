import * as rxjs from 'rxjs'
import * as rxjsAjax from 'rxjs/ajax'

const sequenceEqualOperator = () => {
	const { from, fromEvent } = rxjs
	const { sequenceEqual, mergeMap, map, take } = rxjs

	const num$ = from([3, 1, 4, 7, 5, 8, 2])

	// 시간차 상관없이 기준과 인자 스트림의 각 결과물들이 순서와 값이 같은지 판단
	// const key$ = fromEvent(document, 'keyup')
	// 	.pipe(
	// 		map((e) => Number(e.code.replace('Digit', ''))),
	// 		take(7),
	// 		sequenceEqual(num$),
	// 	)
	// 	.subscribe(console.log)
}

const distinctUntilChangedOperator = () => {
	const { of, from } = rxjs
	const { distinctUntilChanged } = rxjs

	// 연속된 같은값만 distinct 처리 -> 1,2,1,2,3,4,1 ~ 중복값은 존재!
	of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 3, 4, 4, 1).pipe(distinctUntilChanged()).subscribe(console.log)

	const students = [
		{ name: '홍길동', sex: 'male' },
		{ name: '전우치', sex: 'male' },
		{ name: '아라치', sex: 'female' },
		{ name: '성춘향', sex: 'female' },
		{ name: '임꺽정', sex: 'male' },
	]
	from(students)
		// 콜백을 인자로 넘겨줘 비교 여부 커스텀 가능 (sex 연속되게 같은 경우만 distinct!)
		.pipe(distinctUntilChanged((a, b) => a.sex === b.sex))
		.subscribe(console.log)
}

const combineLatestOperator = () => {
	const { combineLatest, interval, fromEvent } = rxjs
	const { pluck } = rxjs
	// 각 스트림 조합에서 이벤트가 생성되면, 각 스트림의 최신 이벤트를 결합시켜 발행
	combineLatest(interval(2000), fromEvent(document, 'click').pipe(pluck('x'))).subscribe(console.log)
}

const bufferOperator = () => {
	const { interval, fromEvent, range } = rxjs
	const { buffer } = rxjs

	// buffer ~ 기준 스트림 이벤트를 인자 스트림 이벤트마다 버퍼시켜 발행 (클릭마다 리턴!)
	interval(1000)
		.pipe(buffer(fromEvent(document, 'click')))
		.subscribe(console.log)

	// buffer count ~ 버퍼 발행물의 limit과 skip을 제안해 발행
	//  이벤트의 경우 버퍼 카운트 찰때까지 발행 안하다가 발행!
	const { bufferCount } = rxjs
	range(1, 100).pipe(bufferCount(10, 10)).subscribe(console.log)

	// buffer time ~ 시간마다 버퍼로 묶어서 발행
	const { bufferTime } = rxjs
	interval(200).pipe(bufferTime(2000)).subscribe(console.log)
}

// 인덱스 순서끼리 결합
const groupByOperator = () => {
	const { range } = rxjs
	const { groupBy, mergeMap, toArray } = rxjs

	range(1, 50)
		.pipe(
			groupBy((x) => x % 3), // 인자의 결과값에 따라 그룹을 묶어서
			mergeMap((groups$) => {
				console.log(groups$, '@') // 인자는 하위 옵저버블
				return groups$.pipe((r) => {
					console.log(r, '@@') // 마찬가지로 하위 옵저버블
					return r.pipe(toArray()) // 옵저버블 출력물 배열화
				})
			}), // 나오는 하위 스트림 발행물들을 배열로 !
		)
		.subscribe(console.log)
}

// sequenceEqualOperator()
// distinctUntilChangedOperator()
// combineLatestOperator()
// bufferOperator()
// groupByOperator()

const withOperator = () => {
	const { of } = rxjs
	const { startWith, endWith } = rxjs

	const obs$ = of(1, 2, 3)
	// 발행물 앞에 0 추가
	obs$.pipe(startWith(0)).subscribe(console.log)
	console.log('\n\n')
	// 발행물 뒤에 -2, -1, 0 추가
	obs$.pipe(endWith(-2, -1, 0)).subscribe(console.log)
}
const everyOperator = () => {
	const { of } = rxjs
	const { every } = rxjs

	of(1, 3, 5, 7, 9, 11, 13, 15)
		.pipe(every((x) => x % 2 !== 0))
		.subscribe(console.log)
}
const defaultIfEmptyOperator = () => {
	const { fromEvent, timer } = rxjs
	const { defaultIfEmpty, pluck, takeUntil } = rxjs

	fromEvent(document, 'click')
		.pipe(
			takeUntil(timer(5000)), // 5초 안 발행물
			pluck('x'), // 특정 값 뽑아
			defaultIfEmpty('NO CLICK'),
		) // 없으면 기본 값 세팅
		.subscribe(console.log)
}
const retryOperator = () => {
	const { range } = rxjs
	const { ajax } = rxjsAjax
	const { mergeMap, pluck, retry } = rxjs

	range(1, 20)
		.pipe(
			mergeMap(
				// 1 ~ 20까지 파라미터 넣으면서
				(keyword) =>
					ajax(`http://127.0.0.1:3000/people/quarter-error/${keyword}`).pipe(
						// 요청 결과 기준으로 하위 옵저버블 만들어
						pluck('response', 'first_name'), // 데이터 뽑고
						retry(3), // 3번 리트라이 정책
					),
			),
		)
		.subscribe(console.log)
}
const deferOperator = () => {
	const { defer, fromEvent, of } = rxjs
	const { pluck } = rxjs

	fromEvent(document.querySelector('#check'), 'change')
		.pipe(pluck('target', 'checked'))
		.subscribe((checked) => {
			// 발행물의 값을 가지고, 이벤트 발행순간의 조건에 맞춰 옵저버블 생성 ~ 팩토리
			defer(() => (checked ? of('CHECKED') : of('UNCHECKED'))).subscribe(console.log)
		})
}
const iffOperator = () => {
	const { iif, fromEvent, of } = rxjs
	const { pluck } = rxjs

	fromEvent(document.querySelector('#check'), 'change')
		.pipe(pluck('target', 'checked'))
		.subscribe((checked: boolean) => {
			// 각 인자는 조건 / 성공시 스트림 / 실패시 스트림 (생략 가능, 하면 바로 스트림 완료로 떨어짐)
			iif(() => checked, of('CHECKED'), of('UNCHECKED')).subscribe(
				console.log,
				(err) => console.log(err),
				() => console.log('COMPLETE'),
			)
		})
}
const emptyOperator = () => {
	const { empty } = rxjs
	// const EMPTY = new Observable<never>((subscriber) => subscriber.complete()); ~ 바로 완료하는 옵저버블 리턴
	empty().subscribe(console.log, console.error, () => console.log('COMPLETE'))
}
const throwErrorOperator = () => {
	const { throwError } = rxjs
	// 바로 에러 리턴
	throwError('ERROR').subscribe(console.log, console.error, () => console.log('COMPLETE'))
}
const shareOperator = () => {
	const { interval } = rxjs
	const { take, tap, takeLast, share } = rxjs

	const obs$ = interval(1000).pipe(
		take(20),
		tap((x) => console.log(`side effect: ${x}`)),
		share(), // 옵저버블을 서브젝트처럼 만들어줌! 멀티캐스트 핫 방식!
	)

	obs$.subscribe((x) => console.log(`subscriber 1: ${x}`))

	setTimeout((_) => {
		obs$.subscribe((x) => console.log(`subscriber 2: ${x}`))
	}, 5000)
	setTimeout((_) => {
		obs$.subscribe((x) => console.log(`subscriber 3: ${x}`))
	}, 10000)
}
const shareReplayOperator = () => {
	const { interval } = rxjs
	const { take, tap, takeLast, shareReplay } = rxjs

	const obs$ = interval(1000).pipe(
		take(20),
		tap((x) => console.log(`side effect: ${x}`)),
		shareReplay(3), // ReplaySubject와 유사 : 마지막 N개 값을 저장후 다음 구독자 구독시 발행
	)

	obs$.subscribe((x) => console.log(`subscriber 1: ${x}`))

	// 새로 구독자 붙을 때마다, 그전 구독자들이 발행한 (share된) 결과값 3개를 가져옴
	setTimeout((_) => {
		obs$.subscribe((x) => console.log(`subscriber 2: ${x}`))
	}, 5000)
	setTimeout((_) => {
		obs$.subscribe((x) => console.log(`subscriber 3: ${x}`))
	}, 10000)
}

// withOperator()
// everyOperator()
// defaultIfEmptyOperator()
// retryOperator()
// deferOperator()
// iffOperator()
// emptyOperator()
// throwErrorOperator()
// shareOperator()
shareReplayOperator()
