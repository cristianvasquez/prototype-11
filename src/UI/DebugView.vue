<script lang="ts" setup>
import {onBeforeMount, onMounted, ref, toRaw} from 'vue'
import {PLUGIN_NAME} from '../consts'
import {inject} from '@vue/runtime-core'
import NoteInfo from './components/NoteInfo.vue'
import {Note} from "../lib/Note";
import {TAbstractFile, TFile} from "obsidian";
import {AppContext} from "../types";
import {Prototype11} from "../lib/Prototype11";
import Status from "./components/Status.vue";
import DotTriples from "./components/DotTriples.vue";

const context: AppContext = inject('context')

let title = ref('loading')
let note = ref()

onMounted(() => {
  // @ts-ignore
  const currentFile = app.workspace?.activeLeaf?.view?.file
  if (currentFile) {
    updateView(currentFile)
  }
})

async function updateView(file: TAbstractFile) {
  console.log(`updatingView, for file ${file.path}`)
  const prototype = new Prototype11(context.app, file as TFile)
  const data = await prototype.getRawData()

  title.value = file.name
  note.value = new Note(toRaw(data))
}


async function deleteIndex(path: String) {
  console.log('Deleting', path)
  const uri = context.config.pathToUri(path)
  await context.triplestore.deleteDataset(uri)
  console.log('Done')
}

onBeforeMount(() => {
  // @ts-ignore
  let plugin = app.plugins.plugins[PLUGIN_NAME]

  plugin.registerEvent(
      context.app.metadataCache.on('changed', file => {
        console.log('File modified')
        // updateView(file)
      })
  )

  plugin.registerEvent(
      context.app.vault.on('rename', async (file, oldPath) => {
        if (!(file instanceof TFile)) return
        console.log('Renaming')
        await deleteIndex(oldPath)
        await updateView(file)
      })
  )

  plugin.registerEvent(
      context.app.vault.on('delete', async af => {
        if (!(af instanceof TFile)) return
        await deleteIndex(af.path)
      })
  )

  plugin.registerEvent(
      context.app.workspace.on('file-open', (file) => {
        updateView(file)
      })
  )
})

</script>

<template>
  <div class="debug-view">
    <h1>{{ title }}</h1>
    <template v-if="note">
      <NoteInfo :note="note"/>
      <DotTriples :note="note"/>
      <Status :note="note"/>
    </template>
  </div>
</template>

<style>

.debug-view {
  display: grid;
  padding: 10px;
}

</style>
