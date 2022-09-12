import { Kafka, logLevel, Producer, Message } from 'kafkajs'
import * as _ from 'lodash'
import { TOPICS } from '..'

export class KafkaProducer {
	private readonly kafka: Kafka

	private readonly producer: Producer

	private readonly topicPrefix = process.env.KAFKA_TOPIC_PREFIX || 'test'

	private isInit = false

	constructor({ clientId = 'kafka-producer', brokers }: KafkaProducerConstructorInput) {
		this.kafka = new Kafka({
			logLevel: logLevel.INFO,
			brokers,
			clientId,
		})

		this.producer = this.kafka.producer({
			allowAutoTopicCreation: false,
			transactionTimeout: 30000,
		})
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
		}
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
}

type KafkaSendInput = {
	topic: typeof TOPICS[number]
	messages: Message
}

type KafkaSendBatchInput = KafkaSendInput[]
