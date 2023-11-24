import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUse } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a check-in', async () => {
		const { token } = await createAndAuthenticateUse(app)

		const gym = await prisma.gym.create({
			data: {
				title: 'Javascript Gym',
				latitude: -19.9444655,
				longitude: -44.1625328,
			},
		})

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-ins`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				latitude: -19.9444655,
				longitude: -44.1625328,
			})

		expect(response.statusCode).toEqual(201)
	})
})