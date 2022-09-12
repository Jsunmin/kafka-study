import { KafkaConsumer } from './kafka/consumer'
import * as dotenv from 'dotenv'
import { TOPICS } from './kafka'

dotenv.config()
async function start() {
	const brokerAddress1 = `${process.env.CONF_KAFKA_HOST}:${process.env.CONF_KAFKA_PORT}`

	const consumer = new KafkaConsumer({
		brokers: [brokerAddress1],
		groupId: 'kafka-consumer-1',
		clientId: 'kafka-worker-1',
	})
	const topics: Array<typeof TOPICS[number]> = ['test']
	const fromBeginning = false
	await consumer.init(topics, fromBeginning)
	await consumer.listen({})
	console.log('setup worker')
}

start()
