import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, reactive } from 'vue'
import type { Component } from 'vue'
import type { PERTTaskResult } from '@/types'
import TaskTable from '../TaskTable.vue'
import TaskListMobile from '../TaskListMobile.vue'

const stubs = {
  VueDraggable: { template: '<div><slot /></div>' },
  NumberField: { template: '<div><slot /></div>' },
  NumberFieldContent: { template: '<div><slot /></div>' },
  NumberFieldInput: true,
  HoverCard: { template: '<div><slot /></div>' },
  HoverCardTrigger: { template: '<div><slot /></div>' },
  HoverCardContent: true,
  Separator: true,
}

function makeTask(overrides: Partial<PERTTaskResult> = {}): PERTTaskResult {
  return {
    taskName: 'Task A',
    milestone: 'Milestone 1',
    description: 'First task',
    optimistic: 1,
    mostLikely: 2,
    pessimistic: 3,
    expectedTime: 2,
    standardDeviation: 0.333,
    variance: 0.111,
    ...overrides,
  }
}

function mountTaskList(component: Component, tasks: PERTTaskResult[]) {
  return mount(component, {
    props: { tasks },
    global: { stubs },
  })
}

const taskLists: [string, Component][] = [
  ['TaskTable', TaskTable],
  ['TaskListMobile', TaskListMobile],
]

describe.each(taskLists)('%s', (_name, component) => {
  it('should render one entry per task', () => {
    const tasks = reactive([makeTask()])

    const wrapper = mountTaskList(component, tasks)

    expect(wrapper.text()).toContain('Task A')
    expect(wrapper.text()).not.toContain('Task B')
  })

  it('should render a task appended to the tasks array in place', async () => {
    const tasks = reactive([makeTask()])

    const wrapper = mountTaskList(component, tasks)

    tasks.push(makeTask({ taskName: 'Task B' }))
    await nextTick()

    expect(wrapper.text()).toContain('Task A')
    expect(wrapper.text()).toContain('Task B')
  })

  it('should stop rendering a task removed from the tasks array in place', async () => {
    const tasks = reactive([makeTask(), makeTask({ taskName: 'Task B' })])

    const wrapper = mountTaskList(component, tasks)

    tasks.splice(0, 1)
    await nextTick()

    expect(wrapper.text()).not.toContain('Task A')
    expect(wrapper.text()).toContain('Task B')
  })

  it('should render an updated task name when the task object is mutated in place', async () => {
    const tasks = reactive([makeTask()])

    const wrapper = mountTaskList(component, tasks)

    tasks[0].taskName = 'Renamed Task'
    await nextTick()

    expect(wrapper.text()).toContain('Renamed Task')
  })
})
