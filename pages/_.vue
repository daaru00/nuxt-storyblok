<template>
  <article v-if="page">
    <LayoutHeader>
      <h1>
        {{ page.content.title }}
      </h1>
    </LayoutHeader>
    <template v-for="blok in page.content.body">
      <component :is="blok.component" :key="blok._uid" v-editable="blok" :blok="blok" />
    </template>
  </article>
</template>

<script>
export default {
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
    const { data: pageData } = await app.$storyblok.get('cdn/stories/' + currentPath, {
      version: $config.storyblokVersion
    })

    // Check if page does not exist
    if (!pageData.story || pageData.story.content.component !== 'page') {
      return error({ statusCode: 404, message: 'Page not found' })
    }
    const page = pageData.story

    return { page }
  },
  mounted () {
    // Inject Storyblok bridge in page
    if (this.$config.storyblokBridgeEnabled) {
      // eslint-disable-next-line no-console
      this.$initStoryblokBridge().then(() => console.debug('Storyblok Bridge Loaded!')).catch(err => console.error(err))
    }

    // Register for editor events
    this.$storyblokBridgeListener(['published', 'change'], () => {
      this.$nuxt.$router.go({
        path: this.$nuxt.$router.currentRoute,
        force: true
      })
    })

    // Register for input events
    this.$storyblokBridgeListener('input', ({ story }) => {
      if (story.id === this.page.id) {
        this.page = story
      }
    })
  }
}
</script>

<style>
header nav {
  margin: 1em 0;
}
header nav a{
  display: inline-block;
  margin: 0 0.5em;
  border: 1px solid;
  padding: 0.2em;
  text-decoration: none;
  color: black;
}
</style>
