<template>
  <div>
    <q-file
      :value="files"
      :label="label"
      outlined
      multiple
    >
<!--      <template v-slot:file="{ index, file }">
        <q-chip
          class="full-width q-my-xs"
          :removable="isUploading && uploadProgress[index].percent < 1"
          square
          @remove="cancelFile(index)"
        >
          <q-linear-progress
            class="absolute-full full-height"
            :value="uploadProgress[index].percent"
            :color="uploadProgress[index].color"
            track-color="grey-2"
          />

          <q-avatar>
            <q-icon :name="uploadProgress[index].icon" />
          </q-avatar>

          <div class="ellipsis relative-position">
            {{ file.name }}
          </div>

          <q-tooltip>
            {{ file.name }}
          </q-tooltip>
        </q-chip>
      </template>-->
    </q-file>

    <q-btn
      color="primary"
      dense
      icon="cloud_upload"
      round
      @click="upload"
      :disable="!canUpload"
      :loading="isUploading"
    />
  </div>
  <!--
    <div class="col-4 q-pa-sm">
      <q-uploader
        url="http://localhost:30035/uploads"
        label="Upload files"
        color="purple"
        square
        flat
        bordered
      />
    </div>
  </div>
  -->
</template>

<script>
import axios from "axios";

export default {
  name: "Uploader",
  props: {
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      files: null,
      uploadProgress: [],
      uploading: null
    };
  },
  computed: {
    label() {
      return "Upload your " + this.type;
    },
    isUploading() {
      return this.uploading !== null;
    },

    canUpload() {
      return this.files !== null;
    }
  },

  methods: {
    cancelFile(index) {
      this.uploadProgress[index] = {
        ...this.uploadProgress[index],
        error: true,
        color: "orange-2"
      };
    },

    async updateFiles(files) {
      console.log('-- updateFiles:', files);
      this.files = files;
    },
    upload() {
      clearTimeout(this.uploading);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        /*onUploadProgress: progressEvent => {
          console.log(progressEvent.loaded);
          this.uploadProgress[0].error = false;
          this.uploadProgress[0].color = "green-2";
          var percent = progressEvent.loaded / progressEvent.total;
          this.uploadProgress[0].percent = percent;
          console.log(
            "Progress:",
            progressEvent.loaded,
            "/",
            progressEvent.total,
            percent + "%"
          );
        }*/
      };

      var file = this.files[0];
      //var fileName = file.name;
      var strType = this.type;

      var formData = new FormData();
      formData.append("file", file);
      // You should have a server side REST API

      var _this = this;

      axios
        .post("/uploads", formData, config)
        .then(function(objResponse) {
          objResponse.data.strType = strType;
          console.log("SUCCESS!!", objResponse.data);
          _this.$emit("uploaded", objResponse.data);
        })
        .catch(function(err) {
          console.log("FAILURE!!", err);
          _this.$emit("uploaded", err);
        });
    }
  },

  beforeUnmount() {
    clearTimeout(this.uploading);
  }
};
</script>
