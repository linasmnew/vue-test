<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useCheckListsStore } from '../stores/checkLists'
import CheckList from '@/components/CheckList.vue'
import BaseButton from '@/components/BaseButton.vue'

const route = useRoute()
const selectedStatus = ref('')
const store = useCheckListsStore()
const router = useRouter()
const { checkLists, isLoading, error } = storeToRefs(store)
const { fetchCheckLists } = store

watch(selectedStatus, (newValue) => {
  const filters = newValue ? { status: newValue } : {}

  router.push({
    path: route.path,
    query: newValue ? { status: newValue } : {},
  })

  fetchCheckLists(filters)
})

const handleCheckListClick = (id: number) => {
  router.push(`/checklists/${id}`)
}

const handleNewCheckListClick = () => {
  router.push('/checklists/new')
}

onMounted(() => {
  if (route.query.status) {
    selectedStatus.value = route.query.status as string
  } else {
    fetchCheckLists()
  }
})
</script>

<template>
  <div class="container">
    <div class="checklists-header">
      <BaseButton
        size="medium"
        label="Add check list"
        :onClick="handleNewCheckListClick"
        data-test="add-checklist-button"
        primary
      />
      <div class="filter-container">
        <label class="filter-label" for="status">Filter by status:</label>
        <select id="status" data-test="status-filter" v-model="selectedStatus">
          <option value="">All</option>
          <option value="Pass">Pass</option>
          <option value="Fail">Fail</option>
        </select>
      </div>
    </div>
    <div class="checklists-container">
      <div v-if="isLoading" data-test="loading-indicator">Loading...</div>
      <div v-else-if="error" data-test="error-message">Error: {{ error.message }}</div>
      <div v-else data-test="checklists-container">
        <CheckList
          v-for="checkList in checkLists"
          :key="checkList.id"
          :checkList="checkList"
          data-test="checklist-item"
          @click="handleCheckListClick(checkList.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.checklists-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filter-container {
  display: flex;
  justify-content: flex-end;
}
.filter-label {
  padding-right: 0.5rem;
}
.checklists-container {
  margin-top: 20px;
}
.checklist {
  cursor: pointer;
}
</style>
