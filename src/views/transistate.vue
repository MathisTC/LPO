<template>
  <div>  ETAT DE TRANSITION
</div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import { auth } from '../firebaseConfig'


export default {
  name: "transistateComponent",
  data() {
    return {
    }
  },
  methods: {
  },

  async mounted() {
        this.$router.push({
      path: this.$route.query.path,
      query: {
        etapes: this.$route.query.etapes,
        ordre: this.$route.query.ordre,
        parcours: this.$route.query.parcours,
        parcoursid: this.$route.query.parcoursid,

      }

    })
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
</style>