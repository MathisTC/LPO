<template>
    <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="features" class="elevation-1"
        density="compact">
    </v-data-table>
</template>
  
<script>
import { VDataTable } from 'vuetify/lib/labs/components';
export default {
    props: [
        'areaCode',
        'protection',
        'listerouge',
        'reproduction',
        'groupe',
        'hasloaded'
    ],
    components: {
        VDataTable
    },
    data() {
        return {
            lr: 'non',
            re: 'non',
            pr: 'non',
            itemsPerPage: -1,
            headers: [
                // Définissez vos en-têtes de colonne ici
                //{ title: 'Area Code', sortable: true, key: 'area_code' },
                { title: 'Nom Scientifique', sortable: true, key: 'nom_sci' },
                { title: 'Nom Français', sortable: true, key: 'nom_fr' },
                //{ title: 'Code de Référence',sortable: true, key: 'cd_ref' },
                { title: 'Groupe Taxonomique', sortable: true, key: 'groupe_taxo_fr' },
                { title: 'Population', sortable: true, key: 'count' },
                { title: 'Reproduction', sortable: true, key: 'reproduction' },
                { title: 'Liste rouge', sortable: true, key: 'lr' },
                { title: 'Protection', sortable: true, key: 'protection' }
            ],
            features: [],
        };
    },
    mounted() {
        if (this.listerouge) {
            this.lr = 'oui'
        }
        if (this.protection) {
            this.pr = 'oui'
        }
        if (this.reproduction) {
            this.re = 'oui'
        }
        if(this.hasloaded) {
            this.fetchData_filter();
        } else {
            this.fetchData()
        }
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

        fetchData_filter() {
            console.log(this.groupe)
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
                        .filter((properties) => {
                            return (
                                properties.area_code === this.areaCode &&
                                (properties.lr === this.lr || this.lr === 'non' )&&
                                (properties.protection === this.pr || this.pr === 'non' ) &&
                                (properties.reproduction === this.re|| this.re === 'non') &&
                                ( !this.groupe || this.groupe.length == 0 || this.groupe.includes(properties.groupe_taxo_fr))
                            );
                        }
                        );
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        },
    },
};
</script>


