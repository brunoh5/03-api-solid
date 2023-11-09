import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Search Gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it('should be able to fetch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near Gym',
			description: null,
			phone: null,
			latitude: -19.9444655,
			longitude: -44.1625328,
		})

		await gymsRepository.create({
			title: 'Far Gym',
			description: null,
			phone: null,
			latitude: -15.523963,
			longitude: -41.4917964,
		})

		const { gyms } = await sut.execute({
			userLatitude: -19.9444655,
			userLongitude: -44.1625328,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
	})
})
