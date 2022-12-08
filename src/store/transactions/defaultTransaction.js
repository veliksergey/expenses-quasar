import moment from 'moment';

const defaultTransaction = {
  type: 0,
  name: '',
  amount: 0.00,
  relatedAmount: null,
  date: moment().format('YYYY-MM-DD'),
  relatedDate: null,
  notes: '',
  // accountId: 0,
  // categoryId: 0,
  // personId: 0,
  // projectId: 0,
  // vendorId: 0,
  account: {id: 0, name: '',},
  category: {id: 0, name: '',},
  person: {id: 0, name: '',},
  project: {id: 0, name: '',},
  vendor: {id: 0, name: '',},
  fileName: '',
  fileInTemp: '',
}

const defaultFilters = {
  account: null,
  category: null,
  person: null,
  project: null,
  vendor: null,
  date: '',
  type: '',
  condition1: 'all',
}

export {defaultTransaction, defaultFilters}
