import Vue from 'vue'
import StoryblokVue from 'storyblok-vue'

Vue.use(StoryblokVue)

export default ({ $config: { storyblokBridgeUrl } }, inject) => {
  const eventBus = new Vue()

  inject('storyblokBridgeListener', function (events, callback) {
    eventBus.$on(events, callback)
  })

  inject('storyblokBridgeInstance', function () {
    if (window.StoryblokBridge) {
      throw new Error('StoryblokBridge class not found in window object')
    }

    return new window.StoryblokBridge()
  })

  inject('initStoryblokBridge', function (events) {
    events = events || ['input', 'published', 'change']

    return new Promise((resolve, reject) => {
      if (window.StoryblokBridge) {
        return resolve()
      }

      const script = document.createElement('script')
      script.async = true
      script.src = storyblokBridgeUrl
      script.id = 'storyblok-javascript-bridge'

      script.onerror = function (err) {
        reject(new Error('Failed to load Storyblok bridge' + err.toString()))
      }

      script.onload = function () {
        if (!window.StoryblokBridge) {
          return reject(new Error('Storyblok bridge instance not found'))
        }

        const instance = new window.StoryblokBridge()
        instance.on(events, (event) => {
          eventBus.$emit(event.action, event)
        })

        resolve()
      }

      document.getElementsByTagName('head')[0].appendChild(script)
    })
  })
}
