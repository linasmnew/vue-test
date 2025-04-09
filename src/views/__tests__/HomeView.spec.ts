import { describe, it, expect, vi} from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'

vi.mock('../../components/TheWelcome.vue', () => ({
  default: {
    name: 'TheWelcome',
    template: '<div data-test="welcome-component"></div>'
  }
}))

describe('HomeView', () => {
  it('mounts without errors', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders TheWelcome component', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.find('[data-test="welcome-component"]').exists()).toBe(true)
  })
})
