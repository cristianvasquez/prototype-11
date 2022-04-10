<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {inject} from '@vue/runtime-core'
import NoteInfo from './components/NoteInfo.vue'
import {Note, rawDataToDotTriples} from "../lib/Note";
import {TAbstractFile, TFile} from "obsidian";
import {AppContext, ObsidianRawData} from "../types";
import {Prototype11} from "../lib/Prototype11";
import Status from "./components/Status.vue";
import DotTriples from "./components/DotTriples.vue";
import {withEntities} from "../triplifiers/dotTriples";
import {indexNote} from "../lib/indexer";

const context: AppContext = inject('context')

let title = ref('loading')
let ver = ref(1)

onMounted(() => {

  // @ts-ignore
  const currentFile = app.workspace?.activeLeaf?.view?.file
  if (currentFile) {
    updateView(currentFile)
  }
  context.events.on('update', (file: TFile) => {
    updateView(file)
    ver.value = ver.value + 1
  })

  context.events.on('index', async (file: TFile) => {
    console.log('index')
    const note = await updateView(file)
    const size = await indexNote(context.triplestore, note, context.ns)
    console.log(`indexed ${size} triples`)
    ver.value = ver.value + 1
  })

})

async function updateView(file: TAbstractFile) {
  if (file) {
    const prototype = new Prototype11(context.app, file as TFile)
    const data = await prototype.getRawData()
    const note = new Note(data)
    title.value = file.name
    noteUri.value = note.noteUri
    noteInfo.value = note.getFileInfo()
    await updateDotTriples(note.getRawData())
    return note;
  } else {
    title.value = 'None'
    noteUri.value = undefined
  }
}

let noteUri = ref()
let noteInfo = ref()
let dotTriples = ref()

async function updateDotTriples(rawData: ObsidianRawData) {
  const spo = rawDataToDotTriples(rawData)
  dotTriples.value = spo.map((triple) => withEntities(triple, context.uriResolvers))
}

</script>

<template>
  <div class="debug-view">
    <h1>{{ title }}</h1>
    <template v-if="ver">
      <NoteInfo v-if="noteInfo" :noteInfo="noteInfo"/>
      <DotTriples v-if="dotTriples" :dotTriples="dotTriples"/>
      <Status v-if="noteUri" :key="ver" :noteUri="noteUri"/>
    </template>
  </div>
</template>

<style>

.debug-view {
  display: grid;
  padding: 10px;
}

</style>
