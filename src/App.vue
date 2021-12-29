<script setup>
import { DataviewApi, FullIndex } from 'obsidian-dataview'
import { defineProps, ref, onMounted, onBeforeMount } from 'vue'
import { PLUGIN_NAME } from './main'
import { canonicalizeVarName } from './util/normalize'

const { TAbstractFile } = require('obsidian')

const props = defineProps({
  app: {
    type: Object,
    required: true
  }
})
let currentFile = ref({})
let metadata = ref({})

function updateView (file) {
  currentFile.value = file
  const api = props.app.plugins.plugins.dataview?.api
  if (api) {
    metadata.value = api.index.pages.get(file.path)
  }
}

onBeforeMount(() => {
  let plugin = props.app.plugins.plugins[PLUGIN_NAME]
  console.log('register trigger updateView')
  plugin.registerEvent(props.app.workspace.on('file-open', async (file) => {
    updateView(file)
  }))
  console.log('mounted!')
})

onMounted(() => {
  const currentFile = props.app.workspace?.activeLeaf?.view?.file
  if (currentFile) {
    updateView(currentFile)
  }
})

</script>

<template>
  <div class="grid">
    <div>{{ currentFile }}</div>
    <div v-if="metadata">
      <div>ctime: {{ metadata.ctime }}</div>
      <div>mtime: {{ metadata.mtime }}</div>
      <div>size: {{ metadata.size }}</div>
      <h3>Fields</h3>
      <div v-for="[key, value] in metadata.fields">
        {{ key }} => {{ value }};
      </div>

      <h3>Tags</h3>
      <div v-for="(value, name) in metadata.tags">
        {{ value }}
      </div>

      <h3>Links</h3>
      <div v-for="(value, name) in metadata.links">
        {{ name }}: {{ value }}
      </div>

      <h3>Tasks</h3>
      <div v-for="(value, name) in metadata.tasks">
        {{ name }}: {{ value }}
      </div>
    </div>
  </div>
</template>

<style>
.grid {
  display: grid;
}
</style>
