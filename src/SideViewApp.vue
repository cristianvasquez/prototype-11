<script lang="ts" setup>
import {onBeforeMount, onMounted, ref} from 'vue'
import {PLUGIN_NAME} from './consts'
import {inject} from '@vue/runtime-core'
import {getDataByFile} from './lib/helpers'
import Metadata from './components/Metadata.vue'
import {getMetadata} from "./lib/extract";
import {App, TAbstractFile, TFile} from "obsidian";

const app: App = inject('app')

let title = ref('loading')
let metadata = ref({})

function updateView(file: TAbstractFile) {
  console.log('updating')
  title.value = file.name
  const data = getDataByFile(app, file as TFile)
  metadata.value = getMetadata(data)
}

onBeforeMount(() => {
  // @ts-ignore
  let plugin = app.plugins.plugins[PLUGIN_NAME]

  plugin.registerEvent(
      app.metadataCache.on('changed', file => {
        updateView(file)
      })
  )

  plugin.registerEvent(
      app.vault.on('rename', (file, oldPath) => {
        console.log('rename', file)
        updateView(file)
      })
  )

  plugin.registerEvent(
      app.vault.on('delete', af => {
        if (!(af instanceof TFile)) return
        console.log('delete', af)
      })
  )

  plugin.registerEvent(
      app.workspace.on('file-open', async (file) => {
        updateView(file)
      })
  )

})

onMounted(() => {
  // @ts-ignore
  const currentFile = app.workspace?.activeLeaf?.view?.file
  if (currentFile) {
    updateView(currentFile)
  }
})

</script>

<template>
  <div class="grid">
    <h1>{{ title }}</h1>
    <Metadata v-if="metadata" :metadata="metadata"/>
  </div>
</template>

<style>

.grid {
  display: grid;
  padding: 10px;
}

</style>
