import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckList from '../CheckList.vue'
import { Status } from '@/types/checkList'

const props = {
  checkList: {
    id: 1,
    building: 'Building A',
    status: Status.PASS,
    date: '2025-04-13',
    inspector: 'John Doe',
    notes: 'Everything looks good'
  },
  onClick: vi.fn()
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('CheckList.vue', () => {
  it('mounts without errors', () => {
    const wrapper = mount(CheckList, {
      props
    })
    expect(wrapper.exists()).toBe(true)
  })

  describe('when rendered', () => {
    it('renders the date', () => {
      const wrapper = mount(CheckList, {
        props
      })
      expect(wrapper.text()).toContain(props.checkList.date)
    })

    it('renders the status', () => {
      const wrapper = mount(CheckList, {
        props
      })
      expect(wrapper.text()).toContain(props.checkList.status)
    })

    it('renders the building', () => {
      const wrapper = mount(CheckList, {
        props
      })
      expect(wrapper.text()).toContain(props.checkList.building)
    })

    it('renders the inspector', () => {
      const wrapper = mount(CheckList, {
        props
      })
      expect(wrapper.text()).toContain(props.checkList.inspector)
    })

    it('renders the notes', () => {
      const wrapper = mount(CheckList, {
        props
      })
      expect(wrapper.text()).toContain(props.checkList.notes)
    })
  })

  describe('conditionally rendered fields', () => {
    it('does not render the inspector when not provided', () => {
      const wrapper = mount(CheckList, {
        props: { ...props, checkList: { ...props.checkList, inspector: undefined } }
      })

      expect(wrapper.text()).not.toContain(props.checkList.inspector)
    })

    it('does not render the notes when not provided', () => {
      const wrapper = mount(CheckList, {
        props: { ...props, checkList: { ...props.checkList, notes: undefined } }
      })
      expect(wrapper.text()).not.toContain(props.checkList.notes)
    })
  })

  describe('when clicked', () => {
    describe('when onClick handler is provided', () => {
      it('invokes onClick handler', () => {
        const wrapper = mount(CheckList, {
          props
        })

        wrapper.find('[data-test="checklist"]').trigger('click')
        expect(props.onClick).toHaveBeenCalledWith(props.checkList.id)
      })
    })

    describe('when onClick handler is not provided', () => {
      it('does not invoke onClick handler', () => {
        const wrapper = mount(CheckList, {
            props: {
              ...props,
            onClick: undefined
          }
        })

        wrapper.find('[data-test="checklist"]').trigger('click')
        expect(props.onClick).not.toHaveBeenCalled()
      })
    })
  })
})
