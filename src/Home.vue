<template>
  <section class="relative z-10 max-w-3xl mx-auto px-8 pt-28 pb-24">
        <Badge variant="outline" class="mb-8 font-mono text-xs tracking-widest uppercase">
          PERT-based estimation
        </Badge>

        <h1 class="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
          Stop guessing.<br />
          <span class="text-primary">Start calculating.</span>
        </h1>

        <p class="text-muted-foreground text-base leading-relaxed max-w-xl mb-12">
          Man-Hours Calculator replaces instinct-based project quotes with
          <strong class="text-foreground font-medium">structured, statistical estimates</strong>
          — so you commit to timelines you can actually defend.
        </p>

        <Button size="lg" class="gap-2 font-mono group" @click="goToDemo">
          Get Started
          <ArrowRight class="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
        </Button>
      </section>

      <!-- ── How it works ── -->
      <section class="relative z-10 max-w-3xl mx-auto px-8 pb-24">
        <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-10">
          How it works
        </p>

        <div class="flex flex-col">
          <template v-for="(step, i) in steps" :key="step.num">
            <div class="grid grid-cols-[48px_1fr] gap-x-5 gap-y-1 py-7">
              <!-- Step number -->
              <span class="font-mono text-xs text-primary tracking-wider pt-0.5 row-span-2">
                {{ step.num }}
              </span>
              <!-- Title -->
              <h3 class="text-sm font-semibold text-foreground tracking-tight">
                {{ step.title }}
              </h3>
              <!-- Description with optional inline code -->
              <p class="text-sm text-muted-foreground leading-relaxed">
                <template v-if="step.code">
                  {{ step.description.split(step.code)[0] }}
                  <code
                    class="font-mono text-xs text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-sm">
                    {{ step.code }}
                  </code>
                  {{ step.description.split(step.code)[1] }}
                </template>
                <template v-else>
                  {{ step.description }}
                </template>
              </p>
            </div>
            <Separator v-if="i < steps.length - 1" />
          </template>
        </div>
      </section>

      <!-- ── Why it matters ── -->
      <section class="relative z-10 max-w-3xl mx-auto px-8 pb-24">
        <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-10">
          Why it matters
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card v-for="card in whyCards" :key="card.title"
            class="bg-card border-border transition-colors duration-200 hover:border-primary/30">
            <CardHeader class="pb-2">
              <component :is="card.icon" class="w-5 h-5 text-primary mb-3" :stroke-width="1.5" />
              <CardTitle class="text-sm font-semibold leading-snug">
                {{ card.title }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription class="text-xs leading-relaxed">
                {{ card.description }}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <!-- ── Bottom CTA ── -->
      <section class="relative z-10 max-w-3xl mx-auto px-8 pb-28">
        <Separator class="mb-14" />

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <p class="text-xl font-semibold tracking-tight">
            Ready to build your first estimate?
          </p>
          <Button variant="outline" class="gap-2 font-mono shrink-0 group" @click="goToDemo">
            Open the Calculator
            <ArrowRight class="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
          </Button>
        </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Shield, Clock, BarChart2, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const goToDemo = () => router.push('/demo')

const steps = [
  {
    num: '01',
    title: 'Three-point input',
    description: 'For every task, provide three estimates: Optimistic (best case), Most Likely (realistic), and Pessimistic (worst case). No more single-number guesses that silently ignore risk.',
  },
  {
    num: '02',
    title: 'PERT calculates your expected duration',
    description: 'The system applies a weighted formula — E = (O + 4M + P) / 6 — that anchors the estimate around your most informed guess while still factoring in the extremes.',
    code: 'E = (O + 4M + P) / 6',
  },
  {
    num: '03',
    title: 'Variance reveals what to worry about',
    description: "Each task produces a variance score. High variance signals wide uncertainty — the gap between best and worst case is large enough to shift the whole project. Low variance means you know what you're dealing with.",
  },
  {
    num: '04',
    title: 'Project-level confidence at a glance',
    description: "Task variances accumulate into a single completion probability. You'll know whether your deadline is a safe bet or an optimistic stretch — before you quote it to a client.",
  },
]

const whyCards = [
  {
    icon: Shield,
    title: 'Eliminates estimation debt',
    description: 'Optimistic quotes that miss deadlines erode trust and eat into margins. Data-driven estimates create a paper trail that protects both parties.',
  },
  {
    icon: Clock,
    title: 'Real-time feedback as you estimate',
    description: "All calculations update live. Spot when a task's variance is unusually high and revisit the scope before it becomes a problem downstream.",
  },
  {
    icon: BarChart2,
    title: 'Communicates uncertainty honestly',
    description: 'Confidence intervals turn vague gut feelings into concrete probability ranges — language that clients, managers, and stakeholders can actually act on.',
  },
]
</script>
