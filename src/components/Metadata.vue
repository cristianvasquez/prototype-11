<script setup>
import DataviewValue from './DataviewValue.vue'
import DataviewProperty from './DataviewProperty.vue'
import { createBuilder } from '../lib/rdfBuilder'
import { canonicalizeVarName } from '../lib/normalize'
import { computed, inject } from 'vue'
import {dateTimeFormat} from '../consts'

import { RDFModal } from './RDFModal'

const app = inject('app')

const props = defineProps({
  metadata: {
    type: Object,
    required: true
  }
})

async function index () {
  const { metadataToRDF } = createBuilder(app)
  const data = metadataToRDF(props.metadata, dedupFields.value)
  new RDFModal(app, data.dataset.toString()).open()
}

const isNormalized = (value) => value === canonicalizeVarName(value)

const ignoreFields = new Set([
  'position'
])

const dedupFields = computed(() => {
  const result = new Map()
  if (props.metadata.fields) {
    for (const [key, value] of props.metadata.fields) {
      if (!result.has(canonicalizeVarName(key)) && !ignoreFields.has(canonicalizeVarName(key))) {
        result.set(canonicalizeVarName(key), value)
      }
    }
  }
  return result
})

const fieldLabels = computed(() => {
  const labels = new Map()
  if (props.metadata.fields) {
    for (const [key, value] of props.metadata.fields) {
      if (!isNormalized(key)) {
        if (!labels.has(canonicalizeVarName(key))) {
          labels.set(canonicalizeVarName(key), [key])
        } else {
          labels.set(canonicalizeVarName(key), [key, ...labels.get(canonicalizeVarName(key))])
        }
      }
    }
  }
  return labels
})

</script>

<template>

  <div class="fields">
    <template v-if="props.metadata.ctime">
    <div>Created</div>
    <div>{{ props.metadata.ctime.toLocaleString(dateTimeFormat) }}</div>
    </template>

    <template v-if="props.metadata.mtime">
      <div>Modified</div>
      <div>{{ props.metadata.mtime.toLocaleString(dateTimeFormat) }}</div>
    </template>

    <template v-if="props.metadata.size">
      <div>Size</div>
      <div>{{ props.metadata.size }}</div>
    </template>

  </div>

  <div v-if="dedupFields" class="fields">
    <h3>Fields</h3>
    <div/>
    <template v-for="[key, value] in dedupFields" class="fields">
      <dataview-property :labels="fieldLabels.get(key)" :property="key"/>
      <dataview-value :value="value"/>
    </template>
  </div>

  <h3 v-if="props.metadata.links && props.metadata.links.length">Links</h3>
  <template v-for="(value) in props.metadata.links">
    <dataview-value :value="value"/>
  </template>

  <h3><a @click="index">Gimme some RDF</a></h3>

  <!--  <h3>Tasks</h3>-->
  <!--  <div v-for="(value) in props.metadata.tasks">-->
  <!--    <dataview-value :value="value"/>-->
  <!--    <br/>-->
  <!--  </div>-->
</template>

<style>

.fields {
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding: 10px;
}


</style>