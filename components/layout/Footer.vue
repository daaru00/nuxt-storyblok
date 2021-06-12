<template>
  <footer v-if="blok.content" v-editable="blok.content">
    <component
      :is="child.component"
      v-for="child in blok.content.bloks"
      :key="child._uid"
      v-editable="child"
      :blok="child"
    />
  </footer>
</template>

<script>
export default {
  data: () => ({
    blok: {}
  }),
  async fetch () {
    // Load blok
    const { data: pageData } = await this.$storyblok.get('cdn/stories/layout/footer', {
      version: this.$config.storyblokVersion
    })

    this.blok = pageData.story
  },
  mounted () {
    // Register for input events
    this.$storyblokBridgeListener('input', ({ story }) => {
      if (story.id === this.blok.id) {
        this.blok = story
      }
    })
  }
}
</script>
