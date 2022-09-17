import {KafkaStreams} from 'kafka-streams'
import {getKafkaStreamsConfig} from './config'
import {TOPICS} from '..'

kTable()

// 메시지 키로 그룹핑해 최신 것만 찍는 데이터 스트림
/**
 * The main difference between a KStream and KTable is that the table can only represent a certain moment or state
 *  of the total events on a stream (messages on a Kafka Topic) as it has to complete before the table can be build and used.
 *  You can either do that by awaiting time .consumeUntilMs(milliseconds) or counting messages.consumeUntilCount(messageCount)
 *  or alternatively run until a certain offset is reached with .consumeUntilLatestOffset().
 */
 async function kTable() {
	const config = getKafkaStreamsConfig()
	const kafkaStreams = new KafkaStreams(config)

	const fromTopic: AvailableTopicType = 'tableLog'
	const toTopic: AvailableTopicType = 'filteredJoinLog'

	// 데이터 소스
	const kTable = kafkaStreams.getKTable(fromTopic, setKeyValue, kafkaStreams.getStorage() as any)

	try {
		await kTable.start()
		console.log("stream started, as kafka table client is ready.")
	} catch (err) {
		console.log("streamed failed to start: " + err)
		throw new Error(err)
	}
}

// 스트림, 테이블 join
// async function joinStreamAndTable() {
// 	const config = getKafkaStreamsConfig()
// 	const kafkaStreams = new KafkaStreams(config)

// 	const fromStreamTopic: AvailableTopicType = 'streamLog'
// 	const fromTableTopic: AvailableTopicType = 'tableLog'

// 	const kStream = kafkaStreams.getKStream(fromStreamTopic)
// 	const kTable = kafkaStreams.getKTable(fromTableTopic, setKeyValue, kafkaStreams.getStorage() as any)

// 	kStream.merge(kTable).map()
// }

type AvailableTopicType = typeof TOPICS[number]

function setKeyValue(data) {
	const {key, value} = data
	const strKey = key && key.toString()
	const strValue = value && value.toString()
	console.log(strKey, strValue, 'check!', data)

	return {
		key: strKey,
		value: strValue
	};
};