export default function () {
  return {
    list: [],
    selectedItem: {id: null, name: ''},
    dialog: false,
    isLoading: false,
    isSaving: false,
    type: null,
    items: {
      accounts: [],
      categories: [],
      people: [],
      projects: [],
      vendors: [],
    },
  }
}
