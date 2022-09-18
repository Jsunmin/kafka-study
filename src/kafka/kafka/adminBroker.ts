import * as _ from 'lodash'
import * as dotenv from 'dotenv'
import { KafkaAdmin } from './broker'

dotenv.config()
async function start() {
	const brokerAddress1 = `${process.env.CONF_KAFKA_HOST}:${process.env.CONF_KAFKA_PORT}`

	const admin = new KafkaAdmin({
		brokers: [brokerAddress1],
		clientId: 'kafka-broker',
	})

	await admin.init()
	exitHandler(admin)
	console.log('setup broker admin')

	await manageTopic(admin)

	await manageConsumerGroup(admin)

}

start()
async function manageConsumerGroup(admin: KafkaAdmin) {
	const cgs = await admin.getGrouplist()
	console.log('consumer group list', cgs)

	const cgIds = _.map(cgs.groups, cg => cg.groupId)
	const cgsInfo = await admin.describeGroups(cgIds)
	console.log('consumer group description', cgsInfo)

	const aGroupId = 'kafka-consumer-2'
	const aTopic = 'study-test'
	const cgOffset = await admin.getConsumerGroupOffset(aGroupId)
	const tOffset = await admin.getTopicOffset(aTopic)
	// 컨슈머 그룹과 토픽관점에서 오프셋 체킹 ~ 컨슈머랙 체크!
	console.log('consumer group offset', JSON.stringify(cgOffset, null, 2))
	console.log('topic offset', JSON.stringify(tOffset, null, 2))
	
}

async function manageTopic(admin: KafkaAdmin) {
	const topics = await admin.getTopicList()
	console.log('topic list', topics)

	const newTopicDryRun = true
	const newTopicName = 'rebalncing'
	const newTopic = await admin.createTopics([{
		topic: newTopicName,
		// 토픽 할당 파티션
  		numPartitions: 3,
		// 고가용성을 위한 레플리카 셋업 (cf acks)
  		replicationFactor: 1,
	}], newTopicDryRun)
	console.log('newTopic', newTopic)
	
	const allTopicInfo = await admin.describeTopics()
	console.log('allTopicInfo', allTopicInfo)

	// const consumerOffsets = allTopicInfo.topics.find(topic => topic.name === '__consumer_offsets')
	// console.log('__consumer_offsets', consumerOffsets)
	const rebalancing = allTopicInfo.topics.find(topic => topic.name === 'rebalncing')
	console.log('rebalancing', rebalancing)

	const aTopicInfo = await admin.describeTopics([newTopicName])
	console.log('aTopicInfo', aTopicInfo)
}

async function exitHandler(admin: KafkaAdmin) {
	const stopFunc = async () => {
		await admin.exit()
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
