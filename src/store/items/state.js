export default function () {
  return {
    list: [],
    selectedItem: {id: null, name: ''},
    dialog: false,
    isLoading: false,
    isSaving: false,
    type: null,
    allItems: {
      accounts: [],
      categories: [],
      people: [],
      projects: [],
      vendors: [],
    },
  }
}
