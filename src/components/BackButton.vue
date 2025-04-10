<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'

const props = withDefaults(
  defineProps<{
    label: string
    path: string
  }>(),
  {
    label: '← Go back',
    path: '/',
  },
)

const router = useRouter()

const handleBackButtonClick = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push(props.path)
  }
}
</script>

<template>
  <BaseButton :label="label" :onClick="handleBackButtonClick" data-test="back-button" naked />
</template>

<style scoped>
.back-button {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: 5px 0;
  font-size: 1rem;
}
</style>
