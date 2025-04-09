<script setup lang="ts">
import { useCheckListsStore } from '../stores/checkLists'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import CheckListForm from '@/components/CheckListForm.vue'
import type { CheckListBase } from '@/types/checkList'

const store = useCheckListsStore()
const router = useRouter()
const { isLoading, error } = storeToRefs(store)
const { createCheckList } = store

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/checklists')
  }
}

const handleCreateCheckList = async (formValues: CheckListBase) => {
  await createCheckList(formValues)
  router.push('/checklists')
}
</script>

<template>
  <button class="back-button" data-test="back-button" @click="goBack">← Go back</button>
  <CheckListForm :isLoading="isLoading" :onSubmit="handleCreateCheckList" />
  <div v-if="error" data-test="error-message">Error: {{ error.message }}</div>
</template>

<style scoped>
.back-button {
  background: none;
  border: none;
  color: #184f91;
  cursor: pointer;
  padding: 5px 0;
  font-size: 0.9rem;
  text-align: left;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
