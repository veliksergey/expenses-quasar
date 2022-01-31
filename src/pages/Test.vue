<template>
  <div class="q-pa-md"
       style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary"
               multi-line>
        Model: "{{ model }}"
      </q-badge>

      <q-select filled
                v-model="model"
                :options="options"
                label="Standard"
                use-input
                input-debounce="0"
                @filter="filterFn"
                behavior="menu"
                use-chips

                @new-value="newValFn"
      /> <!-- new-value-mode="add" -->
    </div>
  </div>
</template>

<script>
import {ref} from 'vue';

const initedOptions = [
  {
    label: 'Google',
    value: 'Google',
    description: 'Search engine',
    category: '1'
  },
  {
    label: 'Facebook',
    value: 'Facebook',
    description: 'Social media',
    category: '1'
  },
  {
    label: 'Twitter',
    value: 'Twitter',
    description: 'Quick updates',
    category: '2'
  },
  {
    label: 'Apple',
    value: 'Apple',
    description: 'iStuff',
    category: '2'
  },
  {
    label: 'Oracle',
    value: 'Oracle',
    disable: true,
    description: 'Databases',
    category: '3'
  }
];

export default {

  // data() {
  //   return {
  //     options: [...initedOptions],
  //   }
  // },

  setup() {
    const options = ref(initedOptions);
    const model = ref(null);
    return {
      // model: ref(null),
      initedOptions,
      options,
      model,

      filterFn(val, update) {
        if (val === '') {
          update(() => {
            options.value = initedOptions;
          });
          return;
        }

        update(
          () => {
            const needle = val.toLowerCase();
            options.value = initedOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
          },

          ref => {
            if (val !== '' && ref.options.length > 0) {
              ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
            }
          }
        );
      },
      tttTEST(val, update, abort) {
        setTimeout(() => {
          update(
            () => {
              if (val === '') {
                options.value = stringOptions;
              } else {
                const needle = val.toLowerCase();
                options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1);
              }
            },

            // "ref" is the Vue reference to the QSelect
            ref => {
              if (val !== '' && ref.options.length > 0) {
                ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
                ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
              }
            }
          );
        }, 300);
      },
      newValFn(value, done) {
        console.log('-- newValFn:', value);

        const newObj = {
          label: value,
          value: value,
          description: value,
          category: '1'
        };

        initedOptions.push(newObj);

        done(newObj);
      }


    };
  }
};
</script>
