export function list (state) {
  return state.list;
}
export function total (state) {
  return state.total;
}

export function selectedTransaction (state) {
  return state.selectedTransaction;
}

export function dialog (state) {
  return state.dialog;
}

export function isLoading (state) {
  return state.isLoading;
}

export function isSaving (state) {
  return state.isSaving;
}

export function filters (state) {
  return state.filters;
}
export function filtersDialog (state) {
  return state.filtersDialog;
}
export function filtersCount (state) {
  return Object.values(state.filters)
    .filter(v => !!v)
    .length;
}
