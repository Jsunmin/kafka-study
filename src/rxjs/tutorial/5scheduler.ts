import * as rxjs from 'rxjs'

/**
 * 스케줄러
 *  - 각 rxjs 기능을 쓰다보면 멀티 스레딩을 통해 값을 내는 경우가 있음
 *  - 이 경우 여러 스케줄러로 멀티스레딩을 통해 처리한 여러 결과물 함수에 맞는 값을 리턴함
 *  - https://rxjs.dev/guide/scheduler
 *  - rxjs: 이벤트루프와 비슷
 * 		- 구독 시작과 언제 이벤트 발행시킬지를 컨트롤 (delay, setInterval ..)
 *
 * - SubscribeOn : 옵저버블 또는 이를 처리할 연산자를 실행할 스케줄러 지정
 * - ObserverOn	: 구독자에게 알림을 보낼 때 사용할 스케줄러 지정
 *  ~ 연산자들은 각각이 이미 적절한 스케줄러가 부여되어 있으므로 subscribeOn으로 이들을 굳이 지정하기보다는,
 *    구독자가 이를 받아 작업을 수행하는 시점을 정하는 observeOn이 실무에서 보다 활용될 것입니다.
 */
{
	const { of, asyncScheduler } = rxjs
	const { subscribeOn, observeOn, tap } = rxjs

	const tapper = (x) => console.log(`${x} IN`)
	const observer = (x) => console.log(`${x} OUT`)

	// subscribeOn ~ 옵저버블이나 연산자가 실행되는 시점부터 해당 스케줄러를 지정
	of(1, 2, 3).pipe(tap(tapper), subscribeOn(asyncScheduler)).subscribe(observer) // 옵저버블 & 구독 처리 모두 비동기

	of(4, 5, 6).pipe(tap(tapper)).subscribe(observer) // 동기 실행

	// observeOn ~ 구독자에게 전달되는 시점만 async로 동작
	of('A', 'B', 'C').pipe(tap(tapper), observeOn(asyncScheduler)).subscribe(observer) // 옵저버블은 동기 / 구독 처리만 비동기 실행

	of('D', 'E', 'F').pipe(tap(tapper)).subscribe(observer) // 동기 실행
}
