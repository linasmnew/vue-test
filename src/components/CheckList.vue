<script setup lang="ts">
import type { CheckList } from '@/types/checkList'

const props = defineProps<{
  checkList: CheckList
  onClick?: (id: number) => void
}>()

const handleClick = () => {
  if (props.onClick) {
    props.onClick(props.checkList.id)
  }
}
</script>

<template>
  <div data-test="checklist" class="checklist" @click="handleClick">
    <p><span class="checklist-label">Date:</span>{{ checkList.date }}</p>
    <p>
      <span class="checklist-label">Status:</span>
      <span
        :class="{
          'status-label-pass': checkList.status === 'Pass',
          'status-label-fail': checkList.status === 'Fail',
        }"
      >
        {{ checkList.status }}
      </span>
    </p>
    <p><span class="checklist-label">Building:</span>{{ checkList.building }}</p>
    <p v-if="checkList.inspector">
      <span class="checklist-label">Inspector:</span>{{ checkList.inspector }}
    </p>
    <p v-if="checkList.notes"><span class="checklist-label">Notes:</span>{{ checkList.notes }}</p>
  </div>
</template>

<style scoped>
.checklist {
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.03);
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
}
.checklist:last-child {
  margin-bottom: 0;
}
.checklist-label {
  padding-right: 5px;
}
.status-label-pass {
  color: var(--color-success);
}
.status-label-fail {
  color: var(--color-error);
}
</style>
