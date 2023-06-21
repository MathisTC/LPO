<template>
  <div v-if="user.loggedIn">
    <div class="center-div">
      <h2 align="center">
        Modification du parcours: {{ titre }}
      </h2>
      <br>
      <v-row>
        <v-col>
          <h3 align="center"> Paramètres du parcours</h3>
          <v-textarea label="Nom du parcours" rows="1" variant="outlined" no-resize required v-model="titre"></v-textarea>
          <br>
          <v-textarea  label="Description du parcours" required auto-grow v-model="description" />
          <br>
          <v-combobox clearable label="Difficulté" required v-model="difficulte" :items="['Très facile', 'Facile', 'Moyen', 'Difficile', 'Très difficile']"></v-combobox>
          <br>
          <div class="timeSelectContainer">
              <label class="label"> Durée du parcours: </label>
              <v-combobox v-model="heure" :items="hours" label="Heure" required></v-combobox>
              <v-combobox v-model="minute" :items="minutes" label="Minute" required></v-combobox>
          </div>
        </v-col>
        <v-col>
        <div align="center">
          <h3 align="center"> Choisir une image </h3>
          <label for="file">
            <svg-icon class="iconImage" type="mdi" :path="mdiPlus" :size="40"></svg-icon>
          </label>
          <input @change="uploadNewLocalImage" class="inputfile" type="file" name="file" id="file" accept="image/*" />

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
          <div v-if="image_url || bytesarray">Prévisualisation de l'image</div>
          <img v-if="image_url" class="preview" :src="image_url" />
          <img v-else class="preview" id="addedimage" />
        </div>
      </v-col>
      </v-row>
      <br><br>
      <button @click="EditParcours()" type="submit" width="100%" class="btn greenbtn">Modifier parcours</button>
      <br>
      <div class="precedent">
        <router-link custom v-slot="{ navigate }" :to="'/editcommune/'+parcour.commune">
          <button @click="navigate" role="link" class="routerLink btn orangebtn">Retour</button>
        </router-link>
      </div>
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
import { getParcoursContents, modifyParcours } from '../../utils/queries.js'
import { uploadImage } from '../../utils/UploadImage.js'
import { mdiMagnify } from '@mdi/js';
import { mdiPlus } from '@mdi/js';
export default {
  name: "EditParcours",
  data(){
    return {
      image_url: '',
      bytesarray: '',
      id: '',
      imagepicked: false,
      hasimagechanged: false,
      commune: '',
      titre: '',
      description: '',
      difficulte: '',
      duree: '',
      especes: [],
      espece: '',
      parcour: {},
      heure: '0',
      minute: '00',
      hours: Array.from({ length: 8 }, (_, i) => i.toString()),
      minutes: Array.from({ length: 12 }, (_, i) => (i*5).toString().padStart(2, '0'))
    }
  },
  methods: {
    async uploadNewLocalImage(event) {
      this.hasimagechanged = true
      this.image_url = ''
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
    //FIND API IMAGE METHODS ----------------
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
          this.image_url = this.especes[i]._links.file.href
        }
      }
      this.hasimagechanged = true
    },
    //UPDATE PARCOURS METHOD
    async EditParcours() {
      try {
        if (this.image_url !== '' && this.imagepicked == true && this.hasimagechanged) { //FROM API IMAGE         
            const response = await fetch(this.image_url);
            const arrayBuffer = await response.arrayBuffer();
            const byteArray = new Uint8Array(arrayBuffer);
            uploadImage(byteArray, "image_parcours", this.$router.currentRoute.value.params.parcours, '')
        } else { //FROM LOCAL IMAGE
          if (this.bytesarray && this.hasimagechanged) {
            uploadImage(this.bytesarray, "image_parcours", this.$router.currentRoute.value.params.parcours, '')
          }
        }
      } catch (error) {
        console.error(error);
        alert("Erreur pendant le téléchargement de l'image, l'image est peut-être trop grande (max : 2Mo)") 
      }
      const new_p_obj = {
        commune: this.commune,
        description: this.description,
        titre: this.titre,
        difficulte: this.difficulte,
        duree: this.heure + 'h' + this.minute,
      }
      modifyParcours(this.$router.currentRoute.value.params.parcours, new_p_obj)
      this.$router.push('/editetapes/' + this.$router.currentRoute.value.params.parcours)
    }
  },
  mounted() {
    getParcoursContents(this.$router.currentRoute.value.params.parcours).then((res) => {
      this.parcour = res.data
      this.commune = this.parcour.commune
      this.titre = this.parcour.titre
      this.description = this.parcour.description
      this.duree = this.parcour.duree
      this.heure = this.duree.split("h",2)[0]
      this.minute = this.duree.split("h",2)[1]
      this.difficulte = this.parcour.difficulte
      if(this.parcour.image_url != ''){
        this.image_url = this.parcour.image_url
      }
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
  margin-left: 10px;
  margin-right: auto;
  color: #5C5E5F;
  font-size: 14px;
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

.timeSelectContainer {
  display: grid;
  grid-template-columns: auto auto auto;
  column-gap: 10px;
  background-color: #E7ECEE;
  border-radius: 5px;
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