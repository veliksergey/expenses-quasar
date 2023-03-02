import {defaultFilters} from './defaultReportFilters';

export default function () {
  return {
    tables: {},
    isLoading: false,
    filters: {...defaultFilters},
    filtersDialog: false,
  }
}
