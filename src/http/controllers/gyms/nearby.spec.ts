import { app } from '@/app'
import { createAndAuthenticateUse } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Nearby Gym (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list nearby gyms', async () => {
		const { token } = await createAndAuthenticateUse(app, true)

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
				latitude: -15.523963,
				longitude: -41.4917964,
			})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -15.523963,
				longitude: -41.4917964,
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
	})
})
