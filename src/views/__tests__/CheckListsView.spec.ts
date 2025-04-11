import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, createPinia } from 'pinia'
import CheckListsView from '../CheckListsView.vue'
import { useCheckListsStore } from '../../stores/checkLists'
import { Status } from '@/types/checkList'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/checklists',
      name: 'checklists',
      component: { template: '<div></div>' }
    },
    {
      path: '/checklists/:id',
      name: 'checklist',
      component: { template: '<div></div>' }
    },
    {
      path: '/checklists/new',
      name: 'new-checklist',
      component: { template: '<div></div>' }
    }
  ]
})

router.push = vi.fn()

vi.mock('@/components/CheckList.vue', () => ({
  default: {
    name: 'CheckList',
    props: ['checkList'],
    template: '<div data-test="checklist-mock">{{ checkList.building }}</div>'
  }
}))

describe('CheckListsView.vue', () => {
  const mockCheckLists = [
    {
      id: 1,
      building: 'Building A',
      status: Status.PASS,
      date: '2023-04-08',
      inspector: 'John Doe',
      notes: 'All good'
    },
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

    vi.mocked(router.push).mockReset()

    router.currentRoute.value.path = '/checklists'
    router.currentRoute.value.query = {}
  })

  const mountWithOptions = (routeQuery = {}, initialState = {}) => {
    router.currentRoute.value.query = routeQuery as Record<string, string>

    return mount(CheckListsView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              checkLists: {
                checkLists: mockCheckLists,
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

  it('renders filter dropdown', () => {
    const wrapper = mountWithOptions()
    expect(wrapper.find('[data-test="status-filter"]').exists()).toBe(true)
    expect(wrapper.findAll('option').length).toBe(3)
  })

  it('renders checkLists when available', async () => {
    const wrapper = mountWithOptions()
    const store = useCheckListsStore()

    store.checkLists = mockCheckLists
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-test="checklists-container"]').exists()).toBe(true)
  })

  it('shows loading state when isLoading is true', async () => {
    const wrapper = mountWithOptions()
    const store = useCheckListsStore()

    store.isLoading = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-test="loading-indicator"]').exists()).toBe(true)
  })

  it('displays error message when error exists', async () => {
    const errorMessage = 'Failed to load checklists'
    const wrapper = mountWithOptions({}, {
      error: {
        message: errorMessage,
        details: { status: ['Invalid status'] }
      }
    })

    expect(wrapper.find('[data-test="error-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="error-message"]').text()).toBe(errorMessage)
    expect(wrapper.find('[data-test="checklists-container"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="loading-indicator"]').exists()).toBe(false)
  })

  it('navigates to new checkList page when add button is clicked', async () => {
    const wrapper = mountWithOptions()
    await wrapper.find('[data-test="add-checklist-button"]').trigger('click')

    expect(router.push).toHaveBeenCalledWith('/checklists/new')
  })

  it('initializes with status from route query', async () => {
    router.currentRoute.value.query = { status: 'Pass' }

    const wrapper = mountWithOptions({ status: 'Pass' })
    const store = useCheckListsStore()

    await router.isReady()

    expect(store.fetchCheckLists).toHaveBeenCalled()
    expect(wrapper.vm.selectedStatus).toBe('Pass')
  })
})
