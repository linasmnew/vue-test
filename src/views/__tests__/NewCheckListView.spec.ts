import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, createPinia } from 'pinia'
import NewCheckListView from '../NewCheckListView.vue'
import { useCheckListsStore } from '../../stores/checkLists'
import { Status } from '@/types/checkList'

const mockRouter = {
  replace: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

const mockCheckListBase = {
  building: 'Building A',
  status: Status.PASS,
  date: '2025-04-13',
  inspector: 'John Doe',
  notes: 'All good'
}

setActivePinia(createPinia())

beforeEach(() => {
  vi.clearAllMocks()
})

const mountWithOptions = (initialState = {}) => {
  return mount(NewCheckListView, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          stubActions: true,
          initialState: {
            checkLists: {
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

describe('NewCheckListView.vue', () => {
  it('mounts without errors', () => {
    const wrapper = mountWithOptions()
    expect(wrapper.exists()).toBe(true)
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

  describe('renders the CheckListForm component', () => {
    it('exists', () => {
      const wrapper = mountWithOptions()
      expect(wrapper.findComponent({ name: 'CheckListForm' }).exists()).toBe(true)
    })

    it('has the correct props', () => {
      const wrapper = mountWithOptions()

      expect(wrapper.findComponent({ name: 'CheckListForm' }).props('isLoading')).toBe(false)
      expect(wrapper.findComponent({ name: 'CheckListForm' }).props('onSubmit')).toBeDefined()
      expect(wrapper.findComponent({ name: 'CheckListForm' }).props('error')).toBeUndefined()
    })

    describe('onSubmit handler', () => {
      describe('without errors', () => {
        const wrapper = mountWithOptions()
        const store = useCheckListsStore()
        const form = wrapper.findComponent({ name: 'CheckListForm' })
        const onSubmit = form.props('onSubmit')

        it('invokes createCheckList store action', async () => {
          await onSubmit(mockCheckListBase)
          expect(store.createCheckList).toHaveBeenCalledWith(mockCheckListBase)
        })

        it('navigates to checklists page', async () => {
          await onSubmit(mockCheckListBase)
          expect(mockRouter.replace).toHaveBeenCalledWith('/checklists')
        })
      })

      describe('with errors', () => {
        it('does not navigate to checklists page', async () => {
          const wrapper = mountWithOptions({
            error: new Error('Failed to create checklist')
          })
          const form = wrapper.findComponent({ name: 'CheckListForm' })
          const onSubmit = form.props('onSubmit')
          await onSubmit(mockCheckListBase)

          expect(mockRouter.replace).not.toHaveBeenCalled()
        })
      })
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
