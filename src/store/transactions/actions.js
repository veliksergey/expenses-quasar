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

function transformTransaction(trans) {
  const {name, amount, relatedAmount, date, relatedDate, nonTaxable, notes,
    fileName, fileInTemp, project, vendor} = trans;
  const transToReturn = {
    name, amount, relatedAmount, date, relatedDate, nonTaxable, notes, fileName, fileInTemp,
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

  const transToSave = transformTransaction(transaction);
  console.log('-- transToSave:', transToSave);

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
