<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test Card</CardTitle>
        <CardDescription>Shadcn Vue components are working!</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is a test to verify that shadcn-vue components are properly configured.</p>
      </CardContent>
      <CardFooter>
        <Button>Click Me</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script>
