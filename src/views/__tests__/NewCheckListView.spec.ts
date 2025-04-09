import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, createPinia } from 'pinia'
import NewCheckListView from '../NewCheckListView.vue'
import { useCheckListsStore } from '../../stores/checkLists'
import { Status } from '@/types/checkList'
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/checklists/new',
      name: 'new-checklist',
      component: { template: '<div></div>' }
    },
    {
      path: '/checklists',
      name: 'checklists',
      component: { template: '<div></div>' }
    }
  ]
})

router.go = vi.fn()
router.push = vi.fn()

vi.mock('@/components/CheckListForm.vue', () => ({
  default: {
    name: 'CheckListForm',
    props: ['isLoading', 'onSubmit'],
    template: '<div data-test="checklist-form-mock">Form Mock</div>'
  }
}))

describe('NewCheckListView.vue', () => {
  const mockCheckListBase = {
    building: 'Building A',
    status: Status.PASS,
    date: '2023-04-08',
    inspector: 'John Doe',
    notes: 'All good'
  }

  beforeEach(() => {
    setActivePinia(createPinia())

    vi.mocked(router.push).mockReset()
    vi.mocked(router.go).mockReset()

    Object.defineProperty(window, 'history', {
      value: { length: 2 },
      writable: true
    })
  })

  const mountWithOptions = (initialState = {}) => {
    return mount(NewCheckListView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              checkLists: {
                isLoading: false,
                error: null,
                ...initialState
              }
            }
          }),
          router
        ]
      }
    })
  }

  it('mounts without errors', () => {
    const wrapper = mountWithOptions()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the CheckListForm component', () => {
    const wrapper = mountWithOptions()
    expect(wrapper.find('[data-test="checklist-form-mock"]').exists()).toBe(true)
  })

  it('displays error message when error exists', () => {
    const errorMessage = 'Failed to create checklist'
    const wrapper = mountWithOptions({
      error: new Error(errorMessage)
    })

    expect(wrapper.find('[data-test="error-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="error-message"]').text()).toContain(errorMessage)
  })

  it('does not display error message when no error exists', () => {
    const wrapper = mountWithOptions()

    expect(wrapper.find('[data-test="error-message"]').exists()).toBe(false)
  })

  it('navigates back in history when back button is clicked and history exists', async () => {
    const wrapper = mountWithOptions()

    await wrapper.find('[data-test="back-button"]').trigger('click')

    expect(router.go).toHaveBeenCalledWith(-1)
    expect(router.push).not.toHaveBeenCalled()
  })

  it('navigates to checklists page when back button is clicked and history is short', async () => {
    Object.defineProperty(window, 'history', {
      value: { length: 1 },
      writable: true
    })

    const wrapper = mountWithOptions()

    await wrapper.find('[data-test="back-button"]').trigger('click')

    expect(router.push).toHaveBeenCalledWith('/checklists')
    expect(router.go).not.toHaveBeenCalled()
  })

  it('calls createCheckList store action and navigates to checklists page', async () => {
    const wrapper = mountWithOptions()
    const store = useCheckListsStore()

    const form = wrapper.findComponent({ name: 'CheckListForm' })

    const onSubmit = form.props('onSubmit')

    await onSubmit(mockCheckListBase)

    expect(store.createCheckList).toHaveBeenCalledWith(mockCheckListBase)

    expect(router.push).toHaveBeenCalledWith('/checklists')
  })
})
