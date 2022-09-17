# studty
 - ### kafka
 - ### grpc
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

### 정리
 - 카프카:
    - 
    - 관련 모듈: kafkajs (https://kafka.js.org)
 - 카프카 스트림즈: 토픽에서 토픽을 연결하는 데이터 파이프라인
    - 일련의 토폴로지를 구성해, (소스)데이터를 받아오고 -> (스트림)가공해서 -> (싱크)적재하는 과정을 가짐
    - 태스크: 스트림즈 앱 구성하는 데이터 처리 최소 단위
    - 스트림즈 DSL: 스트림 프로세스에 쓰이는 apis
         - 레코드 흐름
            - KStream: 메시지 키와 값으로 데이터 흐름 표현
            - KTable: 메시지 키를 기준으로 그룹핑 & 최신 데이터 출력
         - 기타 기능: filter, map, reduce ...
    - 관련 모듈: kafka-streams (https://www.npmjs.com/package/kafka-streams)
         - dependency: node-rdkafka / 
 - 카프카 커넥트:
    - 
 - 스트림즈 DSL:
    - goal is to have type information available when editing and building code that uses @grpc/proto-loader to load .proto files at runtime.
    - .proto를 체크하지 못하는 ts를 위한 셋업 cli
    - packagedefinition을 받아와 ts환경에서 쓸 수 있다!
    - packag로 폴더링 가능! (동명시 충돌 주의;; ~ 덮어쓴다)

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