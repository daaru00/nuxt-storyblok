<template>
  <div class="teaser">
    {{ blok.headline }}
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

<style>
.teaser {
  text-align: center;
  font-size: 4em;
}
</style>
