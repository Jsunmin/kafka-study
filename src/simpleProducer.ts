import * as dotenv from 'dotenv'
import { KafkaProducer } from './kafka/producer'

dotenv.config()
async function testTopicSend() {
	const brokerAddress1 = `${process.env.CONF_KAFKA_HOST}:${process.env.CONF_KAFKA_PORT}`

	const kafkaProducer = new KafkaProducer({
		brokers: [brokerAddress1],
		clientId: 'kafka-producer-1',
	})
	await kafkaProducer.init()
	const send = await kafkaProducer.sendTopic({
		topic: 'test',
		messages: {
			key: 'test key',
			value: 'test value',
			headers: {
				userId: '1',
			},
			// partition: 1,
		},
	})
	console.log('send!', send)
}

testTopicSend()
