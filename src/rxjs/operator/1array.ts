import * as rxjs from 'rxjs'
import * as rxjsAjax from 'rxjs/ajax'

const numericOperator = () => {
	const { of } = rxjs
	const { count, max, min, reduce } = rxjs

	const obs$ = of(4, 2, 6, 10, 8)

	obs$.pipe(count()).subscribe((x) => console.log('count: ' + x))
	obs$.pipe(max()).subscribe((x) => console.log('max: ' + x))
	obs$.pipe(min()).subscribe((x) => console.log('min: ' + x))
	obs$.pipe(
		reduce((acc, x) => {
			return acc + x
		}, 0),
	).subscribe((x) => console.log('reduce: ' + x))
}

const choosingOperator = () => {
	const { from } = rxjs
	const { first, last, elementAt, filter, distinct } = rxjs

	const obs$ = from([9, 3, 10, 5, 1, 10, 9, 9, 1, 4, 1, 8, 6, 2, 7, 2, 5, 5, 10, 2])

	obs$.pipe(first()).subscribe((x) => console.log('first: ' + x))
	obs$.pipe(last()).subscribe((x) => console.log('last: ' + x))
	obs$.pipe(elementAt(5)).subscribe((x) => console.log('elementAt: ' + x))
	obs$.pipe(distinct()).subscribe((x) => console.log('distinct: ' + x))
	obs$.pipe(filter((x) => x % 2 === 1)).subscribe((x) => console.log('filter: ' + x))
}

// 중간에 끼어서 액션은 하지만 결과값에 영향을 주지 않는! ~ 디버깅이나 구독 처리를 여기서 하기도!
const tapOperator = () => {
	const { from } = rxjs
	const { tap, filter, distinct } = rxjs

	from([9, 3, 10, 5, 1, 10, 9, 9, 1, 4, 1, 8, 6, 2, 7, 2, 5, 5, 10, 2])
		.pipe(
			tap((x) => console.log('-------------- 처음 탭: ' + x)),
			filter((x) => x % 2 === 0),
			tap((x) => console.log('--------- 필터 후: ' + x)),
			distinct(),
			tap((x) => console.log('중복 제거 후: ' + x)),
		)
		.subscribe((x) => console.log('발행물: ' + x))
}

// numericOperator()
// choosingOperator()
tapOperator()
