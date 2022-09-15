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

 ### 구성
  - m1 기준 kafka setup
  - 컨슈머(워커)
  - 프로듀서

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