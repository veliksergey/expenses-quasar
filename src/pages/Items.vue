<template>
  <div>

    <!-- banner -->
    <q-banner class="bg-primary text-white" rounded>
      <div class="row">
        <!-- title -->
        <span class="text-h4 pageTitle">{{ type }}</span>
        <q-space></q-space>
        <!-- add btn -->
        <q-btn round
               flat
               class="bg-primary"
               icon="fa fa-plus"
               @click="editItem()"
        ></q-btn>
      </div>
    </q-banner>

    <q-table
      :rows="items"
      :columns="columns"
      row-key="id"
      :loading="isLoading"
      virtual-scroll
      :rows-per-page-options="[0]"
    >

      <!-- actions -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon='edit'
                 dense
                 round
                 flat
                 size='small'
                 color='primary'
                 class="q-mr-sm"
                 @click="editItem(props.row)"
          ></q-btn>
          <q-btn icon='delete'
                 dense
                 round
                 flat
                 size='small'
                 color='negative'
                 class="q-mr-sm"
                 @click="deleteItem(props.row)"
          ></q-btn>
        </q-td>
      </template>

    </q-table>

    <!-- dialog -->
    <q-dialog v-model="dialog">
      <ItemFormDialog></ItemFormDialog>
    </q-dialog>

  </div>
</template>

<script>
import ItemFormDialog from 'components/items/ItemFormDialog';

export default {
  name: "Items",
  components: {ItemFormDialog},

  data() {
    return {
      columns: [
        {name: 'actions', align: 'left', style: 'width: 40px'},
        {name: 'id', label: 'ID', field: 'id', align: 'left',},
        {name: 'name', label: 'Name', field: 'name', align: 'left'},
      ],
    };
  },

  computed: {
    type() {return this.$route.params.type},
    items() {return this.$store.getters['items/list']},
    isLoading() {return this.$store.getters['items/isLoading']},
    dialog: {
      get() {return this.$store.getters['items/dialog']},
      set(newVal) {this.$store.commit('items/setDialog', newVal)}
    }
  },

  watch: {
    type: function (type) {
      this.onTypeChange();
    }
  },

  methods: {
    onTypeChange() {
      this.$store.commit('items/setType', this.type);
      this.$store.dispatch('items/getList');
    },
    editItem(item) {
      this.$store.commit('items/setSelectedItem', item);
      this.$store.commit('items/setDialog', true);
    },
    deleteItem(item) {
      this.$q.dialog({
        title: `Delete "${item.name}?"`,
        message: `Are you sure you want delete <strong class="text-primary">${item.name}</strong> from <strong class="text-primary">${this.type}</strong>?`,
        html: true,
        cancel: true,
        focus: false,
      }).onOk(() => {
        this.$store.dispatch('items/deleteItem', {item});
      });
    }
  },

  mounted() {
    this.onTypeChange();
  }
};
</script>

<style scoped>
.pageTitle {
  text-transform: capitalize;
}
</style>
