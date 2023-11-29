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
      Edition d'un jeu de l'intrus
    </h2>
    <v-row v-if="etape.nom">
      <v-col>
        <h3 align="center"> Paramètres du jeu</h3>
        <v-textarea label="Nom du jeu" rows="1" variant="outlined" no-resize autofocus required
          v-model="etape.nom"></v-textarea>
        <br>
        <v-textarea label="Question" rows="2" required auto-grow v-model="etape.question" />
        <br>
        <h3 align="center"> Affichage après réponse</h3>
        <v-textarea label="Titre si mauvaise réponse" rows="1" no-resize required
          v-model="etape.titreSiMauvaiseReponse"></v-textarea>
        <br>
        <v-textarea label="Titre si bonne réponse" rows="1" no-resize required
          v-model="etape.titreSiBonneReponse"></v-textarea>
        <br>
        <v-textarea label="Texte après la réponse" rows="4" required auto-grow v-model="etape.texteApresReponse" />
        <br>
      </v-col>
      <v-col>
        <h3 align="center">Choix de l'intrus</h3>
        <div>
          <v-row class="intrus">
            <v-col class="intru">
              <input type="radio" name="radio" v-model="etape.index_bonneReponse" v-bind:value="'0'"/>
              <ImagePicker :doNotDisplayTitle="true" :previousImageUrl="etape.images_tab[0]" number="0"
                @imageUpdated="(image) => updateImage(image, 0)" @bytesUpdated="(bytesArray) => updateBytes(bytesArray, 0)" />
            </v-col>
            <v-col class="intru">
              <input type="radio" name="radio" v-model="etape.index_bonneReponse" v-bind:value="'1'"/>
              <ImagePicker :doNotDisplayTitle="true" :previousImageUrl="etape.images_tab[1]" number="1"
                @imageUpdated="(image) => updateImage(image, 1)" @bytesUpdated="(bytesArray) => updateBytes(bytesArray, 1)" />
            </v-col>
          </v-row>
          <v-row class="intrus">
            <v-col class="intru">
              <input type="radio" name="radio" v-model="etape.index_bonneReponse" v-bind:value="'2'"/>
              <ImagePicker :doNotDisplayTitle="true" :previousImageUrl="etape.images_tab[2]" number="2"
                @imageUpdated="(image) => updateImage(image, 2)" @bytesUpdated="(bytesArray) => updateBytes(bytesArray, 2)" />
            </v-col>
            <v-col class="intru">
              <input type="radio" name="radio" v-model="etape.index_bonneReponse" v-bind:value="'3'"/>
              <ImagePicker :doNotDisplayTitle="true" :previousImageUrl="etape.images_tab[3]" number="3"
                @imageUpdated="(image) => updateImage(image, 3)" @bytesUpdated="(bytesArray) => updateBytes(bytesArray, 3)" />
            </v-col>
          </v-row>
        </div>

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
import { uploadMultipleImages } from '../../utils/UploadImage.js'
import { modifyEtapeInParcours } from '../../utils/queries.js'
export default {
  name: "EditPyramideComponent",
  data() {
    return {
      etape: {},
      parcoursId: String,
      hasimagechanged: [],
      imagepicked: false,
      bytesArray: [],
      image_url: [],
    }
  },
  methods: {
    updateImage(image, index) {
      this.image_url[index] = image
      this.hasimagechanged[index] = true
    },
    updateBytes(bytesArray, index) {
      this.bytesArray[index] = bytesArray
      this.hasimagechanged[index] = true
    },
    async getInfos() {
      this.parcoursId = this.$route.query.parcoursId
      this.etape = JSON.parse(this.$route.query.etape).etape
      this.etapeId = JSON.parse(this.$route.query.etape).id

    },
    async EditEtape() {
      var byteArray_tab = ['','','','']
      try {
        for (var i = 0; i<=3; i++) {
          if (this.image_url[i]) {
              const response = await fetch(this.image_url[i]);
              const arrayBuffer = await response.arrayBuffer();
              byteArray_tab[i] = new Uint8Array(arrayBuffer);
          } else {
            if (this.bytesArray[i]) {
              byteArray_tab[i] = this.bytesArray[i]
            } else {
            if(!this.hasimagechanged[i] && this.etape.images_tab[i]) {
              const response = await fetch(this.etape.images_tab[i]);
              const arrayBuffer = await response.arrayBuffer();
              byteArray_tab[i] = new Uint8Array(arrayBuffer);
            }
          }
          } 
        }
        //Upload images
        if(byteArray_tab.length == 4) {
          await uploadMultipleImages(byteArray_tab, "image_jeu", this.etapeId, this.parcoursId)
        }
      }
      catch (err) {
        console.log(err)
        alert("Erreur pendant le téléchargement d'une des images, l'image est peut-être trop grande (max : 2Mo)")
        return
      }

      const p_obj = {
        nom: this.etape.nom,
        ordre: this.etape.ordre,
        question: this.etape.question,
        index_bonneReponse: this.etape.index_bonneReponse,
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

<style scoped>
.intrus {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
}

.intru {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  height: max-content;
}
</style>