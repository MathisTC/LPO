<template>
    <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="features"
        class="elevation-1"
        density="compact"
    >
    </v-data-table>
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
        itemsPerPage: -1,
        headers: [
        // Définissez vos en-têtes de colonne ici
        //{ title: 'Area Code', sortable: true, key: 'area_code' },
        { title: 'Nom Scientifique',sortable: true, key: 'nom_sci' },
        { title: 'Nom Français',sortable: true, key: 'nom_fr' },
        //{ title: 'Code de Référence',sortable: true, key: 'cd_ref' },
        { title: 'Groupe Taxonomique',sortable: true, key: 'groupe_taxo_fr' },
        { title: 'Population',sortable: true, key: 'count' },
        { title: 'Reproduction',sortable: true, key: 'reproduction' },
        { title: 'Liste rouge',sortable: true, key: 'lr' },
        { title: 'Protection',sortable: true, key: 'protection' }
        ],
        features: [],
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
        fetch("https://data.lpo-aura.org/web/files/data/mv_sem_com_list_sp.geojson")
            .then((response) => response.json())
            .then((data) => {
            this.features = data.features
                .map(({ properties }) => {
                    properties.reproduction = properties.reproduction ? "oui" : "non";
                    properties.lr = properties.lr ? "oui" : "non";
                    properties.protection = properties.protection ? "oui" : "non";
                    return properties;
                })
                .filter((properties) => properties.area_code === this.areaCode);
            })
            .catch((error) => {
            console.error("Error fetching data:", error);
            });
        },
    },
};
</script>


