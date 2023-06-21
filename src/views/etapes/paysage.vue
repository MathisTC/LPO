<template>
  <div v-if="user.loggedIn" class="center-div">
    <h2 align="center">
      Création d'une recherche de paysage (par code)
    </h2>
    <br>
    <v-row align="start">
      <v-col>
        <h3 align="center"> Paramètres du jeu</h3>
        <v-textarea label="Nom du jeu" rows="1" variant="outlined" no-resize autofocus required v-model="titre"></v-textarea>
        <br>
        <v-textarea  label="Description position code" rows="3" required auto-grow v-model="description" />
        <br>
        <v-textarea class="selectCode" label="Code à trouver" rows="1" no-resize required v-model="code"></v-textarea>
        <br>
      </v-col>
      <v-col>
        <div align="center">
            <h3 align="center"> Ajouter une image </h3>
            <br>
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
                    <v-btn v-if="imagepicked" variant="text" @click="isActive.value = false, validate()">Choisir image</v-btn>
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
      <button @click="createEtape()" type="submit" width="100%" class="btn greenbtn">Créer Etape</button>
      <br>
      <router-link custom v-slot="{ navigate }" :to="'/createetapeinparcours/' + $router.currentRoute.value.params.parcours">
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
import { JeuCode } from "../../utils/etapeCreator.js"
import { getParcoursContents, addEtapeInParcours } from "../../utils/queries.js"

export default {
  name: "gpsComponent",
  data() {
    return {
      image: '',
      bytesarray: '',
      id: '',
      imagepicked: false,
      titre: '',
      description: '',
      code: '',
      especes: [],
      espece: '',
      parcour: {}
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
    async searchSpecies()  {
      this.especes = []
      const response = await fetch('https://taxref.mnhn.fr/api/taxa/search?frenchVernacularNames=' + this.espece + '&territories=fr&page=1&size=1');
      const myJson = await response.json(); //extract JSON from the http response
      if (myJson.page.totalElements) {
        const response2 = await fetch('https://taxref.mnhn.fr/api/taxa/' + myJson._embedded.taxa[0].id + '/media');
        const myJson2 = await response2.json(); //extract JSON from the http response
        this.especes = myJson2._embedded.media
      }
    },
    async createEtape () {
      var jeuCode = new JeuCode(JSON.parse(JSON.stringify(this.parcour)).etapes.length + 1, this.titre, '', this.description, this.code)
      try {
        const id = await addEtapeInParcours(this.$router.currentRoute.value.params.parcours,jeuCode.generateFirestoreData())
        if (this.image != '') {
            const response = await fetch(this.image);
            const arrayBuffer = await response.arrayBuffer();
            const byteArray = new Uint8Array(arrayBuffer);
            await uploadImage(byteArray, "image_etape", id, this.$router.currentRoute.value.params.parcours )
        } else {
          if (this.bytesarray) {
              await uploadImage(this.bytesarray, "image_etape",id, this.$router.currentRoute.value.params.parcours)          
          }
        }
      }
      catch(err) {
        console.log(err)
        alert("Erreur pendant le téléchargement de l'image, l'image est peut-être trop grande (max : 2Mo)")
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
    return { user, mdiMagnify, mdiPlus}
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

.selectCode {
  width: 40%;
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
</style>