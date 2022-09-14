import * as path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const PROTO_PATH = path.join(__dirname, './password.proto')

const loaderOptions = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
}

const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions)
const passwordProto = grpc.loadPackageDefinition(packageDef)

const dummyRecords = {
	passwords: [
		{ id: '153642', password: 'default1', hashValue: 'default', saltValue: 'default' },
		{ id: '234654', password: 'default2', hashValue: 'default', saltValue: 'default' },
	],
}

function main() {
	const ourServer = new grpc.Server()

	// 강제 타입 할당을 해야만 하나?..
	const PasswordService = passwordProto.PasswordService as grpc.ServiceClientConstructor

	ourServer.addService(PasswordService.service, {
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
