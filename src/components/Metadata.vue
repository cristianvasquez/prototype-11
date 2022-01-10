<script lang="ts" setup>
import DataviewValue from './DataviewValue.vue'
import DataviewProperty from './DataviewProperty.vue'
import {createBuilder} from '../lib/rdfBuilder'
import {inject, PropType} from 'vue'
import {dateTimeFormat} from '../consts'
import {RDFModal} from './RDFModal'
import {App} from 'obsidian'
import {Metadata} from "../lib/helpers";

const app: App = inject('app')

const props = defineProps({
  metadata: {
    type: Object as PropType<Metadata>,
    required: true
  }
})

async function popupRDF() {
  const {metadataToRDF} = createBuilder(app)
  // const data = metadataToRDF(props.metadata, dedupFields.value)
  // new RDFModal(app, data.dataset.toString()).open()
  new RDFModal(app, 'Hi there').open()

}


</script>

<template v-if="metadata">

  {{ metadata }}
  <div class="fields">

    <template v-if="metadata.created">
      <div>Created</div>
      <div>{{ metadata.created.toLocaleString(dateTimeFormat) }}</div>
    </template>

    <template v-if="props.metadata.updated">
      <div>Modified</div>
      <div>{{ metadata.updated.toLocaleString(dateTimeFormat) }}</div>
    </template>

    <template v-if="props.metadata.size">
      <div>Size</div>
      <div>{{ metadata.size }}</div>
    </template>

  </div>

  <div v-if="metadata.tuples" class="fields">
    <h3>Fields</h3>
    <div/>
    <template v-for="tuple in metadata.tuples" class="fields">
      {{tuple.property}}
      {{tuple.value}}
<!--      <dataview-property :labels="fieldLabels.get(key)" :property="key"/>-->
<!--      <dataview-value :value="value"/>-->
    </template>
  </div>

  <h3 v-if="metadata.links && metadata.links.length">Links</h3>
  <template v-for="(value) in metadata.links">
    <dataview-value :value="value"/>
  </template>

  <h3><a @click="popupRDF">Gimme some RDF</a></h3>

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