import {api} from 'boot/axios';

export async function getList (store, {page, rowsPerPage, sortBy, descending, filter}) {
  store.commit('setIsLoading', true);
  // store.commit('setListAndTotal', {list: [], total: 0});

  // build url query
  const params = new URLSearchParams({
    page, rowsPerPage, sortBy, descending, filter
  });

  try {
    const res = await api.get(`/transactions?${params.toString()}`);
    const {result, total} = res.data;

    store.commit('setListAndTotal', {list: result, total});
    store.commit('setIsLoading', false);

  } catch (err) {
    console.error(err);
    store.commit('setListAndTotal', {list: [], total: 0});
    store.commit('setIsLoading', true);
  }
}

function prepareTransactionForBackEnd(trans) {
  const {type, name, amount, relatedAmount, date, relatedDate, nonTaxable, notes,
    fileName, fileInTemp, project, vendor} = trans;
  const transToReturn = {
    type, name, amount, relatedAmount, date, relatedDate, nonTaxable, notes,
    fileName, fileInTemp,
    project, vendor,
    accountId: trans.account?.id || null,
    categoryId: trans.category?.id || null,
    personId: trans.person?.id || null,
    projectId: trans.project?.id || null,
    vendorId: trans.vendor?.id || null,
  };
  if (trans.id) transToReturn.id = trans.id;
  return transToReturn;
}

export async function saveTransaction (store, {transaction}) {
  store.commit('setIsSaving', true);

  const transToSave = prepareTransactionForBackEnd(transaction);

  try {

    const res = transToSave.id
      ? await api.put(`transactions/${transToSave.id}`, transToSave)
      : await api.post('transactions', transToSave);
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
