<template>
  <div align="center">
    <h3 v-if="doNotDisplayTitle !== true" align="center"> Choisir une image </h3>
    <div class="flex justify-center">
      <label :for="'file' + number">
        <svg-icon class="iconImage" type="mdi" :path="mdiPlus" :size="40"></svg-icon>
      </label>
      <input @change="uploadNewImage" class="inputfile" type="file" name="file" :id="'file' + number" accept="image/*" />
      <v-dialog transition="dialog-bottom-transition" width="800px">
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
              <div v-if="error">{{ error }}</div>
              <div class="card" v-for="uneEspece in especes" v-bind:key="uneEspece" @click="select(uneEspece)">
                <img v-if="uneEspece.selected" class="img-selected" :src="uneEspece._links.file.href">
                <img v-else class="img" :src="uneEspece._links.file.href">
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
    </div>
    <div v-if="image || bytesarray || previousImageUrl">Prévisualisation de l'image</div>
    <img v-if="image" class="preview" :src="image" />
    <img v-else class="preview" id="addedimage" />
  </div>
</template>


<script>
import { mdiMagnify, mdiPlus } from '@mdi/js';
export default {
  name: "ImagePicker",

  data() {
    return {
      bytesarray: '',
      imagepicked: false,
      especes: [],
      espece: '',
      image: '',
      error: ''
    }

  },
  props: ['previousImageUrl', 'doNotDisplayTitle', 'number'],
  async mounted() {
    this.image = this.previousImageUrl
  },
  methods: {
    async searchSpecies() {
      try {
        this.error = ""
        this.especes = []
        const response = await fetch('https://taxref.mnhn.fr/api/taxa/search?frenchVernacularNames=' + this.espece + '&territories=fr&page=1&size=1');
        const myJson = await response.json(); //extract JSON from the http response
        if (myJson.page.totalElements) {
          const response2 = await fetch('https://taxref.mnhn.fr/api/taxa/' + myJson._embedded.taxa[0].id + '/media');
          const myJson2 = await response2.json(); //extract JSON from the http response
          this.especes = myJson2._embedded.media
        }
      } catch (err) {
        console.log(err)
        this.error = "erreur lors de la récupération des espèces, le mot clé n'a peut être pas d'espèces associées"
      }
    },
    async uploadNewImage(event) {
      this.image = ''
      const file = event.target.files[0]; // Accéder à l'objet File
      const reader = new FileReader();
      var reader2 = new FileReader();
      reader.onload = (event) => {
        const fileBytes = new Uint8Array(event.target.result);
        this.bytesarray = fileBytes
        this.$emit('bytesUpdated', this.bytesarray)
      };
      reader2.onload = function () {
        var output = document.getElementById('addedimage');
        output.src = reader2.result;
      };
      reader.readAsArrayBuffer(file);
      reader2.readAsDataURL(event.target.files[0]);
    },
    async select(uneEspece) {
      for (let i = 0; i < this.especes.length; i++) {
        if (this.especes[i].id == uneEspece.id) {
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
          this.$emit('imageUpdated', this.image)
        }
      }
    },
  },
  setup() {
    return { mdiMagnify, mdiPlus }
  }
}
</script>
<style> .imageselector {
   min-width: 70%;
 }

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