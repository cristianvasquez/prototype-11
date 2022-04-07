<script lang="ts" setup>
import {onMounted, ref, toRaw} from 'vue'
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
  context.events.on('update', (file: TFile) => {
    updateView(file)
  })
})

async function updateView(file: TAbstractFile) {
  const prototype = new Prototype11(context.app, file as TFile)
  const data = await prototype.getRawData()
  title.value = file.name
  note.value = new Note(toRaw(data))
}

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
