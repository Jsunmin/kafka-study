import {KafkaStreams} from 'kafka-streams'
import {getKafkaStreamsConfig} from './config'
import {TOPICS} from '..'

kStream()

// 일반적인 데이터 스트림
async function kStream() {
	/**
	 * KafkaStreams instance is the representation of a classical "factory",
	 *  which will enable you to create multiple instances of KStreams and KTables
	 */
	const config = getKafkaStreamsConfig()
	// 스트림 빌더 (팩토리) 구성
	const kafkaStreams = new KafkaStreams(config)

	// setup kStream
	// 스트림 앱 토픽 셋업
	const fromTopic: AvailableTopicType = 'streamLog'
	const toTopic: AvailableTopicType = 'filteredStreamLog'

	// 데이터 소스
	const kStream = kafkaStreams.getKStream(fromTopic)

	// 데이터 스트림: 스트림즈 DSL로 가공!
	kStream.filter(data => {
		const {value, key, topic, offset} = data
		// byte buffer로 들어옴
		let strKey = key.toString()
		let strValue = value.toString()
		
		console.log(topic, strKey, strValue, 'check!')
		if (strValue && strValue.length >= 5) {
			return true
		}
		return false
	})
	// .map(/* .. */).reduce(/* .. */)
	// 데이터 싱크
	.to(toTopic);

	try {
		await kStream.start()
		console.log("stream started, as kafka stream client is ready.")
	} catch (err) {
		console.log("streamed failed to start: " + err)
		throw new Error(err)
	}
}

type AvailableTopicType = typeof TOPICS[number]