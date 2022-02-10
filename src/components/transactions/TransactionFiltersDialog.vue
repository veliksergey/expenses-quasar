<template>
  <q-card>
    <q-form @submit.prevent="close">
      <q-card-section class="bg-primary text-white text-h6">
        Filters
      </q-card-section>
      <q-card-section>
        <div class="row">

          <!-- project -->
          <div class="col-12 col-sm-6 filterCol">
            <ItemDropdown type="project" storeItem="filters"></ItemDropdown>
          </div>

          <!-- vendor -->
          <div class="col-12 col-sm-6 filterCol">
            <ItemDropdown type="vendor" storeItem="filters"></ItemDropdown>
          </div>
          
          <!-- account -->
          <div class="col-12 col-sm-6 filterCol">
            <ItemDropdown type="account" storeItem="filters"></ItemDropdown>
          </div>

          <!-- category -->
          <div class="col-12 col-sm-6 filterCol">
            <ItemDropdown type="category" storeItem="filters"></ItemDropdown>
          </div>

          <!-- person -->
          <div class="col-12 col-sm-6 filterCol">
            <ItemDropdown type="person" storeItem="filters"></ItemDropdown>
          </div>

          <!-- date -->
          <div class="col-12 col-sm-6 filterCol">
            <q-input
              label="Date"
              v-model="date"
            ></q-input>
          </div>

        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>

        <!-- clear btn -->
        <q-btn
          label="Clean"
          type="button"
          color="primary"
          flat
          @click="clean()"
        ></q-btn>

        <!-- close btn -->
        <q-btn
          label="Close"
          type="submit"
          color="primary"
        ></q-btn>

      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import ItemDropdown from 'components/items/ItemDropdown';

export default {
  name: "TransactionFiltersDialog",
  components: {ItemDropdown},

  computed: {
    filters() {
      return this.$store.getters['transactions/filters'];
    },
    accountId: {
      get() {return this.filters.accountId},
      set(value) {this.setParamInFilters('accountId', value)}
    },
    categoryId: {
      get() {return this.filters.categoryId},
      set(value) {this.setParamInFilters('categoryId', value)}
    },
    personId: {
      get() {return this.filters.personId},
      set(value) {this.setParamInFilters('personId', value)}
    },
    projectId: {
      get() {return this.filters.projectId},
      set(value) {this.setParamInFilters('projectId', value)}
    },
    vendorId: {
      get() {return this.filters.vendorId},
      set(value) {this.setParamInFilters('vendorId', value)}
    },
    date: {
      get() {return this.filters.date},
      set(value) {this.setParamInFilters('date', value)}
    },
    type: {
      get() {return this.filters.type},
      set(value) {this.setParamInFilters('type', value)}
    },
  },

  methods: {
    clean() {
      this.$store.commit('transactions/setFilters');
    },
    close() {
      this.$store.commit('transactions/setFiltersDialog', false);
    },
    setParamInFilters(param, value) {
      this.$store.commit('transactions/setFilters', {[param]: value});
    },
  }
};
</script>

<style scoped>
.row .filterCol {
  padding: 0 1em;
}
</style>
