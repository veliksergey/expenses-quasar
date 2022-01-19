import {boot} from 'quasar/wrappers';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default boot( ({app}) => {
  app.config.globalProperties.$filters = {
    localCurrency(val) {
      // (val).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      return currencyFormatter.format(val);
    }
  }
})
