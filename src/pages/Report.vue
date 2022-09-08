<template>
<div>

<!--  <ItemDropdown type="project" :required="true" storeItem="selectedTransaction"></ItemDropdown>-->

  <q-card
    v-for="title in Object.keys(tables)"
    :id="cardId(title)"
    :key="title"
    class="q-mb-xl"
  >
    <q-card-section class="bg-primary text-white cursor-pointer" @click="toggleCard(title)">
      {{capitilize(title)}}
    </q-card-section>

    <!-- table section -->
    <q-card-section class="tableSection">
      <q-table :rows="tables[title]"
               :columns="columns"
               dense
               :rows-per-page-options="[-1]"
      >
        <template v-slot:top-right>
          <q-btn
            color="primary"
            icon-right="archive"
            label="Export to csv"
            no-caps
            @click="exportTable(title)">
          </q-btn>
        </template>
      </q-table>
    </q-card-section>
    <!-- !table section -->

    <!-- totals section -->
    <q-card-section v-if="totals[title]">
      In: {{$filters.localCurrency(totals[title].in)}} <br>
      Out: {{$filters.localCurrency(totals[title].out)}} <br>
      Total: {{$filters.localCurrency(totals[title].total)}} <br>
      Total (v2): {{$filters.localCurrency(((totals[title].in * 100) - (totals[title].out * 100)) / 100)}} <br>
      Rows: {{totals[title].rows}}<br>
    </q-card-section>

  </q-card>

  <q-card v-if="totals.total">
    <q-card-section class="bg-primary text-white">
      Total
    </q-card-section>
    <q-card-section>
      In: {{$filters.localCurrency(totals.total.in)}} <br>
      Out: {{$filters.localCurrency(totals.total.out)}} <br>
      Total: {{$filters.localCurrency(totals.total.total)}} <br>
      Rows: {{totals.total.rows}}<br>
    </q-card-section>
  </q-card>

<!--  <q-table v-for="(title) in Object.keys(tables)"
           :id="title"
           :ref="title"
           :key="title"
           :title="capitilize(title)"
           :rows="tables[title]"
           :columns="columns"
           class="q-mb-xl"
           dense
           :rows-per-page-options="[-1]"
           >
    <template v-slot:top-right>
      <q-btn dense flat icon="fas fa-angle-down" @click="toggleTable(title)"></q-btn>
      <q-btn
        color="primary"
        icon-right="archive"
        label="Export to csv"
        no-caps
        @click="exportTable(title)">
      </q-btn>
    </template>

&lt;!&ndash;    <template v-slot:body='props'>
      <q-tr :props='props'>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >

          &lt;!&ndash; project &ndash;&gt;
          <template v-if="col.name === 'project'">
            {{ props.row.project.name }}
          </template>

          <template v-else>
            {{ col.value }}
          </template>

        </q-td>
      </q-tr>
    </template>&ndash;&gt;

  </q-table>-->


</div>
</template>

<script>
import {exportFile, useQuasar} from 'quasar';
// import ItemDropdown from 'components/items/ItemDropdown';

export default {
  name: "Report",
  // components: {ItemDropdown},

  data() {
    return {
      $q: useQuasar(),
      projectId: 2,
      groupBy: '',
      totals: {},
      columns: [
        // {name: 'actions', style: 'background-color: orange; width: 10px; padding: 0'},
        {name: 'id', label: 'ID', field: 'id', align: 'right', sortable: true,},
        {name: 'date', label: 'Date', field: 'date', align: 'right', sortable: true, format: (val, row) => this.$filters.localDate(val)},
        {name: 'amount', label: 'Amount', field: 'amount', sortable: true, classes: (row) => {return row.type === 1 ? 'text-green-9' : 'text-pink-9'}}, // format: (val, row) => this.$filters.localCurrency(val) - doesn't work when exporting excel
        {name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true},
        // {name: 'projectName', label: 'Project', field: 'projectName', align: 'left', sortable: true},
        {name: 'vendorName', label: 'Vendor', field: 'vendorName', align: 'left', sortable: true},
        // {name: 'accountName', label: 'Account', field: 'accountName', align: 'left', sortable: true},
        {name: 'categoryName', label: 'Category', field: 'categoryName', align: 'left', sortable: true},
        {name: 'notes', label: 'Notes', field: 'notes', align: 'left', sortable: false},

        // {name: 'project', label: 'Project', field: 'projectId', align: 'left', sortable: true, format: (val, row) => row.project?.name},
        // {name: 'vendor', label: 'Vendor', field: 'vendorId', align: 'left', sortable: true, format: (val, row) => row.vendor?.name},
        // {name: 'account', label: 'Account', field: 'accountId', align: 'left', sortable: true, format: (val, row) => row.account?.name},
        // {name: 'category', label: 'Category', field: 'catId', align: 'left', sortable: true, format: (val, row) => row.category?.name},
      ],
    }
  },

  computed: {
    tables() {return this.$store.getters['report/tables']},
  },

  methods: {
    async getTables() {
      await this.$store.dispatch('report/getTables', {
        projectId: this.projectId,
        groupBy: this.groupBy,
      });
      this.calculateTotals();
    },
    capitilize(value) {
      return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    },

    exportTable (tableTitle) {
      console.log(`-- ${tableTitle}`, this.tables[tableTitle].length, this.tables[tableTitle]);
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))].concat(
        this.tables[tableTitle].map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[ col.field === void 0 ? col.name : col.field ],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    }, // !exportTable

    cardId(title) {
      return title.replaceAll(' ', '_') + 'Card';
    },

    toggleCard(title) {
      const el = document.querySelector(`#${this.cardId(title)} .tableSection .q-table__container`);
      if (el.style.display !== 'none') el.style.display = 'none';
      else el.style.display = 'block';
    },

    calculateTotals() {
      const totals = {};

      Object.keys(this.tables).forEach(title => {

        if (!totals[title]) totals[title] = {in: 0, out: 0, total: 0, rows: 0};
        if (!totals.total) totals.total = {in: 0, out: 0, total: 0, rows: 0};

        this.tables[title].forEach(t => {
          totals[title].rows++;
          totals.total.rows++;

          if (t.type === 0) { // out
            totals[title].out = ((totals[title].out * 100) + (t.amount * 100)) / 100;
            totals[title].total = ((totals[title].total * 100) - (t.amount * 100)) / 100;

            totals.total.out = ((totals.total.out * 100) + (t.amount * 100)) / 100;
            totals.total.total = ((totals.total.total * 100 - t.amount * 100) / 100).toFixed(2);
          } else if (t.type === 1) { // in
            totals[title].in = ((totals[title].in * 100) + (t.amount * 100)) / 100;
            totals[title].total = ((totals[title].total * 100) + (t.amount * 100)) / 100;

            totals.total.in = ((totals.total.in * 100) + (t.amount * 100)) / 100;
            totals.total.total = ((totals.total.total * 100 + t.amount * 100) / 100).toFixed(2);
          } else {
            alert(`WRONG TYPE FOR id #${t.id}`);
          }
        });

      });

      // total of all tables
      // Object.keys(totals).forEach(title => {
      //   totals[title]
      // })

      this.totals = totals;
    },
  },

  mounted() {
    this.getTables();
  }
};

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}
</script>

<style scoped>

</style>
