<template>
  <div>
    <h2>Test Page</h2>

    <q-input label="File Name" v-model="fileName"></q-input>
    <q-uploader
      label="File"
      :factory="factoryFn"
      :auto-upload="true"
      @uploaded="onFileAdd"
      accept=".jpg, .jpeg, .png, .pdf, image/*"
      max-files="1"
      :no-thumbnails="true"
      flat
    >
<!--      <template v-slot:list="">-->
<!--      </template>-->
    </q-uploader>

<!--    <div class="row">
      <div class="col">
        <q-file
          label="File"
          v-model="file"
        ></q-file>
      </div>
      <div class="col">
        <q-input
          label="File Name"
          v-model="fileName"
        ></q-input>
      </div>
    </div>
    <br>
    <q-btn
      label="Submit"
      @click="upload"
      color="primary"
      class="full-width"
      ></q-btn>-->
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
