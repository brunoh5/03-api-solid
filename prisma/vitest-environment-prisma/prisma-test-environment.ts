import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'

// postgresql://docker:docker@localhost:5432/apisolid?schema=public

function generateDatabaseURL(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('Please provide a DATABASE_URL environment variable')
	}

	const url = new URL(process.env.DATABASE_URL)

	url.searchParams.set('schema', schema)

	return url.toString()
}

export default <Environment>{
	name: 'prisma',
	async setup() {
		const schema = randomUUID()

		const databaseURL = generateDatabaseURL(schema)

		process.env.DATABASE_URL = databaseURL

		execSync('')

		return {
			async teardown() {
				console.log('teardown')
			},
		}
	},
}
