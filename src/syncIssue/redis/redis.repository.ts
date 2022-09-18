import { getRedis } from '.';

/**
 * http://redisgate.kr/redis/command/setnx.php
 * setnx : 데이터베이스에 동일한 key가 없을 경우에만 저장
 *  - return 0 / 1
 *  - 이를 통해 lock 여부 구현
 */

export async function lock(tableName: string, id: string) {
	const redis = await getRedis()
	const key = generateKey(tableName, id)
	const result = await redis.setnx(key, 'lock')
	return result
}

export async function unlock(tableName: string, id: string) {
	const redis = await getRedis()
	const key = generateKey(tableName, id)
	return !!redis.del(key)
}

function generateKey(tableName: string, id: string) {
	return `${tableName}-${id}`
}