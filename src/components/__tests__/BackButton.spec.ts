import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BackButton from '../BackButton.vue'

const props = {
  label: 'Back',
  path: '/',
}

const mockRouter = {
  go: vi.fn(),
  push: vi.fn()
}

const mockHistoryLength = (length: number) => {
  Object.defineProperty(window, 'history', {
    value: { length },
    writable: true
  })
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('BackButton', () => {
  it('mounts without errors', () => {
    const wrapper = mount(BackButton, {
      props
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with custom label when provided', () => {
    const wrapper = mount(BackButton, {
      props
    })
    expect(wrapper.text()).toContain('Back')
  })

  describe('when clicking the button', () => {
    describe('when there is a previous page', () => {
      it('navigates to the previous page', () => {
        mockHistoryLength(2)
        const wrapper = mount(BackButton, {
        props
      })
      const button = wrapper.findComponent({name: 'BaseButton'})

        button.trigger('click')
        expect(mockRouter.go).toHaveBeenCalledWith(-1)
      })
    })

    describe('when there is no previous page', () => {
      it('navigates to the provided path', () => {
        mockHistoryLength(1)
        const wrapper = mount(BackButton, {
          props
      })
      const button = wrapper.findComponent({name: 'BaseButton'})

      button.trigger('click')
        expect(mockRouter.push).toHaveBeenCalledWith(props.path)
      })
    })
  })
})
