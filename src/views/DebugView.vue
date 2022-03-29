<script lang="ts" setup>
import {onBeforeMount, onMounted, ref, toRaw} from 'vue'
import {PLUGIN_NAME} from '../consts'
import {inject} from '@vue/runtime-core'
import {getDataByFile} from '../lib/obsidianHelpers'
import Metadata from '../components/Metadata.vue'
import {NoteData} from "../lib/extract";
import {App, TAbstractFile, TFile} from "obsidian";
import {ns} from '../namespaces.js'
import {AppContext} from "../types";


const context: AppContext = inject('context')

let title = ref('loading')
let noteData = ref()

async function updateView(file: TAbstractFile) {
  title.value = file.name
  const data = await getDataByFile(context.app, file as TFile)

  noteData.value = new NoteData(toRaw(data), ns)
}

onBeforeMount(() => {
  // @ts-ignore
  let plugin = app.plugins.plugins[PLUGIN_NAME]

  plugin.registerEvent(
      context.app.metadataCache.on('changed', file => {
        updateView(file)
      })
  )

  plugin.registerEvent(
      context.app.vault.on('rename', (file, oldPath) => {
        console.log('rename', file)
        updateView(file)
      })
  )

  plugin.registerEvent(
      context.app.vault.on('delete', af => {
        if (!(af instanceof TFile)) return
        console.log('delete', af)
      })
  )

  plugin.registerEvent(
      context.app.workspace.on('file-open', (file) => {
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
  <div class="debug-view">
    <h1>{{ title }}</h1>
    <Metadata v-if="noteData" :noteData="noteData"/>
  </div>
</template>

<style>

.debug-view {
  display: grid;
  padding: 10px;
}

</style>
