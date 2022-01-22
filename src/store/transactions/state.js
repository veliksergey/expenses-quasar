import defaultTransaction from './defaultTransaction';

export default function () {
  return {
    list: [],
    total: 0,
    selectedTransaction: {...defaultTransaction},
    dialog: true,
    isLoading: false,
    isSaving: false,
  }
}
