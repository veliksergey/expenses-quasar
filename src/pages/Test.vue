<template>
  <div>

    <q-btn-toggle
      v-model="model"
      push
      rounded
      glossy
      toggle-color="purple"
      :options="[
          {value: 'one', slot: 'one'},
          {value: 'two', slot: 'two'},
          {value: 'three', slot: 'three'}
        ]"
    >
      <template v-slot:one>
        <div class="row items-center no-wrap">
          <div class="text-center">
            Pick<br>boat
          </div>
          <q-icon right name="directions_boat" />
        </div>
      </template>

      <template v-slot:two>
        <div class="row items-center no-wrap">
          <div class="text-center">
            Pick<br>car
          </div>
          <q-icon right name="directions_car" />
        </div>
      </template>

      <template v-slot:three>
        <div class="row items-center no-wrap">
          <div class="text-center">
            Pick<br>railway
          </div>
          <q-icon right name="directions_railway" />
        </div>
      </template>
    </q-btn-toggle>

  </div>
</template>

<script>
import {api, baseUrl} from 'boot/axios';

export default {
  name: "Test",

  data() {
    return {
      file: null,
      fileName: '',
    }
  },

  computed: {
  },

  methods: {
    factoryFn(files) {
      // console.log('-- factoryFn:', files);
      // console.log('-- factoryFn file:', files[0]);
      // console.log('-- factoryFn:', files[0].name);
      return {
        url: `${baseUrl}/documents`,
        fieldName: this.fileName
      }
    },

    onFileAdd({files, xhr}) {
      const res = JSON.parse(xhr.response);
      console.log('===== res:', res);
    },

    async upload() {
      console.log('-- file:', this.file);
      console.log('-- file.name:', this.file.name);

      const formData = new FormData();
      formData.append('file', this.file, this.file.name);
      formData.append('fileName', this.fileName);

      const res = await api.post('documents', formData,
        {headers: {'Content-Type': 'multipart/form-data'}});

      console.log('-- res:', res);
    }
  },
};
</script>

<style scoped>

</style>
