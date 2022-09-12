import * as _ from 'lodash'
import { Consumer, Kafka, logLevel } from 'kafkajs'
import { TOPICS } from '..'

export class KafkaConsumer {
	private readonly kafka: Kafka

	private readonly consumer: Consumer

	private readonly topicPrefix = process.env.KAFKA_TOPIC_PREFIX || 'test'

	private isInit = false

	constructor({ groupId = 'kafka-consumer', clientId = 'worker', brokers }: KafkaConsumerConstructorInput) {
		this.kafka = new Kafka({
			logLevel: logLevel.INFO,
			brokers,
			clientId,
		})

		this.consumer = this.kafka.consumer({ groupId })
	}

	async init(topics: Array<typeof TOPICS[number]>, fromBeginning = true) {
		if (!this.isInit) {
			await this.consumer.connect()
			const Prefixedtopics = _.map(topics, (topic) => `${this.topicPrefix}${topic}`)
			await this.consumer.subscribe({ topics: Prefixedtopics, fromBeginning })
			this.isInit = true
		}
		return this.isInit
	}

	async listen(logger: any) {
		if (!this.isInit) {
			throw new Error('should consumer init() done')
		}

		await this.consumer.run({
			eachMessage: async ({ topic: Prefixedtopic, partition, message }) => {
				try {
					const topic = Prefixedtopic.replace(this.topicPrefix, '')
					// logger.info({partition, offset: message.offset, value: message.value.toString(), topic})
					console.log({ partition, offset: message.offset, value: (message.value || '').toString(), topic, Prefixedtopic })
				} catch (err) {
					console.error(err)
					throw new Error(err)
				}
			},
		})
	}
}

type KafkaConsumerConstructorInput = {
	groupId?: string
	clientId?: string
	brokers: string[]
}
