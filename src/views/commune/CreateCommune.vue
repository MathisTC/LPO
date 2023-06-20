<template>
  <div v-if="user.loggedIn" class="center-div">
    <h2 align="center">
      Création d'une commune
    </h2>
    <br>
    <v-row align="start">
      <v-col>
        <form action="#" @submit.prevent="Create">
          <v-textarea label="Nom commune" rows="1" variant="outlined" no-resize autofocus required v-model="nom"></v-textarea>
          <br>
          <v-textarea label="Code postal" rows="1" variant="outlined" no-resize required v-model="code_postal"></v-textarea>
          <br>
          <v-textarea label="Code INSEE (5 chiffres)" rows="1" variant="outlined" no-resize required v-model="code_insee"></v-textarea>
          <a href="https://www.insee.fr/fr/statistiques/fichier/6800675/v_commune_2023.csv" target="_blank">Lien de téléchargement du fichier contenant les codes INSEE des communes françaises</a>
          <br>
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
    const code_postal = ref('')

    auth.onAuthStateChanged(user => {
      store.dispatch("fetchUser", user);
    });
    const user = computed(() => {
      return store.getters.user;
    });

    const Create = async () => {
      try {
        await addCity(nom, code_insee, code_postal)
        router.push('/')
      }
      catch (err) {
        console.log(err);
      }
    }

    if (!(user.value.loggedIn)) {
      router.push('/login')
    }
    return { user, Create, nom, code_insee, code_postal }
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