<script setup>
import ImagePicker from '../../components/ImagePicker.vue'
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
</script>

<template>
  <div v-if="user.loggedIn" class="center-div">
    <h2 align="center">
      Edition d'une blague
    </h2>
    <v-row v-if="etape.nom">
      <v-col>
        <h3 align="center"> Paramètres du jeu</h3>
        <v-textarea label="Nom du jeu" rows="1" variant="outlined" no-resize autofocus required
          v-model="etape.nom"></v-textarea>
        <br>
        <v-textarea label="Enoncé de la blague" rows="3" required auto-grow v-model="etape.texte" />
        <br>
      </v-col>
      <v-col>
        <ImagePicker :previousImageUrl="etape.image_url" @imageUpdated="(image) => updateImage(image)"
          @bytesUpdated="(bytesArray) => updateBytes(bytesArray)" />
      </v-col>
    </v-row>
    <div align="center">
      <button @click="EditEtape()" type="submit" width="100%" class="btn greenbtn">Modifier l'étape</button>
      <br><br>
      <router-link class="routerLink" :to="'/editetapes/' + parcoursId"><button
          class="btn orangebtn">Retour</button></router-link><br>
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
import { uploadImage } from '../../utils/UploadImage.js'
import { modifyEtapeInParcours } from '../../utils/queries.js'
export default {
  name: "EditBlagueComponent",
  data() {
    return {
      etape: {},
      parcoursId: String,
      hasimagechanged: false,
      imagepicked: false,
      bytesArray: '',
      image_url: '',
    }
  },
  methods: {
    updateImage(image) {
      this.image_url = image
      this.hasimagechanged = true
    },
    updateBytes(bytesArray) {
      this.bytesArray = bytesArray
      this.hasimagechanged = true
    },
    async getInfos() {
      this.parcoursId = this.$route.query.parcoursId
      this.etape = JSON.parse(this.$route.query.etape).etape
      this.etapeId = JSON.parse(this.$route.query.etape).id
    },
    async EditEtape() {
      try {
        if (this.image_url !== '' && this.hasimagechanged) { //FROM API IMAGE         
          const response = await fetch(this.image_url);
          const arrayBuffer = await response.arrayBuffer();
          const byteArray = new Uint8Array(arrayBuffer);
          uploadImage(byteArray, "image_etape", this.etapeId, this.parcoursId)
        } else { //FROM LOCAL IMAGE
          if (this.bytesArray && this.hasimagechanged) {
            uploadImage(this.bytesArray, "image_etape", this.etapeId, this.parcoursId)
          }
        }
      } catch (error) {
        alert("La taille de l'image dépasse la limite autorisée (2Mo Max)")
        console.error(error);
        return;
      }
      const p_obj = {
        nom: this.etape.nom,
        ordre: this.etape.ordre,
        texte: this.etape.texte,
      }
      modifyEtapeInParcours(this.parcoursId, this.etapeId, p_obj).then(() => {
        this.$router.push('/editetapes/' + this.parcoursId)
      })
    }
  },

  async mounted() {
    await this.getInfos()
  },
};
</script>

<style scoped></style>