<template>
  <div>

    <q-select
      :label="type"
      v-model="model"
      use-input
      input-debounce="0"
      behavior="menu"
      :options="options"
      option-value="id"
      option-label="name"
      @filter="filterItems"
      fill-input
      hide-selected
      clearable
      ref="accountRef"
    ></q-select>
  </div>
</template>

<script>
export default {
  name: "ItemDropdown",

  props: {
    type: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      options: [],
    };
  },

  computed: {
    typePlural() {return `${this.type}s`},
    model: {
      get() {return this.$store.getters['transactions/selectedTransaction']},
      set(item) {
        return this.$store.commit('transactions/updateItemInSelectedTransaction', {type: this.type, item})
      }
    },
  },

  methods: {
    filterItems(val, update, abourt) {
      console.log('-- type:', this.type, this.typePlural);
      update(() => {
        if (val === '') this.options = [...this.$store.getters['items/allItems'][this.typePlural]];
        const needle = val.toLowerCase();
        this.options = this.$store.getters['items/allItems'][this.typePlural]
          .filter(item => item.name.toLowerCase().indexOf(needle) > -1);
      })
    },
  },

  mounted() {
    console.log('-- mounted type:', this.type, this.typePlural);
    this.options = [...this.$store.getters['items/allItems'][this.typePlural]];
    console.log('-- mounted options:', this.options);
    console.log('-- this.$store.getters[\'items/allItems\']:', this.$store.getters['items/allItems']);
  }
};
</script>

<style scoped>

</style>
