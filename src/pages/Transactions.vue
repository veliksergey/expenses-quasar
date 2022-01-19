<template>
  <div>

<!--    <q-bar class="bg-primary text-white rounded-borders">
      bar
    </q-bar>-->

    <q-banner class="bg-primary text-white" rounded>
<!--      <q-toolbar-title>Banner title</q-toolbar-title>-->
      <div class="row">
        <span class="q-header">Transactions</span>
        <q-space></q-space>

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
          @click="createDialog = true"
          ></q-btn>
      </div>
    </q-banner>

    <q-table
      :rows='transactions'
      :columns='columns'
      row-key='id'
      :loading='!transactions.length'
    >

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
              {{ props.row.account.name }}
            </template>

            <!-- category -->
            <template v-else-if="col.name === 'category'">
              {{ props.row.category?.name }}
            </template>

            <!-- person -->
            <template v-else-if="col.name === 'person'">
              {{ props.row.person.name }}
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
        <q-tr v-show="props.expand"
              :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              <q-btn icon='edit'
                     dense
                     round
                     size='small'
                     color='primary'
                     class="q-mr-sm"
                     v-if="props.expand"
              ></q-btn>
              <q-btn icon='delete'
                     dense
                     round
                     size='small'
                     color='negative'
                     class="q-mr-sm"
                     v-if="props.expand"
              ></q-btn>
              <br>
              Notes: {{ props.row.notes }} <br>
              Related Amount: {{ props.row.relatedAmount }} <br>
              Related Date: {{ props.row.relatedDate }} <br>
              Non Taxable: {{ props.row.nonTaxable }} <br>
              By: {{ props.row.person.name }} <br>
            </div>
          </q-td>
        </q-tr>
      </template>

    </q-table>

    <TransactionFormDialog></TransactionFormDialog>

  </div>
</template>

<script>
import {defineComponent} from 'vue';
import {useStore} from 'vuex';
import TransactionFormDialog from 'components/transactions/TransactionFormDialog';

export default defineComponent({
  name: 'Transactions',
  components: {TransactionFormDialog},
  setup() {
    const $store = useStore();
    const search = '';

    return {$store, search}
  },
  data() {
    return {
      columns: [
        {name: 'date', label: 'Date', field: 'date', align: 'center'},
        {name: 'amount', label: 'Amount', field: 'amount'},
        {name: 'name', label: 'Name', field: 'name', align: 'left'},
        {name: 'project', label: 'Project', field: 'projectId', align: 'left'},
        {name: 'account', label: 'Account', field: 'accountId', align: 'left'},
        {name: 'vendor', label: 'Vendor', field: 'vendorId', align: 'left'},
        {name: 'category', label: 'Category', field: 'catId', align: 'left'},
      ],
    };
  },
  computed: {
    transactions() {
      return this.$store.getters['transactions/list'];
    }
  },
  methods: {},

  mounted() {
    this.$store.dispatch('transactions/getList', {search: ''});
  }

});
</script>

<style scoped>

</style>
