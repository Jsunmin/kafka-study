export async function sleep(millisecond?: number) {
	let ms = millisecond
	if (!ms) {
		ms = Math.random() * 1000
	}
	return new Promise(function (resolve, reject) {
		// console.log('sleep', ms)
		setTimeout(resolve, ms)
	})
}