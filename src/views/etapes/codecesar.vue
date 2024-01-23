<template>
  <div v-if="user.loggedIn" class="center-div">
    <h2 class="text-xl my-4" align="center">
      Création d'un code César
    </h2>
    <br>
    <v-row align="start">
      <v-col>
        <h3 align="center"> Paramètres du jeu</h3>
        <v-textarea label="Nom du jeu" rows="1" variant="outlined" no-resize autofocus required
          v-model="titre"></v-textarea>
        <br>
        <v-textarea label="Question (indice)" rows="2" no-resize required v-model="question"></v-textarea>
        <br>
        <v-textarea label="Texte à coder" rows="1" no-resize required
          @change="previsualisation = cesar(texteBrut, decalage)" v-model="texteBrut"></v-textarea>
        <br>
        <v-text-field label="Décalage" type="number" class="selectDecalage" no-resize required
          @change="previsualisation = cesar(texteBrut, decalage)" v-model="decalage" />
        <br>
        <v-text-field disabled label="prévisualisation" no-resize required v-model="previsualisation" />
        <br>
      </v-col>
      <v-col>
        <h3 align="center"> Affichage après réponse</h3>
        <v-textarea label="Titre si mauvaise réponse" rows="1" no-resize required
          v-model="titreMauvaiseReponse"></v-textarea>
        <br>
        <v-textarea label="Titre si bonne réponse" rows="1" no-resize required v-model="titreBonneReponse"></v-textarea>
        <LinkInsert />
        <br>
        <v-textarea label="Texte après la réponse" rows="4" required auto-grow v-model="texteApresReponse" />
        <br>
      </v-col>
      <v-col>
        <div align="center">
          <h3 align="center">Ajouter une image</h3>
          <label for="file">
            <svg-icon class="iconImage" type="mdi" :path="mdiPlus" :size="40"></svg-icon>
          </label>
          <input @change="uploadNewImage" class="inputfile" type="file" name="file" id="file" accept="image/*" />
          <v-dialog transition="dialog-bottom-transition" width="auto">
            <template v-slot:activator="{ props }">
              <svg-icon v-bind="props" class="iconImage" type="mdi" :path="mdiMagnify" :size="40"></svg-icon>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-toolbar color="green">
                  <div>
                    <form action="#" @submit.prevent="searchSpecies()">
                      <input placeholder="Rechercher une espèce" v-model="espece" required autofocus />
                      <input type="submit" hidden />
                    </form>
                  </div>
                </v-toolbar>
                <div class="container">
                  <div class="card" v-for="espece in especes" v-bind:key="espece" @click="select(espece)">
                    <img v-if="espece.selected" class="img-selected" :src="espece._links.file.href">
                    <img v-else class="img" :src="espece._links.file.href">
                  </div>
                </div>
                <v-card-actions class="justify-end">
                  <v-btn variant="text" @click="isActive.value = false">Fermer</v-btn>
                  <v-btn v-if="imagepicked" variant="text" @click="isActive.value = false, validate()">Choisir
                    image</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <br>
          <div v-if="image || bytesarray">Prévisualisation de l'image</div>
          <img v-if="image" class="preview" :src="image" />
          <img v-else class="preview" id="addedimage" />
        </div>
      </v-col>
    </v-row>
    <br><br>
    <div class="precedent">
      <button @click="createEtape()" type="submit" width="100%" class="btn greenbtn bg-green">Créer Etape</button>
      <br>
      <router-link custom v-slot="{ navigate }"
        :to="'/createetapeinparcours/' + $router.currentRoute.value.params.parcours">
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
import { computed } from "vue";
import { auth } from '../../firebaseConfig'
import { uploadImage } from '../../utils/UploadImage.js'
import { mdiMagnify } from '@mdi/js';
import { mdiPlus } from '@mdi/js';
import { JeuCesar } from "../../utils/etapeCreator.js"
import { getParcoursContents, addEtapeInParcours } from "../../utils/queries.js"

export default {
  name: "cesarComponent",
  data() {
    return {
      previsualisation: '',
      image: '',
      bytesarray: '',
      id: '',
      imagepicked: false,
      titre: '',
      question: '',
      texteBrut: '',
      titreMauvaiseReponse: '',
      titreBonneReponse: '',
      texteApresReponse: '',
      decalage: 0,
      especes: [],
      espece: '',
      parcour: {},
    }
  },
  methods: {
    async uploadNewImage(event) {
      this.image = ''
      const file = event.target.files[0]; // Accéder à l'objet File
      const reader = new FileReader();
      var reader2 = new FileReader();
      reader.onload = (event) => {
        const fileBytes = new Uint8Array(event.target.result);
        this.bytesarray = fileBytes
      };
      reader2.onload = function () {
        var output = document.getElementById('addedimage');
        output.src = reader2.result;
      };
      reader.readAsArrayBuffer(file);
      reader2.readAsDataURL(event.target.files[0]);
    },
    async select(espece) {
      for (let i = 0; i < this.especes.length; i++) {
        if (this.especes[i].id == espece.id) {
          this.especes[i].selected = true;
        } else {
          this.especes[i].selected = false;
        }
      }
      this.imagepicked = true
    },
    validate() {
      for (let i in this.especes) {
        if (this.especes[i].selected) {
          this.image = this.especes[i]._links.file.href
        }
      }
    },
    async searchSpecies() {
      this.especes = []
      const response = await fetch('https://taxref.mnhn.fr/api/taxa/search?frenchVernacularNames=' + this.espece + '&territories=fr&page=1&size=1');
      const myJson = await response.json(); //extract JSON from the http response
      if (myJson.page.totalElements) {
        const response2 = await fetch('https://taxref.mnhn.fr/api/taxa/' + myJson._embedded.taxa[0].id + '/media');
        const myJson2 = await response2.json(); //extract JSON from the http response
        this.especes = myJson2._embedded.media
      }
    },
    async createEtape() {
      var cesar = new JeuCesar(JSON.parse(JSON.stringify(this.parcour)).etapes.length + 1, this.titre, '', this.question, this.texteBrut, this.decalage, this.titreBonneReponse, this.titreMauvaiseReponse, this.texteApresReponse)
      try {
        const id = await addEtapeInParcours(this.$router.currentRoute.value.params.parcours, cesar.generateFirestoreData())
        if (this.image != '') {
          const response = await fetch(this.image);
          const arrayBuffer = await response.arrayBuffer();
          const byteArray = new Uint8Array(arrayBuffer);
          await uploadImage(byteArray, "image_etape", id, this.$router.currentRoute.value.params.parcours)
        } else {
          if (this.bytesarray) {
            await uploadImage(this.bytesarray, "image_etape", id, this.$router.currentRoute.value.params.parcours)
          }
        }
      }
      catch (err) {
        console.log(err)
        alert("Erreur pendant le téléchargement de l'image, l'image est peut-être trop grande (max : 2Mo)")
      }

      this.$router.push('/editetapes/' + this.$router.currentRoute.value.params.parcours)
    },
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
    }
  },

  mounted() {
    getParcoursContents(this.$router.currentRoute.value.params.parcours).then((res) => {
      this.parcour = res

    });

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
      this.$router.push('/')
    }
    return { user, mdiMagnify, mdiPlus }
  }
};
</script>

<style scoped>
.btn {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 20%
}

.label {
  display: block;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
}

.img {
  width: 200px;
}

.preview {
  width: 200px;
}

.img-selected {
  width: 200px;
  border: 5px solid #76B828;
}

.container {
  display: grid;
  column-gap: 20px;
  row-gap: 20px;
  grid-template-columns: auto auto auto;
  background-color: white;
  padding: 10px;
}

.selectDecalage {
  width: 30%;
}

.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.inputfile+label {
  font-size: 1.25em;
  font-weight: 700;
  color: white;
  background-color: black;
  display: inline-block;
}
</style>