import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('renders properly with label', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test Button'
      }
    })
    expect(wrapper.text()).toContain('Test Button')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('data-test')).toBe('button')
  })

  it('shows loading state when loading prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test Button',
        loading: true
      }
    })
    expect(wrapper.text()).toContain('Loading...')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('applies primary style by default', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test Button'
      }
    })
    expect(wrapper.classes()).toContain('primary')
  })

  it('applies secondary style when secondary prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test Button',
        secondary: true
      }
    })
    expect(wrapper.classes()).toContain('secondary')
  })

  it('applies naked style when naked prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test Button',
        naked: true
      }
    })
    expect(wrapper.classes()).toContain('naked')
  })

  it('disables the button when disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test Button',
        disabled: true
      }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('calls onClick callback when clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test Button',
        onClick
      }
    })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('uses custom submit type when specified', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Submit',
        type: 'submit'
      }
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('uses custom data-test attribute when specified', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test Button',
        dataTestId: 'custom-button'
      }
    })
    expect(wrapper.attributes('data-test')).toBe('custom-button')
  })
})
