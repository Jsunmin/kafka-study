import * as path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
// proto-loader-gen-types cli로 생성한 ts type
import { ProtoGrpcType } from './generated/password'

// proto file path
const PROTO_PATH = path.join(__dirname, './proto/password.proto')

const loaderOptions = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
}

// 프로토파일을가져와 셋업한 패키지 정의
const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions)

// 패키지 정의로 grpc 객체 생성
// using proto-loader-gen-types ~ 생성된 타입으로 강제설정 처리
const passwordProto = grpc.loadPackageDefinition(packageDef) as unknown as ProtoGrpcType

const dummyRecords = {
	passwords: [
		{ id: '153642', password: 'default1', hashValue: 'default', saltValue: 'default' },
		{ id: '234654', password: 'default2', hashValue: 'default', saltValue: 'default' },
	],
}

function main() {
	const ourServer = new grpc.Server()

	ourServer.addService(passwordProto.tutorial.PasswordService.service, {
		RetrievePasswords: (_passwordMessage, callback) => {
			callback(null, dummyRecords)
		},
		AddNewDetails: (passwordMessage, callback) => {
			const passwordDetails = { ...passwordMessage.request }
			dummyRecords.passwords.push(passwordDetails)
			callback(null, passwordDetails)
		},
		UpdatePasswordDetails: (passwordMessage, callback) => {
			const detailsID = passwordMessage.request.id
			const targetDetails = dummyRecords.passwords.find(({ id }) => detailsID == id)
			targetDetails.password = passwordMessage.request.password
			targetDetails.hashValue = passwordMessage.request.hashValue
			targetDetails.saltValue = passwordMessage.request.saltValue
			callback(null, targetDetails)
		},
	})

	ourServer.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
		console.log('Server running at http://127.0.0.1:50051')
		ourServer.start()
	})
}

main()
