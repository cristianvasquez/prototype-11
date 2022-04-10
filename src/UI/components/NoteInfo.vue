<script lang="ts" setup>
import {dateTimeFormat} from '../../consts'

const props = defineProps({
  noteInfo: {
    type: Object,
    required: true
  }
})

</script>

<template v-if="noteInfo">

  <div class="file-info">
    <div>URI</div>
    <div>{{ noteInfo.noteUri }}</div>
    <div>Created</div>
    <div>{{ noteInfo.created.toLocaleString(dateTimeFormat) }}</div>
    <div>Modified</div>
    <div>{{ noteInfo.updated.toLocaleString(dateTimeFormat) }}</div>
    <div>Size</div>
    <div>{{ noteInfo.size }}</div>
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