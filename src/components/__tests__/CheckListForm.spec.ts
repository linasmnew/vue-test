import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckListForm from '../CheckListForm.vue'

const props = {
  isLoading: false,
  onSubmit: vi.fn(),
  error: undefined
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('CheckListForm', () => {
  it('mounts without errors', () => {
    const wrapper = mount(CheckListForm, {
      props
    })
    expect(wrapper.exists()).toBe(true)
  })

  describe('when submitting', () => {
    it('calls onSubmit with form values', async () => {
      const wrapper = mount(CheckListForm, {
        props
      })

      wrapper.vm.formValues.date = '2025-04-13'
      wrapper.vm.formValues.status = 'Pass'
      wrapper.vm.formValues.building = 'Building A'
      wrapper.vm.formValues.inspector = 'John Doe'
      wrapper.vm.formValues.notes = 'Everything looks good'

      await wrapper.find('[data-test="checklist-form"]').trigger('submit')

      expect(props.onSubmit).toHaveBeenCalledWith({
        date: '2025-04-13',
        status: 'Pass',
        building: 'Building A',
        inspector: 'John Doe',
        notes: 'Everything looks good'
      })
    })

    it('sets button to loading state', async () => {
      const wrapper = mount(CheckListForm, {
        props: { ...props, isLoading: true }
      })
      const submitButton = wrapper.findComponent({ name: 'BaseButton' })
      expect(submitButton.props().loading).toBe(true)
    })

    describe('errors', () => {
      describe('when there are errors', () => {
      it('displays the error messages', () => {
        const wrapper = mount(CheckListForm, {
          props: { ...props, error: {
            building: ['Error message 1'],
            notes: ['Error message 2', 'Error message 3'],
          } }
        })
        const errorMessages = wrapper.findAll('[data-test="error-message"]')

        expect(errorMessages.length).toBe(2)
        expect(errorMessages[0].text()).toContain('Error message 1')
        expect(errorMessages[1].text()).toContain('Error message 2')
          expect(errorMessages[1].text()).toContain('Error message 3')
        })
      })

      describe('when there are no errors', () => {
        it('does not display error messages', () => {
          const wrapper = mount(CheckListForm, {
          props
        })
          expect(wrapper.findAll('[data-test="error-message"]').length).toBe(0)
        })
      })
    })
  })

})
