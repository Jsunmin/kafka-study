import { KafkaConsumer } from './consumer'
import * as dotenv from 'dotenv'
import { TOPICS } from '..'
import { v4 as uuidV4 } from 'uuid'

dotenv.config()
async function start() {
	const brokerAddress1 = `${process.env.CONF_KAFKA_HOST}:${process.env.CONF_KAFKA_PORT}`
	const groupId = 'kafka-consumer-3'
	const clientId = uuidV4()
	const consumer = new KafkaConsumer({
		brokers: [brokerAddress1],
		groupId,
		clientId,
	})
	const topics: Array<typeof TOPICS[number]> = ['rebalancing']
	const fromBeginning = false
	await consumer.init(topics, fromBeginning)
	await consumer.listen({})

	exitHandler(consumer)
	console.log('setup worker', 'groupId', groupId, 'clientId', clientId)
}

start()

async function exitHandler(consumer: KafkaConsumer) {
	const stopFunc = async () => {
		await consumer.exit()
		process.exit(0) // if you don't close yourself this will run forever
	}
	process.on('beforeExit', stopFunc)

	//do something when app is closing
	process.on('exit', stopFunc)

	//catches ctrl+c event
	process.on('SIGINT', stopFunc)

	// catches "kill pid" (for example: nodemon restart)
	process.on('SIGUSR1', stopFunc)
	process.on('SIGUSR2', stopFunc)

	//catches uncaught exceptions
	process.on('uncaughtException', stopFunc)
}
