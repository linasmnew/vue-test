<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    onClick?: () => void
    primary?: boolean
    secondary?: boolean
    naked?: boolean
    disabled?: boolean
    type?: 'button' | 'submit'
    dataTestId?: string
    loading?: boolean
  }>(),
  {
    type: 'button',
    dataTestId: 'button',
    loading: false,
  },
)

const buttonType = computed(() => {
  if (props.primary) return 'primary'
  if (props.secondary) return 'secondary'
  if (props.naked) return 'naked'
  return 'primary'
})

const handleClick = () => {
  if (props.onClick) {
    props.onClick()
  }
}
</script>

<template>
  <button
    class="button"
    :class="buttonType"
    :disabled="disabled || loading"
    :type="type"
    :data-test="dataTestId"
    @click="handleClick"
  >
    <span v-if="loading">Loading...</span>
    <span v-else>{{ label }}</span>
  </button>
</template>

<style scoped>
.button {
  border: none;
  cursor: pointer;
  padding: 5px 0;
  font-size: 1rem;
  padding: 10px;
  border-radius: 5px;
}
.button:disabled {
  opacity: 0.5;
  background: var(--color-button-disabled);
}
.button:disabled:hover {
  background: var(--color-button-disabled);
}
.primary {
  background: var(--color-primary);
  color: var(--color-button-text);
}
.primary:hover {
  background: var(--color-secondary);
}
.secondary {
  background: var(--color-secondary);
  color: var(--color-button-text);
}
.secondary:hover {
  background: var(--color-primary);
}
.naked {
  background: none;
  color: var(--color-primary);
}
</style>
