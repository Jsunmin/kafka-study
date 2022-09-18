import { DataSource } from 'typeorm'
import * as path from 'path'

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: 'root',
	database: 'test',
	entities: [path.join(__dirname, '/entities/**/*{.ts,.js}')],
	// synchronize: true,
	logging: true,
})

export async function initDb() {
	if (!AppDataSource.isInitialized) {
		try {
			await AppDataSource.initialize()
			console.log('Data Source has been initialized!')
		} catch (err) {
			console.error('Error during Data Source initialization', err)
			throw new Error(err)
		}
	}
	return AppDataSource
}

export async function closeDb() {
	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy()
	}
	console.log('Data Source closed')
}
