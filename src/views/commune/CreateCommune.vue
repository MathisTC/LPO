<template>
  <div v-if="user.loggedIn" class="center-div">
    <h2 align="center">
      Création d'une ville
    </h2>
    <br>
    <v-row align="start">
      <v-col>
        <form action="#" @submit.prevent="Create">
          <v-textarea label="Nom commune" rows="1" variant="outlined" no-resize autofocus required v-model="nom"></v-textarea>
          <br>
          <v-textarea label="Code INSEE" rows="1" variant="outlined" no-resize required v-model="code_insee"></v-textarea>
          <br>
          <button type="submit" class="btn greenbtn">Créer</button>
        </form>
      </v-col>
    </v-row>
    
    <br>
    <div class="precedent">
        <router-link custom v-slot="{ navigate }" to="/">
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
import { ref } from 'vue'
import { addCity } from '../../utils/queries.js'
export default {
  name: "CreateCommuneComponent",

  setup() {
    const nom = ref('')
    const code_insee = ref('')
    const store = useStore()
    const router = useRouter()

    auth.onAuthStateChanged(user => {
      store.dispatch("fetchUser", user);
    });
    const user = computed(() => {
      return store.getters.user;
    });

    const Create = async () => {
      try {
        await addCity(nom, code_insee)
        router.push('/')
      }
      catch (err) {
        console.log(err);
      }
    }

    if (!(user.value.loggedIn)) {
      router.push('/login')
    }
    return { user, Create, nom, code_insee }
  }



};
</script>

<style scoped>
.btn {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 20%
}

.center-div{
  width:50%;
}
</style>