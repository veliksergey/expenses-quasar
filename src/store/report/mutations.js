import {defaultFilters} from "src/store/transactions/defaultTransaction";

export function setIsLoading(state, payload) {
  state.isLoading = !!payload;
}

export function setTables(state, payload) {
  state.tables = payload || {};
}

// filters
export function setFilters (state, payload) {
  state.filters = {...defaultFilters, payload};
}
export function updateItemInFilters(state, {type, item}) {
  Object.assign(state.filters, {[type]: item})
}
export function setFiltersDialog (state, payload) {
  state.filtersDialog = !!payload;
}
