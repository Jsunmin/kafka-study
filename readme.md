# studty
 - ### kafka
 - ### grpc
 - ### synchronize
</br>

## kafka

### libs
 - kafkajs
### 자료
 - https://kafka.js.org/docs/consumer-example
 - https://www.inflearn.com/course/%EC%95%84%ED%8C%8C%EC%B9%98-%EC%B9%B4%ED%94%84%EC%B9%B4-%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D
 - https://developer.confluent.io/get-started/nodejs/#introduction
 - https://nodefluent.github.io/kafka-streams/docs

 ### 구성
  - m1 기준 kafka setup
  - 컨슈머(워커)
  - 프로듀서
  - 스트림즈

### 정리
 - 카프카: 이벤트 스트림 프로세싱 아키텍처
    - 브로커: 카프카 클러스터 서버 중 하나. 데이터를 저장하고 전달하는 역할 (only 송수신 리더파티션)
    - 토픽: 카프카 클러스터에서 데이터를 구분하는 단위. 토픽은 최소 1개 이상 파티션을 가짐
    - 파티션: 토픽에서 데이터를 논리적으로 구분하는 단위
    - 레코드: 메시지를 담는 가장 작은 단위
    - 프로듀서: 카프카 클러스터로 데이터 전달하는 역할의 앱
    - 컨슈머: 카프카 클러스터에 저장된 레코드를 받아와 처리하는 역할의 앱
    - 관련 모듈: kafkajs (https://kafka.js.org)

 - 카프카 스트림즈: 토픽에서 토픽을 연결하는 데이터 파이프라인
    - 일련의 토폴로지를 구성해, (소스)데이터를 받아오고 -> (스트림)가공해서 -> (싱크)적재하는 과정을 가짐
    - 태스크: 스트림즈 앱 구성하는 데이터 처리 최소 단위
    - 스트림즈 DSL: 스트림 프로세스에 쓰이는 apis
         - 레코드 흐름
            - KStream: 메시지 키와 값으로 데이터 흐름 표현
            - KTable: 특정 파티션의 메시지 키를 기준으로 그룹핑 & 최신 데이터 출력 (키밸류 스토어와 비슷)
            - GlobalKTable: 모든 파티션이 (전부 데이터 in-sync) 메시지 키를 기준으로 그룹핑 & 최신 데이터 출력
               - cf) 코파티셔닝
         - 기타 기능: filter, map, reduce ...
    - 관련 모듈: kafka-streams (https://www.npmjs.com/package/kafka-streams)
         - dependency: node-rdkafka / 

 - 카프카 커넥트: 데이터 파이프라인을 반복적으로 생성할때 사용하는 앱

</br></br>

## grpc
### libs
 - @grpc/proto-loader
 - @grpc/grpc-js

### 정리
 - proto-loader-gen-types:
    - goal is to have type information available when editing and building code that uses @grpc/proto-loader to load .proto files at runtime.
    - .proto를 체크하지 못하는 ts를 위한 셋업 cli
    - packagedefinition을 받아와 ts환경에서 쓸 수 있다!
    - packag로 폴더링 가능! (동명시 충돌 주의;; ~ 덮어쓴다)
### 자료
 - https://npmtrends.com/@grpc/grpc-js-vs-@grpc/proto-loader-vs-grpc-vs-grpc-caller-vs-grpc-tools
 - https://www.trendmicro.com/pl_pl/devops/22/f/grpc-api-tutorial.html
 - https://github.com/grpc/proposal/blob/master/L70-node-proto-loader-type-generator.md


 ## 동시성 이슈
  - 디비 lock (pessimistic/optimistic) & 데드락 핸들링
  - 디비 atomic operation
  - redis key/value ~ lock 활용 (spin lock || pub/sub)
  - 캐싱 (sql -> redis) & atomic operation & batch sync to db ** 