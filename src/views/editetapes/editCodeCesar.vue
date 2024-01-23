<template>
  <h2 align="center">
    Edition d'un code César
  </h2>
  <v-row>
    <v-col>
      <h3 align="center"> Paramètres du jeu</h3>
      <v-textarea label="Nom du jeu" rows="1" variant="outlined" no-resize autofocus required
        v-model="etape.nom"></v-textarea>
      <br>
      <v-textarea label="Question (indice)" rows="2" no-resize required v-model="etape.question"></v-textarea>
      <br>
      <v-textarea label="Texte à coder" rows="1" no-resize required
        @change="previsualisation = cesar(etape.texteBrut, etape.decalage)" v-model="etape.texteBrut"></v-textarea>
      <br>
      <v-text-field label="Décalage" type="number" class="selectDecalage" no-resize required
        @change="previsualisation = cesar(etape.texteBrut, etape.decalage)" v-model="etape.decalage" />
      <br>
      <v-text-field disabled label="prévisualisation" no-resize required v-model="previsualisation" />
      <br>

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
      loaded: false,
      previsualisation: ''
    }
  },
  methods: {
    cesar(str, decalage) {
      // Vérifier si le décalage est en dehors de la plage valide
      if (decalage < -25 || decalage > 25) {
        throw new Error('Le décalage doit être compris entre -25 et 25.');
      }
      // Convertir le décalage en valeur positive équivalente
      decalage = ((decalage % 26) + 26) % 26;
      // Convertir la chaîne en tableau de caractères
      var chars = str.split('');
      // Parcourir chaque caractère et effectuer le décalage
      for (var i = 0; i < chars.length; i++) {
        var char = chars[i];
        // Vérifier si le caractère est une lettre minuscule
        if (char.match(/[a-z]/i)) {
          // Convertir le caractère en code ASCII
          var code = str.charCodeAt(i);
          // Appliquer le décalage au code ASCII
          if (code >= 97 && code <= 122) {
            code = ((code - 97 + decalage) % 26) + 97;
          }
          // Convertir le code ASCII décalé en caractère
          chars[i] = String.fromCharCode(code);
        }
      }
      // Rejoindre les caractères décalés pour former la chaîne de caractères finale
      var result = chars.join('');
      return result;
    },
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
      this.previsualisation = this.cesar(this.etape.texteBrut, this.etape.decalage)
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
        decalage: this.etape.decalage,
        nom: this.etape.nom,
        ordre: this.etape.ordre,
        question: this.etape.question,
        texteBrut: this.etape.texteBrut,
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
