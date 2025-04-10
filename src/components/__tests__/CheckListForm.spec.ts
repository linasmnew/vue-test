import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckListForm from '../CheckListForm.vue'
import { Status } from '@/types/checklist'
import IconSpinner from '../icons/IconSpinner.vue'

describe('CheckListForm.vue', () => {
  const defaultProps = {
    isLoading: false,
    onSubmit: vi.fn()
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
        onSubmit
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
        onSubmit: vi.fn()
      }
    })

    const submitButton = wrapper.find('[data-test="submit-button"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
    expect(submitButton.findComponent(IconSpinner).exists()).toBe(true)
    expect(submitButton.text()).not.toBe('Save')
  })

  it('shows Save text on button when not loading', () => {
    const wrapper = mount(CheckListForm, {
      props: defaultProps
    })

    const submitButton = wrapper.find('[data-test="submit-button"]')
    expect(submitButton.attributes('disabled')).toBeUndefined()
    expect(submitButton.text()).toBe('Save')
    expect(submitButton.findComponent(IconSpinner).exists()).toBe(false)
  })
})
