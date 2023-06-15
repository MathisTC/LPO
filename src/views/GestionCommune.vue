<template>
  <div v-if="user.loggedIn" class="center-div">
    <h2 align="center">
      Gestion de communes
    </h2>
    <v-autocomplete outlined color="blue" label="Communes" placeholder="Rechercher une commune" :items="communes"
      v-model="commune"></v-autocomplete>
    <br><br>
    <v-row>
      <button class="btn bluebtn" @click="EditCommune()">Modifier </button>
      <button class="btn orangebtn" @click="DeleteCommune()">Supprimer</button>
    </v-row>
    <br>
    <br>
    <v-row>
      <div class="precedent">
        <router-link custom v-slot="{ navigate }" to="/createcommune">
          <button @click="navigate" role="link" class="routerLink btn greenbtn">Ajouter</button>
        </router-link>
      </div>
    </v-row>
  </div>

  <div v-else class="alert alert-danger" role="alert">
    You are not logged in!
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { auth } from '../firebaseConfig'
import { ref } from 'vue'
import { getAllCommunes } from '../utils/queries.js'

export default {
  name: "GestionCommuneComponent",

  setup() {
    const commune = ref('')
    const communes = ref([]);
    const store = useStore()
    const router = useRouter()

    getAllCommunes().then((res) => {
      communes.value = res;
    });

    auth.onAuthStateChanged(user => {
      store.dispatch("fetchUser", user);
    });

    const user = computed(() => {
      return store.getters.user;
    });
    if (!(user.value.loggedIn)) {
      router.push('/login')
    }
    const signOut = async () => {
      await store.dispatch('logOut')
      router.push('/login')
    }
    const EditCommune = async () => {
      if (commune.value != null && commune.value != '') {
        router.push('/editcommune/' + commune.value)
      }
    }
    const DeleteCommune = async () => {
      if (commune.value != null && commune.value != '') {
        router.push('/deletecommune/' + commune.value)
      }
    }
    return { computed, user, signOut, communes, commune, EditCommune, DeleteCommune }


  }



};
</script>

<style scoped>
.center-div {
  padding-top: 50px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

v-row {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.btn {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 20%
}
</style>