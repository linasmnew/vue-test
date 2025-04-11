import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCheckList, getCheckLists, createCheckList as createCheckListApi } from '../services/api'
import type { CheckList } from '../types/checkList'

export const useCheckListsStore = defineStore('checkLists', () => {
  const checkLists = ref<CheckList[]>([])
  const checkList = ref<CheckList | null>(null)
  const error = ref<Record<string, string[]> | null>(null)
  const isLoading = ref(false)

  const fetchCheckLists = async (filters: Record<string, string> = {}) => {
    isLoading.value = true
    try {
      const response = await getCheckLists(filters)
      checkLists.value = response
      error.value = null
    } catch (err) {
      error.value = {
        message: err.message,
        details: err.details,
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchCheckList = async (id: number) => {
    if (checkList.value && checkList.value.id === id) {
        return checkList.value
    }

    isLoading.value = true
    try {
      const response = await getCheckList(id)
      checkList.value = response
      error.value = null
    } catch (err) {
      error.value = {
        message: err.message,
        details: err.details,
      }
    } finally {
      isLoading.value = false
    }
  }

  const createCheckList = async (checkList: CheckList) => {
    isLoading.value = true
    try {
      const response = await createCheckListApi(checkList)
      checkLists.value.push(response)
      error.value = null
    } catch (err) {
      error.value = {
        message: err.message,
        details: err.details,
      }
    } finally {
      isLoading.value = false
    }
  }

  return { checkLists, checkList, error, isLoading, fetchCheckLists, fetchCheckList, createCheckList }
})
