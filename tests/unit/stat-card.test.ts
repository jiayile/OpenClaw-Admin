import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NIcon } from 'naive-ui'
import { SunnyOutline, MoonOutline } from '@vicons/ionicons5'
import StatCard from '@/components/charts/StatCard.vue'

describe('StatCard', () => {
  it('renders with icon, value, and label', () => {
    const wrapper = mount(StatCard, {
      props: {
        icon: SunnyOutline,
        value: 1234,
        label: 'Total Users'
      }
    })
    
    expect(wrapper.findComponent(NIcon).exists()).toBe(true)
    expect(wrapper.text()).toContain('1,234')
    expect(wrapper.text()).toContain('Total Users')
  })

  it('formats large numbers with commas', () => {
    const wrapper = mount(StatCard, {
      props: {
        icon: SunnyOutline,
        value: 1234567,
        label: 'Revenue'
      }
    })
    
    expect(wrapper.text()).toContain('1,234,567')
  })

  it('shows positive trend when trend > 0', () => {
    const wrapper = mount(StatCard, {
      props: {
        icon: SunnyOutline,
        value: 100,
        label: 'Sales',
        trend: 15
      }
    })
    
    expect(wrapper.text()).toContain('15%')
    expect(wrapper.find('.up').exists()).toBe(true)
  })

  it('shows negative trend when trend < 0', () => {
    const wrapper = mount(StatCard, {
      props: {
        icon: MoonOutline,
        value: 100,
        label: 'Churn',
        trend: -5
      }
    })
    
    expect(wrapper.text()).toContain('5%')
    expect(wrapper.find('.down').exists()).toBe(true)
  })

  it('does not show trend when trend is null', () => {
    const wrapper = mount(StatCard, {
      props: {
        icon: SunnyOutline,
        value: 100,
        label: 'Stable',
        trend: null
      }
    })
    
    expect(wrapper.find('.up').exists()).toBe(false)
    expect(wrapper.find('.down').exists()).toBe(false)
  })

  it('applies custom icon background and color', () => {
    const wrapper = mount(StatCard, {
      props: {
        icon: SunnyOutline,
        value: 100,
        label: 'Test',
        iconBg: '#ff0000',
        iconColor: '#ffffff'
      }
    })
    
    const icon = wrapper.find('.stat-icon')
    expect(icon.attributes('style')).toContain('#ff0000')
  })

  it('handles zero value correctly', () => {
    const wrapper = mount(StatCard, {
      props: {
        icon: SunnyOutline,
        value: 0,
        label: 'Count'
      }
    })
    
    expect(wrapper.text()).toContain('0')
  })

  it('handles negative value correctly', () => {
    const wrapper = mount(StatCard, {
      props: {
        icon: MoonOutline,
        value: -50,
        label: 'Balance'
      }
    })
    
    expect(wrapper.text()).toContain('-50')
  })
})
