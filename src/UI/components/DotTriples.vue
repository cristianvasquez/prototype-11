<script lang="ts" setup>
import MetadataValue from "./helpers/Term.vue"

const props = defineProps({
  dotTriples: {
    required: true
  }
})


// onMounted(async () => {
//   watchEffect(async () => update());
// })

</script>

<template>

  <template v-if="dotTriples">
    <h3>Triples</h3>
    <div class="metadata-fields">
      <template v-for="triple in dotTriples">
        <template v-if="triple.subject && triple.predicate && triple.object">
          <metadata-value :term="triple.subject"/>
          <metadata-value :term="triple.predicate"/>
          <metadata-value :term="triple.object"/>
        </template>
        <template v-else>
          <div>{{ triple.raw }}</div>
          <div>{{ triple.exception }}</div>
          <div></div>
        </template>

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
  /*display: grid;*/
  /*grid-template-columns: 2fr 2fr 5fr;*/
  padding: 5px;
  gap: 5px;
}


</style>