import * as rxjs from 'rxjs'
import * as rxjsAjax from 'rxjs/ajax'

// 생성 오퍼레이터
{
	// 옵저버블 생성!
	const { of, from, range, fromEvent, interval } = rxjs
	const { ajax } = rxjsAjax
}

/**
 * 파이프라인용 오퍼레이터 ~ 연산자는 순수함수로써 가공
 *  - 순수함수: 함수가 실행되면서 부수작용을 일으키지 않는 (외부 데이터를 변경시키지 않는) 함수
 * */
const pipableOperator = () => {
	const observable$ = rxjs.range(1, 10)

	const observer = {
		next: (x) => console.log(x + ' 발행'),
		error: (err) => console.error('발행중 오류', err),
		complete: () => console.log('발행물 완결'),
	}

	observable$
		.pipe(
			rxjs.filter((x) => x % 2 === 0),
			rxjs.map((x) => x * x), // 복수 오퍼레이터 가능
		)
		.subscribe(observer)
}

const timeOperator = () => {
	const observable$ = rxjs.interval(1000)

	const observer = {
		next: (x) => console.log(x + ' 발행'),
		error: (err) => console.error('발행중 오류', err),
		complete: () => console.log('발행물 완결'),
	}

	observable$
		.pipe(
			rxjs.tap((x) => console.log(`tab${x}`)),
			rxjs.filter((x) => x % 2 === 0),
			rxjs.map((x) => x * x),
		)
		.subscribe(observer)
}

const eventOperator = () => {
	const observable$ = rxjs.fromEvent(document, 'click')

	const observer = {
		next: (x) => console.log(x + ' 발행'),
		error: (err) => console.error('발행중 오류', err),
		complete: () => console.log('발행물 완결'),
	}

	// observable$.pipe(rxjs.map((e) => e.x + ' ' + e.y)).subscribe(observer)
}

// pipableOperator()
// timeOperator()
// eventOperator()
