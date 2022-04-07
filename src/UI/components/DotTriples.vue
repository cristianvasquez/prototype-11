<script lang="ts" setup>
import MetadataValues from './helpers/MetadataValues.vue'
import {computed, inject, onMounted, PropType, ref, toRaw, watchEffect} from 'vue'
import {AppContext} from "../../types";
import {Note, rawDataToDotTriples} from "../../lib/Note";

const context: AppContext = inject('context')

const props = defineProps({
  note: {
    type: Object as PropType<Note>,
    required: true
  }
})

onMounted(async () => {
  watchEffect(async () => update());
})

async function update() {
  console.log('updated dotTriples')
  dotTriples.value = rawDataToDotTriples(toRaw(props.note.getRawData()))
}

const dotTriples = ref([])
const attributes = computed(() => dotTriples.value.filter((current) => current.subject == null))
const triples = computed(() => dotTriples.value.filter((current) => current.subject != null))

</script>

<template>
  <template v-if="attributes">

    {{dotTriples}}
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