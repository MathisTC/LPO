<template>
  <div v-if="user.loggedIn" class="center-div">
    <h2 align="center">
      Création d'une transition GPS
    </h2>
    <v-row>
      <v-col>
        <h3 align="center"> Paramètres de la transition</h3>
        <v-textarea label="Nom de la transition" rows="1" variant="outlined" no-resize autofocus required v-model="titre"></v-textarea>
        <br>
        <v-textarea  label="Information de la transition" rows="3" required auto-grow v-model="description" />
        <br>
        <h4 align="center">Position du marqueur GPS</h4>
        <br>
        <div class="gpsSelectContainer">
          <v-text-field label="Latitude" placeholder="Latitude" type="number" required v-model="latitude" />
          <br>
          <v-text-field label="Longitude" placeholder="Longitude" type="number" required v-model="longitude" />
          <br>
        </div>
      </v-col>
      <v-col>
        <h3 align="center">Carte interactive </h3>
        <div style="height:400px; width:400px">
          <l-map id='map' ref="map" :zoom="zoom" :center="[originalLatitude, originalLongitude]">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
              name="Carte de la ville"></l-tile-layer>
            <l-marker draggable @update:lat-lng="Updatelatlng" :lat-lng="[latitude, longitude]"></l-marker>
          </l-map>
        </div>
      </v-col>
      <v-col>
        <div align="center">
          <h3 align="center"> Ajouter une image (de la carte)</h3>
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
import { TransiGPS } from "../../utils/etapeCreator.js"
import { getParcoursContents, addEtapeInParcours } from "../../utils/queries.js"
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker  } from "@vue-leaflet/vue-leaflet";
export default {
  name: "gpsComponent",
  components: {
    LMap, LTileLayer, LMarker 
  },
  data() {
    return {
      zoom: 13,
      image: '',
      bytesarray: '',
      id: '',
      imagepicked: false,
      titre: '',
      description: '',
      latitude: '',
      longitude: '',
      originalLatitude: '',
      originalLongitude: '',
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
    Updatelatlng(event) {
      this.latitude = event.lat
      this.longitude= event.lng
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
      var gps = new TransiGPS(JSON.parse(JSON.stringify(this.parcour)).etapes.length + 1, this.titre, '', this.description, this.latitude, this.longitude)
      try {
        const id = await addEtapeInParcours(this.$router.currentRoute.value.params.parcours,gps.generateFirestoreData())
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
    },
    async getCoordsFromCity(city) {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent((city))}`;

      fetch(nominatimUrl)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const coordinates = {
              latitude: parseFloat(data[0].lat),
              longitude: parseFloat(data[0].lon)
            };
            this.latitude= coordinates.latitude
            this.longitude= coordinates.longitude
            this.originalLatitude= coordinates.latitude
            this.originalLongitude= coordinates.longitude
          } else {
            console.log("Impossible de récupérer les coordonnées pour cette ville.");
          }
        })
        .catch(error => {
          console.log("Une erreur s'est produite lors de la récupération des coordonnées.", error);
        });
    }
  },

  mounted() {
    getParcoursContents(this.$router.currentRoute.value.params.parcours).then((res) => {
      this.parcour = res
      this.commune = res.data.commune;
      this.getCoordsFromCity(this.commune)
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

.gpsSelectContainer {
  display: grid;
  grid-template-columns: auto auto auto;
  column-gap: 10px;
}

.selectNumber {
  width:45%;
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

.center-div {
  width: 80%;
}
</style>