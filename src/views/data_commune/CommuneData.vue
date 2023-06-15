<template>
    <div v-if="display">
        <div v-if="code_insee!=''">
            <h1 align='center'> Données pour la commune de {{ $route.params.commune }}</h1>
            <h2> Informations sur la répartition des espèces </h2>
            <geojson-table-synth :areaCode="code_insee"></geojson-table-synth>
            <h2>Détails des espèces </h2>
            <geojson-table :areaCode="code_insee" ></geojson-table>
        </div>
        <div v-else>
            Chargement en cours ...
        </div>
    </div>
</template>
  
<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
import GeojsonTable from './GeojsonTable.vue';
import GeojsonTableSynth from "./GeojsonTableSynth.vue";
import { getInseeCodeFromCommune } from "@/utils/queries";
  
export default {
    components: {
      GeojsonTable,
      GeojsonTableSynth,
    },
    name: "InformationCommuneComponent",

    setup() {
        const code_insee = ref('');
        const router = useRouter();
        const display = true;

        getInseeCodeFromCommune(router.currentRoute.value.params.commune).then((res) => {
            code_insee.value = res;
        });
        
        return { display, code_insee };
    },
};
</script>