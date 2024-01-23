<template>
  <h2 align="center">
    Edition d'un calcul pyramidal
  </h2>
  <v-row>
    <v-col>
      <h3 align="center"> Paramètres du jeu</h3>
      <v-textarea label="Nom du jeu" rows="1" variant="outlined" no-resize autofocus required
        v-model="etape.nom"></v-textarea>
      <br>
      <v-textarea label="Question" rows="2" required auto-grow v-model="etape.question" />
      <br>
      <v-text-field label="Réponse" type="number" class="selectNumber" no-resize required v-model="etape.nombre" />
    </v-col>
    <v-col>
      <h3 align="center"> Affichage après réponse</h3>
      <v-textarea label="Titre si mauvaise réponse" rows="1" no-resize required
        v-model="etape.titreSiMauvaiseReponse"></v-textarea>
      <br>
      <v-textarea label="Titre si bonne réponse" rows="1" no-resize required
        v-model="etape.titreSiBonneReponse"></v-textarea>
      <br>
      <LinkInsert />
      <v-textarea label="Texte après la réponse" rows="4" required auto-grow v-model="etape.texteApresReponse" />
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
  name: "EditPyramideComponent",
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
        question: this.etape.question,
        nombre: this.etape.nombre,
        texteApresReponse: this.etape.texteApresReponse,
        titreSiBonneReponse: this.etape.titreSiBonneReponse,
        titreSiMauvaiseReponse: this.etape.titreSiMauvaiseReponse
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