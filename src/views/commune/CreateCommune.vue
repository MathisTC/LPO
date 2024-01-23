<template>
  <h2 align="center">
    Création d'une commune
  </h2>
  <br>
  <v-row align="start">
    <v-col>
      <form action="#" @submit.prevent="Create">
        <v-textarea label="Nom commune" rows="1" variant="outlined" no-resize autofocus required
          v-model="nom"></v-textarea>
        <br>
        <v-textarea label="Code postal" rows="1" variant="outlined" no-resize required v-model="code_postal"></v-textarea>
        <br>
        <v-textarea label="Code INSEE (5 chiffres)" rows="1" variant="outlined" no-resize required
          v-model="code_insee"></v-textarea>
        <a href="https://www.insee.fr/fr/statistiques/fichier/6800675/v_commune_2023.csv" target="_blank">Lien de
          téléchargement du fichier contenant les codes INSEE des communes françaises</a>
        <br>
        <br>
        <button type="submit" class="btn greenbtn bg-green">Créer</button>
      </form>
    </v-col>
  </v-row>

  <br>
  <div class="precedent">
    <router-link class="routerLink" to="/gestioncommune"><button class="btn orangebtn">Retour</button></router-link>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from 'vue'
import { addCity } from '../../utils/queries.js'
export default {
  name: "CreateCommuneComponent",

  setup() {
    const nom = ref('')
    const code_insee = ref('')
    const router = useRouter()
    const code_postal = ref('')

    const Create = async () => {
      try {
        await addCity(nom, code_insee, code_postal)
        router.push('/gestioncommune')
      }
      catch (err) {
        console.log(err);
      }
    }

    return { Create, nom, code_insee, code_postal }
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

.center-div {
  width: 50%;
}
</style>