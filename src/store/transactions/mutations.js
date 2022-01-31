import defaultTransaction from './defaultTransaction';

export function setListAndTotal (state, {list, total}) {
  state.list = list;
  state.total = total;
}

export function setSelectedTransaction (state, payload) {
  state.selectedTransaction = payload ? {...payload} : {...defaultTransaction};
}

export function setDialog (state, payload) {
  state.dialog = !!payload;
}

export function setIsLoading (state, payload) {
  state.isLoading = !!payload;
}

export function setIsSaving (state, payload) {
  state.isSaving = !!payload;
}

export function updateTransactionInList(state, payload) {
  let idx = state.list.findIndex(t => t.id === payload.id);
  if (idx > -1) state.list[idx] = payload;
  else state.list.unshift(payload);
}

export function removeTransactionFromList(state, payload) {
  const idx = state.list.findIndex(t => t.id === payload.id);
  if (idx < 0) return;
  state.list.splice(idx, 1);
}

export function updateSelectedTransaction(state, payload) {
  Object.assign(state.selectedTransaction, payload);
}

export function updateItemInSelectedTransaction(state, {type, item}) {
  Object.assign(state.selectedTransaction, {[type]: item});
}
