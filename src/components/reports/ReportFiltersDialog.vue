<template>
  <q-card>
    <q-form @submit.prevent="close">
      <q-card-section class="bg-primary text-white text-h6">
        Report Filters
      </q-card-section>
      <q-card-section>
        <div class="row">

          <!-- project -->
          <div class="col-12 col-sm-6 filterCol">
            <ItemDropdown type="project" :item="filters.project" @update="updateItem"></ItemDropdown>
          </div>

          <!-- category -->
          <div class="col-12 col-sm-6 filterCol">
            <ItemDropdown type="category" :item="filters.category" @update="updateItem"></ItemDropdown>
          </div>

          <!-- year -->
          <div class="col-12 col-sm-6 filterCol">
            <q-select
              label="Year"
              v-model="yearModel"
              :options="years"
              ></q-select>
          </div>

          <!-- ToDo: groupBy -->

          <!-- condition1 -->
          <div class="col-12 col-sm-6 filterCol">
            <q-select
              label="Condition1"
              v-model="condition1Model"
              :options="conditions"
              option-value="id"
              option-label="name"
            ></q-select>
          </div>

          <!-- excludeLoans -->
          <q-checkbox
            label="Exclude loans"
            v-model="excludeLoansModel"
          ></q-checkbox>

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
import ItemDropdown from "components/items/ItemDropdown.vue";

export default {
  name: 'ReportFiltersDialog',
  components: {ItemDropdown},

  data() {
    return {
      conditions: [
        {id: 'all', name: 'All',},
        {id: 'false', name: 'For Partner',},
        {id: 'true', name: 'Only Me',},
      ],
    }
  },

  computed: {
    filters() {
      return this.$store.getters['report/filters'];
    },
    condition1Model: {
      get() {return this.filters.condition1},
      set(value) {this.updateItem({type: 'condition1', item: value})},
    },
    excludeLoansModel: {
      get() {return this.filters.excludeLoans},
      set(value) {this.updateItem({type: 'excludeLoans', item: value})},
    },
    yearModel: {
      get() {return this.filters.year},
      set(value) {this.updateItem({type: 'year', item: value})},
    },
    years() {
      const oldestYear = 2019;
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = oldestYear; i <= currentYear; i++) {
        years.push(i);
      }
      return years;
    }

  },

  methods: {
    clean() {
      this.$store.commit('report/setFilters');
    },
    close() {
      this.$store.commit('report/setFiltersDialog', false);
    },
    updateItem({type, item}) {
      this.$store.commit(`report/updateItemInFilters`, {type, item})
    },
  }

}
</script>

<style scoped>
.row .filterCol {
  padding: 0 1em;
}
</style>
