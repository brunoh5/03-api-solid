import { app } from '@/app'
import { createAndAuthenticateUse } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gym (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to search gyms by title', async () => {
		const { token } = await createAndAuthenticateUse(app)

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Typescript Gym',
				description: 'description',
				phone: null,
				latitude: -19.9444655,
				longitude: -44.1625328,
			})

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Javascript Gym',
				description: 'description',
				phone: null,
				latitude: -19.9444655,
				longitude: -44.1625328,
			})

		const response = await request(app.server)
			.get('/gyms/search')
			.query({
				q: 'Javascript',
			})
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Javascript Gym',
			}),
		])

		expect(response.statusCode).toEqual(200)
	})
})
