<script setup lang="ts">
import { useCheckListsStore } from '../stores/checkLists'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import CheckList from '@/components/CheckList.vue'

const store = useCheckListsStore()
const router = useRouter()
const route = useRoute()
const { isLoading, error, checkList } = storeToRefs(store)
const { fetchCheckList } = store

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/checklists')
  }
}

fetchCheckList(Number(route.params.id))
</script>

<template>
  <button class="back-button" data-test="back-button" @click="goBack">← Go back</button>
  <div v-if="isLoading" data-test="loading-indicator">Loading...</div>
  <div v-else-if="error" data-test="error-message">Error: {{ error.message }}</div>
  <div v-else>
    <CheckList :checkList="checkList" data-test="checklist-detail" />
  </div>
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
