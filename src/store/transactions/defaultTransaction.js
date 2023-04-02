import moment from 'moment';

const defaultTransaction = {
  type: 0,
  name: '',
  amount: 0.00,
  relatedAmount: null,
  date: moment().format('YYYY-MM-DD'),
  relatedDate: null,
  notes: '',
  account: {id: 0, name: '',},
  category: {id: 0, name: '',},
  person: {id: 0, name: '',},
  project: {id: 0, name: '',},
  vendor: {id: 0, name: '',},
  fileName: '',
  fileInTemp: '',
  condition1: false,
}

const defaultFilters = {
  account: null,
  category: null,
  person: null,
  project: null,
  vendor: null,
  date: '',
  dateFrom: '',
  dateTo: '',
  year: '',
  type: '',
  condition1: null,
  excludeLoans: true,
}

export {defaultTransaction, defaultFilters}
