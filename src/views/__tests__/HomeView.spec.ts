import { describe, it, expect} from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'

describe('HomeView', () => {
  it('mounts without errors', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders HomePage component', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.findComponent({ name: 'HomePage' }).exists()).toBe(true)
  })
})
