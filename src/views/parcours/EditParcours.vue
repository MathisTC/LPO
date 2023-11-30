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
          <br>
        </v-col>
        <v-col>
          <ImagePicker :previousImageUrl="image_url" v-if="parcours.titre" @imageUpdated="(image) => updateImage(image)"
            @bytesUpdated="(bytesArray) => updateBytes(bytesArray)" />
      </v-col>
      </v-row>
      <br><br>
      <button @click="EditParcours()" type="submit" width="100%" class="btn greenbtn">Modifier parcours</button>
      <br>
      <div class="precedent">
        <router-link custom v-slot="{ navigate }" :to="'/editcommune/'+parcours.commune">
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
import ImagePicker from '../../components/ImagePicker.vue'
export default {
  components: { ImagePicker },
  name: "EditParcours",
  data(){
    return {
      initialImageChanged: false,
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
      parcours: {},
      heure: '0',
      minute: '00',
      hours: Array.from({ length: 8 }, (_, i) => i.toString()),
      minutes: Array.from({ length: 12 }, (_, i) => (i*5).toString().padStart(2, '0')),
    }
  },
  methods: {
    updateImage(image) {
      this.initialImageChanged= true
      this.image_url = image
      this.hasimagechanged =true
    },
    updateBytes(bytesArray) {
      this.bytesarray = bytesArray
      this.hasimagechanged = true
    },
    //UPDATE PARCOURS METHOD
    async EditParcours() {
      try {
        if (this.image_url !== ''  && this.hasimagechanged && this.initialImageChanged) { //FROM API IMAGE         
            const response = await fetch(this.image_url);
            const arrayBuffer = await response.arrayBuffer();
            const byteArray = new Uint8Array(arrayBuffer);
            uploadImage(byteArray, "image_parcours", this.$router.currentRoute.value.params.parcours, '')
        } else { //FROM LOCAL IMAGE
          if (this.bytesarray && this.bytesarray != ''  && this.hasimagechanged) {
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
  async mounted() {
    getParcoursContents(this.$router.currentRoute.value.params.parcours).then((res) => {
      this.parcours = res.data
      this.commune = this.parcours.commune
      this.titre = this.parcours.titre
      this.description = this.parcours.description
      this.duree = this.parcours.duree
      this.heure = this.duree.split("h",2)[0]
      this.minute = this.duree.split("h",2)[1]
      this.difficulte = this.parcours.difficulte
      if(this.parcours.image_url != ''){
        this.image_url = this.parcours.image_url
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
      this.$router.push('/')
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