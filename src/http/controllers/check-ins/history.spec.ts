import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUse } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check-in History (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list the history of check-in', async () => {
		const { token } = await createAndAuthenticateUse(app)

		const user = await prisma.user.findFirstOrThrow()

		const gym = await prisma.gym.create({
			data: {
				title: 'Javascript Gym',
				latitude: -19.9444655,
				longitude: -44.1625328,
			},
		})

		await prisma.checkIn.createMany({
			data: [
				{ gym_id: gym.id, user_id: user.id },
				{ gym_id: gym.id, user_id: user.id },
			],
		})

		const response = await request(app.server)
			.get('/check-ins/history')
			.set('Authorization', `Bearer ${token}`)
			.send({
				latitude: -19.9444655,
				longitude: -44.1625328,
			})

		expect(response.statusCode).toEqual(200)
		expect(response.body.checkIns).toEqual([
			expect.objectContaining({
				gym_id: gym.id,
				user_id: user.id,
			}),
			expect.objectContaining({
				gym_id: gym.id,
				user_id: user.id,
			}),
		])
	})
})
