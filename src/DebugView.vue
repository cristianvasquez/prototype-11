<script lang="ts" setup>
import {onBeforeMount, onMounted, ref} from 'vue'
import {PLUGIN_NAME} from './consts'
import {inject} from '@vue/runtime-core'
import {getDataByFile} from './lib/obsidianHelpers'
import Metadata from './components/Metadata.vue'
import {NoteData} from "./lib/extract";
import {App, TAbstractFile, TFile} from "obsidian";
import {ns} from './namespaces.js'

const app: App = inject('app')

let title = ref('loading')
let noteData = ref()

async function updateView(file: TAbstractFile) {
  title.value = file.name
  const data = await getDataByFile(app, file as TFile)
  noteData.value = new NoteData(data, ns)
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
      app.workspace.on('file-open',  (file) => {
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
    <Metadata v-if="noteData" :noteData="noteData"/>
  </div>
</template>

<style>

.grid {
  display: grid;
  padding: 10px;
}

</style>
