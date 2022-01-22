<template>
  <q-card style="width: 400px">
    <q-form ref="formRef" @submit.prevent="onSubmit">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section>
        <q-input
          label="Name"
          v-model="selectedItem.name"
          lazy-rules
          :rules="nameRules"
          autofocus
          :disable="isSaving"
        ></q-input>
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

        <!-- submit btn -->
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
export default {
  name: "ItemFormDialog",

  data() {
    return {
      selectedItem: {id: null, name: ''},
      nameRules: [
        val => val && val.trim().length > 0 || 'Please enter a name',
        val => val.length < 50 || 'Cannot be longer 50 characters',
      ],
    }
  },

  computed: {
    isNew() {return !this.selectedItem.id},
    title() {return this.isNew ? 'Add new' : 'Edit'},
    isSaving() {return this.$store.getters['items/isSaving']},
  },

  methods: {
    onCancel() {
      this.$store.commit('items/setDialog', false);
      this.$store.commit('items/setSelectedItem', {id: null, name: '',});
    },
    onSubmit() {
      this.$store.dispatch('items/saveItem', {item: this.selectedItem});
    },
  },

  mounted() {
    this.selectedItem = {...this.$store.getters['items/selectedItem']};
  }
};
</script>

<style scoped>

</style>
