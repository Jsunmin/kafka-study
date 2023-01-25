import * as rxjs from 'rxjs'
import * as rxjsAjax from 'rxjs/ajax'

// 평면적 형태의 스트림
const normalStream = () => {
	const obs1 = rxjs.of(1, 2, 3, 4, 5)
	const obs2 = rxjs.from([1, 2, 3, 4, 5])
	const obs3 = rxjs.range(11, 5) // 11부터 5개
	const obs4 = rxjs.generate(
		15, // offset
		(x) => x < 30, // 30까지
		(x) => x + 2, // +=2    ~ for문과 유사
	)

	// obs1.subscribe((item) => console.log(item))
	// obs2.subscribe((item) => console.log(item))
	// obs3.subscribe((item) => console.log(item))
	obs4.subscribe((item) => console.log(item))
}

// 시간 형태의 스트림
const timeStream = () => {
	const obs1 = rxjs.interval(1000)
	const obs2 = rxjs.timer(3000) // 특정 시간 후!

	// obs1.subscribe((item) => console.log(item))
	obs2.subscribe((item) => console.log(item))
}

// 이벤트 (행동)의 스트림
const eventStream = () => {
	const obs1 = rxjs.fromEvent(document, 'click')
	const obs2 = rxjs.fromEvent(document.getElementById('sample'), 'keypress')

	// obs1.subscribe((item) => console.log(item))
	obs2.subscribe((item) => console.log(item))
}

// 네트워크 통신 스트림
const apiStream = () => {
	const obs = rxjsAjax.ajax('https://naver.com')

	obs.subscribe((result) => console.log(result))
}

const customStream = () => {
	const obs = new rxjs.Observable((sub) => {
		sub.next(1)
		sub.next(2)
		sub.next(3)
		sub.complete() // 제너레이터 같은 느낌!
	})

	obs.subscribe((result) => console.log(result))
}

// normalStream()
// timeStream()
// eventStream()
// apiStream()
customStream()

/**
 * lazy evaluate ~ 누군가 구독해야 발행 시작 / 각 구독자마다 따로 발행
 */
