<template>
  <article v-if="page">
    <header>
      <h1>
        {{ page.name }}
      </h1>
    </header>
    <template v-for="blok in page.content.body">
      <component :is="blok.component" :key="blok._uid" v-editable="blok" :blok="blok" />
    </template>
  </article>
</template>

<script>
import Slider from '../components/Slider'

export default {
  components: {
    'v-slider': Slider
  },
  async asyncData ({ app, route, error, $config }) {
    if (!$config.storyblokAccessToken) {
      return error({ statusCode: 404, message: 'Page not found' })
    }

    /** @type string */
    let currentPath = route.path || ''

    // Removing trailing slash
    if (currentPath.startsWith('/')) {
      currentPath = currentPath.slice(1)
    }
    // Remove leading slash
    if (currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1)
    }

    // If path is empty set the homepage
    if (!currentPath || currentPath === '/') {
      currentPath = 'home'
    }

    // Get page searching by current path
    const res = await app.$storyblok.get('cdn/stories', {
      version: $config.storyblokVersion,
      by_slugs: currentPath
    })

    // Check if page does not exist
    if (res.data.stories.length === 0) {
      return error({ statusCode: 404, message: 'Page not found' })
    }

    // Get first page matched
    const page = res.data.stories.shift()
    return { page }
  },
  mounted () {
    if (this.$config.storyblokBridgeEnabled) {
      // Inject Storyblok bridge in page
      this.$storyblokbridge((storyblok) => {
        // Listen for editor events
        storyblok.on(['input', 'published', 'change'], (event) => {
          if (event.action === 'input') {
            if (event.story.id === this.page.id) {
              this.page.name = event.story.name
              this.page.content = event.story.content
            }
          } else {
            this.$nuxt.$router.go({
              path: this.$nuxt.$router.currentRoute,
              force: true
            })
          }
        })
      })
    }
  }
}
</script>
