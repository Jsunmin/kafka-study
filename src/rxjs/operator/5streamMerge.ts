import * as rxjs from 'rxjs'
import * as rxjsAjax from 'rxjs/ajax'

const mergeOperator = () => {
	const { merge, interval, fromEvent } = rxjs
	const { map, take } = rxjs

	// 인터벌과 클릭 이벤트가 함꼐 스트림으로 나옴
	// const interval$ = interval(1000).pipe(map((_) => 'interval'))
	// const click$ = fromEvent(document, 'click').pipe(map((_) => 'click'))
	// merge(interval$, click$).subscribe(console.log)

	const intv1$ = interval(1000).pipe(
		map((_) => 'INTERVAL 1'),
		take(3),
	)
	const intv2$ = interval(1000).pipe(
		map((_) => 'INTERVAL 2'),
		take(6),
	)
	const intv3$ = interval(1000).pipe(
		map((_) => 'INTERVAL 3'),
		take(9),
	)
	const intv4$ = interval(1000).pipe(
		map((_) => 'INTERVAL 4'),
		take(9),
	)
	const intv5$ = interval(1000).pipe(
		map((_) => 'INTERVAL 5'),
		take(9),
	)
	// 3개씩 머지해서 출력
	merge(intv1$, intv2$, intv3$, intv4$, intv5$, 3).subscribe(console.log)
}

const concatOperator = () => {
	const { concat, interval, fromEvent } = rxjs
	const { map, take } = rxjs

	// 시간이 다 끝나고, 클릭 이벤트를 붙임 ~ 5초 후에 클릭 이벤트 발행 시작 (머지는 한꺼번에 나오지만!)
	// const interval$ = interval(1000).pipe(
	// 	map((_) => 'interval'),
	// 	take(5),
	// )
	// const click$ = fromEvent(document, 'click').pipe(map((_) => 'click'))
	// concat(interval$, click$).subscribe(console.log)

	const intv1$ = interval(1000).pipe(
		map((_) => 'INTERVAL 1'),
		take(3),
	)
	const intv2$ = interval(1000).pipe(
		map((_) => 'INTERVAL 2'),
		take(3),
	)
	const intv3$ = interval(1000).pipe(
		map((_) => 'INTERVAL 3'),
		take(3),
	)
	// 9개의 이벤트 순서대로 발행
	concat(intv1$, intv2$, intv3$).subscribe(console.log)
}

/**
 * HOO ~ higher order observerble
 *  : 상위 스트림과 해당 이벤트에서 파생되는 하위 스트림으로 구성
 *   ~ 상위 이벤트 출력물과 하위 이벤트 출력물을 조합해 쓸 수도 있음!
 *
 */
const mergeMapOperator = () => {
	const { interval, fromEvent, of } = rxjs
	const { mergeMap, map, take, pluck } = rxjs
	const { ajax } = rxjsAjax

	// 클릭 이벤트 스트림(상위) 에서부터 클릭하면 나오는 인터벌 이벤트 (하위)
	// fromEvent(document, 'click')
	// 	.pipe(
	// 		mergeMap((e) =>
	// 			interval(1000).pipe(
	// 				map((i) => e.x + ' : ' + i),
	// 				take(5),
	// 			),
	// 		),
	// 	)
	// 	.subscribe(console.log)

	of(3, 15, 4, 9, 1, 7)
		// 3개씩 묶어서 api를 부르고, 그 다음 파이프 돌리고 전체 반환 ~ 순서는 api 응답시간에 맞춰!
		.pipe(mergeMap((keyword) => ajax(`http://127.0.0.1:3000/people/${keyword}`).pipe(pluck('response', 'first_name')), 3))
		.subscribe(console.log)
}

const concatMapOperator = () => {
	const { interval, fromEvent, of } = rxjs
	const { concatMap, map, take, pluck } = rxjs

	// 각 하위 스트림 (+상위 스트림) 결과를 일렬로 붙여서 발행물 출력
	// fromEvent(document, 'click')
	// 	.pipe(
	// 		concatMap((e) =>
	// 			interval(1000).pipe(
	// 				map((i) => e.x + ' : ' + i),
	// 				take(5),
	// 			),
	// 		),
	// 	)
	// 	.subscribe(console.log)

	const { ajax } = rxjsAjax

	of(3, 15, 4, 9, 1, 7)
		// 각 api 결과를 순서대로 쌓은 배열로 출력
		.pipe(concatMap((keyword) => ajax(`http://127.0.0.1:3000/people/${keyword}`).pipe(pluck('response', 'first_name'))))
		.subscribe(console.log)
}

const switchMapOperator = () => {
	const { interval, fromEvent } = rxjs
	const { switchMap, map, take } = rxjs

	// 새로운 하위스트림이 나타나면 기존의 하위스트림 작업을 취소하고 신규 하위스트림 발행물을 작업하고 출력함!
	// fromEvent(document, 'click')
	// 	.pipe(
	// 		switchMap((e) =>
	// 			interval(1000).pipe(
	// 				map((i) => e.x + ' : ' + i),
	// 				take(5),
	// 			),
	// 		),
	// 	)
	// 	.subscribe(console.log)
}

// mergeOperator()
// concatOperator()
// mergeMapOperator()
// mergeMapOperator()
// concatMapOperator()
// switchMapOperator()

/**
 * 각 오퍼레이터에 MapTo를 붙인 오퍼레이터들은, 상위 옵저버블의 결과물없이 하위옵저버블의 결과물을 발행시킬 떄 쓰임!
 *  - MergeMapTo / concatMapTo / switchMapTo
 */
