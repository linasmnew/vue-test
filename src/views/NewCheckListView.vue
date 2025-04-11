<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCheckListsStore } from '../stores/checkLists'
import CheckListForm from '@/components/CheckListForm.vue'
import type { CheckListBase } from '@/types/checkList'
import BackButton from '@/components/BackButton.vue'

const store = useCheckListsStore()
const router = useRouter()
const { isLoading, error } = storeToRefs(store)
const { createCheckList } = store

const handleCreateCheckList = async (formValues: CheckListBase) => {
  await createCheckList(formValues)
  if (!error.value) {
    router.replace('/checklists')
  }
}
</script>

<template>
  <div class="back-button-container">
    <BackButton path="/checklists" />
  </div>
  <CheckListForm :error="error?.details" :isLoading="isLoading" :onSubmit="handleCreateCheckList" />
  <div v-if="error" class="error-message" data-test="error-message">{{ error.message }}</div>
</template>

<style scoped>
.back-button-container {
  margin-bottom: 10px;
}
.error-message {
  color: var(--color-error);
}
</style>
