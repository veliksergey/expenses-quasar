export function setList(state, payload) {
  state.list = payload || [];
}

export function setSelectedItem(state, payload) {
  state.selectedItem = payload || {id: null, name: ''};
}

export function setDialog(state, payload) {
  state.dialog = !!payload;
}

export function setIsLoading(state, payload) {
  state.isLoading = !!payload;
}

export function setIsSaving(state, payload) {
  state.isSaving = !!payload;
}

export function setType(state, payload) {
  state.type = payload;
}

export function updateItemInList(state, payload) {
  const idx = state.list.findIndex(i => i.id === payload.id);
  if (idx > -1) state.list[idx] = payload;
  else state.list.unshift(payload);
}

export function removeItemFromList(state, payload) {
  const idx = state.list.findIndex(i => i.id === payload.id);
  if (idx < 0) return;
  state.list.splice(idx, 1);
}

export function setItems(state, payload) {
  state.items = {
    accounts: payload.accounts || state.items.accounts || [],
    categories: payload.categories || state.items.categories || [],
    people: payload.people || state.items.people || [],
    projects: payload.projects || state.items.projects || [],
    vendors: payload.vendors || state.items.vendors || [],
  }
}
