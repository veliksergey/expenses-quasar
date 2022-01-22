import {api} from 'boot/axios';

export async function getAllItems (store) {
  const types = ['accounts', 'categories', 'people', 'projects', 'vendors'];
  const allItems = store.state.allItems;

  if (allItems.length) {
    let toContinue = false;
    types.forEach(type => {
      if (!allItems[type] || !allItems[type].length) {
        toContinue = true;
      }
    });
    if (!toContinue) return;
  }

  try {

    const res = await api.get('items/all-items');
    store.commit('setAllItems', res.data);

  } catch (err) {
    console.error(err);
  }
}

export async function getList (store) {
  const type = store.state.type;
  if (!type) return;

  store.commit('setIsLoading', true);
  store.commit('setList', []);

  try {

    const res = await api.get(`items/${type}`);
    store.commit('setList', res.data);
    store.commit('setIsLoading', false);

  } catch (err) {
    console.error(err);

    store.commit('setList', []);
    store.commit('setIsLoading', false);
  }
}

export async function saveItem (store, {item}) {
  store.commit('setIsSaving', true);
  const type = store.state.type;

  if (!item.id) delete item.id;

  try {

    const res = item.id
      ? await api.put(`items/${type}/${item.id}`, item)
      : await api.post(`items/${type}`, item);
    const data = res.data;

    // if error
    if (data.errMsg) {
      alert(data.errMsg);
      throw new Error(data.errMsg);
    }

    store.commit('updateItemInList', data)
    store.commit('setIsSaving', false);
    store.commit('setDialog', false);

  } catch (err) {
    console.error(err);
    store.commit('setIsSaving', false);
    // store.commit('setDialog', false);
    // store.dispatch('getList')
  }
}

export async function deleteItem (store, {item}) {
  if (!item || !item.id) return;
  const type = store.state.type;
  try {

    const res = await api.delete(`items/${type}/${item.id}`);
    const data = res.data;

    if (data.deleted) {
      store.commit('removeItemFromList', item);
    }

  } catch (err) {
    console.error(err);
    store.dispatch('getList');
  }
}
