<template>
  <div class="grid">
    <component
      :is="child.component"
      v-for="child in blok.columns"
      :key="child._uid"
      v-editable="child"
      :blok="child"
    />
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
.grid {
  width: 100%;
  display: inline-flex;
  flex-wrap: wrap;
}
.grid > * {
  flex-grow: 1;
}
</style>
