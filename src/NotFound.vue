<template>
    <div
        class="relative z-10 flex flex-col items-start justify-center min-h-[calc(100vh-4rem)] max-w-3xl mx-auto px-8 py-28">

        <!-- Error code -->
        <Badge variant="outline" class="mb-8 font-mono text-xs tracking-widest uppercase">
            Error
        </Badge>

        <!-- Giant 404 -->
        <div class="relative mb-6 select-none">
            <span class="font-mono text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-border">
                404
            </span>
            <span
                class="absolute inset-0 flex items-center font-mono text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-transparent"
                style="-webkit-text-stroke: 1px hsl(var(--primary) / 0.3)">
                404
            </span>
        </div>

        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.08] mb-6">
            Page not found.<br />
            <span class="text-primary">Wrong estimate.</span>
        </h1>

        <p class="text-muted-foreground text-base leading-relaxed max-w-xl mb-10">
            The route you're looking for doesn't exist — Let's get you back on track.
        </p>

        <Separator class="mb-10 max-w-xl w-full" />

        <div class="flex items-center gap-6">
            <Button size="lg" class="gap-2 font-mono group" @click="goHome">
                Back to Home
                <ArrowRight class="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </Button>

            <Button variant="outline" size="lg" class="gap-2 font-mono group" @click="goDemo">
                Open Calculator
                <ArrowRight class="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </Button>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const goHome = () => router.push('/')
const goDemo = () => router.push('/demo')
</script>