<template>
  <nuxt-link :to="blok.link.url">
    {{ blok.name }}
  </nuxt-link>
</template>

<script>
export default {
  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
