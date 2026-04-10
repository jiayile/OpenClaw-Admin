import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NButton, NIcon } from 'naive-ui'
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue'

describe('ThemeSwitcher', () => {
  it('renders all theme buttons', () => {
    const wrapper = mount(ThemeSwitcher)
    
    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('sets default theme from props', () => {
    const wrapper = mount(ThemeSwitcher, {
      props: {
        defaultTheme: 'dark'
      }
    })
    
    const vm = wrapper.vm as any
    expect(vm.currentTheme).toBe('dark')
  })

  it('emits theme change event', async () => {
    const wrapper = mount(ThemeSwitcher)
    
    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    const darkButton = buttons.find(btn => btn.text().includes('暗色'))
    
    if (darkButton) {
      await darkButton.trigger('click')
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')?.[0]?.[0]).toBe('dark')
    }
  })

  it('saves theme to localStorage', async () => {
    const mockSetItem = vi.fn()
    Object.defineProperty(window.localStorage, 'setItem', {
      value: mockSetItem
    })
    
    const wrapper = mount(ThemeSwitcher)
    
    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    const darkButton = buttons.find(btn => btn.text().includes('暗色'))
    
    if (darkButton) {
      await darkButton.trigger('click')
      expect(mockSetItem).toHaveBeenCalledWith('app-theme', 'dark')
    }
  })

  it('loads theme from localStorage on mount', () => {
    const mockGetItem = vi.fn(() => 'dark')
    Object.defineProperty(window.localStorage, 'getItem', {
      value: mockGetItem
    })
    
    mount(ThemeSwitcher)
    
    expect(mockGetItem).toHaveBeenCalledWith('app-theme')
  })

  it('applies theme to document', async () => {
    const wrapper = mount(ThemeSwitcher)
    
    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    const darkButton = buttons.find(btn => btn.text().includes('暗色'))
    
    if (darkButton) {
      await darkButton.trigger('click')
      
      const html = document.documentElement
      expect(html.getAttribute('data-theme')).toBe('dark')
    }
  })

  it('toggles theme class on document', async () => {
    const wrapper = mount(ThemeSwitcher)
    
    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    
    // 切换到暗色
    const darkButton = buttons.find(btn => btn.text().includes('暗色'))
    if (darkButton) {
      await darkButton.trigger('click')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    }
    
    // 切换到亮色
    const lightButton = buttons.find(btn => btn.text().includes('亮色'))
    if (lightButton) {
      await lightButton.trigger('click')
      expect(document.documentElement.classList.contains('light')).toBe(true)
    }
  })

  it('exposes getTheme and setTheme methods', () => {
    const wrapper = mount(ThemeSwitcher)
    
    const vm = wrapper.vm as any
    expect(typeof vm.getTheme).toBe('function')
    expect(typeof vm.setTheme).toBe('function')
  })
})
