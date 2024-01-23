<template>
  <h2 align="center">
    Edition d'une transition GPS
  </h2>
  <v-row>

    <v-col>
      <h3 align="center"> Paramètres de la transition</h3>
      <v-textarea label="Nom de la transition" rows="1" variant="outlined" no-resize autofocus required
        v-model="etape.nom"></v-textarea>
      <br>
      <LinkInsert />
      <v-textarea label="Information de la transition" rows="3" required auto-grow v-model="etape.texte" />
      <br>
      <h4 align="center">Position du marqueur GPS</h4>
      <br>
      <div class="gpsSelectContainer">
        <v-text-field label="Latitude" placeholder="Latitude" type="number" required v-model="etape.latitude" />
        <br>
        <v-text-field label="Longitude" placeholder="Longitude" type="number" required v-model="etape.longitude" />
        <br>
      </div>
    </v-col>
    <v-col>
      <h3 align="center">Carte interactive </h3>
      <div style="height:400px; width:400px">
        <l-map id='map' ref="map" :zoom="zoom" :center="[etape.latitude, etape.longitude]">
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
            name="Carte de la ville"></l-tile-layer>
          <l-marker draggable @update:lat-lng="Updatelatlng" :lat-lng="[etape.latitude, etape.longitude]"></l-marker>
        </l-map>
      </div>
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
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import ImagePicker from '../../components/ImagePicker.vue'
export default {
  name: "editPointGPS",
  components: {
    LMap, LTileLayer, LMarker, ImagePicker
  },
  data() {
    return {
      zoom: 13,
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
    Updatelatlng(event) {
      this.etape.latitude = event.lat
      this.etape.longitude = event.lng
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
        latitude: this.etape.latitude,
        longitude: this.etape.longitude
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
  width: 45%;
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