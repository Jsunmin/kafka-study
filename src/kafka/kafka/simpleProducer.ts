import * as dotenv from 'dotenv'
import { TOPICS } from '..'
import { KafkaProducer } from './producer'

dotenv.config()

// testTopicSend('test')
testTopicSend('rebalancing', 3)

async function testTopicSend(topicName: typeof TOPICS[number], times = 1) {
	const brokerAddress1 = `${process.env.CONF_KAFKA_HOST}:${process.env.CONF_KAFKA_PORT}`

	const kafkaProducer = new KafkaProducer({
		brokers: [brokerAddress1],
		clientId: 'kafka-producer-1',
		usingCustomPartitioner: false,
	})
	await kafkaProducer.init()

	let cnt = 0
	while (cnt <= times) {
		const send = await kafkaProducer.sendTopic({
			// 타겟 브로커 토픽
			topic: topicName,
			messages: {
				// record(message) key ~ 파티셔닝!
				//  로드밸런싱 되려면 없거나(default) 각자 다르게 설정해야! || 파티셔너 만들던가!
				key: `test-key-${cnt}`,
				// record(message) value ~ 실제 데이터 값
				value: JSON.stringify({
					orderId: '1',
					addressId: '22',
					cnt,
				}),
				headers: {
					userId: '1',
				},
				// 파티셔너의 정책과 별개로 바로 토픽의 파티션에 송신
				//  없으면 KAFKAJS_NO_PARTITIONER_WARNING=1 처리
				// partition: 1,
			},
		})
		console.log(`send ${cnt} :`, send)
		cnt++

	}
}

