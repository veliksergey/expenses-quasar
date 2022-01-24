<template>
  <q-card style="width: 600px">
    <q-form ref="formRef"
            @submit.prevent="onSubmit">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section v-if="selected">
        <div class="row">

          <!-- date -->
          <div class="col q-pr-sm">
            <q-input
              label="Date"
              v-model="date"
              mask="date"
              :rules="rules.date"
            >
              <template v-slot:append>
                <q-icon name="event"
                        class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy"
                                 cover
                                 transition-show="scale"
                                 transition-hide="scale">
                    <q-date v-model="date"
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

          <!-- amount -->
          <div class="col q-pl-sm">
            <q-input
              label="Amount"
              v-model="amount"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              :rules="rules.amount"
              input-class="text-right"
              autofocus
            ></q-input>
          </div>

        </div>
        <div class="row">

          <!-- name -->
          <div class="col q-pr-sm">
            <q-input
              label="Name"
              v-model="name"
              lazy-rules
              :rules="rules.name"
            ></q-input>
          </div>

          <!-- notes -->
          <div class="col q-pl-sm">
            <q-input
              label="Notes"
              v-model="notes"
              autogrow
            ></q-input>
          </div>
        </div>

        <!-- dropdowns -->
        <div class="row">
          <div class="col q-pr-sm">
            <ItemDropdown type="project"
                          :required="true"></ItemDropdown>
          </div>
          <div class="col q-pl-sm">
            <ItemDropdown type="vendor"
                          :required="true"></ItemDropdown>
          </div>
        </div>
        <div class="row">
          <div class="col q-pr-sm">
            <ItemDropdown type="account"></ItemDropdown>
          </div>
          <div class="col q-pl-sm">
            <ItemDropdown type="category"></ItemDropdown>
          </div>
        </div>
        <!--        <div class="row">
                  <div class="col-6 q-pr-sm">
                    <ItemDropdown type="person"></ItemDropdown>
                  </div>
                </div>-->

        <!-- file -->
        <div class="row">
          <div class="col q-pr-sm">
            <q-input
              label="File Name"
              v-model="fileName"
              color="secondary"
              label-color="secondary"
            ></q-input>
          </div>
          <div class="col q-pl-sm">
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
        </div>
        <div class="row">
          <div class="col">
            <q-input label="Temp File Name"
                     v-model="fileInTemp"
                     readonly
                     disable
                     color="secondary"
                     label-color="secondary"
            ></q-input>
          </div>
        </div>
      </q-card-section>

      {{selected}}

      <!-- actions -->
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
        name: [val => val && val.trim().length > 0 || 'Please enter a name'],
        amount: [
          val => val !== null && val !== '' || 'Please enter an amount',
          val => val > 0 || 'Amount cannot be negative'
        ],
        date: [val => val && val.trim().length > 0 || 'Please enter a date'],
      },
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
      return this.isNew ? 'Add a transaction' : `Edit transaction #${this.selected.id}`;
    },
    isSaving() {
      return this.$store.getters['transactions/isSaving'];
    },
    dropdowns() {
      return {...this.$store.getters['items/allItems']};
    },
    name: {
      get() {
        return this.selected.name;
      },
      set(value) {
        this.setParamInSelected('name', value);
      }
    },
    amount: {
      get() {
        return this.selected.amount;
      },
      set(value) {
        this.setParamInSelected('amount', value);
      }
    },
    date: {
      get() {
        return this.selected.date;
      },
      set(value) {
        this.setParamInSelected('date', value);
      }
    },
    notes: {
      get() {
        return this.selected.notes;
      },
      set(value) {
        this.setParamInSelected('notes', value);
      }
    },
    fileName: {
      get() {
        return this.selected.fileName;
      },
      set(value) {
        this.setParamInSelected('fileName', value);
      }
    },
    fileInTemp: {
      get() {
        return this.selected.fileInTemp;
      },
      set(value) {
        this.setParamInSelected('fileInTemp', value);
      }
    },
  },

  methods: {
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

  mounted() {
  }
};
</script>

<style>
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
</style>
