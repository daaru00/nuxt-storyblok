<template>
  <div class="feature">
    {{ blok.name }}
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
.feature {
  text-align: center;
  font-size: 2em;
}
</style>
