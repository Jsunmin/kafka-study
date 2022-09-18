import { Kafka, logLevel, Message, Admin, ITopicConfig, ITopicPartitionConfig } from 'kafkajs'
import * as _ from 'lodash'
import { TOPICS } from '../..'

// admin client hosts all the cluster operations, such as: createTopics, createPartitions, etc.
// 브로커 영역의 api를 제공하고 있다.
export class KafkaAdmin {
	private readonly kafka: Kafka

	private readonly admin: Admin

	private isInit = false

	constructor({ clientId = 'kafka-admin', brokers }: KafkaAdminConstructorInput) {
		this.kafka = new Kafka({
			logLevel: logLevel.INFO,
			brokers,
			clientId,
		})

		this.admin = this.kafka.admin()
	}

	async init() {
		if (!this.isInit) {
			await this.admin.connect()
			this.isInit = true
		}
		return this.isInit
	}

	/**
	 *  topic
	 */
	// ./kafka-topics.sh --bootstrap-server localhost:9092 --list
	async getTopicList() {
		return this.admin.listTopics()
	}

	// ./kafka-topics.sh --bootstrap-server localhost:9092 --topic tableLog --create
	async createTopics(topics: ITopicConfig[], dryRun = false) {
		return this.admin.createTopics({ topics, validateOnly: dryRun })
	}

	// ./kafka-topics.sh --bootstrap-server localhost:9092 --topic test --describe
	async describeTopics(topics?: string[]) {
		return this.admin.fetchTopicMetadata({ topics })
	}

	/**
	 *  offset & partition
	 */
	// 토픽의 오프셋 정보
	async getTopicOffset(topic: string) {
		return this.admin.fetchTopicOffsets(topic)
	}

	// 컨슈머그룹의 오프셋 정보
	async getConsumerGroupOffset(groupId: string, topics?: string[]) {
		return this.admin.fetchOffsets({ groupId, topics })
	}

	// ./kafka-topics.sh --bootstrap-server localhost:9092 --topic test --alter --partitions 2
	async createPartions(topicPartitions: ITopicPartitionConfig[], dryRun = false) {
		// 파티션 수 감소는 불가능! & 리밸런싱이 일어남을 고려!
		return this.admin.createPartitions({ topicPartitions, validateOnly: dryRun })
	}

	/**
	 *  consumer group
	 */
	// ./kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list 
	async getGrouplist() {
		return this.admin.listGroups()
	}

	// ./kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group hello --describe
	// 정보가 미흡..
	async describeGroups(groupIds: string[]) {
		return this.admin.describeGroups(groupIds)
	}

	async exit() {
		await this.admin.disconnect()
	}
}

type KafkaAdminConstructorInput = {
	clientId?: string
	brokers: string[]
}
