<template>
  <div>
    <q-select
      :label="labelName"
      v-model="model"
      use-input
      :rules="rules"
      input-debounce="0"
      behavior="menu"
      :options="options"
      option-value="id"
      option-label="name"
      @filter="filterItems"
      new-value-mode="add-unique"
      use-chips
    >
      <template v-slot:selected-item="{opt}">
        <q-chip dense v-if="opt && typeof opt === 'string'">{{opt}}</q-chip>
        <q-chip dense v-if="opt && typeof opt === 'object' && opt.id">{{ opt.name }}</q-chip>
      </template>
    </q-select>
<!--    {{$store.state.transactions.selectedTransaction[type]}}-->
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
    label: {
      type: String,
    },
    required: {
      type: Boolean,
      default: false,
    },
    /*storeItem: {
      type: String,
      required: true,
    }*/
    item: {
      type: Object,
      required: true,
    }
  },

  data() {
    return {
      options: [],
      rules: [
        // val => !this.required || ((typeof val === 'string') || (this.required && val.id)) || 'Field required'
        val => !this.required || (typeof val === 'object') && val && val.id || ((typeof val === 'string') && !!val) || 'This field is required'
      ],
    };
  },

  computed: {
    labelName() {
      return this.label || this.type.charAt(0).toUpperCase() + this.type.slice(1);
    },
    typePlural() {
      const t = this.type.toLowerCase();
      if (t === 'category') return 'categories';
      else if (t === 'person') return 'people';
      else return `${this.type}s`
    },
    model: {
      get() {
        return this.item;
      },
      set(item) {
        this.$emit('update', {type: this.type, item});
      }
      /*get() {
        return this.$store.getters[`transactions/${this.storeItem}`][this.type]
      },
      set(item) {
        let actionStr = '';
        if (this.storeItem === 'selectedTransaction') actionStr = 'updateItemInSelectedTransaction';
        else if (this.storeItem === 'filters') actionStr = 'updateItemInFilters';
        else alert('Unknown storeItem');
        this.$store.commit(`transactions/${actionStr}`, {type: this.type, item})
      }*/
    },
  },

  methods: {
    filterItems(val, update, abort) {
      update(
        () => {
          if (val === '') this.options = [...this.$store.getters['items/items'][this.typePlural]];
          const needle = val.toLowerCase();
          this.options = this.$store.getters['items/items'][this.typePlural]
            .filter(item => item.name.toLowerCase().indexOf(needle) > -1);

          // this.options.unshift({id: 0, name: '-- All --'});
        },
        ref => {
          if (val !== '' && ref.options.length > 0) {
            ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
            ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
          }
        }
      )
    },
  },

  mounted() {
    // this.options = [...this.$store.getters['items/items'][this.typePlural]];
  }
};
</script>

<style scoped>

</style>
