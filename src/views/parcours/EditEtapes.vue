<template>
  <div v-if="user.loggedIn">
    <br>
    <h2 align="center">
      Etapes du parcours:
      {{ parcour }}
    </h2>

    <div align="center" class="brouillon" v-if="brouillon">
      <h3>Ce parcours est en brouillon. Appuyez sur le bouton pour le mettre en ligne</h3>
      <button @click="publishParcours($route.params.parcour)" class="btn greenbtn">Publier le parcours
      </button>
    </div>

    <div align="center" class="brouillon" v-else>
      <h3>Ce parcours est en ligne. Appuyez sur le bouton pour le mettre en brouillon</h3>
      <button @click="hideParcours($route.params.parcour)" class="btn orangebtn">Mettre le parcours en brouillon
      </button>
    </div>

    <br>
    <p align="center">Pour changer l'ordre des étapes, glisser les différentes étapes puis cliquer sur le bouton valider
    </p>
    <draggable v-model="etapes" tag="ul" itemKey="id" ghost-class="ghost" :animation="300">
      
      <template #item="{ element: etape }">
        

        <div class="parcours">
          <div>{{ etape.etape.type + " : " + etape.etape.nom }} </div>
          <div class="buttons">
            <input v-model="etape.etape.poids" @input="updateEtape($route.params.parcour, etape.id, etape.etape.poids)" @change="getEtapes()">
            <div>
              <svg-icon @click="EditEtape(etape)" class="iconEditDelete" type="mdi" :path="mdiPencilOutline" :size="20">
              </svg-icon>
              <svg-icon @click="ViewEtape(etape)" class="iconEditDelete" type="mdi" :path="mdiEyeOutline" :size="20">
              </svg-icon>
              <svg-icon @click="DeleteEtape(etape)" class="iconEditDelete" type="mdi" :path="mdiDeleteOutline" :size="20"></svg-icon>
            </div>
          </div>
        </div>
      </template>
    </draggable>
    <br><br>
    <v-row>
      <button @click="AddEtapeInParcours($route.params.parcour)" class="btn bluebtn">Ajouter une étape
      </button>
      <button @click="validateParcours($route.params.parcour)" class="btn greenbtn">Valider l'ordre du parcours
      </button>
    </v-row>
    <br>
    <div class="precedent">
      <router-link custom v-slot="{ navigate }" :to="'/editcommune/' + commune">
        <button @click="navigate" role="link" class="routerLink btn orangebtn">Retour</button>
      </router-link>
    </div>
    <br>
  </div>

  <div v-else class="alert alert-danger" role="alert">
    You are not logged in!
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import { mdiEyeOutline, mdiPencilOutline } from '@mdi/js';
import { mdiDeleteOutline } from '@mdi/js';
import { auth } from '../../firebaseConfig'
import { getParcoursContents, validateEtapesInParcours, deleteEtapeInParcours, setBrouillon } from '../../utils/queries.js'
import draggable from 'vuedraggable';
import { modifyEtapeInParcours } from '../../utils/queries'

export default {
  name: "EditeEtapesComponent",
  poidsTotal: 0,

  data() {
    return {
      parcour: '_',
      etapes: [],
      commune: '_',
      brouillon: Boolean,
    }
  },
  methods: {
    ViewEtape(etape) {
      if (etape.id != this.etapes[etape.etape.ordre - 1].id) {
        validateEtapesInParcours(this.$router.currentRoute.value.params.parcour, JSON.parse(JSON.stringify(this.etapes)))
      }
      this.$router.push({
        path: '/viewetape/' + etape.etape.type + '/' + etape.id,
        query: {
          parcoursid: this.$router.currentRoute.value.params.parcour,
          parcours: this.parcour,
          etapes: JSON.stringify(this.etapes),
          ordre: etape.etape.ordre

        }
      })
    },

    // Met à jour le poids de chaque étape
    updateEtape(id_parcours, id_etape, poids) {
      var p_obj = {
        poids: poids
      }
      modifyEtapeInParcours(id_parcours, id_etape, p_obj)
    },
    EditEtape(etape) {
      if (etape.id != this.etapes[etape.etape.ordre - 1].id) {
        validateEtapesInParcours(this.$router.currentRoute.value.params.parcour, JSON.parse(JSON.stringify(this.etapes)))
      }
      this.$router.push({
        path: '/editetape/' + etape.etape.type + '/' + etape.id,
        query:  {
          parcoursId: this.$router.currentRoute.value.params.parcour,
          etape: JSON.stringify(etape)
        }
      })
    },

    AddEtapeInParcours() {
      this.$router.push('/createetapeinparcours/' + this.$router.currentRoute.value.params.parcour)
    },
    validateParcours() {
      validateEtapesInParcours(this.$router.currentRoute.value.params.parcour, JSON.parse(JSON.stringify(this.etapes)))
      window.alert("L'ordre des étapes a été mis à jour")
    },
    DeleteEtape(etape) {
      const response = confirm("Souhaitez vous vraiment supprimer l'étape: " + etape.etape.nom);
      if (response) {
        deleteEtapeInParcours(this.$router.currentRoute.value.params.parcour, etape.id, JSON.parse(JSON.stringify(this.etapes)))
        for (let i = 0; i < this.etapes.length; i++) {
          if (JSON.parse(JSON.stringify(etape)).id == this.etapes[i].id) {
            this.etapes.splice(i, 1)
          }
        }
      }
    },
    getEtapes() {

      if (this.etapes[this.etapes.length-1].etape.poids < 100){
        window.alert("La progression n'est pas complète, veuillez réessayer")   
      }
      //console.log(this.$router.currentRoute.value.params.parcour.nom)      
    },
    isSorted() {
      let tab = []
      for (let i = 0; i < this.etapes.length; i++) {
        tab.push(this.etapes[i].etape.poids)
        console.log("comp ",this.etapes[i].etape.poids > this.etapes[i+1].etape.poids)
      }
      for (let i = 0; i < this.etapes.length; i++) {
        if (tab[i] > tab[i+1]) {
          return false
         // Si un élément est plus grand que l'élément suivant, la liste n'est pas ordonnée
        }
      }
      return true; // Si aucun élément n'est plus grand que l'élément suivant, la liste est ordonnée
    },
    async hideParcours(parcoursId) {
      await setBrouillon(parcoursId, true).then(() => {
        this.getParcours()
      })
    },
    async publishParcours(parcoursId) {
      await setBrouillon(parcoursId, false).then(() => {
        this.getParcours()
      })
    },
    async getParcours() {
      await getParcoursContents(this.$router.currentRoute.value.params.parcour).then((res) => {
        this.brouillon = res.data.brouillon
        this.parcour = res.data.titre;
        this.commune = res.data.commune;
        this.etapes = res.etapes;
        this.etapes.sort((a, b) => a.etape.ordre - b.etape.ordre);
      });
    }
  },

  async mounted() {
    await this.getParcours()
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
    return { user, mdiEyeOutline, mdiDeleteOutline, draggable, mdiPencilOutline }
  }
};
</script>

<style scoped>
v-row {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.btn {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 20%;
}

.parcours {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  background-color: white;
  align-items: center;
  width: 50%;
  margin: 0 auto;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.buttons {
  display: flex;
  align-items: center;
}

input {
  width: 40px;
  height: 30px;
  background-color: rgb(235, 235, 235);
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  font-size: .9em;
}
</style>