import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('mounts without errors', () => {
    const wrapper = mount(BaseButton, {})
    expect(wrapper.find('[data-test="button"]').exists()).toBe(true)
  })

  describe('Button default state', () => {
    const wrapper = mount(BaseButton, {})

    it('displays a label', () => {
      expect(wrapper.text()).toContain('Submit')
    })

    it('is not disabled', () => {
      expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
    })

    it('is not loading', () => {
      expect(wrapper.findComponent({name: 'IconSpinner'}).exists()).toBe(false)
    })

    it('is primary', () => {
      expect(wrapper.classes()).toContain('primary')
    })

    it('is medium size', () => {
      expect(wrapper.classes()).toContain('button-size-medium')
    })
  })

  describe('when loading', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test Button',
        loading: true
      }
    })

    it('shows spinner', () => {
      expect(wrapper.findComponent({ name: 'IconSpinner' }).exists()).toBe(true)
    })

    it('hides the label', () => {
      expect(wrapper.text()).not.toContain('Test Button')
    })

    it('is disabled', () => {
      expect(wrapper.find('[data-test="button"]').attributes('disabled')).toBeDefined()
    })
  })

  it('uses secondary style when specified', () => {
    const wrapper = mount(BaseButton, {
      props: {
        secondary: true
      }
    })
    expect(wrapper.classes()).toContain('secondary')
  })

  it('uses naked style when specified', () => {
    const wrapper = mount(BaseButton, {
      props: {
        naked: true
      }
    })
    expect(wrapper.classes()).toContain('naked')
  })

  it('uses small size when specified', () => {
    const wrapper = mount(BaseButton, {
      props: {
        size: 'small'
      }
    })
    expect(wrapper.classes()).toContain('button-size-small')
  })

  it('uses large size when specified', () => {
    const wrapper = mount(BaseButton, {
      props: {
        size: 'large'
      }
    })
    expect(wrapper.classes()).toContain('button-size-large')
  })

  it('disables the button when disabled', () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('uses button type when specified', () => {
    const wrapper = mount(BaseButton, {
      props: {
        type: 'submit'
      }
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseButton, {
      props: {
        onClick
      }
    })
    await wrapper.find('[data-test="button"]').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('uses custom data-test attribute when specified', () => {
    const wrapper = mount(BaseButton, {
      props: {
        dataTestId: 'custom-button'
      }
    })
    expect(wrapper.attributes('data-test')).toBe('custom-button')
  })
})
