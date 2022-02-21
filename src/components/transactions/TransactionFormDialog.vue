<template>
  <q-card > <!-- style="width: 600px; max-width: 80vw;" -->
    <q-form ref="formRef" @submit.prevent="onSubmit">
      <q-card-section class="bg-primary text-white text-h6">
        <div class="row">
          {{ title }}
          <q-space></q-space>
          <q-btn-toggle
            v-model="type"
            no-caps
            rounded
            unelevated
            color="white"
            text-color="primary"
            toggle-color="info"
            toggle-text-color="primary"
            :options="[{slot: 'in', value: 1},{slot: 'out', value: 0}]"
          >
            <template v-slot:in>
              <div class="row items-center no-wrap">
                <q-icon left name="attach_money"></q-icon> In
              </div>
            </template>
            <template v-slot:out>
              <div class="row items-center no-wrap">
                <q-icon left name="shopping_cart"></q-icon> Out
              </div>
            </template>
          </q-btn-toggle>
        </div>
      </q-card-section>
      <q-card-section v-if="selected">
        <div class="row">

          <!-- type -->
<!--          <div class="col-12 col-sm-6 col-md-4 formCol">
            <q-btn-toggle
              v-model="type"
              toggle-color="info"
              no-caps
              rounded
              glossy
              spread
              :options="[{slot: 'in', value: 1},{slot: 'out', value: 0}]"
            >
              <template v-slot:in>
                <div class="row items-center no-wrap">
                  <q-icon left name="attach_money" />
                  Money<br>In
                </div>
              </template>
              <template v-slot:out>
                <div class="row items-center no-wrap">
                  <q-icon left name="shopping_cart" />
                  Money<br>Out
                </div>
              </template>
            </q-btn-toggle>
          </div>-->

          <!-- date -->
          <div class="col-12 col-sm-6 col-md-4 formCol">
            <q-input
              label="Date"
              v-model="date"
              mask="date"
              :rules="rules.date"
              autofocus
              :hint="$filters.localDate(date)"
            >
              <template v-slot:append>
                <q-icon name="event"
                        class="cursor-pointer">
                  <q-popup-proxy
                                 cover
                                 transition-show="scale"
                                 transition-hide="scale"> <!-- ref="qDateProxy" -->
                    <q-date v-model="date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup
                               label="Close"
                               color="primary"
                               flat></q-btn>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- amount -->
          <div class="col-12 col-sm-6 col-md-4 formCol">
            <q-input
              label="Amount"
              v-model="amount"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              :rules="rules.amount"
              :input-class="amountInputClasses"
            ></q-input>
          </div>

          <!-- name -->
          <div class="col-12 col-sm-6 col-md-4 formCol">
            <q-input
              label="Name"
              v-model="name"
              lazy-rules
            ></q-input>
          </div>

          <!-- notes -->
          <div class="col-12 col-sm-6 col-md-4 formCol">
            <q-input
              label="Notes"
              v-model="notes"
              autogrow
            ></q-input>
          </div>

          <!-- project -->
          <div class="col-12 col-sm-6 col-md-4 formCol">
            <ItemDropdown type="project" :required="true" storeItem="selectedTransaction"></ItemDropdown>
          </div>

          <!-- vendor -->
          <div class="col-12 col-sm-6 col-md-4 formCol">
            <ItemDropdown type="vendor" :required="true" storeItem="selectedTransaction"></ItemDropdown>
          </div>

          <!-- account -->
          <div class="col-12 col-sm-6 col-md-4 formCol">
            <ItemDropdown type="account" :required="true" storeItem="selectedTransaction"></ItemDropdown>
          </div>

          <!-- category -->
          <div class="col-12 col-sm-6 col-md-4 formCol">
            <ItemDropdown type="category" :required="true" storeItem="selectedTransaction"></ItemDropdown>
          </div>

          <template v-if="type === 0"> <!-- out -->

            <!-- person -->
            <div class="col-12 col-sm-6 col-md-4 formCol">
              <ItemDropdown type="person" label="By (person)" storeItem="selectedTransaction"></ItemDropdown>
            </div>

            <!-- related Amount -->
            <div class="col-12 col-sm-6 col-md-4 formCol">
              <q-input
                label="Alternative Amount"
                v-model="relatedAmount"
                mask="#.##"
                fill-mask="0"
                reverse-fill-mask
                input-class="text-right"
              ></q-input>
            </div>

            <!-- related date -->
            <div class="col-12 col-sm-6 col-md-4 formCol">
              <q-input
                label="Related Date"
                v-model="relatedDate"
                mask="date"
              >
                <template v-slot:append>
                  <q-icon name="event"
                          class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale">
                      <q-date v-model="relatedDate"
                              v-close-popup>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup
                                 label="Close"
                                 color="primary"
                                 flat></q-btn>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- file name -->
            <div class="col-12 col-sm-6 col-md-4 formCol">
              <q-input
                label="File Name"
                v-model="fileName"
                color="secondary"
                label-color="secondary"
              ></q-input>
            </div>

            <!-- file uploader -->
            <div class="col-12 col-sm-6 col-md-4 formCol">
              <q-uploader
                label="Upload File"
                :factory="fileFactory"
                @uploaded="onFileAdded"
                :auto-upload="true"
                :no-thumbnails="true"
                accept=".jpg, .jpeg, .png, .pdf, image/*"
                max-files="1"
                color="secondary"
                class="full-width"
              >
              </q-uploader>
            </div>

            <!-- server temp file name -->
            <div class="col-12 col-sm-6 col-md-4 formCol">
              <q-input label="Temp File Name"
                       v-model="fileInTemp"
                       readonly
                       disable
                       color="secondary"
                       label-color="secondary"
              ></q-input>
            </div>

          </template>

        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>

        <!-- cancel btn -->
        <q-btn
          label="Cancel"
          type="button"
          color="primary"
          flat
          class="q-mr-md"
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
import ItemDropdown from 'components/items/ItemDropdown';
import {baseUrl} from 'boot/axios';

export default {
  name: "TransactionFormDialog",
  components: {ItemDropdown},
  data() {
    return {
      rules: {
        // name: [val => val && val.trim().length > 0 || 'Please enter a name'],
        amount: [
          val => val !== null && val !== '' || 'Please enter an amount',
          val => val > 0 || 'Amount cannot be negative'
        ],
        date: [val => val && val.trim().length > 0 || 'Please enter a date'],
      },
      timer: null,
    };
  },

  computed: {
    selected() {
      return this.$store.getters['transactions/selectedTransaction'];
    },
    isNew() {
      return this.selected && !this.selected.id;
    },
    title() {
      if (!this.isNew) return `Edit transaction #${this.selected.id}`;
      else if (this.type === 0) return 'Add Expense';
      else if (this.type === 1) return 'Add Income';
      return 'Add transaction';
    },
    isSaving() {
      return this.$store.getters['transactions/isSaving'];
    },
    dropdowns() {return {...this.$store.getters['items/items']};},
    type: {
      get() {return this.selected.type},
      set(value) {this.setParamInSelected('type', value)}
    },
    name: {
      get() {return this.selected.name;},
      set(value) {this.setParamInSelected('name', value)}
    },
    amount: {
      get() {return this.selected.amount;},
      set(value) {this.setParamInSelected('amount', value);}
    },
    relatedAmount: {
      get() {return this.selected.relatedAmount},
      set(value) {this.setParamInSelected('relatedAmount', value)}
    },
    date: {
      get() {return this.selected.date;},
      set(value) {this.setParamInSelected('date', value);}
    },
    relatedDate: {
      get() {return this.selected.relatedDate},
      set(value) {this.setParamInSelected('relatedDate', value)}
    },
    notes: {
      get() {return this.selected.notes;},
      set(value) {this.setParamInSelected('notes', value);}
    },
    fileName: {
      get() {return this.selected.fileName;},
      set(value) {this.setParamInSelected('fileName', value);}
    },
    fileInTemp: {
      get() {return this.selected.fileInTemp;},
      set(value) {this.setParamInSelected('fileInTemp', value);}
    },
    amountInputClasses() {
      return `text-${this.type === 1 ? 'green' : 'pink'}-9 text-right`;
    }
  },

  watch: {
    date() {this.checkPossibleDuplicates()},
    amount() {this.checkPossibleDuplicates()},
    relatedDate() {this.checkPossibleDuplicates()},
    relatedAmount() {this.checkPossibleDuplicates()},
  },

  methods: {
    checkPossibleDuplicates() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.date && this.amount) {
          this.$store.dispatch('transactions/getPossibleDuplicates', {
            date: this.date,
            amount: this.amount,
            relatedDate: this.relatedDate,
            relatedAmount: this.relatedAmount,
            id: this.selected.id || '',
          });
        }
      }, 1000);
    },
    setParamInSelected(param, value) {
      this.$store.commit('transactions/updateSelectedTransaction', {[param]: value});
    },
    onCancel() {
      this.$store.commit('transactions/setDialog', false);
      this.$store.commit('transactions/setSelectedTransaction', null);
    },
    onSubmit() {
      if (!this.$refs.formRef.validate()) return;
      this.$store.dispatch('transactions/saveTransaction', {transaction: this.selected});
    },
    fileFactory(files) {
      return {
        url: `${baseUrl}/documents`,
        fieldName: this.fileName
      };
    },
    onFileAdded({files, xhr}) {
      const res = JSON.parse(xhr.response);
      if (res && res.fileInTemp) this.fileInTemp = res.fileInTemp;
      else alert('Error in saving file!');
    }
  },

  beforeUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }
};
</script>

<style lang="scss">
.q-uploader__list{
  display: none !important;
}
/*.q-uploader {
  border: 2px solid red !important;
  background-color: yellow !important;
}
.q-uploader__list {
  background-color: red !important;
}
.q-uploader__header {
  background-color: blue !important;
}*/

/* padding for columns */
.row .formCol {
  padding: 0 1em;
}
.row .formCol:nth-child(3n+3) {
  padding-left: 1em;
}
.row .formCol:nth-child(3n + 1) {
  padding-right: 1em;
}

.amountInputIn {
  color: $green-9;
}
.amountInputOut {
  color: $pink-9;
}
</style>
