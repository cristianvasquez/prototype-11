<script lang="ts" setup>
import {onBeforeMount, onMounted, ref} from 'vue'
import {PLUGIN_NAME} from '../consts'
import {inject} from '@vue/runtime-core'
import {getDataByFile} from '../lib/obsidianHelpers'
import Metadata from '../components/Metadata.vue'
import {Extract} from "../lib/extract";
import {TAbstractFile, TFile} from "obsidian";
import {ns} from '../namespaces'
import {AppContext} from "../types";
import NamedNodeExt from "rdf-ext/lib/NamedNode";


const context: AppContext = inject('context')

let title = ref('loading')
let noteData = ref()

async function updateView(file: TAbstractFile) {
  title.value = file.name
  const data = await getDataByFile(context.app, file as TFile)
  const uri: NamedNodeExt = context.config.tFileToURI(file as TFile)
  noteData.value = new Extract(uri, data, ns)
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
  const currentFile = context.app.workspace.getActiveFile()
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
