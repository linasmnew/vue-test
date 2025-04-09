import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, createPinia } from 'pinia'
import CheckListView from '../CheckListView.vue'
import { useCheckListsStore } from '../../stores/checkLists'
import { Status } from '@/types/checkList'
import { createRouter, createMemoryHistory, RouteLocationNormalizedLoaded } from 'vue-router'

vi.mock('@/components/CheckList.vue', () => ({
  default: {
    name: 'CheckList',
    props: ['checkList'],
    template: '<div class="checklist" data-test="checklist-mock">Mock CheckList</div>'
  }
}))

describe('CheckListView.vue', () => {
  let router;

  const mockCheckList = {
    id: 1,
    building: 'Building A',
    status: Status.PASS,
    date: '2023-04-08',
    inspector: 'John Doe',
    notes: 'All good'
  }

  beforeEach(() => {
    setActivePinia(createPinia())

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/checklists/:id',
          name: 'checklist',
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

    router.currentRoute.value = {
      params: { id: '1' },
      path: '/checklists/1',
      name: 'checklist',
      query: {},
      hash: '',
      fullPath: '/checklists/1',
      matched: [],
      meta: {},
    } as RouteLocationNormalizedLoaded

    Object.defineProperty(window, 'history', {
      value: { length: 2 },
      writable: true
    })
  })

  const mountComponent = (initialState = {}) => {
    return mount(CheckListView, {
      global: {
        stubs: {
          CheckList: {
            template: '<div class="checklist" data-test="checklist-mock">Mock CheckList</div>',
            props: ['checkList']
          }
        },
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
              checkLists: {
                checkList: mockCheckList,
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
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('fetches checkList data on mount using ID from route params', () => {
    const testingPinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false
    })

    const store = useCheckListsStore(testingPinia)

    mount(CheckListView, {
      global: {
        plugins: [testingPinia, router]
      }
    })

    expect(store.fetchCheckList).toHaveBeenCalledWith(1)
  })

  it('shows loading state when isLoading is true', () => {
    const wrapper = mountComponent({ isLoading: true })

    expect(wrapper.find('[data-test="loading-indicator"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="error-message"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="checklist-mock"]').exists()).toBe(false)
  })

  it('displays error message when not loading and error exists', () => {
    const wrapper = mountComponent({
      isLoading: false,
      error: new Error('Failed to load checklist')
    })

    expect(wrapper.find('[data-test="error-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="loading-indicator"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="checklist-mock"]').exists()).toBe(false)
  })

  it('displays checkList when not loading and no error', () => {
    const wrapper = mountComponent({
      isLoading: false,
      error: null
    })

    expect(wrapper.find('[data-test="checklist-detail"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="error-message"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="loading-indicator"]').exists()).toBe(false)
  })

  it('navigates back in history when back button is clicked and history exists', async () => {
    const wrapper = mountComponent()

    await wrapper.find('[data-test="back-button"]').trigger('click')

    expect(router.go).toHaveBeenCalledWith(-1)
    expect(router.push).not.toHaveBeenCalled()
  })

  it('navigates to checklists page when back button is clicked and history is short', async () => {
    Object.defineProperty(window, 'history', {
      value: { length: 1 },
      writable: true
    })

    const wrapper = mountComponent()

    await wrapper.find('[data-test="back-button"]').trigger('click')

    expect(router.push).toHaveBeenCalledWith('/checklists')
    expect(router.go).not.toHaveBeenCalled()
  })
})
