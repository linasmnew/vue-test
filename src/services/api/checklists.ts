import type { CheckListBase } from '@/types/checkList';
import { fetchJSON, postJSON } from '../fetchUtil';

const getCheckLists = async (filters: Record<string, string>) => {
  const filterParams = Object.keys(filters).length > 0 ? `?${new URLSearchParams(filters)}` : '';

  return fetchJSON(`/checklists${filterParams}`);
};

const getCheckList = async (id: number) => {
  return fetchJSON(`/checklists/${id}`);
};

const createCheckList = async (checkList: CheckListBase) => {
  return postJSON('/checklists', checkList);
};

export { getCheckLists, getCheckList, createCheckList };
