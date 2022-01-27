<template>
  <div>

    <!-- banner -->
    <q-banner class="bg-primary text-white" rounded>
      <div class="row">
        <!-- title -->
        <span class="q-header">Transactions</span>
        <q-space></q-space>
        <!-- search -->
        <q-input v-model="search"
                 dense
                 color="white"
                 class="text-white"
        ></q-input>
        <q-space></q-space>
        <!-- add btn -->
        <q-btn
          round
          flat
          class="bg-primary"
          icon="fas fa-plus"
          @click="editTransaction()"
          ></q-btn>
      </div>
    </q-banner>

    <!-- table -->
    <q-table
      title="Transactions"
      :rows='transactions'
      :columns='columns'
      row-key='id'
      v-model:pagination="pagination"
      :loading='isLoading'
      :filter="filter"
      @request="onRequest"
      binary-state-sort
    >
      <!-- :rows-per-page-options="[10,20,50,100, 0]" -->

      <!-- filter -->
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
      </template>

      <!-- columns -->
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
                   color='primary'
                   class="q-mr-sm"
                   @click="editTransaction(props.row)"
            ></q-btn>

          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >

            <!-- amount -->
            <template v-if="col.name === 'amount'">
              {{ $filters.localCurrency(props.row.amount) }}
            </template>

            <!-- account -->
            <template v-else-if="col.name === 'account'">
              {{ props.row.account?.name }}
            </template>

            <!-- category -->
            <template v-else-if="col.name === 'category'">
              {{ props.row.category?.name }}
            </template>

            <!-- person -->
            <template v-else-if="col.name === 'person'">
              {{ props.row.person?.name }}
            </template>

            <!-- project -->
            <template v-else-if="col.name === 'project'">
              {{ props.row.project.name }}
            </template>

            <!-- vendor -->
            <template v-else-if="col.name === 'vendor'">
              {{ props.row.vendor.name }}
            </template>

            <!-- everything else -->
            <template v-else>
              {{ col.value }}
            </template>
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
              Non Taxable: {{ props.row.nonTaxable }} <br>
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
    <q-dialog v-model="dialog">
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
        {name: 'date', label: 'Date', field: 'date', align: 'center', sortable: true,},
        {name: 'amount', label: 'Amount', field: 'amount', sortable: true,},
        {name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true},
        {name: 'project', label: 'Project', field: 'projectId', align: 'left'},
        {name: 'vendor', label: 'Vendor', field: 'vendorId', align: 'left'},
        {name: 'account', label: 'Account', field: 'accountId', align: 'left'},
        {name: 'category', label: 'Category', field: 'catId', align: 'left'},
      ],
      filter: '',
      pagination: {
        sortBy: 'date',
        descending: true,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 3,
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
    async getList() {
      await this.$store.dispatch('transactions/getList', {search: ''});
    },
    async getTransactionsFromServer(startRow, count, filter, sortBy, descending) {
      await this.$store.dispatch('transactions/getList', {startRow, count, filter, sortBy, descending});
    },
    async onRequest(props) {
      console.log('-- onRequest()');
      const {page, rowsPerPage, sortBy, descending} = props.pagination;
      const filter = props.filter;
      await this.$store.dispatch('transactions/getList', {page, rowsPerPage, sortBy, descending, filter});

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
    async getAllItemsForDropdowns() {
      await this.$store.dispatch('items/getAllItems');
    }
  },

  mounted() {
    // this.getList();
    console.log('-- mounted() pagination:', this.pagination);
    this.onRequest({pagination: {...this.pagination}, filter: ''});
    this.getAllItemsForDropdowns();
  }

};
</script>

<style scoped>

</style>
