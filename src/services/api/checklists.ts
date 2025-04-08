import { fetchJSON } from '../fetchUtil';

const getChecklists = async () => {
  const response = await fetchJSON('/checklists');
  return response;
};

const getChecklist = async (id: string) => {
  const response = await fetchJSON(`/checklists/${id}`);
  return response;
};

export { getChecklists, getChecklist };
