// 카프카 규정 토픽
export const TOPICS = [
	// 카프카 컨슈머, 프로듀서 토픽
	'test',
	// 카프카 스트림용 토픽
	'streamLog',
	'filteredStreamLog',
	'tableLog',
	'filteredJoinLog',
] as const
