import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomePage from '../HomePage.vue'

describe('HomePage', () => {
  it('mounts without errors', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.exists()).toBe(true)
  })
})
