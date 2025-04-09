import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCheckListsStore } from '../checkLists'
import { Status } from '../../types/checkList'
import { getCheckList, getCheckLists, createCheckList as createCheckListApi } from '../../services/api'

vi.mock('../../services/api', () => {
  return {
    getCheckLists: vi.fn(),
    getCheckList: vi.fn(),
    createCheckList: vi.fn()
  }
})

describe('checkLists store', () => {
  const mockCheckList = {
    id: 1,
    building: 'Building A',
    status: Status.PASS,
    date: '2023-04-08',
    inspector: 'John Doe',
    notes: 'All good'
  }

  const mockCheckLists = [
    mockCheckList,
    {
      id: 2,
      building: 'Building B',
      status: Status.FAIL,
      date: '2023-04-09',
      inspector: 'Jane Smith',
      notes: 'Issues found'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())

    vi.mocked(getCheckLists).mockReset()
    vi.mocked(getCheckList).mockReset()
    vi.mocked(createCheckListApi).mockReset()
  })

  describe('fetchCheckLists', () => {
    it('should update the store with checkLists array on successful API call', async () => {
      vi.mocked(getCheckLists).mockResolvedValueOnce(mockCheckLists)
      const store = useCheckListsStore()

      await store.fetchCheckLists()

      expect(getCheckLists).toHaveBeenCalledTimes(1)
      expect(store.checkLists).toEqual(mockCheckLists)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should accept filter parameters', async () => {
      vi.mocked(getCheckLists).mockResolvedValueOnce(mockCheckLists)
      const store = useCheckListsStore()
      const filters = { status: 'Pass' }

      await store.fetchCheckLists(filters)

      expect(getCheckLists).toHaveBeenCalledWith(filters)
    })

    it('should handle API errors properly', async () => {
      const errorMessage = 'API Error'
      vi.mocked(getCheckLists).mockRejectedValueOnce(new Error(errorMessage))
      const store = useCheckListsStore()

      await store.fetchCheckLists()

      expect(store.isLoading).toBe(false)
      expect(store.error).toBeInstanceOf(Error)
      expect(store.error?.message).toBe(errorMessage)
    })
  })

  describe('fetchCheckList', () => {
    it('should return cached checkList if it exists and has matching ID', async () => {
      const store = useCheckListsStore()
      // Set the existing checkList value directly
      store.checkList = mockCheckList

      await store.fetchCheckList(1)

      expect(getCheckList).not.toHaveBeenCalled()
      expect(store.checkList).toEqual(mockCheckList)
    })

    it('should fetch a checkList by id from API if not found in store', async () => {
      vi.mocked(getCheckList).mockResolvedValueOnce(mockCheckList)
      const store = useCheckListsStore()

      await store.fetchCheckList(1)

      expect(getCheckList).toHaveBeenCalledWith(1)
      expect(store.checkList).toEqual(mockCheckList)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should handle API errors properly', async () => {
      const errorMessage = 'API Error'
      vi.mocked(getCheckList).mockRejectedValueOnce(new Error(errorMessage))
      const store = useCheckListsStore()

      await store.fetchCheckList(1)

      expect(store.isLoading).toBe(false)
      expect(store.error).toBeInstanceOf(Error)
      expect(store.error?.message).toBe(errorMessage)
    })
  })

  describe('createCheckList', () => {
    it('should add new checkList to the store on successful API call', async () => {
      const store = useCheckListsStore()
      const newCheckList = {
        id: 3,
        building: 'Building C',
        status: Status.PASS,
        date: '2023-04-10',
        inspector: 'Sam Williams',
        notes: 'New building check'
      }

      vi.mocked(createCheckListApi).mockResolvedValueOnce(newCheckList)

      await store.createCheckList(newCheckList)

      expect(createCheckListApi).toHaveBeenCalledWith(newCheckList)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.checkLists.some(checkList => checkList.id === newCheckList.id)).toBe(true)
    })

    it('should handle API errors properly', async () => {
      const store = useCheckListsStore()
      const errorMessage = 'API Error'
      const newCheckList = { ...mockCheckList, id: 5 }

      vi.mocked(createCheckListApi).mockRejectedValueOnce(new Error(errorMessage))

      await store.createCheckList(newCheckList)

      expect(store.isLoading).toBe(false)
      expect(store.error).toBeInstanceOf(Error)
      expect(store.error?.message).toBe(errorMessage)
    })
  })
})
