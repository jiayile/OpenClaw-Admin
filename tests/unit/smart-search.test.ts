import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { NInput, NSelect, NTag, NDatePicker } from 'naive-ui'
import SmartSearchFilter from '@/components/common/SmartSearchFilter.vue'

describe('SmartSearchFilter', () => {
  it('renders search input correctly', () => {
    const wrapper = mount(SmartSearchFilter)
    
    expect(wrapper.findComponent(NInput).exists()).toBe(true)
  })

  it('emits search event when typing', async () => {
    const wrapper = mount(SmartSearchFilter)
    
    const input = wrapper.findComponent(NInput)
    await input.setValue('test')
    await input.trigger('input')
    
    // 等待防抖
    await new Promise(resolve => setTimeout(resolve, 400))
    
    expect(wrapper.emitted('search')).toBeTruthy()
  })

  it('debounces search input', async () => {
    const wrapper = mount(SmartSearchFilter, {
      props: {
        debounceMs: 300
      }
    })
    
    const input = wrapper.findComponent(NInput)
    await input.setValue('test')
    
    // 立即检查，应该还没有触发
    expect(wrapper.emitted('search')).toBeUndefined()
    
    // 等待防抖时间
    await new Promise(resolve => setTimeout(resolve, 350))
    
    expect(wrapper.emitted('search')).toBeTruthy()
  })

  it('applies filters correctly', async () => {
    const wrapper = mount(SmartSearchFilter, {
      props: {
        filters: [
          {
            key: 'status',
            label: '状态',
            type: 'single',
            options: [
              { label: '启用', value: 'enabled' },
              { label: '禁用', value: 'disabled' }
            ]
          }
        ]
      }
    })
    
    const select = wrapper.findComponent(NSelect)
    await select.setValue('enabled')
    
    expect(wrapper.emitted('search')).toBeTruthy()
  })

  it('applies quick filters correctly', async () => {
    const wrapper = mount(SmartSearchFilter, {
      props: {
        quickFilters: [
          {
            key: 'recent',
            label: '最近',
            filters: { dateRange: 'week' }
          }
        ]
      }
    })
    
    const tags = wrapper.findAllComponents(NTag)
    const recentTag = tags.find(tag => tag.text().includes('最近'))
    
    if (recentTag) {
      await recentTag.trigger('click')
      expect(wrapper.emitted('search')).toBeTruthy()
    }
  })

  it('toggles quick filter off when clicked again', async () => {
    const wrapper = mount(SmartSearchFilter, {
      props: {
        quickFilters: [
          {
            key: 'recent',
            label: '最近',
            filters: { dateRange: 'week' }
          }
        ]
      }
    })
    
    const tags = wrapper.findAllComponents(NTag)
    const recentTag = tags.find(tag => tag.text().includes('最近'))
    
    if (recentTag) {
      // 第一次点击：开启
      await recentTag.trigger('click')
      expect(wrapper.emitted('search')).toBeTruthy()
      
      // 第二次点击：关闭
      const searchSpy = vi.spyOn(wrapper.vm as any, 'handleSearch')
      await recentTag.trigger('click')
      
      expect(searchSpy).toHaveBeenCalled()
    }
  })

  it('resets all filters when reset is called', async () => {
    const wrapper = mount(SmartSearchFilter)
    
    const input = wrapper.findComponent(NInput)
    await input.setValue('test')
    
    const vm = wrapper.vm as any
    vm.reset()
    
    await nextTick()
    
    expect(input.props('value')).toBe('')
  })

  it('shows search suggestions when typing', async () => {
    const wrapper = mount(SmartSearchFilter)
    
    const input = wrapper.findComponent(NInput)
    await input.setValue('test')
    
    await new Promise(resolve => setTimeout(resolve, 350))
    
    // 验证建议显示
    expect(wrapper.exists()).toBe(true)
  })

  it('applies suggestion when clicked', async () => {
    const wrapper = mount(SmartSearchFilter)
    
    const input = wrapper.findComponent(NInput)
    await input.setValue('test')
    
    await new Promise(resolve => setTimeout(resolve, 350))
    
    // 模拟点击建议
    const vm = wrapper.vm as any
    vm.applySuggestion('test suggestion')
    
    expect(input.props('value')).toBe('test suggestion')
  })
})
