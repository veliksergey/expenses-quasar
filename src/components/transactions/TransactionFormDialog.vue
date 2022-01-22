<template>
  <q-card style="width: 400px">
    <q-form ref="formRef" @submit.prevent="onSubmit">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section v-if="selectedTransaction">

        <!-- name -->
        <q-input
          label="Name"
          v-model="selectedTransaction.name"
          lazy-rules
          :rules="rules.name"
        ></q-input>

        <!-- amount -->
        <q-input
          label="Amount"
          v-model="selectedTransaction.amount"
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          :rules="rules.amount"
          input-class="text-right"
        ></q-input>

        <!-- date -->
<!--        <q-input
          label="Date"
          v-model="selectedTransaction.date"
          mask="date"
          :rules="rules.date"
          >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="selectedTransaction.date" @input="onDateInput" v-close-popup>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        &lt;!&ndash; notes &ndash;&gt;
        <q-input
          label="Notes"
          v-model="selectedTransaction.notes"
          autogrow
        ></q-input>-->

        <!-- account -->
<!--        <q-select
          label="Account"
          v-model="selectedTransaction.account"
          use-input
          input-debounce="0"
          behavior="menu"
          :options="options.accounts"
          option-value="id"
          option-label="name"
          @filter="filterAccounts"
          fill-input
          hide-selected
          clearable
          ref="accountRef"
        ></q-select>-->

        {{$store.state.transactions.selectedTransaction.account}}

        <ItemDropdown type="account" :selectedItem="selectedTransaction.account"></ItemDropdown>

      </q-card-section>

      <!-- actions -->
      <q-card-actions>
        <q-space></q-space>

        <!-- cancel btn -->
        <q-btn
          label="Cancel"
          type="button"
          color="primary"
          flat
          @click="onCancel"
          :disable="isSaving"
        ></q-btn>

        <!-- save btn -->
        <q-btn
          label="Save"
          type="submit"
          color="primary"
          :disable="isSaving"
          :loading="isSaving"
        ></q-btn>
      </q-card-actions>

    </q-form>
  </q-card>
</template>

<script>
import { ref } from 'vue';
import defaultTransaction from '../../store/transactions/defaultTransaction';
import ItemDropdown from 'components/items/ItemDropdown';

export default {
  name: "TransactionFormDialog",
  components: {ItemDropdown},
  data() {
    return {
      selectedTransaction: {...defaultTransaction},
      rules: {
        name: [val => val && val.trim().length > 0 || 'Please enter a name'],
        amount: [
          val => val !== null && val !== '' || 'Please enter an amount',
          val => val > 0 || 'Amount cannot be negative'
        ],
        date: [val => val && val.trim().length > 0 || 'Please enter a date'],
      },
      options: {
        accounts: [],
      },
    };
  },

  computed: {
    isNew() {return this.selectedTransaction && !this.selectedTransaction.id},
    title() {return this.isNew ? 'Add a transaction' : 'Edit transaction'},
    isSaving() {return this.$store.getters['transactions/isSaving']},
    dropdowns() {return {...this.$store.getters['items/allItems']}},
  },

  methods: {
    onCancel() {
      this.$store.commit('transactions/setDialog', false);
      this.$store.commit('transactions/setSelectedTransaction', null);
    },
    onSubmit() {
      if (!this.$refs.formRef.validate()) return;
      this.$store.dispatch('transactions/saveTransaction', {transaction: this.selectedTransaction});
    },
    onDateInput() {
      console.log('-- onDateInput()');
    },
    filterAccounts(val, update, abort) {
      update(() => {
        if (val === '') this.options.accounts = [...this.$store.getters['items/allItems'].accounts];
        const needle = val.toLowerCase();
        this.options.accounts = this.$store.getters['items/allItems'].accounts
          .filter(item => item.name.toLowerCase().indexOf(needle) > -1);

        // const accountRef = this.$refs.accountRef;
        // if (val !== '' && accountRef.options.length > 0) {
        //   accountRef.setOptionIndex(-1);
        //   accountRef.moveOptionSelection(1, true);
        // }
      })
    }
  },

  mounted() {
    this.selectedTransaction = {...this.$store.getters['transactions/selectedTransaction']};
    this.options.accounts = [...this.$store.getters['items/allItems'].accounts];
  }
};
</script>

<style scoped>

</style>
