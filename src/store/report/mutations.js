export function setIsLoading(state, payload) {
  state.isLoading = !!payload;
}

export function setTables(state, payload) {
  state.tables = payload || {};
}
