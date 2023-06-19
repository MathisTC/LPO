<template>
  <div v-if="user.loggedIn" class="center-div">
    <h1 align="center">
      Choisissez le type d'étape:
    </h1>
    <br>
    <h2 align="center">Modèles de Jeux:</h2> <br>
    <div class="container">
      <router-link class="routerLink" :to="'/qcm/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">QCM</button></router-link>
      <router-link class="routerLink" :to="'/codecesar/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Code César</button></router-link>
      <router-link class="routerLink" :to="'/pyramide/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Calcul pyramidal</button></router-link>
      <router-link class="routerLink" :to="'/blague/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Blague</button></router-link>
      <router-link class="routerLink" :to="'/lesaviezvous/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Le saviez vous ?</button></router-link>
      <router-link class="routerLink" :to="'/intru/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Trouvez l'intrus</button></router-link>
      <router-link class="routerLink" :to="'/paysage/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Trouvez un paysage</button></router-link>
      <router-link class="routerLink" :to="'/charade/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Charade</button></router-link>
      <router-link class="routerLink" :to="'/compterimage/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Compter Image</button></router-link>
      <router-link class="routerLink" :to="'/rebus/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Rebus</button></router-link>
      <router-link class="routerLink" :to="'/ecogeste/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Eco geste</button></router-link>
    </div>
    <br>  
    <h2 align="center">Modèles de Transition:</h2><br>
    <div class="container2">
    <router-link class="routerLink" :to="'/informations/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Informations</button></router-link>
    <router-link class="routerLink" :to="'/pointgps/'+$router.currentRoute.value.params.parcour"><button class="btn greenbtn">Point GPS</button></router-link>
    </div><br>
    <div class="precedent">
      <router-link custom v-slot="{ navigate }" :to="'/editetapes/'+$router.currentRoute.value.params.parcour">
        <button @click="navigate" role="link" class="routerLink btn orangebtn">Retour</button>
      </router-link>
    </div>
  </div>

  <div v-else class="alert alert-danger" role="alert">
    You are not logged in!
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { auth } from '../../firebaseConfig'
// import { addCity } from '../../utils/queries.js'
export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    auth.onAuthStateChanged(user => {
      store.dispatch("fetchUser", user);
    });
    const user = computed(() => {
      return store.getters.user;
    });
    if (!(user.value.loggedIn)) {
      router.push('/login')
    }
    return { user }
  },
  name: "CreateEtapeInParcours",
  data() {
    return {
    }
  },
  methods: {
    Create() {
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

.greenbtn {
  display: grid;
  width: 100%;
}
.orangebtn {
  display: block;
  box-sizing: border-box;
  background-color: #cd8244;
  border: 1px solid #E7EAF3;
  border-radius: 5px;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	text-decoration:none;
  padding: 5px;
  margin-left: auto;
  margin-right: auto;
  width: 20%
}

.container {
  display: grid;
  column-gap: 20px;
  row-gap: 20px;
  grid-template-columns: auto auto auto;
}
.container2 {
  display: grid;
  column-gap: 20px;
  row-gap: 20px;
  grid-template-columns: auto auto
}
.center-div {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}
</style>