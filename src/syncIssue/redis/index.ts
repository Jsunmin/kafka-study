import Redis from 'ioredis'

let redisClient: Redis
export function getRedis() {
	if (!redisClient) {
		const debugMode = true
		const redisOption = {
			host: 'localhost',
			port: 6379,
			password: undefined,
			commandTimeout: 5000, // 5 sec
			retryStrategy: (times: number) => {
				return Math.min(times * 100, 3000)
			},
			maxRetriesPerRequest: 10,
			showFriendlyErrorStack: debugMode,
		}
		const newRedisClient = new Redis(redisOption)
		redisClient = newRedisClient
	}

	return redisClient
}
