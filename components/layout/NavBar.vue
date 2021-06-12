<template>
  <nav v-if="blok.content" v-editable="blok.content">
    <nuxt-link v-for="(link, index) in blok.content.links" :key="index" :to="link.link.url">
      {{ link.name }}
    </nuxt-link>
  </nav>
</template>

<script>
export default {
  data: () => ({
    blok: {}
  }),
  async fetch () {
    // Load blok
    const { data: pageData } = await this.$storyblok.get('cdn/stories/layout/navbar', {
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
