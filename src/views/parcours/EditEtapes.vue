<template>
  <br>
  <h2 class="text-xl my-4" align="center">
    Etapes du parcours:
    {{ parcour }}
  </h2>

  <div align="center" class="brouillon" v-if="brouillon">
    <h3>Ce parcours est en brouillon. Appuyez sur le bouton pour le mettre en ligne</h3>
    <button @click="publishParcours($route.params.parcour)" class="btn greenbtn bg-green">Publier le parcours
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
  <draggable v-model="etapes" tag="ul" itemKey="id_etape" ghost-class="ghost" :animation="300">

    <template #item="{ element: etape }">


      <div class="parcours">
        <div>{{ etape.etape.type + " : " + etape.etape.nom }} </div>
        <div class="buttons">
          <input v-model="etape.etape.n_etape">
          <div class="flex">
            <svg-icon @click="EditEtape(etape)" class="iconEditDelete" type="mdi" :path="mdiPencilOutline" :size="20">
            </svg-icon>
            <svg-icon @click="ViewEtape(etape)" class="iconEditDelete" type="mdi" :path="mdiEyeOutline" :size="20">
            </svg-icon>
            <svg-icon @click="DeleteEtape(etape)" class="iconEditDelete" type="mdi" :path="mdiDeleteOutline"
              :size="20"></svg-icon>
          </div>
        </div>
      </div>
    </template>
  </draggable>
  <br><br>
  <v-row>
    <button @click="AddEtapeInParcours($route.params.parcour)" class="btn bluebtn">Ajouter une étape
    </button>
    <button @click="validateParcours($route.params.parcour)" class="btn greenbtn bg-green">Valider l'ordre du parcours
    </button>
  </v-row>
  <br>
  <div class="precedent">
    <router-link custom v-slot="{ navigate }" :to="'/editcommune/' + commune">
      <button @click="navigate" role="link" class="routerLink btn orangebtn">Retour</button>
    </router-link>
  </div>
  <br>
</template>

<script>
import { mdiEyeOutline, mdiPencilOutline } from '@mdi/js';
import { mdiDeleteOutline } from '@mdi/js';
import { getParcoursContents, validateEtapesInParcours, deleteEtapeInParcours, setBrouillon } from '../../utils/queries.js'
import draggable from 'vuedraggable';

export default {
  name: "EditeEtapesComponent",
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
    EditEtape(etape) {
      if (etape.id != this.etapes[etape.etape.ordre - 1].id) {
        validateEtapesInParcours(this.$router.currentRoute.value.params.parcour, JSON.parse(JSON.stringify(this.etapes)))
      }
      this.$router.push({
        path: '/editetape/' + etape.etape.type + '/' + etape.id,
        query: {
          parcoursId: this.$router.currentRoute.value.params.parcour,
          etape: JSON.stringify(etape)
        }
      })
    },

    AddEtapeInParcours() {
      this.$router.push('/createetapeinparcours/' + this.$router.currentRoute.value.params.parcour)
    },
    validateParcours() {
      validateEtapesInParcours(this.$router.currentRoute.value.params.parcour, JSON.parse(JSON.stringify(this.etapes))).then(() => {
        window.alert("L'ordre des étapes a été mis à jour")
      }).catch(() => {
        window.alert("Erreur, sur la mise à jour des étapes, veuillez vérifier que vous avez bien saisi les valeurs")
      })
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
    return { mdiEyeOutline, mdiDeleteOutline, draggable, mdiPencilOutline }
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