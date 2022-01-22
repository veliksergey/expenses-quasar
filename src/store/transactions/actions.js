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

export async function saveTransaction (store, {transaction}) {
  store.commit('setIsSaving', true);

  if (!transaction.id) delete transaction.id;

  try {

    const res = transaction.id
      ? await api.put(`transactions/${transaction.id}`, transaction)
      : await api.post('transactions', transaction);
    const data = res.data;

    if (data.errMsg) {
      alert(data.errMsg);
      throw new Error(data.errMsg);
    }

    store.commit('updateTransactionInList', data);
    store.commit('setIsSaving', false);
    store.commit('setDialog', false);

  } catch (err) {
    console.error(err);
    store.commit('setIsSaving', false);
  }
}

export async function deleteTransaction (store, {transaction}) {
  if (!transaction || !transaction.id) return;
  try {

    const res = await api.delete(`transactions/${transaction.id}`);
    const data = res.data;

    if (data.deleted) {
      store.commit('removeTransactionFromList', transaction);
    }

  } catch (err) {
    console.error(err);
    store.dispatch('getList');
  }
}
