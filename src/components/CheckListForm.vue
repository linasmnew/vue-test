<script setup lang="ts">
import { ref } from 'vue'
import type { CheckListBase } from '@/types/checkList'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps<{
  isLoading: boolean
  onSubmit: (formValues: CheckListBase) => Promise<void>
  error: Record<string, string[]> | undefined
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
          <div v-if="error?.date" class="error-message" data-test="error-message">
            <p v-for="error in error.date" :key="error">
              {{ error }}
            </p>
          </div>
        </div>
        <div class="form-group">
          <label for="status">Status</label>
          <select v-model="formValues.status" id="status" data-test="status-select" required>
            <option disabled selected value="">Select status</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
          <div v-if="error?.status" class="error-message" data-test="error-message">
            <p v-for="error in error.status" :key="error">
              {{ error }}
            </p>
          </div>
        </div>
        <div class="form-group">
          <label for="building">Building</label>
          <input
            v-model="formValues.building"
            type="text"
            id="building"
            placeholder="Building name"
            data-test="building-input"
            required
          />
          <div v-if="error?.building" class="error-message" data-test="error-message">
            <p v-for="error in error.building" :key="error">
              {{ error }}
            </p>
          </div>
        </div>
        <div class="form-group">
          <label for="inspector">Inspector</label>
          <input
            v-model="formValues.inspector"
            type="text"
            id="inspector"
            placeholder="Inspector name"
            data-test="inspector-input"
          />
          <div v-if="error?.inspector" class="error-message" data-test="error-message">
            <p v-for="error in error.inspector" :key="error">
              {{ error }}
            </p>
          </div>
        </div>
        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea
            v-model="formValues.notes"
            id="notes"
            data-test="notes-input"
            placeholder="Enter notes"
            required
          ></textarea>
          <div v-if="error?.notes" class="error-message" data-test="error-message">
            <p v-for="error in error.notes" :key="error">
              {{ error }}
            </p>
          </div>
        </div>
        <div class="form-group">
          <BaseButton
            type="submit"
            :loading="props.isLoading"
            label="Save"
            data-test="submit-button"
            primary
            size="medium"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
.form-group button {
  margin-top: 10px;
}
.form-group input,
.form-group select,
.form-group textarea {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}
.error-message {
  color: var(--color-error);
}
</style>
