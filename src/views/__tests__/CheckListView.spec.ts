import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, createPinia } from 'pinia'
import CheckListView from '../CheckListView.vue'
import { useCheckListsStore } from '../../stores/checkLists'
import { Status } from '@/types/checkList'

const mockRoute = {
  params: {
      id: 1
  },
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => vi.fn()
}))

const mockCheckList = {
  id: 1,
  building: 'Building A',
  status: Status.PASS,
  date: '2025-04-13',
  inspector: 'John Doe',
  notes: 'All good'
}

setActivePinia(createPinia())

const mountWithOptions = (initialState = {}) => {
  return mount(CheckListView, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          stubActions: true,
          initialState: {
            checkLists: {
              checkList: mockCheckList,
              isLoading: false,
              error: null,
              ...initialState
            }
          }
        }),
      ]
    }
  })
}

describe('CheckListView.vue', () => {
  it('mounts without errors', () => {
    const wrapper = mountWithOptions()
    expect(wrapper.exists()).toBe(true)
  })

  describe('fetches checklist on mount', () => {
    it('invokes fetchCheckList store action', () => {
      const store = useCheckListsStore()
      mountWithOptions()

      expect(store.fetchCheckList).toHaveBeenCalledOnce()
    })

    it('passes route params to fetchCheckList store action', () => {
      const store = useCheckListsStore()
      mountWithOptions()

      expect(store.fetchCheckList).toHaveBeenCalledWith(1)
    })
  })

  describe('renders the BackButton component', () => {
    it('exists', () => {
      const wrapper = mountWithOptions()
      expect(wrapper.findComponent({ name: 'BackButton' }).exists()).toBe(true)
    })

    it('has the correct props', () => {
      const wrapper = mountWithOptions()
      expect(wrapper.findComponent({ name: 'BackButton' }).props('path')).toBe('/checklists')
    })
  })

  describe('renders the CheckList component', () => {
    it('exists', () => {
      const wrapper = mountWithOptions()
      expect(wrapper.findComponent({ name: 'CheckList' }).exists()).toBe(true)
    })

    it('has the correct props', () => {
      const wrapper = mountWithOptions()
      expect(wrapper.findComponent({ name: 'CheckList' }).props('checkList')).toStrictEqual(mockCheckList)
    })

    it('does not exist when isLoading is true', () => {
      const wrapper = mountWithOptions({ isLoading: true })
      expect(wrapper.findComponent({ name: 'CheckList' }).exists()).toBe(false)
    })

    it('does not exist when error exists', () => {
      const wrapper = mountWithOptions({ error: new Error('Failed to load checklist') })
      expect(wrapper.findComponent({ name: 'CheckList' }).exists()).toBe(false)
    })
  })

  describe('loading state', () => {
    it('shows loading indicator when isLoading is true', () => {
      const wrapper = mountWithOptions({ isLoading: true })
      expect(wrapper.find('[data-test="loading-indicator"]').exists()).toBe(true)
    })

    it('does not show loading indicator when isLoading is false', () => {
      const wrapper = mountWithOptions({ isLoading: false })
      expect(wrapper.find('[data-test="loading-indicator"]').exists()).toBe(false)
    })
  })

  describe('error message', () => {
    it('does not display error message when no error exists', () => {
      const wrapper = mountWithOptions()
      expect(wrapper.find('[data-test="error-message"]').exists()).toBe(false)
    })

    it('displays error message when error exists', () => {
      const errorMessage = 'Failed to create checklist'
      const wrapper = mountWithOptions({
        error: new Error(errorMessage)
      })

      expect(wrapper.find('[data-test="error-message"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="error-message"]').text()).toContain(errorMessage)
    })
  })
})
