<template>
  <h2 align="center">
    Voulez vous vraiment supprimer la commune:
    {{ $route.params.commune }} ?
  </h2>
  <br><br>
  <v-row>
    <button class="btn orangebtn" @click="Delete()">Oui </button>
    <button class="btn greenbtn bg-green" @click="push()">Non</button>
  </v-row>
  <div class="precedent">
    <router-link class="routerLink" to="/gestioncommune"><button class="btn orangebtn">Retour</button></router-link>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { deleteCommune } from '../../utils/queries.js'

export default {
  name: "DeleteCommuneComponent",

  setup() {
    const router = useRouter()

    const Delete = async () => {
      deleteCommune(router.currentRoute.value.params.commune)
      router.push('/gestioncommune')
    }
    const push = async () => {
      router.push('/gestioncommune')
    }

    return { Delete, push }
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