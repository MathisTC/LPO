<template>
  <div> ETAT DE TRANSITION
  </div>
</template>

<script>



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