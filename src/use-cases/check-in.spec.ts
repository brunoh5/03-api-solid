import { expect, describe, it, beforeEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new CheckInUseCase(checkInsRepository)
	})

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice in the same day', async () => {
		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
		})

		await expect(() =>
			sut.execute({
				gymId: 'gym-01',
				userId: 'user-01',
			}),
		).rejects.toBeInstanceOf(Error)
	})
})
