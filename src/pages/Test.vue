<template>
  <div class="q-pa-md" style="max-width: 300px">

    <ItemDropdown type="project" :required="true"
                  :item="$store.getters['transactions/selectedTransaction'].project"
                  @setItem="setItem($event)"></ItemDropdown>

    {{$store.getters['transactions/selectedTransaction'].project}}

  </div>
</template>

<script>
import ItemDropdown from 'components/items/ItemDropdown';

export default {
  components: {ItemDropdown},
  data() {
    return {
      project: {id: 0, name: ''}
    }
  },

  methods: {
    setItem(item) {
      console.log('-- setItem:', item);
      this.$store.commit(`transactions/updateItemInSelectedTransaction`, {type: 'project', item})
    }
  },

  mounted() {
    this.$store.dispatch('items/getItems', {forced: true});
  }

};
</script>
