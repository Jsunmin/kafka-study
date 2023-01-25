import * as rxjs from 'rxjs'

// 서브젝트
const subject = () => {
	const subject1 = new rxjs.Subject()

	subject1.subscribe(console.log)

	subject1.next(1)
	subject1.next(3)
	subject1.next(5)

	/**
	 * 구독자와 상관없이 바로 발행
	 *  - 당시에 구독하고 있는 구독자들만 발행 받음 (multicast & hot)
	 *  -
	 */

	const subject2 = new rxjs.Subject()

	setTimeout((_) => {
		let x = 0
		setInterval((_) => {
			subject2.next(x++)
		}, 2000)
	}, 1000) // 1초 후에 2초 간격으로 서브젝트 값 증가시켜 발행

	subject2.subscribe((x) => console.log('바로구독: ' + x))
	setTimeout((_) => {
		subject2.subscribe((x) => console.log('2초 후 구독: ' + x))
	}, 2000)
	setTimeout((_) => {
		subject2.subscribe((x) => console.log('5초 후 구독: ' + x))
	}, 5000)
	setTimeout((_) => {
		subject2.subscribe((x) => console.log('7초 후 구독: ' + x))
	}, 7000)

	// 구독한 시간에 관계없이 똑같은 값 출력!
}

// 옵저버 & 서브젝트
const objectAndSubject = () => {
	const obs$ = rxjs.interval(1000)

	obs$.subscribe((x) => console.log('바로구독 (obs): ' + x))
	setTimeout((_) => {
		obs$.subscribe((x) => console.log('3초 후 구독 (obs): ' + x))
	}, 3000)
	setTimeout((_) => {
		obs$.subscribe((x) => console.log('5초 후 구독 (obs): ' + x))
	}, 5000)
	setTimeout((_) => {
		obs$.subscribe((x) => console.log('10초 후 구독 (obs): ' + x))
	}, 10000)

	// 기존에 독립적으로 실행되는 옵저버블과 달리, 멀티캐스트 핫 방식의 서브젝트
	const subject = new rxjs.Subject()
	const obs2$ = rxjs.interval(1000)

	obs2$.subscribe(subject)

	subject.subscribe((x) => console.log('바로구독(obs + sub): ' + x))
	setTimeout((_) => {
		subject.subscribe((x) => console.log('3초 후 구독(obs + sub): ' + x))
	}, 3000)
	setTimeout((_) => {
		subject.subscribe((x) => console.log('5초 후 구독(obs + sub): ' + x))
	}, 5000)
	setTimeout((_) => {
		subject.subscribe((x) => console.log('10초 후 구독(obs + sub): ' + x))
	}, 10000)
}

// BehaviorSubject: 마지막값 (첫번째의 경우 초기값)을 저장후 다음 구독자 구독시 발행
const behaviorSubject = () => {
	const { BehaviorSubject } = rxjs
	const subject = new BehaviorSubject(0) // 초기값이 있음

	subject.subscribe((x) => console.log('A: ' + x))

	// 초기값 0도 발행
	subject.next(1)
	subject.next(2)
	subject.next(3)

	subject.subscribe((x) => console.log('B: ' + x))

	// 이전 구독자 A의 마지막값 3도 발행
	subject.next(4)
	subject.next(5)
}

// ReplaySubject: 마지막 N개 값을 저장후 다음 구독자 구독시 발행
const replaySubject = () => {
	const { ReplaySubject } = rxjs
	const subject = new ReplaySubject(3) // 마지막 3개 값 저장

	subject.subscribe((x) => console.log('A: ' + x))

	subject.next(1)
	subject.next(2)
	subject.next(3)
	subject.next(4)
	subject.next(5)

	subject.subscribe((x) => console.log('B: ' + x))

	// 이전 구독자 A의 마지막 3개 값 ~ 3/4/5도 발행
	subject.next(6)
	subject.next(7)
}

// AsyncSubject: 서브젝트 complete 하고나서 마지막 값만, 각 구독자들에게 발행
const asyncSubject = () => {
	const { AsyncSubject } = rxjs
	const subject = new AsyncSubject()

	subject.subscribe((x) => console.log('A: ' + x))

	subject.next(1)
	subject.next(2)
	subject.next(3)

	subject.subscribe((x) => console.log('B: ' + x))

	subject.next(4)
	subject.next(5)

	subject.subscribe((x) => console.log('C: ' + x))

	subject.next(6)
	subject.next(7)
	subject.complete()

	// 갑자기 7 / 7 / 7
}

// subject()
// objectAndSubject()
// behaviorSubject()
// replaySubject()
asyncSubject()
