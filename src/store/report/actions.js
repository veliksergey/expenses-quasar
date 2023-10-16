import {api} from 'boot/axios';

export async function getTables (store) {
  store.commit('setIsLoading', true);

  // filters
  // const filtersObj = {};
  let qryString = '';
  const strFilters = store.state.filters;
  Object.keys(strFilters).forEach(item => {
    const fItem = strFilters[item];
    if (fItem) {
      if (typeof fItem === 'string' || typeof fItem === 'number') qryString += `${item}=${fItem}&`; // if value in filter is string (date, type, etc)\
      else if (typeof fItem === 'boolean') qryString += `${item}=${fItem ? 'true' : 'false'}&`;
      else if (fItem.id) qryString += `${item}Id=${fItem.id}&`; // if value is an object (account, category, etc) {id: 0, name: ''}
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
