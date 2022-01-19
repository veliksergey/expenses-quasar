<template>
  <q-dialog
    v-model="dialog"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">Add a Transaction</div>
      </q-card-section>


      <q-form ref="formRef"
              @submit.prevent="submit"
              @reset="reset">
        <q-card-section>

          <q-input
            label="Name"
            v-model="selectedTransaction.name"
            lazy-rules
            :rules="[val => val && val.trim().length > 0 || 'Please enter a name']"
          ></q-input>

          <q-input
            label="Amount"
            v-model.number="selectedTransaction.amount"
            type="text"
            :rules="rules.amount"
            ></q-input>

          <q-input
            label="Amount"
            v-model="selectedTransaction.amount"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            :rules="rules.amount"
            input-class="text-right"
            ></q-input>

        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn flat color="primary" type="submit" label="Save"></q-btn>
          <q-btn flat type="reset" label="Reset"></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "TransactionFormDialog",
  data() {
    return {
      dialog: true,
      selectedTransaction: {
        name: '',
        amount: 0,
      },
      rules: {
        amount: [
          val => val !== null && val !== '' || 'Please enter an amount',
          val => val > 0 || 'Amount cannot be negative'
        ],
      }
    };
  },

  methods: {
    submit() {
      if (!this.$refs.formRef.validate()) return;


    }
  }
};
</script>

<style scoped>

</style>
