import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCheckLists, getCheckList, createCheckList } from '../checkLists'
import { fetchJSON, postJSON } from '../../fetchUtil'
import { Status } from '@/types/checkList'

vi.mock('../../fetchUtil', () => ({
  fetchJSON: vi.fn(),
  postJSON: vi.fn()
}))

describe('checkLists API', () => {
  const mockResponse = { data: 'mock response' }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(fetchJSON).mockResolvedValue(mockResponse)
    vi.mocked(postJSON).mockResolvedValue(mockResponse)
  })

  describe('getCheckLists', () => {
    describe('when empty filters', () => {
      it('should call fetchJSON without query params', async () => {
        const emptyFilters = {}
        await getCheckLists(emptyFilters)

        expect(fetchJSON).toHaveBeenCalledTimes(1)
        expect(fetchJSON).toHaveBeenCalledWith('/checklists')
      })
    })

    describe('when filters are provided', () => {
      it('should include query parameters when filters are provided', async () => {
        const filters = { status: Status.PASS }
        const expectedQueryParams = '?status=Pass'
        await getCheckLists(filters)

        expect(fetchJSON).toHaveBeenCalledWith(`/checklists${expectedQueryParams}`)
      })
    })

    it('should return the response from fetchJSON', async () => {
      const result = await getCheckLists({})

      expect(result).toEqual(mockResponse)
    })
  })

  describe('getCheckList', () => {
    it('should call fetchJSON with the provided checklist ID', async () => {
      const checkListId = 123
      await getCheckList(checkListId)

      expect(fetchJSON).toHaveBeenCalledTimes(1)
      expect(fetchJSON).toHaveBeenCalledWith(`/checklists/${checkListId}`)
    })

    it('should return the response from fetchJSON', async () => {
      const checkListId = 123
      const result = await getCheckList(checkListId)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('createCheckList', () => {
    it('should call postJSON with the correct endpoint and checklist data', async () => {
      const newCheckList = {
        building: 'New Building',
        status: Status.PASS,
        date: '2025-04-14',
        inspector: 'John Doe',
        notes: 'Everything looks good'
      }
      await createCheckList(newCheckList)

      expect(postJSON).toHaveBeenCalledTimes(1)
      expect(postJSON).toHaveBeenCalledWith('/checklists', newCheckList)
    })

    it('should return the response from postJSON', async () => {
      const newCheckList = {
        building: 'New Building',
        status: Status.FAIL,
        date: '2025-04-14',
        inspector: 'Jane Smith',
        notes: 'Found some issues'
      }
      const result = await createCheckList(newCheckList)

      expect(result).toEqual(mockResponse)
    })
  })
})
