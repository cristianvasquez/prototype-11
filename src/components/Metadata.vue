<script lang="ts" setup>
import MetadataValues from './helpers/MetadataValues.vue'
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

  <div class="attributes">

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

  <template v-if="metadata.pairs">
    <h3>Attributes</h3>
    <div class="attributes">
      <template v-for="tuple in metadata.pairs">
        <metadata-values :value="tuple.predicate"/>
        <metadata-values :value="tuple.object"/>
      </template>
    </div>
  </template>

  <template v-if="metadata.triads">
    <h3>Triples</h3>
    <div class="fields">
      <template v-for="tuple in metadata.triads">
        <metadata-values :value="tuple.subject"/>
        <metadata-values :value="tuple.predicate"/>
        <metadata-values :value="tuple.object"/>
      </template>
    </div>

  </template>

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

.attributes {
  display: grid;
  grid-template-columns: 1fr 5fr;
  padding: 5px;
  gap: 10px;
}

.fields {
  display: grid;
  grid-template-columns: 2fr 2fr 5fr;
  padding: 5px;
  gap: 5px;
}


</style>