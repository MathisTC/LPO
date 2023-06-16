<template>
  <div v-if="user.loggedIn" class="center-div">
    <h2 align="center">
      Parcours: {{ parcour }}
    </h2> <br>
    <v-row>
      <v-col>
        <h3> Informations </h3>
          <div class="info"> 
            <p> <strong> Type :  </strong> {{ etape.type }} </p> <br>
            <p> <strong> Nom : </strong>  {{ etape.nom }}</p> <br>
            <p> <strong> Texte : </strong> {{ etape.texte }} </p>
          </div>
      </v-col>
      <v-col>
        <h3> Image </h3>
        <img class="img" :src="etape.image_url">
      </v-col>
  </v-row>
  <br><br>
  <p> <strong> Etape {{ etape.ordre }} / {{ etapes.length }}</strong></p>
  <v-progress-linear color="primary" model-value="100" v-model="progress"></v-progress-linear> <br>
    <div class="precedent">
      <v-row>
        <v-col>
            <button v-if="etape.ordre != 1" @click="previous()" class="btn bluebtn">Etape précédente</button><br>
        </v-col>
        <v-col>
          <button v-if="etape.ordre != etapes.length" @click="next()" class="btn greenbtn">Etape suivante</button><br>
        </v-col>
      </v-row>
      <v-row>
        <router-link custom v-slot="{ navigate }" :to="'/editetapes/' + $route.query.parcoursid">
          <button @click="navigate" role="link" class="routerLink btn orangebtn">Quitter</button>
        </router-link>
      </v-row>
    </div>
  </div>

  <div v-else class="alert alert-danger" role="alert">
    You are not logged in!
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import { auth } from '../../firebaseConfig'


export default {
  name: "ViewInfoComponent",
  data() {
    return {
      progress: 0,
      etapeId: '',
      etape: {},
      etapes: {},
      parcour: '',
    }
  },
  methods: {
    previous() {
      if(parseInt(this.$route.query.ordre) > 1) {
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
      if(parseInt(this.$route.query.ordre) <this.etapes.length) {
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
    },
  },

  async mounted() {
    await this.getInfos()
  },
  setup() {
    const store = useStore()
    auth.onAuthStateChanged(user => {
      store.dispatch("fetchUser", user);
    });
    const user = computed(() => {
      return store.getters.user;
    });
    if (!(user.value.loggedIn)) {
      this.$router.push('/login')
    }
    return { user }
  }
};
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