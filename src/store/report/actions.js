import {api} from 'boot/axios';

export async function getTables (store, {projectId, groupBy}) {
  store.commit('setIsLoading', true);

  if (!groupBy) groupBy = '';

  const params = new URLSearchParams({projectId, groupBy});

  try {
    const res = await api.get(`/report?${params.toString()}`);
    const tables = res.data;

    store.commit('setTables', tables);
    store.commit('setIsLoading', false);
  } catch (err) {
    console.error(err);
    store.commit('setTables', {});
    store.commit('setIsLoading', false);
  }
}
