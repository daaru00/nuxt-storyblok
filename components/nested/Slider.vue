<template>
  <div class="slider">
    <img v-for="slide in blok.slides" :key="slide._uid" :src="slide.image.filename">
  </div>
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

<style scoped>
.slider img {
  height: 10em;
  margin: 0 0.5em;
}
</style>
