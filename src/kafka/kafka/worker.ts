import { KafkaConsumer } from './consumer'
import * as dotenv from 'dotenv'
import { TOPICS } from '..'

dotenv.config()
async function start() {
	const brokerAddress1 = `${process.env.CONF_KAFKA_HOST}:${process.env.CONF_KAFKA_PORT}`

	const consumer = new KafkaConsumer({
		brokers: [brokerAddress1],
		groupId: 'kafka-consumer-2',
		clientId: 'kafka-worker-2',
	})
	const topics: Array<typeof TOPICS[number]> = ['test']
	const fromBeginning = true
	await consumer.init(topics, fromBeginning)
	await consumer.listen({})

	exitHandler(consumer)
	console.log('setup worker')
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
