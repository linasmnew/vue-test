import { describe, it, expect, vi} from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'

vi.mock('../../components/HomePage.vue', () => ({
  default: {
    name: 'HomePage',
    template: '<div data-test="home-page-component"></div>'
  }
}))

describe('HomeView', () => {
  it('mounts without errors', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders HomePage component', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.find('[data-test="home-page-component"]').exists()).toBe(true)
  })
})
