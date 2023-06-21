<template>
  <div v-if="user.loggedIn" class="center-div">
    <h2 align="center">
      Création d'un jeu "trouver l'intru"
    </h2>
    <br>
    <v-row align="start">
      <v-col>
        <h3 align="center"> Paramètres du jeu</h3>
        <v-textarea label="Nom du jeu" rows="1" variant="outlined" no-resize autofocus required v-model="titre"></v-textarea>
        <br>
        <v-textarea label="Question" rows="2" no-resize required v-model="question"></v-textarea>
        <br>
        <h4 align="center"> Affichage après réponse</h4>
        <v-textarea label="Titre si mauvaise réponse" rows="1" no-resize required v-model="titreMauvaiseReponse"></v-textarea>
        <br>
        <v-textarea label="Titre si bonne réponse" rows="1" no-resize required v-model="titreBonneReponse"></v-textarea>
        <br>
        <v-textarea  label="Texte après la réponse" rows="4" required auto-grow v-model="texteApresReponse" />
        <br>
      </v-col>
      <v-col>
        <h3 align="center">Ajoutez les images puis sélectionnez l'intrus</h3> <br>
        <v-row>
          <v-col>
            <div align="center">
              <label for="file0">
                <svg-icon class="iconImage" type="mdi" :path="mdiPlus" :size="40"></svg-icon>
              </label>
              <input @change="uploadNewImage" class="inputfile" type="file" name="0" id="file0" accept="image/*" />
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
                      <div class="card" v-for="espece in especes" v-bind:key="espece" @click="select(espece, 0)">
                        <img v-if="espece.selected" class="img-selected" :src="espece._links.file.href">
                        <img v-else class="img" :src="espece._links.file.href">
                      </div>
                    </div>
                    <v-card-actions class="justify-end">
                      <v-btn variant="text" @click="isActive.value = false">Fermer</v-btn>
                      <v-btn v-if="imagepicked" variant="text" @click="isActive.value = false, validate(0)">Choisir
                        image</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
              <br>
              <input type="radio" name="radio" v-model="radio" v-bind:value="'0'"/>
              <br>
              <img v-if="image[0]" class="preview" :src="image[0]" />
              <img v-else class="preview" id="addedimage0" />
            </div>
          </v-col>
          <v-col>
            <div align="center">
              <label for="file1">
                <svg-icon class="iconImage" type="mdi" :path="mdiPlus" :size="40"></svg-icon>
              </label>
              <input @change="uploadNewImage" class="inputfile" type="file" name="1" id="file1" accept="image/*" />
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
                      <div class="card" v-for="espece in especes" v-bind:key="espece" @click="select(espece, 1)">
                        <img v-if="espece.selected" class="img-selected" :src="espece._links.file.href">
                        <img v-else class="img" :src="espece._links.file.href">
                      </div>
                    </div>
                    <v-card-actions class="justify-end">
                      <v-btn variant="text" @click="isActive.value = false">Fermer</v-btn>
                      <v-btn v-if="imagepicked" variant="text" @click="isActive.value = false, validate(1)">Choisir
                        image</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
              <br>
              <input type="radio" name="radio" v-model="radio" v-bind:value="'1'"/>
              <br>
              <img v-if="image[1]" class="preview" :src="image[1]" />
              <img v-else class="preview" id="addedimage1" />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div align="center">
              <label for="file2">
                <svg-icon class="iconImage" type="mdi" :path="mdiPlus" :size="40"></svg-icon>
              </label>
              <input @change="uploadNewImage" class="inputfile" type="file" name="2" id="file2" accept="image/*" />
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
                      <div class="card" v-for="espece in especes" v-bind:key="espece" @click="select(espece, 2)">
                        <img v-if="espece.selected" class="img-selected" :src="espece._links.file.href">
                        <img v-else class="img" :src="espece._links.file.href">
                      </div>
                    </div>
                    <v-card-actions class="justify-end">
                      <v-btn variant="text" @click="isActive.value = false">Fermer</v-btn>
                      <v-btn v-if="imagepicked" variant="text" @click="isActive.value = false, validate(2)">Choisir
                        image</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
              <br>
              <input type="radio" name="radio" v-model="radio" v-bind:value="'2'"/>
              <br>
              <img v-if="image[2]" class="preview" :src="image[2]" />
              <img v-else class="preview" id="addedimage2" />
            </div>
          </v-col>
          <v-col>
            <div align="center">
              <label for="file3">
                <svg-icon class="iconImage" type="mdi" :path="mdiPlus" :size="40"></svg-icon>
              </label>
              <input @change="uploadNewImage" class="inputfile" type="file" name="3" id="file3" accept="image/*" />
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
                      <div class="card" v-for="espece in especes" v-bind:key="espece" @click="select(espece, 3)">
                        <img v-if="espece.selected" class="img-selected" :src="espece._links.file.href">
                        <img v-else class="img" :src="espece._links.file.href">
                      </div>
                    </div>
                    <v-card-actions class="justify-end">
                      <v-btn variant="text" @click="isActive.value = false">Fermer</v-btn>
                      <v-btn v-if="imagepicked" variant="text" @click="isActive.value = false, validate(3)">Choisir
                        image</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
              <br>
              <input type="radio" name="radio" v-model="radio" v-bind:value="'3'"/>
              <br>
              <img v-if="image[3]" class="preview" :src="image[3]" />
              <img v-else class="preview" id="addedimage3" />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <br>
    <div class="precedent">
      <button @click="createEtape()" type="submit" width="100%" class="btn greenbtn">Créer Etape</button>
      <br>
      <router-link custom v-slot="{ navigate }" :to="'/createetapeinparcours/' + $router.currentRoute.value.params.parcours">
        <button @click="navigate" role="link" class="routerLink btn orangebtn">Retour</button>
      </router-link>
      <br>
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
import { mdiMagnify } from '@mdi/js';
import { mdiPlus } from '@mdi/js';
import { JeuIntrus } from "../../utils/etapeCreator.js"
import { getParcoursContents, addEtapeInParcours } from "../../utils/queries.js"

export default {
  name: "intruComponent",
  data() {
    return {
      radio: 0,
      image: [],
      bytesarray: [],
      id: '',
      imagepicked: [],
      titre: '',
      question: '',
      titreMauvaiseReponse: '',
      titreBonneReponse: '',
      texteApresReponse: '',
      especes: [],
      espece: '',
      parcour: {},
      especesselected: []
    }
  },
  methods: {
    async uploadNewImage(event) {
      this.image[event.target.name] = ''
      const reader = new FileReader();
      var reader2 = new FileReader();
      reader.onload = (e) => {
        this.bytesarray[event.target.name] = new Uint8Array(e.target.result);
      };
      reader2.onload = function () {
        var output = document.getElementById('addedimage'+event.target.name);
        output.src = reader2.result;
      };
      reader.readAsArrayBuffer(event.target.files[0]);
      reader2.readAsDataURL(event.target.files[0]);
    },

    async select(espece, j) {
      for (let i = 0; i < this.especes.length; i++) {
        if (this.especes[i].id == espece.id) {
          this.especes[i].selected = true;
        } else {
          this.especes[i].selected = false;
        }
      }
      this.imagepicked[j] = true
    },
    validate(j) {
      for (let i in this.especes) {
        if (this.especes[i].selected) {
          this.image[j] = this.especes[i]._links.file.href
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
      var intru = new JeuIntrus(JSON.parse(JSON.stringify(this.parcour)).etapes.length + 1, this.titre, this.question, ['','','',''], this.radio, this.titreBonneReponse, this.titreMauvaiseReponse, this.texteApresReponse)
      var byteArray_tab = ['','','','']
      try {
        const id = await addEtapeInParcours(this.$router.currentRoute.value.params.parcours, intru.generateFirestoreData())
        for (var i = 0; i<=3; i++) {
          if (this.image[i] != '') {
              const response = await fetch(this.image[i]);
              const arrayBuffer = await response.arrayBuffer();
              byteArray_tab[i] = new Uint8Array(arrayBuffer);
          } else {
            if (this.bytesarray[i]) {
              byteArray_tab[i] = this.bytesarray[i]
            }
          }
        }
        //Upload images
        if(byteArray_tab.length == 4) {
          await uploadMultipleImages(byteArray_tab, "image_jeu", id, this.$router.currentRoute.value.params.parcours)
        }
      }
      catch (err) {
        console.log(err)
        alert("Erreur pendant le téléchargement d'une des images, l'image est peut-être trop grande (max : 2Mo)")
      }

      this.$router.push('/editetapes/' + this.$router.currentRoute.value.params.parcours)
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
      this.$router.push('/login')
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

.icon {
  cursor: pointer;
}

.center-div {
  width: 85%;
  height: 100%
}</style>