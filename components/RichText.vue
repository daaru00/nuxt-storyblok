<template>
  <!-- eslint-disable vue/no-v-html -->
  <div v-html="content" />
</template>

<script>
export default {
  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    content () {
      return this.$storyblok.richTextResolver.render(this.blok.content)
    }
  }
}
</script>
