<template>
  <h2 align="center">
    Parcours: {{ parcour }}
  </h2><br>
  <div class="flex items-center">
    <Phone :etape="etape.ordre + '/' + etapeMax" class="flex flex-col">
      <div class="h-5/6 bg-gray-200 rounded-md w-full p-3 overflow-hidden">
        <p class="text-black text-md font-bold my-3"> {{ etape.nom }}</p>
        <div class="flex justify-center">
          <img class="justify-center mb-3 max-h-[200px] " :src="etape.image_url">
        </div>
        <p class="text-[10px] text-gray-600" ref="etape_texte">{{ etape.question }}</p>
        <div class="grid grid-cols-1 gap-2 mt-3 ml-5">
          <div class="col-auto bg-green-600 min-w-20 max-w-28 rounded-2xl w-fit p-1">
            <p class="text-white text-transform: uppercase text-[10px] ml-1 w-fit ">{{ texteDecale }}</p>
          </div>
          <div class="col-auto bg-gray-200 border border-slate-200 min-w-20 max-w-28 rounded-2xl w-fit p-1">
            <p class="text-gray-500 text-[10px] ml-1">CODE</p>
          </div>
        </div>
      </div>
      <div class="flex justify-center h-8 mt-4 gap-3">
        <button v-if="etape.ordre != 1" @click="previous()" class="w-2/5 bg-blue rounded-2xl">Précédent</button>
        <br>
        <button v-if="etape.ordre != etapes.length" @click="next()" class="w-2/5 bg-green rounded-2xl">Suivant
        </button>
        <br>
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
import { useStore } from "vuex";
import { computed } from "vue";
import { auth } from '../../firebaseConfig'
import Phone from "@/components/PhoneView.vue";


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
      etapeMax: '',
      texteDecale: '',
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
      this.parcour = this.$route.query.parcours;
      this.etape = this.etapes[parseInt(this.$route.query.ordre) - 1].etape;
      this.progress = (parseInt(this.$route.query.ordre - 1)) / (this.etapes.length - 1) * 100;
      this.etapeMax = this.etapes[(this.etapes.length) - 1].etape.n_etape;
    },
    cesar(str, decalage) {
      // Vérifier si le décalage est en dehors de la plage valide
      if (decalage < -25 || decalage > 25) {
        throw new Error('Le décalage doit être compris entre -25 et 25.');
      }
      // Convertir le décalage en valeur positive équivalente
      decalage = ((decalage % 26) + 26) % 26;
      // Convertir la chaîne en tableau de caractères
      var chars = str.split('');
      // Parcourir chaque caractère et effectuer le décalage
      for (var i = 0; i < chars.length; i++) {
        var char = chars[i];
        // Vérifier si le caractère est une lettre minuscule
        if (char.match(/[a-z]/i)) {
          // Convertir le caractère en code ASCII
          var code = str.charCodeAt(i);
          // Appliquer le décalage au code ASCII
          if (code >= 97 && code <= 122) {
            code = ((code - 97 + decalage) % 26) + 97;
          }
          // Convertir le code ASCII décalé en caractère
          chars[i] = String.fromCharCode(code);
        }
      }
      // Rejoindre les caractères décalés pour former la chaîne de caractères finale
      var result = chars.join('');
      return result;
    },
  },

  async mounted() {
    await this.getInfos();
    this.texteDecale = this.cesar(this.etape.texteBrut, this.etape.decalage);

  }
  ,
  setup() {
    const store = useStore()
    auth.onAuthStateChanged(user => {
      store.dispatch("fetchUser", user);
    });
    const user = computed(() => {
      return store.getters.user;
    });
    if (!(user.value.loggedIn)) {
      this.$router.push('/')
    }
    return { user }
  }
}
  ;
</script>

<style scoped>
.btn {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.img {
  width: 60%
}

.info {
  padding: 10px;
  margin-right: auto;
  background-color: #ebebeb;
  font-size: 14px;
  border-radius: 10px;
}
</style>