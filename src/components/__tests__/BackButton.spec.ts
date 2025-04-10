import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BackButton from '../BackButton.vue'

const mockRouter = {
  go: vi.fn(),
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

const mockHistoryLength = (length: number) => {
  Object.defineProperty(window, 'history', {
    value: { length },
    writable: true
  })
}

describe('BackButton', () => {
  beforeEach(() => {
    mockRouter.go.mockReset()
    mockRouter.push.mockReset()
    mockHistoryLength(2)
  })

  it('renders properly with default label', () => {
    const wrapper = mount(BackButton, {
      props: {
        label: '← Go back',
        path: '/'
      }
    })
    expect(wrapper.text()).toContain('← Go back')
  })

  it('renders with custom label when provided', () => {
    const wrapper = mount(BackButton, {
      props: {
        label: 'Custom Back Label',
        path: '/'
      }
    })
    expect(wrapper.text()).toContain('Custom Back Label')
  })

  it('navigates back in history when history has entries', async () => {
    mockHistoryLength(2)
    const wrapper = mount(BackButton, {
      props: {
        label: '← Go back',
        path: '/'
      }
    })

    await wrapper.find('[data-test="back-button"]').trigger('click')

    expect(mockRouter.go).toHaveBeenCalledWith(-1)
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('navigates to specified path when no history', async () => {
    mockHistoryLength(1)

    const wrapper = mount(BackButton, {
      props: {
        label: '← Go back',
        path: '/custom-path'
      }
    })

    await wrapper.find('[data-test="back-button"]').trigger('click')

    expect(mockRouter.go).not.toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/custom-path')
  })

  it('uses default path when no path is specified and there is no history', async () => {
    mockHistoryLength(1)

    const wrapper = mount(BackButton, {
      props: {
        label: '← Go back',
        path: '/'
      }
    })

    await wrapper.find('[data-test="back-button"]').trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith('/')
  })
})
