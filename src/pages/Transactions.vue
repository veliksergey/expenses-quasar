<template>
  <div>

    <!-- table -->
    <q-table
      title="Transactions"
      :rows='transactions'
      :columns='columns'
      row-key='id'
      v-model:pagination="pagination"
      :loading='isLoading'
      :filter="search"
      @request="onRequest"
      binary-state-sort
      table-header-class="bg-primary"
    >
      <!-- :rows-per-page-options="[10,20,50,100, 0]" -->

      <!-- top-right slot -->
      <template v-slot:top-right="props">
        <!-- search field -->
        <q-input borderless dense debounce="300" v-model="search" placeholder="Search" class="q-mr-md">
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>

        <!-- add btn -->
        <q-btn round flat dense icon="add" @click="editTransaction()"></q-btn>

        <!-- refresh btn -->
        <q-btn round flat dense icon="refresh" @click="onRequest()"></q-btn>

        <!-- full screen btn -->
        <q-btn flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        />
      </template>

      <!-- header columns -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width/>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body='props'>
        <q-tr :props='props'>
          <q-td auto-width>
            <q-btn size='small'
                   color='grey'
                   round
                   dense
                   flat
                   @click='props.expand = !props.expand'
                   :icon='props.expand ? "fas fa-chevron-up" : "fas fa-chevron-down"'
                   class="q-mr-sm"
            ></q-btn>

            <!-- edit btn -->
            <q-btn icon='edit'
                   dense
                   round
                   flat
                   size='small'
                   :color='props.row.documents.length ? "dark" : "primary"'
                   class="q-mr-sm"
                   @click="editTransaction(props.row)"
            ></q-btn>

          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
<!--            <span class="text-lime-9">{{col.value}}</span>-->
          </q-td>
        </q-tr>

        <!-- expanded row -->
        <q-tr v-show="props.expand"
              :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              <!-- edit btn -->
              <q-btn icon='edit'
                     dense
                     round
                     flat
                     size='small'
                     color='primary'
                     class="q-mr-sm"
                     @click="editTransaction(props.row)"
              ></q-btn>
              <!-- delete btn -->
              <q-btn icon='delete'
                     dense
                     round
                     flat
                     size='small'
                     color='negative'
                     class="q-mr-sm"
                     @click="deleteTransaction(props.row)"
              ></q-btn>
              <br>
              ID: {{props.row.id}} <br>
              Notes: {{ props.row.notes }} <br>
              Related Amount: {{ props.row.relatedAmount }} <br>
              Related Date: {{ props.row.relatedDate }} <br>
              Taxable: {{ props.row.taxable }} <br>
              By: {{ props.row.person?.name }} <br>
              Documents:
              <a :href="`${backEndUrl}/${doc.path}`"
                 target="_blank"
                 v-for="doc in props.row.documents"
                 :key="doc.id"
                 class="q-mr-sm"
              >{{doc.name || doc.path}}</a>
            </div>
          </q-td>
        </q-tr>
      </template>

    </q-table>

    <!-- dialog -->
    <q-dialog v-model="dialog" full-width>
      <TransactionFormDialog></TransactionFormDialog>
    </q-dialog>

  </div>
</template>

<script>
import TransactionFormDialog from 'components/transactions/TransactionFormDialog';
import {baseUrl} from 'boot/axios';

export default {
  name: 'Transactions',
  components: {TransactionFormDialog},

  data() {
    return {
      search: '',
      columns: [
        // {name: 'actions', style: 'background-color: orange; width: 10px; padding: 0'},
        // {name: 'id', label: 'ID', field: 'id', align: 'right'},
        {name: 'date', label: 'Date', field: 'date', align: 'right', sortable: true, format: (val, row) => this.$filters.localDate(val)},
        {name: 'amount', label: 'Amount', field: 'amount', sortable: true, format: (val, row) => this.$filters.localCurrency(val), classes: (row) => {return row.type === 1 ? 'text-green-9' : 'text-pink-9'}},
        {name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true},
        {name: 'project', label: 'Project', field: 'projectId', align: 'left', format: (val, row) => row.project?.name},
        {name: 'vendor', label: 'Vendor', field: 'vendorId', align: 'left', format: (val, row) => row.vendor?.name},
        {name: 'account', label: 'Account', field: 'accountId', align: 'left', format: (val, row) => row.account?.name},
        {name: 'category', label: 'Category', field: 'catId', align: 'left', format: (val, row) => row.category?.name},
      ],
      pagination: {
        sortBy: 'date',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0, // will come from the server
      }
    };
  },

  computed: {
    transactions() {return this.$store.getters['transactions/list']},
    isLoading() {return this.$store.getters['transactions/isLoading']},
    dialog: {
      get() {return this.$store.getters['transactions/dialog']},
      set(newVal) {this.$store.commit('transactions/setDialog', newVal)}
    },
    backEndUrl() {return baseUrl},
  },

  watch: {
    // ToDo
  },

  methods: {
    async onRequest(props) {
      if (!props) { // on refresh -> reset some pagination params and search
        props = {
          pagination: {
            page: 1,
            rowsPerPage: this.pagination.rowsPerPage,
            sortBy: 'date',
            descending: true,
          },
          filter: '',
        };
        this.search = '';
      }

      const {page, rowsPerPage, sortBy, descending} = props.pagination;
      const search = props.filter;
      await this.$store.dispatch('transactions/getList', {page, rowsPerPage, sortBy, descending, search});

      this.pagination.rowsNumber = this.$store.getters['transactions/total'];
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.sortBy = sortBy;
      this.pagination.descending = descending;
    },
    editTransaction(transaction) {
      this.$store.commit('transactions/setSelectedTransaction', transaction);
      this.$store.commit('transactions/setDialog', true);
    },
    deleteTransaction(transaction) {
      this.$q.dialog({
        title: `Delete "${transaction.name}?"`,
        message: `Are you sure you want delete transaction <strong class="text-primary">${transaction.name}</strong>?`,
        html: true,
        cancel: true,
        focus: false,
      }).onOk(() => {
        this.$store.dispatch('transactions/deleteTransaction', {transaction});
      });
    },
  },

  mounted() {
    this.onRequest({pagination: {...this.pagination}, filter: ''});
    this.$store.dispatch('items/getItems', {forced: true})
  }

};
</script>

<style scoped>

</style>
