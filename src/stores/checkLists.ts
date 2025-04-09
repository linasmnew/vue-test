import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCheckList, getCheckLists, createCheckList as createCheckListApi } from '../services/api'
import type { CheckList } from '../types/checkList'

export const useCheckListsStore = defineStore('checkLists', () => {
  const checkLists = ref<CheckList[]>([])
  const checkList = ref<CheckList | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(false)

  const fetchCheckLists = async (filters: Record<string, string> = {}) => {
    isLoading.value = true
    try {
      const response = await getCheckLists(filters)
      checkLists.value = response
    } catch (err) {
      if (err instanceof Error) {
        error.value = err
      } else {
        error.value = new Error('An unknown error occurred')
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
    } catch (err) {
      if (err instanceof Error) {
        error.value = err
      } else {
        error.value = new Error('An unknown error occurred')
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
    } catch (err) {
      if (err instanceof Error) {
        error.value = err
      } else {
        error.value = new Error('An unknown error occurred')
      }
    } finally {
      isLoading.value = false
    }
  }

  return { checkLists, checkList, error, isLoading, fetchCheckLists, fetchCheckList, createCheckList }
})
