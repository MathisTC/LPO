<template>
  <h2 align="center">
    Edition d'une charade
  </h2>
  <v-row>
    <v-col>
      <h3 align="center">Informations</h3>
      <v-textarea label="Nom de la charade" rows="1" variant="outlined" no-resize autofocus required
        v-model="etape.nom"></v-textarea>
      <br>
      <v-textarea label="Enoncé de la charade" rows="3" required auto-grow v-model="etape.charade" />
      <br>
      <br>
      <v-textarea label="Réponse" rows="3" required auto-grow v-model="etape.reponse" />
      <br>
    </v-col>
    <v-col>
      <h3 align="center">Après jeu</h3>
      <v-textarea label="Titre bonne réponse" rows="1" variant="outlined" no-resize autofocus required
        v-model="etape.titreSiBonneReponse"></v-textarea>
      <br>
      <v-textarea label="Titre mauvaise réponse" rows="3" required auto-grow v-model="etape.titreSiMauvaiseReponse" />
      <br>
      <LinkInsert />
      <br>
      <v-textarea label="Texte après réponse" rows="3" required auto-grow v-model="etape.texteApresReponse" />
      <br>
    </v-col>
    <v-col v-if="loaded">
      <ImagePicker :previousImageUrl="etape.image_url" @imageUpdated="(image) => updateImage(image)"
        @bytesUpdated="(bytesArray) => updateBytes(bytesArray)" />
    </v-col>

  </v-row>
  <div align="center">
    <button @click="EditEtape()" type="submit" width="100%" class="btn greenbtn bg-green">Modifier l'étape</button>
    <br><br>
    <router-link class="routerLink" :to="'/editetapes/' + parcoursId"><button
        class="btn orangebtn">Retour</button></router-link><br>
  </div>
</template>

<script>

import { uploadImage } from '../../utils/UploadImage.js'
import { modifyEtapeInParcours } from '../../utils/queries.js'
import ImagePicker from '../../components/ImagePicker.vue'
export default {
  components: { ImagePicker },
  name: "EditBlagueComponent",
  data() {
    return {
      etape: {},
      parcoursId: String,
      hasimagechanged: false,
      imagepicked: false,
      bytesArray: '',
      image_url: '',
      loaded: false
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
      this.loaded = true
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
        charade: this.etape.charade,
        reponse: this.etape.reponse,
        texteApresReponse: this.etape.texteApresReponse,
        titreSiBonneReponse: this.etape.titreSiBonneReponse,
        titreSiMauvaiseReponse: this.etape.titreSiMauvaiseReponse,

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
