import { Kafka, logLevel, Producer, Message, PartitionerArgs } from 'kafkajs'
import * as _ from 'lodash'
import { TOPICS } from '..'

export class KafkaProducer {
	private readonly kafka: Kafka

	private readonly producer: Producer

	private readonly topicPrefix = process.env.KAFKA_TOPIC_PREFIX || 'test-'

	private isInit = false

	constructor({ clientId = 'kafka-producer', brokers, usingCustomPartitioner = false }: KafkaProducerConstructorInput) {
		this.kafka = new Kafka({
			logLevel: logLevel.INFO,
			brokers,
			clientId,
		})

		this.producer = this.kafka.producer({
			allowAutoTopicCreation: false,
			transactionTimeout: 30000,
			createPartitioner: (usingCustomPartitioner && this.generateCustomPartitioner) || undefined,
		})
	}

	// 기존 파티셔너 로직 및 설정한 파티션 번호를 무시하고, 해당 로직으로 타겟 파티션 설정!
	generateCustomPartitioner() {
		return function ({ topic, partitionMetadata, message }: PartitionerArgs): number {
			console.log('using custom partitioner!')
			console.log(' args', topic, partitionMetadata, message)
			return 0 // 파티션 번호를 커스텀하게 설정해 뿌려줄 수 있다. ~ 기본은 round-robin
		}
	}
	async init() {
		if (!this.isInit) {
			await this.producer.connect()
			this.isInit = true
		}
		return this.isInit
	}

	async sendTopic({ topic, messages }: KafkaSendInput) {
		if (!this.isInit) {
			throw new Error('should producer init() done')
		}

		// https://kafka.js.org/docs/producing#producing-messages
		const payload = {
			topic: `${this.topicPrefix}${topic}`,
			messages: [messages],
			// acks: 0,
		}
		/**
		 * 브로커가 보내는 응답 (레코드 메타데이터)를 받아옴
		 * {
		 *	topicName: 'study-test',
		 *	partition: 0,
		 *	errorCode: 0,
		 *	baseOffset: '10',
		 *	logAppendTime: '-1',
		 *	logStartOffset: '0'
		 * }
		 *
		 * cf) acks 0이면 리턴되는 값이 당연 없겠지?!
		 */
		return this.producer.send(payload)
	}

	async sendTopicBatch(sendInput: KafkaSendBatchInput) {
		if (!this.isInit) {
			throw new Error('should producer init() done')
		}

		const topicMessages = _.map(sendInput, (input) => ({
			topic: input.topic,
			messages: [input.messages],
		}))
		sendInput
		return this.producer.sendBatch({ topicMessages })
	}
}

type KafkaProducerConstructorInput = {
	clientId?: string
	brokers: string[]
	usingCustomPartitioner?: boolean
}

type KafkaSendInput = {
	topic: typeof TOPICS[number]
	messages: Message
}

type KafkaSendBatchInput = KafkaSendInput[]
