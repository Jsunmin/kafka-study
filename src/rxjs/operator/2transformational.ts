import * as rxjs from 'rxjs'
import * as rxjsAjax from 'rxjs/ajax'

const mapOperator = () => {
	const { of, from, map } = rxjs

	of(1, 2, 3, 4, 5)
		.pipe(map((x) => x * x))
		.subscribe(console.log)

	from([
		{ name: 'apple', price: 1200 },
		{ name: 'carrot', price: 800 },
		{ name: 'meat', price: 5000 },
		{ name: 'milk', price: 2400 },
	])
		.pipe(map((item) => item.price))
		.subscribe(console.log)
}

const pluckOperator = () => {
	const { from, pluck } = rxjs

	const obs$ = from([
		{ name: 'apple', price: 1200, info: { category: 'fruit' } },
		{ name: 'carrot', price: 800, info: { category: 'vegetable' } },
		{ name: 'pork', price: 5000, info: { category: 'meet' } },
		{ name: 'milk', price: 2400, info: { category: 'drink' } },
	])

	obs$.pipe(pluck('price')).subscribe(console.log)

	obs$.pipe(pluck('info'), pluck('category')).subscribe(console.log)
	obs$.pipe(pluck('info', 'category')).subscribe(console.log)

	const { ajax } = rxjsAjax

	// 	const obs2$ = ajax(`https://api.github.com/search/users?q=user:mojombo`).pipe(pluck('response', 'items', 0, 'html_url'))
	// 	obs2$.subscribe(console.log)
}

const toArrayOperator = () => {
	const { range } = rxjs
	const { toArray, filter } = rxjs

	range(1, 50)
		.pipe(
			filter((x) => x % 3 === 0),
			filter((x) => x % 2 === 1),
			toArray(),
		)
		.subscribe(console.log)
}

// reduce와 매우 흡사 but 과정 모두 발행! (reduce는 결과만 발행)
const scanOperator = () => {
	const { of } = rxjs
	const { reduce, scan } = rxjs

	const obs$ = of(1, 2, 3, 4, 5)

	obs$.pipe(
		scan((acc, x) => {
			return acc + x // 5번 모두 발행!
		}, 0),
	).subscribe((x) => console.log('scan: ' + x))
}

// 인덱스 순서끼리 결합
const zipOperator = () => {
	const { from, interval, fromEvent, zip, pluck } = rxjs

	// const obs1$ = from([1, 2, 3, 4, 5])
	const obs1$ = from([1, 2, 3, 4, 5, 6, 7]) // 끝까지 출력X
	const obs2$ = from(['a', 'b', 'c', 'd', 'e'])
	const obs3$ = from([true, false, 'F', [6, 7, 8], { name: 'zip' }])

	// 가장 짧은 길이의 스트림 길이에 맞춰서 결합시킴 (인덱스 원소끼리 배열로 묶어!)
	zip(obs1$, obs2$, obs3$).subscribe(console.log)

	// 1초 또는 1클릭 하나씩만 맵핑되어 발행됨! ~ 초당 하나의 클릭!!
	// const obs4$ = interval(1000)
	// const obs5$ = fromEvent(document, 'click').pipe(pluck('x'))
	// zip(obs4$, obs5$).subscribe(console.log)
}

// mapOperator()
// pluckOperator()
// toArrayOperator()
// scanOperator()
zipOperator()
