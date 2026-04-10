import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NText, NButton, NIcon, NSpin, NAlert } from 'naive-ui'
import DashboardCard from '@/components/charts/DashboardCard.vue'

describe('DashboardCard', () => {
  it('renders with title', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Card'
      }
    })
    
    expect(wrapper.findComponent(NText).text()).toContain('Test Card')
  })

  it('shows refresh button when showRefresh is true', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Card',
        showRefresh: true
      }
    })
    
    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('emits refresh event when refresh button clicked', async () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Card',
        showRefresh: true
      }
    })
    
    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    const refreshButton = buttons[0]
    
    await refreshButton.trigger('click')
    expect(wrapper.emitted('refresh')).toBeTruthy()
  })

  it('shows loading spinner when loading is true', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Card',
        loading: true
      }
    })
    
    expect(wrapper.findComponent(NSpin).exists()).toBe(true)
  })

  it('shows error alert when error is provided', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Card',
        error: 'Something went wrong'
      }
    })
    
    expect(wrapper.findComponent(NAlert).exists()).toBe(true)
    expect(wrapper.findComponent(NAlert).text()).toContain('Something went wrong')
  })

  it('renders default slot content', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Card'
      },
      slots: {
        default: '<div class="custom-content">Custom</div>'
      }
    })
    
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Custom')
  })
})
