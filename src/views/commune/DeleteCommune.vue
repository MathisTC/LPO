<template>
  <div v-if="user.loggedIn" class="center-div">
    <h2 align="center">
      Voulez vous vraiment supprimer la commune:
      {{ $route.params.commune }} ?
    </h2>
    <br><br>
    <v-row>
        <button class="btn orangebtn" @click="Delete()">Oui </button>
        <button class="btn greenbtn" @click="push()">Non</button>
    </v-row>
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
import { deleteCommune } from '../../utils/queries.js'

export default {
  name: "DeleteCommuneComponent",

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
    const Delete = async () => {
      deleteCommune(router.currentRoute.value.params.commune)
      router.push('/')
    }
    const push = async () => {
      router.push('/')
    }
    
    return { user, Delete, push }
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