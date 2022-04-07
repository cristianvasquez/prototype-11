<script lang="ts" setup>
import {inject, onMounted, PropType, ref, watchEffect} from 'vue'
import {dateTimeFormat} from '../../consts'
import {AppContext} from "../../types";
import {Note} from "../../lib/Note";

const context: AppContext = inject('context')
const fileInfo = ref()

const props = defineProps({
  note: {
    type: Object as PropType<Note>,
    required: true
  }
})

onMounted(async () => {
  watchEffect(async () => update());
})

async function update() {
  fileInfo.value = props.note.getFileInfo()
}


</script>

<template v-if="fileInfo">

  <div class="file-info">

    <template v-if="note">
      <div>URI</div>
      <div>{{ note.noteUri }}</div>
    </template>

    <template v-if="fileInfo">
      <div>Created</div>
      <div>{{ fileInfo.created.toLocaleString(dateTimeFormat) }}</div>
      <div>Modified</div>
      <div>{{ fileInfo.updated.toLocaleString(dateTimeFormat) }}</div>
      <div>Size</div>
      <div>{{ fileInfo.size }}</div>
    </template>
  </div>


</template>

<style>

.file-info {
  display: grid;
  grid-template-columns: 1fr 5fr;
  padding: 5px;
  gap: 10px;
}


</style>