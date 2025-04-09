import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckList from '../CheckList.vue'
import { Status } from '@/types/checkList'

describe('CheckList.vue', () => {
  const defaultProps = {
    checkList: {
      id: 1,
      building: 'Building A',
      status: Status.PASS,
      date: '2023-04-08',
      inspector: 'John Doe',
      notes: 'Everything looks good'
    },
    onClick: vi.fn()
  }

  it('mounts without errors', () => {
    const wrapper = mount(CheckList, {
      props: defaultProps
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders checklist information correctly', () => {
    const wrapper = mount(CheckList, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('Building A')
    expect(wrapper.text()).toContain('Pass')
    expect(wrapper.text()).toContain('2023-04-08')
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Everything looks good')
  })

  it('conditionally renders inspector information when provided', () => {
    const wrapperWithInspector = mount(CheckList, {
      props: defaultProps
    })
    expect(wrapperWithInspector.text()).toContain('John Doe')

    const wrapperWithoutInspector = mount(CheckList, {
      props: {
        ...defaultProps,
        checkList: {
          ...defaultProps.checkList,
          inspector: ''
        }
      }
    })
    expect(wrapperWithoutInspector.text()).not.toContain('Inspector:')
  })

  it('conditionally renders notes when provided', () => {
    const wrapperWithNotes = mount(CheckList, {
      props: defaultProps
    })
    expect(wrapperWithNotes.text()).toContain('Everything looks good')

    const wrapperWithoutNotes = mount(CheckList, {
      props: {
        ...defaultProps,
        checkList: {
          ...defaultProps.checkList,
          notes: ''
        }
      }
    })
    expect(wrapperWithoutNotes.text()).not.toContain('Notes:')
  })

  it('calls onClick handler when clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(CheckList, {
      props: {
        ...defaultProps,
        onClick
      }
    })

    await wrapper.find('.checklist').trigger('click')

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledWith(defaultProps.checkList.id)
  })
})
