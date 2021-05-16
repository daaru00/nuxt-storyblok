import StoryblokClient from 'storyblok-js-client/dist/es5/index.es'

export default ({ $config: { storyblokAccessToken } }, inject) => {
  inject('storyblok', new StoryblokClient({
    accessToken: storyblokAccessToken
  }))
}
