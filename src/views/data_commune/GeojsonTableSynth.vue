<template>
    <v-data-table
        :headers="headers"
        :items="features"
        :items-per-page="1"
        :footer-props="{
            'items-per-page-text':'products per page', 
        }"
        class="elevation-1"
        density="compact"
    ></v-data-table>
</template>
  
<script>
import { VDataTable } from 'vuetify/lib/labs/components';

export default {
    props: [
        'areaCode'
    ],
    components: {
        VDataTable
    },
    data() {
        return {
        headers: [
        // Définissez vos en-têtes de colonne ici
        { title: "Nombre d'espèce (tout type)", align:'start', sortable: false, key: 'nb_sp' },
        { title: 'En reproduction', align:'start', sortable: false, key: 'nb_sp_repro' },
        { title: 'Oiseau', align: 'start', sortable: false, key: 'nb_sp_oiseaux' },
        { title: 'Amphibien', align: 'start',sortable: true, key: 'nb_sp_amphibiens' },
        { title: 'Mammifère', align: 'start',sortable: true, key: 'nb_sp_mammifères' },
        { title: 'Papillon', align: 'start',sortable: true, key: 'nb_sp_papillon' },
        { title: 'Reptiles', align: 'start',sortable: true, key: 'nb_sp_reptiles' },
        { title: 'Chauve-souris', align: 'start',sortable: true, key: 'nb_sp_cs' },
        { title: 'Libellules', align: 'start',sortable: true, key: 'nb_sp_libellules' },
        { title: 'Liste rouge', align: 'start',sortable: true, key: 'nb_sp_lr' },
        { title: 'Protégée',align: 'start',sortable: true, key: 'nb_sp_protection' },
        ],
        features: [],
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
        fetch("https://data.lpo-aura.org/web/files/data/mv_sem_com_synth.geojson")
            .then((response) => response.json())
            .then((data) => {
            this.features = data.features
                .map(({ properties }) => properties)
                .filter((properties) => properties.area_code === this.areaCode);
            })
            .catch((error) => {
            console.error("Error fetching data:", error);
            });
        },
    },
};
</script>


