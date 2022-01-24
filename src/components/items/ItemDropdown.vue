<template>
  <q-select
    :label="label"
    v-model="model"
    :required="required"
    use-input
    :rules="rules"
    input-debounce="0"
    behavior="menu"
    :options="options"
    option-value="id"
    option-label="name"
    @filter="filterItems"
    fill-input
    hide-selected
    ref="dropDownRef"
  ></q-select>
</template>

<script>
export default {
  name: "ItemDropdown",

  props: {
    type: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      options: [],
      rules: [
        val => !this.required || (this.required && val.id) || 'Field required'
      ],
    };
  },

  computed: {
    label() {
      return this.type.charAt(0).toUpperCase() + this.type.slice(1);
    },
    typePlural() {
      const t = this.type;
      if (t === 'category') return 'categories';
      else if (t === 'person') return 'people';
      else return `${this.type}s`
    },
    model: {
      get() {return this.$store.getters['transactions/selectedTransaction'][this.type]},
      set(item) {
        this.$store.commit('transactions/updateItemInSelectedTransaction', {type: this.type, item})
      }
    },
  },

  methods: {
    filterItems(val, update, abort) {
      update(() => {
        if (val === '') this.options = [...this.$store.getters['items/allItems'][this.typePlural]];
        const needle = val.toLowerCase();
        this.options = this.$store.getters['items/allItems'][this.typePlural]
          .filter(item => item.name.toLowerCase().indexOf(needle) > -1);
      })
    },
  },

  mounted() {
    this.options = [...this.$store.getters['items/allItems'][this.typePlural]];
  }
};
</script>

<style scoped>

</style>
