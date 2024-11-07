<template>
  <q-uploader ref="uploader">
    <template v-slot:header="scope">
      <div class="row items-center justify-between p-2">
        <q-btn
          flat
          :disable="!scope.canAddFiles"
          icon="camera_alt"
          color="primary"
          label="上传现场照片视频:"
          @click="scope.pickFiles"
          class="w-full"
        >
          <span class="ml-2"> ({{ scope.files.length }}/{{ maxFiles }}) </span>
          <q-uploader-add-trigger v-if="scope.canAddFiles" />
        </q-btn>
      </div>
    </template>

    <template v-slot:list="scope">
      <div v-if="scope.files.length > 0" class="grid grid-cols-4 gap-4">
        <template v-for="file in scope.files" :key="file.__key">
          <!-- {{ file.type }} -->
          <div class="row items-start">
            <q-img
              :ratio="1"
              :src="
                file.__img
                  ? file.__img.src
                  : file.type.includes('video')
                  ? 'resource/img/video.svg'
                  : 'resource/img/file.svg'
              "
              class="rounded-lg"
              @click="previewURL(file.__img.src)"
            />

            <q-btn
              size="8px"
              flat
              dense
              round
              icon="close"
              @click="scope.removeFile(file)"
              class="-t-ml-3 -mt-1 bg-grey-8 text-white"
            />
          </div>
        </template>
      </div>
      <div v-else class="opacity-30 text-center">暂无数据</div>
    </template>
  </q-uploader>
</template>

<script setup></script>
