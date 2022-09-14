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
const PasswordService = grpc.loadPackageDefinition(packageDef).PasswordService as grpc.ServiceClientConstructor

const clientStub = new PasswordService('localhost:50051', grpc.credentials.createInsecure())

clientStub.RetrievePasswords({}, (error, passwords) => {
	if (error) {
		console.error('debug', error)
		throw new Error(error)
	}
	console.log(passwords)
})
