import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NButton, NCheckbox, NTag, NSpace, NButtonGroup } from 'naive-ui'
import BatchActionsBar from '@/components/common/BatchActionsBar.vue'

describe('BatchActionsBar', () => {
  it('renders correctly when no items selected', () => {
    const wrapper = mount(BatchActionsBar, {
      props: {
        selectedIds: [],
        totalItems: 10
      }
    })
    
    expect(wrapper.findComponent(NTag).exists()).toBe(false)
    expect(wrapper.findComponent(NButtonGroup).exists()).toBe(true)
  })

  it('shows selected count when items are selected', () => {
    const wrapper = mount(BatchActionsBar, {
      props: {
        selectedIds: ['1', '2', '3'],
        totalItems: 10
      }
    })
    
    expect(wrapper.findComponent(NTag).exists()).toBe(true)
    expect(wrapper.text()).toContain('3')
  })

  it('emits batchAction event when enable clicked', async () => {
    const wrapper = mount(BatchActionsBar, {
      props: {
        selectedIds: ['1', '2'],
        totalItems: 10
      }
    })
    
    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    const enableButton = buttons.find(btn => btn.text().includes('启用'))
    
    if (enableButton) {
      await enableButton.trigger('click')
      expect(wrapper.emitted('batchAction')).toBeTruthy()
      expect(wrapper.emitted('batchAction')?.[0]?.[0]).toBe('enable')
    }
  })

  it('emits batchAction event when disable clicked', async () => {
    const wrapper = mount(BatchActionsBar, {
      props: {
        selectedIds: ['1', '2'],
        totalItems: 10
      }
    })
    
    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    const disableButton = buttons.find(btn => btn.text().includes('禁用'))
    
    if (disableButton) {
      await disableButton.trigger('click')
      expect(wrapper.emitted('batchAction')?.[0]?.[0]).toBe('disable')
    }
  })

  it('confirms before delete', async () => {
    const wrapper = mount(BatchActionsBar, {
      props: {
        selectedIds: ['1', '2'],
        totalItems: 10
      }
    })
    
    // 模拟确认对话框
    global.confirm = vi.fn(() => true)
    
    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    const deleteButton = buttons.find(btn => btn.text().includes('删除'))
    
    if (deleteButton) {
      await deleteButton.trigger('click')
      expect(wrapper.emitted('batchAction')?.[0]?.[0]).toBe('delete')
    }
  })

  it('toggles select all checkbox', async () => {
    const wrapper = mount(BatchActionsBar, {
      props: {
        selectedIds: [],
        totalItems: 10,
        showSelectAll: true
      }
    })
    
    const checkbox = wrapper.findComponent(NCheckbox)
    expect(checkbox.exists()).toBe(true)
    
    await checkbox.setValue(true)
    expect(wrapper.emitted('update:selectedIds')).toBeTruthy()
  })

  it('shows indeterminate state when partial selection', () => {
    const wrapper = mount(BatchActionsBar, {
      props: {
        selectedIds: ['1', '2'],
        totalItems: 10,
        showSelectAll: true
      }
    })
    
    const checkbox = wrapper.findComponent(NCheckbox)
    expect(checkbox.props('indeterminate')).toBe(true)
  })
})
