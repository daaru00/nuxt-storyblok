import Vue from 'vue'

import StoryblokVue from 'storyblok-vue'
import Feature from '../components/Feature'
import Grid from '../components/Grid'
import RichText from '../components/RichText'
import SingleImage from '../components/SingleImage'
import Slider from '../components/Slider'
import Teaser from '../components/Teaser'

Vue.component('Feature', Feature)
Vue.component('Grid', Grid)
Vue.component('RichText', RichText)
Vue.component('SingleImage', SingleImage)
Vue.component('Slider', Slider)
Vue.component('Teaser', Teaser)

Vue.use(StoryblokVue)
