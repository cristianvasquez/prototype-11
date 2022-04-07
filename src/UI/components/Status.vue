<script lang="ts" setup>
import {createApp, inject, onMounted, PropType, ref, toRaw, watchEffect} from 'vue'
import {ModalWrapper} from './helpers/ModalWrapper'
import {AppContext, Dataset} from "../../types";
import {Note} from "../../lib/Note";
import Quads from "./Quads.vue";

const context: AppContext = inject('context')
const currentDataset = ref()
const connectionStatus = ref()

const props = defineProps({
  note: {
    type: Object as PropType<Note>,
    required: true
  }
})

onMounted(async () => {
  watchEffect(async () => extract());
})

async function extract() {
  await fetchCurrentDataset()
}

async function fetchCurrentDataset() {
  const noteUri = toRaw(props.note.noteUri)
  try {
    currentDataset.value = await context.triplestore.getDataset(noteUri)
    connectionStatus.value = null
  } catch (e) {
    connectionStatus.value = e
  }
}

async function popupRDF(dataset: Dataset) {
  const rdfView = createApp(Quads)
  rdfView.provide('dataset', toRaw(dataset))
  rdfView.provide('context', context)
  new ModalWrapper(context.app, rdfView).open()
}

async function indexRDF(dataset: Dataset) {
  await context.triplestore.deleteDataset(props.note.noteUri)
  await context.triplestore.insertDataset(props.note.noteUri, dataset)
  await fetchCurrentDataset()
}

</script>

<template>

  <div class="rdf-status">
    <h3>RDF</h3>
    <div v-if="connectionStatus" class="error">{{ connectionStatus }}</div>
    <div v-else-if="currentDataset">
      {{ currentDataset.size }}
      <a class='internal-link' href="#"
         @click="popupRDF(currentDataset)">triples</a>
      in database
    </div>
  </div>

</template>

<style>
.rdf-status {
  margin-top: auto;
}

</style>