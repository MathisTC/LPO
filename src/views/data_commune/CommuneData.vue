<template>
    <div v-if="display">
        <div v-if="code_insee != ''">
            <h1 align='center'> Données pour la commune de {{ $route.params.commune }}</h1>
            <h2> Informations sur la répartition des espèces </h2>
            <geojson-table-synth :areaCode="code_insee"></geojson-table-synth>
            <h2>Détails des espèces </h2>
            <v-row>
                <v-col>
                    <h3>Filtres:</h3>
                </v-col>
                <div class="autocomp">
                <v-autocomplete density="compact" chips fixed label="Groupe Taxonomique" :items="groupe_taxo_fr_list" multiple variant="underlined"
                    v-model="groupe"></v-autocomplete>
                </div>
                <v-col>
                    <input type="checkbox" name="checkbox" v-model="radioReproduction" />
                    <label for="radio">Reproduction</label>
                </v-col>
                <v-col>
                    <input type="checkbox" name="checkbox" v-model="radioListeRouge" />
                    <label for="radio">Liste rouge</label>
                </v-col>
                <v-col>
                    <input type="checkbox" name="checkbox" v-model="radioProtection" />
                    <label for="checkbox">Protection</label>
                </v-col>
                <v-col>
                    <button @click="RechercheFiltree()" class="greenbtn">Filtrer</button>
                </v-col>
            </v-row>
            <geojson-table :key="componentKey" :areaCode="code_insee" :protection="radioProtection" :listerouge="radioListeRouge" :reproduction="radioReproduction" :groupe="groupe" :hasloaded="componentKey"></geojson-table>
        </div>
        <div v-else>
            Chargement en cours ...
        </div>
    </div>
</template>
  
<script>
import GeojsonTable from './GeojsonTable.vue';
import GeojsonTableSynth from "./GeojsonTableSynth.vue";
import { getInseeCodeFromCommune } from "@/utils/queries";

export default {
    components: {
        GeojsonTable,
        GeojsonTableSynth,
    },
    name: "InformationCommuneComponent",
    data() {
        return {
            radioProtection: false,
            radioListeRouge: false,
            radioReproduction: false,
            display: false,
            groupe_taxo_fr_list: [],
            groupe: null,
            code_insee: '',
            componentKey: 0

        }
    },
    methods: {
        RechercheFiltree() {
            // reloads component
            this.componentKey++
        },
        async getTaxonsGroupes() {
            fetch("https://data.lpo-aura.org/web/files/data/mv_sem_com_list_sp.geojson")
                .then((response) => response.json())
                .then((data) => {
                    const features = data.features
                    const groupe_taxo_fr_set = new Set();
                    // Parcours des objets et extraction des données pour le code postal spécifié
                    for (const feature of features) {
                        const groupe_taxo_fr = feature.properties.groupe_taxo_fr;
                        if (groupe_taxo_fr) {
                            groupe_taxo_fr_set.add(groupe_taxo_fr);
                        }
                    }
                    this.groupe_taxo_fr_list = Array.from(groupe_taxo_fr_set).sort();
                })
        }
    },
    async mounted() {
        getInseeCodeFromCommune(this.$route.params.commune).then((res) => {
            this.code_insee = res;
            this.getTaxonsGroupes()
        });
        this.display = true;

    },
};
</script>
<style scoped>
.autocomp {
    width: 20%;
}
.greenbtn{
border: 1px solid #E7EAF3;
  border-radius: 5px;
  cursor: pointer;
  color: #ffffff;
  font-family: "Sora";
  text-decoration: none;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>