import * as dotenv from 'dotenv'
import { KafkaProducer } from './producer'

dotenv.config()
async function testTopicSend() {
	const brokerAddress1 = `${process.env.CONF_KAFKA_HOST}:${process.env.CONF_KAFKA_PORT}`

	const kafkaProducer = new KafkaProducer({
		brokers: [brokerAddress1],
		clientId: 'kafka-producer-1',
		usingCustomPartitioner: false,
	})
	await kafkaProducer.init()
	const send = await kafkaProducer.sendTopic({
		// 타겟 브로커 토픽
		topic: 'test',
		messages: {
			// record(message) key ~ 파티셔닝!
			key: 'test-key',
			// record(message) value ~ 실제 데이터 값
			value: JSON.stringify({
				orderId: '1',
				addressId: '22',
			}),
			headers: {
				userId: '1',
			},
			// 파티셔너의 정책과 별개로 바로 토픽의 파티션에 송신
			//  없으면 KAFKAJS_NO_PARTITIONER_WARNING=1 처리
			// partition: 1,
		},
	})
	console.log('send!', send)
}

testTopicSend()
