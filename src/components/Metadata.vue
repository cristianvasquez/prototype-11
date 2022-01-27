<script lang="ts" setup>
import MetadataValues from './helpers/MetadataValues.vue'
import {computed, inject, onMounted, PropType, ref, toRaw, watchEffect} from 'vue'
import {dateTimeFormat} from '../consts'
import {RDFModal} from './RDFModal'
import {App} from 'obsidian'
import {Dataset} from "../types";
import {Triplestore} from "../lib/client";
import {NoteData} from "../lib/extract";

const app: App = inject('app')
const triplestore: Triplestore = inject('triplestore')

const props = defineProps({
  noteData: {
    type: Object as PropType<NoteData>,
    required: true
  }
})

async function popupRDF(dataset: Dataset) {
  new RDFModal(app, dataset.toCanonical()).open()
}

const currentDataset = ref()
const triplifiedDataset = ref()

const metadata = ref()
const dotTriples = ref([])

const attributes = computed(() => dotTriples.value.filter((current) => current.subject == null))
const triples = computed(() => dotTriples.value.filter((current) => current.subject != null))

const connectionStatus = ref()

async function fetchCurrentDataset() {
  const noteUri = toRaw(props.noteData.noteUri)
  try {
    currentDataset.value = await triplestore.getDataset(noteUri)
    connectionStatus.value = null
  } catch (e) {
    connectionStatus.value = e
  }

}

async function indexRDF(dataset: Dataset) {
  await triplestore.deleteDataset(props.noteData.noteUri)
  await triplestore.insertDataset(props.noteData.noteUri, dataset)
  await fetchCurrentDataset()
}


async function extractNotedata() {
  await fetchCurrentDataset()
  metadata.value = props.noteData.getMetadata()
  const full = await props.noteData.getFullDataset()
  triplifiedDataset.value = full.dataset
  dotTriples.value = full.dotTriples
}


onMounted(async () => {
  watchEffect(async () => extractNotedata());
})

</script>

<template v-if="metadata">

  <div class="metadata-attributes">

    <template v-if="noteData">
      <div>URI</div>
      <div>{{ noteData.noteUri }}</div>
    </template>

    <template v-if="metadata">
      <div>Created</div>
      <div>{{ metadata.created.toLocaleString(dateTimeFormat) }}</div>
      <div>Modified</div>
      <div>{{ metadata.updated.toLocaleString(dateTimeFormat) }}</div>
      <div>Size</div>
      <div>{{ metadata.size }}</div>
    </template>

  </div>

  <template v-if="attributes">
    <h3>Attributes</h3>
    <div class="metadata-attributes">
      <template v-for="tuple in attributes">
        <metadata-values :value="tuple.predicate"/>
        <metadata-values :value="tuple.object"/>
      </template>
    </div>
  </template>

  <template v-if="triples">
    <h3>Triples</h3>
    <div class="metadata-fields">
      <template v-for="tuple in triples">
        <metadata-values :value="tuple.subject"/>
        <metadata-values :value="tuple.predicate"/>
        <metadata-values :value="tuple.object"/>
      </template>
    </div>
  </template>

  <div class="rdf-status">
    <h3>RDF</h3>
    <div v-if="triplifiedDataset">
      {{ triplifiedDataset.size }}
      <a class='internal-link' href="#"
         @click="popupRDF(triplifiedDataset)">triples</a> extracted
      (<a class='internal-link' href="#"
          @click="indexRDF(triplifiedDataset)">index</a>)
    </div>
    <div v-if="connectionStatus" class="error">{{ connectionStatus }}</div>
    <div v-else-if="currentDataset">
      {{ currentDataset.size }}
      <a class='internal-link' href="#"
         @click="popupRDF(currentDataset)">triples</a>
      in database
    </div>
  </div>

  <!--  <h3 v-if="metadata.links && metadata.links.length">Links</h3>-->
  <!--  <template v-for="(value) in metadata.links">-->
  <!--    <dataview-value :value="value"/>-->
  <!--  </template>-->

  <!--  <h3><a @click="popupRDF">Gimme some RDF</a></h3>-->

  <!--  <h3>Tasks</h3>-->
  <!--  <div v-for="(value) in props.metadata.tasks">-->
  <!--    <dataview-value :value="value"/>-->
  <!--    <br/>-->
  <!--  </div>-->
</template>

<style>

/*--background-modifier-success: #197300;*/
/*--background-modifier-error: #3d0000;*/

.rdf-status {
  margin-top: auto;
}

.metadata-attributes {
  display: grid;
  grid-template-columns: 1fr 5fr;
  padding: 5px;
  gap: 10px;
}

.metadata-fields {
  display: grid;
  grid-template-columns: 2fr 2fr 5fr;
  padding: 5px;
  gap: 5px;
}


</style>