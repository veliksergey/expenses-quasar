import moment from 'moment';

export default {
  name: '',
  amount: 0.00,
  relatedAmount: null,
  date: moment().format('YYYY-MM-DD'),
  relatedDate: null,
  nonTaxable: false,
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
  // file: null,
  fileName: '',
  fileInTemp: '',
}
