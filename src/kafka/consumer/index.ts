import * as _ from 'lodash'
import { Consumer, Kafka, logLevel } from 'kafkajs'
import { TOPICS } from '..'

export class KafkaConsumer {
	private readonly kafka: Kafka

	private readonly consumer: Consumer

	private readonly topicPrefix = process.env.KAFKA_TOPIC_PREFIX || 'test-'

	private isInit = false

	constructor({ groupId = 'kafka-consumer', clientId = 'worker', brokers }: KafkaConsumerConstructorInput) {
		this.kafka = new Kafka({
			logLevel: logLevel.INFO,
			brokers,
			clientId,
		})

		// 컨슈머 그룹을 넘겨주면, offset 관리!
		this.consumer = this.kafka.consumer({
			groupId,
			// partitionAssigners ~ 해당 기능으로 직접 컨슈머에 파티션 할당해주는 커스텀 로직 구성 가능! (== producer custom partitioner)
		})
	}

	async init(topics: Array<typeof TOPICS[number]>, fromBeginning = false) {
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
					const { offset, value, key, headers } = message
					// logger.info({partition, offset: message.offset, value: message.value.toString(), topic})
					console.log({ partition, offset, value: value.toString(), key: key.toString(), headers, topic, Prefixedtopic })

					let parsedValue
					try {
						if (value) {
							parsedValue = value.toString()
						}
						if (typeof parsedValue === 'string') {
							parsedValue = JSON.parse(parsedValue)
						}
					} catch (e) {
						console.error(e)
						parsedValue = value
					}

					console.log('work with - ', parsedValue, typeof parsedValue)
				} catch (err) {
					console.error(err)
					throw new Error(err)
				}
			},
		})

		// 카프카 이벤트 에미터
		/**
		 * 리밸런싱 : 파티션 ~ 컨슈머 매칭(할당)
		 *  - 같은 groupId를 갖는 컨슈머가 추가/제거되면 작동함
		 *  - 인스턴스를 추가로 늘려보자!
		 */
		this.consumer.on('consumer.rebalancing', (event) => {
			console.log('consumer rebalancing work!', event)
		})
		/**
		 * 오프셋
		 *  - 오프셋이 커밋되면 작동
		 *  - auto commit 이거나, commitOffsets과 같은 수동 커밋에도 작동함
		 */
		this.consumer.on('consumer.commit_offsets', (event) => {
			console.log('commit offset work!', event)
		})
		/**
		 * 종료
		 *  - 타임아웃까지 좀비 컨슈머가 되지 않게 바로 닫아줌
		 */
		this.consumer.on('consumer.stop', (event) => {
			console.log('consumer stopped!', event)
		})
	}

	// autoCommit 없이 수신하는 컨슈머
	async listenWithoutAutoCommit(logger: any) {
		if (!this.isInit) {
			throw new Error('should consumer init() done')
		}

		await this.consumer.run({
			// auto commit 옵션 끄고.
			autoCommit: false,
			eachMessage: async ({ topic: Prefixedtopic, partition, message }) => {
				try {
					const topic = Prefixedtopic.replace(this.topicPrefix, '')
					const { offset, value, key, headers } = message
					// logger.info({partition, offset: message.offset, value: message.value.toString(), topic})
					console.log({ partition, offset, value: value.toString(), key: key.toString(), headers, topic, Prefixedtopic })

					// 처리 후 직접 커밋처리 (찍힌 offset 부터 불러옴! == offset + 1)
					console.log('do self commit', { topic: Prefixedtopic, partition, offset: String(Number(offset) + 1), metadata: 'self offset commit' })
					await this.consumer.commitOffsets([{ topic: Prefixedtopic, partition, offset: String(Number(offset) + 1), metadata: 'self offset commit' }])
				} catch (err) {
					console.error(err)
					throw new Error(err)
				}
			},
		})
	}

	async exit() {
		await this.consumer.stop()
	}
}

type KafkaConsumerConstructorInput = {
	groupId?: string
	clientId?: string
	brokers: string[]
}
