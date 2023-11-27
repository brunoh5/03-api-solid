import { app } from '@/app'
import { createAndAuthenticateUse } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a gym', async () => {
		const { token } = await createAndAuthenticateUse(app, true)

		const response = await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Javascript Gym',
				description: 'description',
				phone: null,
				latitude: -19.9444655,
				longitude: -44.1625328,
			})

		expect(response.statusCode).toEqual(201)
	})
})
