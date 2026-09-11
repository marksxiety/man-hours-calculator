import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useProjectsView } from '../useProjectsView'

const Host = defineComponent({
  setup() {
    return useProjectsView()
  },
  template: '<div />',
})

describe('useProjectsView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should default to grid when nothing is stored', () => {
    const wrapper = mount(Host)
    expect(wrapper.vm.view).toBe('grid')
  })

  it('should persist view on setView and restore on mount', () => {
    const wrapper = mount(Host)
    wrapper.vm.setView('table')

    expect(localStorage.getItem('man-hours-projects-view')).toBe('table')

    const restored = mount(Host)
    expect(restored.vm.view).toBe('table')
  })

  it('should fall back to grid on invalid stored value', () => {
    localStorage.setItem('man-hours-projects-view', 'banana')
    const wrapper = mount(Host)
    expect(wrapper.vm.view).toBe('grid')
  })
})
