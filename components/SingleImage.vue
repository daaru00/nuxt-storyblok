<template>
  <img :key="blok._uid" :src="blok.image.filename">
</template>

<script>
export default {
  props: {
    blok: {
      type: Object,
      default: () => ({
        image: {
          filename: ''
        }
      })
    }
  }
}
</script>

<style scoped>
img {
  max-width: 100%;
}
</style>
