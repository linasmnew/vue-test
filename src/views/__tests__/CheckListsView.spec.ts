import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, createPinia } from 'pinia'
import CheckListsView from '../CheckListsView.vue'
import { useCheckListsStore } from '../../stores/checkLists'
import { Status } from '@/types/checkList'

const mockRouter = {
  push: vi.fn()
}

const mockRoute = {
  path: '/checklists',
  query: {}
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter
}))

const mockCheckLists = [
  {
    id: 1,
    building: 'Building A',
    status: Status.PASS,
    date: '2025-04-13',
    inspector: 'John Doe',
    notes: 'All good'
  },
  {
    id: 2,
    building: 'Building B',
    status: Status.FAIL,
    date: '2025-04-13',
    inspector: 'Jane Smith',
    notes: 'Issues found'
  }
]

setActivePinia(createPinia())

const mountWithOptions = (initialState = {}) => {
  return mount(CheckListsView, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          stubActions: true,
          initialState: {
            checkLists: {
              checkLists: mockCheckLists,
              isLoading: false,
              error: null,
              ...initialState
            }
          }
        })
      ]
    }
  })
}

describe('CheckListsView.vue', () => {
  it('mounts without errors', () => {
    const wrapper = mountWithOptions()
    expect(wrapper.exists()).toBe(true)
  })

  describe('fetchCheckLists store action on mount', () => {
    describe('when no status is provided', () => {
      it('invokes without status', () => {
        const store = useCheckListsStore()
        mountWithOptions()

        expect(store.fetchCheckLists).toHaveBeenCalled()
      })
    })

    describe('when status exists in route query', () => {
      vi.mock('vue-router', () => ({
        useRoute: () => ({
          ...mockRoute,
          query: { status: 'Pass' }
        }),
        useRouter: () => mockRouter
      }))

      it('invokes with status', async () => {
        const wrapper = mountWithOptions()
        const store = useCheckListsStore()
        await wrapper.vm.$nextTick()

        expect(mockRouter.push).toHaveBeenCalledWith({
          path: '/checklists',
          query: { status: 'Pass' }
        })
        expect(store.fetchCheckLists).toHaveBeenCalledWith({ status: 'Pass' })
      })
    })
  })

  describe('filter dropdown', () => {
    it('renders filter options', () => {
      const wrapper = mountWithOptions()

      expect(wrapper.find('[data-test="status-filter"]').exists()).toBe(true)
      expect(wrapper.findAll('option').length).toBe(3)
      expect(wrapper.findAll('option')[0].text()).toBe('All')
      expect(wrapper.findAll('option')[1].text()).toBe('Pass')
      expect(wrapper.findAll('option')[2].text()).toBe('Fail')
    })

    describe('when filter options are selected', () => {
      it('updates the route query', async () => {
        const wrapper = mountWithOptions()
        await wrapper.find('[data-test="status-filter"]').setValue('Pass')

        expect(mockRouter.push).toHaveBeenCalledWith({
          path: '/checklists',
          query: { status: 'Pass' }
        })
      })

      it('invokes fetchCheckLists store action with the selected status', async () => {
        const wrapper = mountWithOptions()
        const store = useCheckListsStore()
        await wrapper.find('[data-test="status-filter"]').setValue('Pass')

        expect(store.fetchCheckLists).toHaveBeenCalledWith({ status: 'Pass' })
      })
    })
  })

  describe('add check list button', () => {
    it('renders add check list button', () => {
      const wrapper = mountWithOptions()
      expect(wrapper.find('[data-test="add-checklist-button"]').exists()).toBe(true)
    })

    it('navigates to new check list page when add button is clicked', async () => {
      const wrapper = mountWithOptions()
      await wrapper.find('[data-test="add-checklist-button"]').trigger('click')

      expect(mockRouter.push).toHaveBeenCalledWith('/checklists/new')
    })
  })

  describe('checklists', () => {
    describe('when checklists are loading', () => {
      it('renders loading indicator', () => {
        const wrapper = mountWithOptions({ isLoading: true })
        expect(wrapper.find('[data-test="loading-indicator"]').exists()).toBe(true)
      })
    })

    describe('when there is an error', () => {
      it('renders error message', () => {
        const wrapper = mountWithOptions({ error: { message: 'Error' } })
        expect(wrapper.find('[data-test="error-message"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="error-message"]').text()).toBe('Error')
      })
    })

    describe('when checklists are loaded', () => {
      it('renders checklists', () => {
        const wrapper = mountWithOptions()
        expect(wrapper.find('[data-test="checklists-container"]').exists()).toBe(true)
        expect(wrapper.findAll('[data-test="checklist-item"]').length).toBe(mockCheckLists.length)
      })
    })

    describe('when checklists are empty', () => {
      it('renders empty state', () => {
        const wrapper = mountWithOptions({ checkLists: [] })
        expect(wrapper.find('[data-test="empty-state"]').exists()).toBe(true)
      })
    })

    describe('when checklists are filtered by status', () => {
      it('renders filtered checklists', () => {
        const wrapper = mountWithOptions({ checkLists: mockCheckLists.filter(checkList => checkList.status === Status.PASS) })
        expect(wrapper.findAll('[data-test="checklist-item"]').length).toBe(mockCheckLists.filter(checkList => checkList.status === Status.PASS).length)
      })
    })

    describe('when checklist is clicked', () => {
      it('navigates to checklist page', async () => {
        const wrapper = mountWithOptions()
        const checklistItem = wrapper.find('[data-test="checklist-item"]')
        await checklistItem.trigger('click')

        expect(mockRouter.push).toHaveBeenCalledWith(`/checklists/${mockCheckLists[0].id}`)
      })
    })
  })
})
