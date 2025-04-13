<script setup lang="ts">
import { computed } from 'vue'
import IconSpinner from './icons/IconSpinner.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    onClick?: () => void
    primary?: boolean
    secondary?: boolean
    naked?: boolean
    disabled?: boolean
    type?: 'button' | 'submit'
    dataTestId?: string
    loading?: boolean
    size?: 'small' | 'medium' | 'large'
  }>(),
  {
    label: 'Submit',
    type: 'button',
    dataTestId: 'button',
    loading: false,
    size: 'medium',
  },
)

const buttonType = computed(() => {
  if (props.primary) return 'primary'
  if (props.secondary) return 'secondary'
  if (props.naked) return 'naked'
  return 'primary'
})

const buttonSize = computed(() => {
  if (props.size === 'small') return 'small'
  if (props.size === 'medium') return 'medium'
  if (props.size === 'large') return 'large'
  return 'small'
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
    :class="[buttonType, `button-size-${buttonSize}`]"
    :disabled="disabled || loading"
    :type="type"
    :data-test="dataTestId"
    @click="handleClick"
  >
    <span v-if="loading">
      <IconSpinner width="14" height="14" />
    </span>
    <span v-else>{{ label }}</span>
  </button>
</template>

<style scoped>
.button {
  border: none;
  cursor: pointer;
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
.button-size-small {
  padding: 5px 10px;
  font-size: 1rem;
}
.button-size-medium {
  padding: 10px 20px;
  font-size: 1.1rem;
}
.button-size-large {
  padding: 15px 30px;
  font-size: 1.2rem;
}
</style>
