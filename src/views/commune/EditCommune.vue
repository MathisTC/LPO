<template>
  <div v-if="user.loggedIn && display">
    <br>
    <h2 align="center">
      Parcours de la commune:
      {{ $route.params.commune }}
    </h2>
    <div class="parcours" v-for="parcour in parcours" :key="parcour">
      <div>{{ parcour.titre }}</div>
      <div>
        <svg-icon @click="EditParcours(parcour)" class="iconEditDelete" type="mdi" :path="mdiPencilOutline" :size="20">
        </svg-icon>
        <svg-icon @click="DeleteParcours(parcour)" class="iconEditDelete" type="mdi" :path="mdiDeleteOutline" :size="20"></svg-icon>
      </div>
    </div>
    <br><br>
    <button @click="AddParcoursInCommune($route.params.commune)" class="btn greenbtn">Ajouter un parcours</button><br>

    <br><br>
    <button @click="InformationCommune($route.params.commune)" class="btn bluebtn">Données espèces
    </button><br>
    <div class="precedent">
        <router-link custom v-slot="{ navigate }" to="/">
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
import { useRouter } from "vue-router";
import { computed } from "vue";
import { auth } from '../../firebaseConfig'
import { getParcoursFromCommune, deleteParcours } from '../../utils/queries.js'
import { ref } from "vue"
import { mdiPencilOutline } from '@mdi/js';
import { mdiDeleteOutline } from '@mdi/js';
export default {
  name: "EditCommuneComponent",

  setup() {
    let parcours = ref([])
    const store = useStore()
    const router = useRouter()
    let display = true;

    const EditParcours = async (parcour) => {
      router.push('/editparcours/' + parcour.identifiant)
    }

    const AddParcoursInCommune = async (commune) => {
      router.push('/createparcoursincommune/' + commune)
    }

    const InformationCommune = async (commune) => {
      //router.push('/informationcommune/' + commune)
      var nouvelleFenetre = window.open('/informationcommune/' + commune, "_blank");
      nouvelleFenetre.focus();
    }


    getParcoursFromCommune(router.currentRoute.value.params.commune).then((res) => {
      parcours.value = res;
    });

    const DeleteParcours = async (parcour) => {
      const response = confirm("Souhaitez vous vraiment supprimer le parcours: " + parcour.titre);
      if (response) {
        deleteParcours(parcour.identifiant);
        for (let i = 0; i <parcours.value.length; i++)
        {
          if (parcours.value[i].identifiant == parcour.identifiant)
          {
            parcours.value.splice(i, 1)
          }
        }
      }
    }

    auth.onAuthStateChanged(user => {
      store.dispatch("fetchUser", user);
    });
    const user = computed(() => {
      return store.getters.user;
    });
    if (!(user.value.loggedIn)) {
      router.push('/login')
    }


    return { display, user, getParcoursFromCommune, parcours, mdiPencilOutline, mdiDeleteOutline, EditParcours, AddParcoursInCommune, DeleteParcours, InformationCommune }
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
  width: 30%;
}

.parcours {
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
</style>