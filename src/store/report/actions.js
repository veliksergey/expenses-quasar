import {api} from 'boot/axios';

export async function getTables (store) {
  store.commit('setIsLoading', true);

  // filters
  // const filtersObj = {};
  let qryString = '';
  const strFilters = store.state.filters;
  Object.keys(strFilters).forEach(item => {
    if (strFilters[item]) {
      if (typeof strFilters[item] === 'string') qryString += `${item}=${strFilters[item]}&`; // if value in filter is string (date, type, etc)\
      else if (typeof strFilters[item] === 'boolean') qryString += `${item}=${strFilters[item] ? 'true' : 'false'}&`;
      else if (strFilters[item].id) qryString += `${item}Id=${strFilters[item].id}&`; // if value is an object (account, category, etc) {id: 0, name: ''}
    }
  });
  // const filters = JSON.stringify(filtersObj);

  // const params = new URLSearchParams(filters);

  try {
    const res = await api.get(`/report?${qryString}`);
    const tables = res.data;

    store.commit('setTables', tables);
    store.commit('setIsLoading', false);
  } catch (err) {
    console.error(err);
    store.commit('setTables', {});
    store.commit('setIsLoading', false);
  }
}
