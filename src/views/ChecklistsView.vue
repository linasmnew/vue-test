<script setup lang="ts">
import { useCheckListsStore } from '../stores/checkLists'
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import CheckList from '@/components/CheckList.vue'

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
  <div class="checklists">
    <div class="checklists-header">
      <div>
        <button data-test="add-checklist-button" @click="handleNewCheckListClick">
          Add check list
        </button>
      </div>
      <div class="filter-container">
        <label class="filter-label" for="status">Filter by status:</label>
        <select id="status" data-test="status-filter" v-model="selectedStatus">
          <option value="">All</option>
          <option value="Pass">Pass</option>
          <option value="Fail">Fail</option>
        </select>
      </div>
    </div>
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
  margin-right: 0.5rem;
}

.checklist {
  cursor: pointer;
}

.status-label-pass {
  color: green;
}

.status-label-fail {
  color: red;
}
button {
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  background-color: #184f91;
  color: white;
}
button:hover {
  background-color: #5ab031;
}
</style>
