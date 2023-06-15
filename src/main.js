import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/index'
import store from './store'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import SvgIcon from "vue3-icon";
import draggable from "vuedraggable";

const vuetify = createVuetify({
  components,
  directives,
})


createApp(App).use(router).use(store).use(vuetify).use(draggable).component("draggable",draggable).component("svg-icon", SvgIcon).mount('#app')

