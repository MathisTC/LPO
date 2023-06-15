<template>
  <div v-if="user.loggedIn">
    <br>
    <h2 align="center">
      Etapes du parcours:
      {{ parcour }}
    </h2>
    <p align="center">Pour changer l'ordre des étapes, glisser les différentes étapes puis cliquer sur le bouton valider</p>
    <draggable v-model="etapes" tag="ul" itemKey="id" ghost-class="ghost" :animation="300">
      
      <template #item="{ element: etape }">

    <div class="parcours">
      <div>{{ etape.etape.type+": "+etape.etape.nom }} </div>
      <div>
        <svg-icon @click="ViewEtape(etape)" class="iconEditDelete" type="mdi" :path="mdiEyeOutline" :size="20">
        </svg-icon>
        <svg-icon @click="DeleteEtape(etape)" class="iconEditDelete" type="mdi" :path="mdiDeleteOutline" :size="20"></svg-icon>
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
      <router-link custom v-slot="{ navigate }" :to="'/editcommune/'+commune">
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
import { mdiEyeOutline } from '@mdi/js';
import { mdiDeleteOutline } from '@mdi/js';
import { auth } from '../../firebaseConfig'
import { getParcoursContents, validateEtapesInParcours, deleteEtapeInParcours  } from '../../utils/queries.js'
import draggable from 'vuedraggable';


export default {
  name: "EditeEtapesComponent",
  data() {
    return {
      parcour: '_',
      etapes: [],
      commune: '_',
    }
  },
  methods: {
    ViewEtape(etape) {
      if(etape.id != this.etapes[etape.etape.ordre -1].id) {
        validateEtapesInParcours(this.$router.currentRoute.value.params.parcour,JSON.parse(JSON.stringify(this.etapes)))
      }
      this.$router.push({
        path: '/viewetape/'+etape.etape.type+'/'+etape.id,
        query: { 
          parcoursid: this.$router.currentRoute.value.params.parcour,
          parcours: this.parcour,
          etapes: JSON.stringify(this.etapes),
          ordre: etape.etape.ordre
        }
    })
    },

    AddEtapeInParcours() {
      this.$router.push('/createetapeinparcours/'+this.$router.currentRoute.value.params.parcour)
    },
    validateParcours() {
      validateEtapesInParcours(this.$router.currentRoute.value.params.parcour,JSON.parse(JSON.stringify(this.etapes)))
      window.alert("L'ordre des étapes a été mis à jour")
    },
    DeleteEtape(etape) {
      const response = confirm("Souhaitez vous vraiment supprimer l'étape: " + etape.etape.nom);
      if (response) {
        deleteEtapeInParcours(this.$router.currentRoute.value.params.parcour, etape.id, JSON.parse(JSON.stringify(this.etapes)))
        for (let i = 0; i <this.etapes.length; i++)
        {
          if (JSON.parse(JSON.stringify(etape)).id == this.etapes[i].id)
          {
            this.etapes.splice(i, 1)
          }
        }
      }
    }
  },

  mounted() {
    getParcoursContents(this.$router.currentRoute.value.params.parcour).then((res) => {
      this.parcour = res.data.titre;
      this.commune = res.data.commune;
      this.etapes = res.etapes;
      this.etapes.sort((a, b) => a.etape.ordre - b.etape.ordre);
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
    return { user, mdiEyeOutline, mdiDeleteOutline, draggable }
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
  cursor:pointer;
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
</style>