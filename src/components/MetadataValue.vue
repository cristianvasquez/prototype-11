<script setup>
import InternalLink from './InternalLink.vue'
import { toRaw } from 'vue'

const props = defineProps({
  value: {
    type: Object,
    required: true
  }
})

function hasLinks () {
  return props.value.entities?.internalLinks != null
}


function spanify () {
  const text = toRaw(props.value.value)
  const links = toRaw(props.value.entities.internalLinks)

  const includesLink = (txt) => {
    const match = links.filter((x) => (txt === `[[${x}]]` || txt.indexOf(`[[${x}]]`) > 0))
    return match.length > 0 ? match[0] : false
  }

  function extractIfLinks (txt) {
    const result = []
    const match = includesLink(txt)
    if (match) {
      const pre = txt.substring(0, txt.indexOf(`[[${match}]]`))
      if (pre.length) {
        result.push({
          value: pre,
          type: 'text'
        })
      }
      result.push({
        value: match,
        type: 'link'
      })
    }
    return result
  }

  let result = []
  let current = 0
  for (let i = 0; i < text.length; i++) {
    let chunk = text.substring(current, i)
    const matches = extractIfLinks(chunk)
    if (matches.length > 0) {
      current = i
    }
    result = [...result, ...matches]
    if (i === text.length - 1) {
      const tail = text.substring(current, text.length)
      const matches = extractIfLinks(tail)
      if (matches.length > 0) {
        result = [...result, ...matches]
      } else {
        result.push({
          value: tail,
          type: 'text'
        })
      }

    }
  }

  return result
}

</script>

<template>
  <div v-if="hasLinks()" class="words">
    <template v-for="span in spanify()">
      <template v-if="span.type==='link'">
        <internal-link :linkTo="span.value"/>
      </template>
      <template v-else>{{ span.value }}</template>
    </template>
  </div>
  <div v-else>{{ props.value.value }}</div>
</template>

<style scoped>

.words {

}

</style>