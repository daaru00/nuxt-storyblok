export default ({ $config: { storyblokBridgeEnabled, storyblokBridgeUrl } }, inject) => {
  inject('storyblokbridge', function (init) {
    if (!storyblokBridgeEnabled) {
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = storyblokBridgeUrl
    script.id = 'storyblok-javascript-bridge'

    script.onerror = function (err) {
      init(new Error('Failed to load Storyblok bridge' + err.toString()))
    }

    script.onload = function () {
      if (!window.StoryblokBridge) {
        return init(new Error('Storyblok bridge instance not found'))
      }

      const instance = new window.StoryblokBridge()
      init(instance)
    }

    document.getElementsByTagName('head')[0].appendChild(script)
  })
}
