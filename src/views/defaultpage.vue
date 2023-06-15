<template>
  <div v-if="user.loggedIn" class="center-div">
    <h2 align="center">

    </h2>
    <div class="precedent">
      <router-link class="routerLink" :to="'/editcommune/'+commune"><button class="btn orangebtn">Retour</button></router-link><br>
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
  name: "EditeEtapesComponent",
  data() {
    return {
    }
  },
  methods: {
  },

  mounted() {
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
    return { user,  }
  }
};
</script>

<style scoped></style>