import {defaultFilters, defaultTransaction} from './defaultTransaction';

export function setListAndTotal (state, {list, total}) {
  state.list = list;
  state.total = total;
}

export function setSelectedTransaction (state, payload) {
  if (payload){
    state.selectedTransaction = {...payload};
    return;
  }

  const lastSavedTrans = localStorage.getItem('lastSavedTransaction');
  const lastSavedDate = lastSavedTrans ? JSON.parse(lastSavedTrans)?.date || null : null;
  const transToSave = {...defaultTransaction};
  if (lastSavedDate) transToSave.date = lastSavedDate;
  state.selectedTransaction = {...transToSave};
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

// filters
export function setFilters (state, payload) {
  state.filters = {...defaultFilters, payload};
}
/*export function updateFilters(state, payload) {
  Object.assign(state.filters, payload);
}*/
export function updateItemInFilters(state, {type, item}) {
  Object.assign(state.filters, {[type]: item})
}
export function setFiltersDialog (state, payload) {
  state.filtersDialog = !!payload;
}
