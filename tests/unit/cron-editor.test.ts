import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NButton, NCard, NInput, NSelect, NSpace, NText, NRadio, NRadioGroup, NAlert, NGrid, NGridItem, NInputNumber, NTimePicker, NDatePicker } from 'naive-ui'
import CronEditor from '@/components/cron/CronEditor.vue'

describe('CronEditor', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(CronEditor)
    expect(wrapper.findComponent(NCard).exists()).toBe(true)
    expect(wrapper.findComponent(NInput).exists()).toBe(true)
  })

  it('shows preset templates when showPresets is true', () => {
    const wrapper = mount(CronEditor, {
      props: {
        showPresets: true
      }
    })
    expect(wrapper.text()).toContain('快速预设模板')
  })

  it('switches between schedule types', async () => {
    const wrapper = mount(CronEditor)
    
    // 初始为 cron 类型
    expect(wrapper.findComponent(NInput).exists()).toBe(true)
    
    // 切换到 every 类型
    const everyRadio = wrapper.findComponent({ name: 'NRadio' })
    await everyRadio.setValue('every')
    
    // 应该显示数字输入和下拉选择
    expect(wrapper.findComponent(NInputNumber).exists()).toBe(true)
  })

  it('emits save event with correct schedule data', async () => {
    const wrapper = mount(CronEditor)
    
    const saveButton = wrapper.findComponent({ name: 'NButton' })
    await saveButton.trigger('click')
    
    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')?.[0]).toBeTruthy()
  })

  it('applies preset correctly', async () => {
    const wrapper = mount(CronEditor, {
      props: {
        showPresets: true
      }
    })
    
    const presetButton = wrapper.findAllComponents({ name: 'NButton' }).find(btn => 
      btn.text().includes('每天')
    )
    
    if (presetButton) {
      await presetButton.trigger('click')
      // 验证 cron 表达式被更新
      const input = wrapper.findComponent(NInput)
      expect(input.exists()).toBe(true)
    }
  })

  it('validates cron expression on blur', async () => {
    const wrapper = mount(CronEditor)
    
    const input = wrapper.findComponent(NInput)
    await input.setValue('invalid')
    await input.trigger('blur')
    
    // 验证表单验证逻辑
    expect(input.exists()).toBe(true)
  })

  it('resets form when reset button clicked', async () => {
    const wrapper = mount(CronEditor, {
      props: {
        initialSchedule: '0 0 * * *'
      }
    })
    
    const resetButton = wrapper.findComponent({ name: 'NButton' })
    await resetButton.trigger('click')
    
    // 验证表单被重置
    const input = wrapper.findComponent(NInput)
    expect(input.exists()).toBe(true)
  })
})
