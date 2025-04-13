import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconSpinner from '../IconSpinner.vue'

describe('IconSpinner', () => {
  it('mounts without errors', () => {
    const wrapper = mount(IconSpinner)
    expect(wrapper.exists()).toBe(true)
  })

  describe('Icon default state', () => {
    it('uses default width and height', () => {
      const wrapper = mount(IconSpinner)
      expect(wrapper.attributes('width')).toBe('24')
      expect(wrapper.attributes('height')).toBe('24')
    })

    it('uses default color', () => {
      const wrapper = mount(IconSpinner)
      expect(wrapper.attributes('fill')).toBe('var(--color-button-spinner)')
    })
  })

  it('uses the correct custom width and height', () => {
    const wrapper = mount(IconSpinner, {
      props: {
        width: 2,
        height: 2,
      },
    })
    expect(wrapper.attributes('width')).toBe('2')
    expect(wrapper.attributes('height')).toBe('2')
  })

  it('uses the correct custom color', () => {
    const wrapper = mount(IconSpinner, {
      props: {
        color: 'red',
      },
    })
    expect(wrapper.attributes('fill')).toBe('red')
  })
})
