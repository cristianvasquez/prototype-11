<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { PLUGIN_NAME } from './consts'
import { inject } from '@vue/runtime-core'

import Metadata from './components/Metadata.vue'

const app = inject('app')

let current = ref({})
let metadata = ref({})

function updateView (file) {
  current.value = {
    name: file.name,
    path: file.path,
    stat: file.stat
  }
  const api = app.plugins.plugins.dataview?.api
  if (api) {
    metadata.value = api.index.pages.get(file.path)
  }
}

onBeforeMount(() => {
  let plugin = app.plugins.plugins[PLUGIN_NAME]

  plugin.registerEvent(
      app.metadataCache.on('changed', file => {
        updateView(file)
      })
  )
  plugin.registerEvent(
      app.vault.on('rename', (file, oldPath) => {
        updateView(file)
      })
  )
  plugin.registerEvent(
      app.vault.on('delete', af => {
        if (!(af instanceof TFile)) return
        console.log('delete',af)
      })
  )

  plugin.registerEvent(
      app.workspace.on('file-open', async (file) => {
        updateView(file)
      })
  )
  plugin.registerEvent(
      app.metadataCache.on('dataview:metadata-change', (_, file) => {
        // When loading, dataview loads data of all pages.
        if (file.path === current.value.path) {
          updateView(file)
        }
      })
  )

})

onMounted(() => {
  const currentFile = app.workspace?.activeLeaf?.view?.file
  if (currentFile) {
    updateView(currentFile)
  }
})

</script>

<template>
  <div class="grid">
    <h1>{{ current.name }}</h1>
    <Metadata v-if="metadata" :metadata="metadata"/>
  </div>
</template>

<style>

/*@import '../styles.css';*/

.grid {
  display: grid;
  padding: 10px;
}

</style>
