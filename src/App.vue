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
let current = ref({})
let metadata = ref({})

function updateView (file) {
  current.value = {
    name:file.name,
    path:file.path
  }
  const api = props.app.plugins.plugins.dataview?.api
  if (api) {
    metadata.value = api.index.pages.get(file.path)
  }
}

onBeforeMount(() => {
  let plugin = props.app.plugins.plugins[PLUGIN_NAME]

  plugin.registerEvent(
      props.app.metadataCache.on('dataview:metadata-change', (_, file) => {
        if (file.path === current.value.path) {
          updateView(file)
        }
      })
  )

  plugin.registerEvent(
      props.app.workspace.on('file-open', async (file) => {
        updateView(file)
      })
  )

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
    <div>{{ current }}</div>
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
