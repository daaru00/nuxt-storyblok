<template>
  <header v-if="blok.content" v-editable="blok.content">
    <slot />
    <v-nav-bar />
  </header>
</template>

<script>
import NavBar from './NavBar'

export default {
  components: {
    'v-nav-bar': NavBar
  },
  data: () => ({
    blok: {}
  }),
  async fetch () {
    // Load blok
    const { data: pageData } = await this.$storyblok.get('cdn/stories/layout/header', {
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
