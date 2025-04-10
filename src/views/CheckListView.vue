<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useCheckListsStore } from '../stores/checkLists'
import CheckList from '@/components/CheckList.vue'
import BackButton from '@/components/BackButton.vue'

const store = useCheckListsStore()
const route = useRoute()
const { isLoading, error, checkList } = storeToRefs(store)
const { fetchCheckList } = store

fetchCheckList(Number(route.params.id))
</script>

<template>
  <div class="checklist-container">
    <div class="back-button-container">
      <BackButton path="/checklists" />
    </div>
    <div v-if="isLoading" data-test="loading-indicator">Loading...</div>
    <div v-else-if="error" data-test="error-message">Error: {{ error.message }}</div>
    <div v-else>
      <CheckList :checkList="checkList" data-test="checklist-detail" />
    </div>
  </div>
</template>

<style scoped>
.checklist-container {
  margin-top: 20px;
}
.back-button-container {
  margin-bottom: 10px;
}
</style>
