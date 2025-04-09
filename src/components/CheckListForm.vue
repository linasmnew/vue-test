<script setup lang="ts">
import { ref } from 'vue'
import type { CheckListBase } from '@/types/checkList'

const props = defineProps<{
  isLoading: boolean
  onSubmit: (formValues: CheckListBase) => Promise<void>
}>()

const formValues = ref({
  date: '',
  status: '',
  building: '',
  inspector: '',
  notes: '',
})

const handleCheckListSubmit = async () => {
  await props.onSubmit(formValues.value)
}
</script>

<template>
  <div class="checklists">
    <div>
      <form @submit.prevent="handleCheckListSubmit" data-test="checklist-form">
        <div class="form-group">
          <label for="date">Date</label>
          <input v-model="formValues.date" type="date" id="date" data-test="date-input" required />
        </div>
        <div class="form-group">
          <label for="status">Status</label>
          <select v-model="formValues.status" id="status" data-test="status-select" required>
            <option disabled selected value="">Select status</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </div>
        <div class="form-group">
          <label for="building">Building</label>
          <input
            v-model="formValues.building"
            type="text"
            id="building"
            data-test="building-input"
            required
          />
        </div>
        <div class="form-group">
          <label for="inspector">Inspector</label>
          <input
            v-model="formValues.inspector"
            type="text"
            id="inspector"
            data-test="inspector-input"
            required
          />
        </div>
        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea
            v-model="formValues.notes"
            id="notes"
            data-test="notes-input"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <button type="submit" data-test="submit-button" :disabled="props.isLoading">
            <span v-if="props.isLoading">Saving...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.checklists a {
  text-decoration: none;
  color: #184f91;
}
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
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
.form-group input,
.form-group select,
.form-group textarea {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}
.form-group button {
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  background-color: #184f91;
  color: white;
}
.form-group button:hover {
  background-color: #5ab031;
}
.form-group button:disabled {
  cursor: not-allowed;
}
</style>
