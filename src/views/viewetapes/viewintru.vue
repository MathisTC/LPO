<template>
  <h2 align="center">
    Parcours: {{ parcour }}
  </h2> <br>
  <div class="flex items-center">
    <Phone :etape="etape.ordre + '/' + etapeMax" class="flex flex-col">
      <div class="bg-gray-200 rounded-md w-full p-3 overflow-y-visible">
        <p class="text-black text-md font-bold my-3"> {{ etape.nom }}</p>

        <p class="text-[10px] text-gray-600" ref="etape_texte">{{ etape.question }}</p>
        <div class="grid grid-col-2 mt-4 mb-4 gap-8 justify-items-center">
          <img class="col-span-1 col-start-1 max-h-[90px]" :src="images_tab[0]">
          <img class="col-span-1 col-start-2 max-h-[90px]" :src="images_tab[1]">
          <img class="col-span-1 col-start-1 max-h-[90px]" :src="images_tab[2]">
          <img class="col-span-1 col-start-2 max-h-[90px]" :src="images_tab[3]">
        </div>
      </div>
      <div class="flex justify-center h-8 mt-4 gap-3">
        <button v-if="etape.ordre != 1" @click="previous()" class="w-2/5 bg-blue rounded-2xl">Précédent</button><br>
        <button v-if="etape.ordre != etapes.length" @click="next()"
          class="w-2/5 bg-green rounded-2xl">Suivant</button><br>
      </div>
    </Phone>

    <div>
      <p>Prévisualisation de la page</p>
      <router-link custom v-slot="{ navigate }" :to="'/editetapes/' + $route.query.parcoursid">
        <button @click="navigate" role="link" class="bg-orange-600 rounded-lg w-full">Quitter</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import Phone from '@/components/PhoneView.vue';

export default {
  name: "ViewInfoComponent",
  components: { Phone },
  data() {
    return {
      progress: 0,
      etapeId: '',
      etape: {},
      etapes: {},
      parcour: '',
      images_tab: [],
      etapeMax: ''
    }
  },
  methods: {
    previous() {
      if (parseInt(this.$route.query.ordre) > 1) {
        this.$router.push({
          path: '/transistate',
          query: {
            path: '/viewetape/' + this.etapes[parseInt(this.$route.query.ordre) - 2].etape.type + '/' + this.etapes[parseInt(this.$route.query.ordre) - 2].id,
            parcoursid: this.$route.query.parcoursid,
            parcours: this.parcour,
            etapes: JSON.stringify(this.etapes),
            ordre: this.etape.ordre - 1
          }
        })
      } else {
        this.$router.push('/editetapes/' + this.$route.query.parcoursid)
      }
    },
    next() {
      if (parseInt(this.$route.query.ordre) < this.etapes.length) {
        this.$router.push({
          path: '/transistate',
          query: {
            path: '/viewetape/' + this.etapes[parseInt(this.$route.query.ordre)].etape.type + '/' + this.etapes[parseInt(this.$route.query.ordre)].id,
            parcoursid: this.$route.query.parcoursid,
            parcours: this.parcour,
            etapes: JSON.stringify(this.etapes),
            ordre: this.etape.ordre + 1
          }
        })
      } else {
        this.$router.push('/editetapes/' + this.$route.query.parcoursid)
      }
    },
    async getInfos() {
      this.etapes = JSON.parse(this.$route.query.etapes);
      this.parcour = this.$route.query.parcours
      this.etape = this.etapes[parseInt(this.$route.query.ordre) - 1].etape
      this.progress = (parseInt(this.$route.query.ordre - 1)) / (this.etapes.length - 1) * 100
      this.etapeMax = this.etapes[(this.etapes.length) - 1].etape.n_etape
    },
  },

  async mounted() {
    await this.getInfos()
    this.images_tab = this.etape.images_tab
  },

};
</script>
