<template>
  <div class="center-div">
    <h2 class="text-xl my-4" align="center">
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
          <button @click="navigate" role="link" class="routerLink btn bg-green">Ajouter</button>
        </router-link>
      </div>
    </v-row>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { computed } from "vue";
import { ref } from 'vue'
import { getAllCommunes } from '../utils/queries.js'

export default {
  name: "GestionCommuneComponent",

  setup() {
    const commune = ref('')
    const communes = ref([]);
    const router = useRouter()

    getAllCommunes().then((res) => {
      communes.value = res;
    });


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
    return { computed, communes, commune, EditCommune, DeleteCommune }


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