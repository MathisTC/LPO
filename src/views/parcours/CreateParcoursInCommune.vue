<template>
  <div class="center-div">
    <h2 class="text-xl my-4" align="center">
      Créer un parcours dans la commune {{ $route.params.commune }}
    </h2>
    <v-row>
      <v-col>
        <h3 align="center"> Paramètres du parcours</h3>
        <v-textarea label="Nom du parcours" rows="1" variant="outlined" no-resize required autofocus
          v-model="titre"></v-textarea>
        <br>
        <v-textarea label="Description du parcours" required auto-grow v-model="description" />
        <br>
        <v-combobox clearable label="Difficulté" required v-model="difficulte"
          :items="['Très facile', 'Facile', 'Moyen', 'Difficile', 'Très difficile']"></v-combobox>
        <br>
        <div class="timeSelectContainer">
          <label class="label"> Durée du parcours: </label>
          <v-combobox v-model="heure" :items="hours" label="Heure" required></v-combobox>
          <v-combobox v-model="minute" :items="minutes" label="Minute" required></v-combobox>
        </div>
      </v-col>
      <v-col>
        <ImagePicker @imageUpdated="(image) => this.image = image"
          @bytesUpdated="(bytesArray) => this.bytesarray = bytesArray" />
      </v-col>
    </v-row>
    <br><br>
    <button @click="createParcoursInCommune()" type="submit" width="100%" class="btn greenbtn bg-green">Créer
      parcours</button>
    <br>
    <div class="precedent">
      <router-link custom v-slot="{ navigate }" :to="'/editcommune/' + $route.params.commune">
        <button @click="navigate" role="link" class="routerLink btn orangebtn">Retour</button>
      </router-link>
    </div>
  </div>
</template>

<script>

import { createParcours } from '../../utils/queries.js'
import { uploadImage } from '../../utils/UploadImage.js'
import ImagePicker from '../../components/ImagePicker.vue'
export default {
  components: { ImagePicker },
  name: "CreateParcoursInCommune",
  data() {
    return {
      image: '',
      bytesarray: '',
      id: '',
      commune: '',
      titre: '',
      description: '',
      difficulte: '',
      duree: '',
      parcour: {},
      heure: '0',
      minute: '00',
      hours: Array.from({ length: 8 }, (_, i) => i.toString()),
      minutes: Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))
    }
  },
  methods: {
    async createParcoursInCommune() {
      const obj = {
        commune: this.commune,
        description: this.description,
        titre: this.titre,
        difficulte: this.difficulte,
        duree: this.heure + 'h' + this.minute,
        image_url: ''
      }
      const id_parcours = await createParcours(obj);
      try {
        if (this.image != '' && this.image) {
          const response = await fetch(this.image);
          const arrayBuffer = await response.arrayBuffer();
          const byteArray = new Uint8Array(arrayBuffer);
          uploadImage(byteArray, "image_parcours", id_parcours, '')
        } else {
          if (this.bytesarray) {
            uploadImage(this.bytesarray, "image_parcours", id_parcours, '')
          }
        }
      } catch (error) {
        console.error(error);
        alert("Erreur pendant le téléchargement de l'image, l'image est peut-être trop grande (max : 2Mo)")
      }

      this.$router.push('/editcommune/' + this.commune)
    }
  },
  mounted() {
    this.commune = this.$router.currentRoute.value.params.commune;
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
  margin-left: 10px;
  margin-right: auto;
  color: #5C5E5F;
  font-size: 14px;
}


.timeSelectContainer {
  display: grid;
  grid-template-columns: auto auto auto;
  column-gap: 10px;
  background-color: #E7ECEE;
  border-radius: 5px;
}
</style>