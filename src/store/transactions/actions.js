import {api} from 'boot/axios';

export async function getList (store, {search}) {
  store.commit('setListAndTotal', {list: [], total: 0});

  try {
    const res = await api.get('/transactions');
    const {result, total} = res.data;

    store.commit('setListAndTotal', {list: result, total});

  } catch (err) {
    console.error(err);
  }
}
