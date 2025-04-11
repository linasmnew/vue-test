import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckListForm from '../CheckListForm.vue'
import { Status } from '@/types/checklist'

// Create stubs for components
const BaseButtonStub = {
  name: 'BaseButton',
  template: '<button :disabled="loading" :class="{ loading }">{{ !loading ? label : "Loading" }}</button>',
  props: {
    label: String,
    loading: Boolean,
    disabled: Boolean,
    primary: Boolean,
    secondary: Boolean,
    type: String,
    size: String
  }
}

describe('CheckListForm.vue', () => {
  const defaultProps = {
    isLoading: false,
    onSubmit: vi.fn(),
    error: null
  }

  it('mounts without errors', () => {
    const wrapper = mount(CheckListForm, {
      props: defaultProps
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders all form fields correctly', () => {
    const wrapper = mount(CheckListForm, {
      props: defaultProps
    })

    expect(wrapper.find('[data-test="checklist-form"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="date-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="status-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="building-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="inspector-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="notes-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="submit-button"]').exists()).toBe(true)
  })

  it('updates form values when inputs change', async () => {
    const wrapper = mount(CheckListForm, {
      props: defaultProps
    })

    await wrapper.find('[data-test="date-input"]').setValue('2023-04-10')
    await wrapper.find('[data-test="status-select"]').setValue(Status.PASS)
    await wrapper.find('[data-test="building-input"]').setValue('Test Building')
    await wrapper.find('[data-test="inspector-input"]').setValue('Test Inspector')
    await wrapper.find('[data-test="notes-input"]').setValue('Test Notes')

    expect(wrapper.vm.formValues.date).toBe('2023-04-10')
    expect(wrapper.vm.formValues.status).toBe(Status.PASS)
    expect(wrapper.vm.formValues.building).toBe('Test Building')
    expect(wrapper.vm.formValues.inspector).toBe('Test Inspector')
    expect(wrapper.vm.formValues.notes).toBe('Test Notes')
  })

  it('calls onSubmit prop when form is submitted', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(CheckListForm, {
      props: {
        isLoading: false,
        onSubmit,
        error: null
      }
    })

    await wrapper.find('[data-test="date-input"]').setValue('2023-04-10')
    await wrapper.find('[data-test="status-select"]').setValue(Status.PASS)
    await wrapper.find('[data-test="building-input"]').setValue('Test Building')
    await wrapper.find('[data-test="inspector-input"]').setValue('Test Inspector')
    await wrapper.find('[data-test="notes-input"]').setValue('Test Notes')

    await wrapper.find('[data-test="checklist-form"]').trigger('submit.prevent')

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      date: '2023-04-10',
      status: Status.PASS,
      building: 'Test Building',
      inspector: 'Test Inspector',
      notes: 'Test Notes'
    })
  })

  it('disables the submit button when isLoading is true', async () => {
    const wrapper = mount(CheckListForm, {
      props: {
        isLoading: true,
        onSubmit: vi.fn(),
        error: null
      },
      global: {
        stubs: {
          BaseButton: BaseButtonStub
        }
      }
    })

    const submitButton = wrapper.find('[data-test="submit-button"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
    expect(submitButton.classes()).toContain('loading')
    expect(submitButton.text()).toBe('Loading')
  })

  it('shows Save text on button when not loading', () => {
    const wrapper = mount(CheckListForm, {
      props: defaultProps,
      global: {
        stubs: {
          BaseButton: BaseButtonStub
        }
      }
    })

    const submitButton = wrapper.find('[data-test="submit-button"]')
    expect(submitButton.attributes('disabled')).toBeUndefined()
    expect(submitButton.text()).toBe('Save')
    expect(submitButton.classes('loading')).toBe(false)
  })

  describe('form validation', () => {
    it('displays validation errors for date field', () => {
      const wrapper = mount(CheckListForm, {
        props: {
          ...defaultProps,
          error: {
            details: {
              date: ['Date is required', 'Date must be valid']
            }
          }
        }
      })

      const errorMessages = wrapper.findAll('.error-message p')
      expect(errorMessages.length).toBe(2)
      expect(errorMessages[0].text()).toBe('Date is required')
      expect(errorMessages[1].text()).toBe('Date must be valid')
    })

    it('displays validation errors for status field', () => {
      const wrapper = mount(CheckListForm, {
        props: {
          ...defaultProps,
          error: {
            details: {
              status: ['Status is required']
            }
          }
        }
      })

      const errorMessage = wrapper.find('.error-message p')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Status is required')
    })

    it('displays validation errors for building field', () => {
      const wrapper = mount(CheckListForm, {
        props: {
          ...defaultProps,
          error: {
            details: {
              building: ['Building name is required']
            }
          }
        }
      })

      const errorMessage = wrapper.find('.error-message p')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Building name is required')
    })

    it('displays validation errors for multiple fields', () => {
      const wrapper = mount(CheckListForm, {
        props: {
          ...defaultProps,
          error: {
            details: {
              building: ['Building name is required'],
              inspector: ['Inspector name is required'],
              notes: ['Notes are required']
            }
          }
        }
      })

      const errorMessages = wrapper.findAll('.error-message p')
      expect(errorMessages.length).toBe(3)
      expect(errorMessages[0].text()).toBe('Building name is required')
      expect(errorMessages[1].text()).toBe('Inspector name is required')
      expect(errorMessages[2].text()).toBe('Notes are required')
    })

    it('does not display error messages when no errors exist', () => {
      const wrapper = mount(CheckListForm, {
        props: defaultProps
      })

      const errorMessages = wrapper.findAll('.error-message')
      expect(errorMessages.length).toBe(0)
    })
  })
})
