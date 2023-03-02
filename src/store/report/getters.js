export function tables (state) {
  return state.tables;
}
export function isLoading (state) {
  return state.isLoading;
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
