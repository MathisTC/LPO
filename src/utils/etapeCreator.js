const TypeEtape = {
    transi_info: "transi_info", //DONE
    transi_gps: "transi_gps", //DONE
    jeu_info: "jeu_info", // DONE
    jeu_blague: "jeu_blague", // DONE
    jeu_qcm: "jeu_qcm", // DONE
    jeu_cesar: "jeu_cesar", // DONE
    jeu_pyramide: "jeu_pyramide", // DONE
    jeu_intrus: "jeu_intrus", // DONE
    jeu_code: "jeu_code", // DONE
    jeu_charade: "jeu_charade", //DONE
    jeu_compterimage: "jeu_compterimage", //DONE
    jeu_rebus: "jeu_rebus", //DONE
    jeu_ecogeste: "jeu_ecogeste" //DONE
};

/* N'importe quelle étape, que ce soit une transition ou un jeu possède des champs communs : 
ordre : un entier allant de 1 à ... qui indique la position de l'étape dans le parcours
nom : Le 'titre' de l'étape qui est affiché en haut de la page de l'étape
type : Un String qui permet de spécifié quel est le type de l'étape et ainsi pouvoir savoir quel champs spécifique 
        sont associé à l'étape (cf. variable TypeEtape).
image_url : Un lien de l'image hébergée sur Firebase dans Storage, au départ ce champ est vide tant que la méthode "UploadImage"
            n'a pas retourné un lien de téléchargement de l'image.
Ainsi, chaque nouvelle classe de jeu ou transition hérite de la classe "Etape" et doit être associée à un type
contenu dans la variable TypeEtape ci-dessus.
Enfin, il faut s'assurer de rédéfinir la méthode "generateFirestoreData()" pour chaque classe héritée de Etape. Cette méthode est chargée de retourner
un objet qui sera écrit dans une sous-collection 'étape' d'un parcours donné sur Firestore. L'objet retourné doit contenir les champs communs
et spécifique de l'étape en question.
*/
class Etape {
    constructor(ordre, type, nom, image_url) {
      this.ordre = ordre;
      if (Object.values(TypeEtape).includes(type)) {
        this.type = type;
      } else {
        throw new Error("Type d'étape non valide");
      }
      this.nom = nom;
      this.image_url = image_url;
    }
  
    generateFirestoreData() { /*NEED TO BE OVERRIDE IN CHILDREN CLASS BELOW vvvv*/ }

    getType() {
        return this.type;
    }
}
  

// eslint-disable-next-line no-unused-vars
class JeuInfo extends Etape {
    constructor(ordre, nom, image_url, texte){
        // Commun attributes
        super(ordre, TypeEtape.jeu_info, nom, image_url);

        // Specific attributes
        this.texte = texte;
    }

    generateFirestoreData() {
        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            texte: this.texte
        }
        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class JeuBlague extends Etape {
    constructor(ordre, nom, image_url, texte){
        super(ordre, TypeEtape.jeu_blague, nom, image_url);
        this.texte = texte;
    }

    generateFirestoreData() {
        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            texte: this.texte
        }
        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class JeuQCM extends Etape {
    constructor(ordre, nom, image_url, question, reponses_tab, index_bonneReponse, titreSiBonneReponse, titreSiMauvaiseReponse, texteApresReponse) {
        // Commun attributes
        super(ordre, TypeEtape.jeu_qcm, nom, image_url);

        // Specific attributes
        this.question = question;
        this.reponses_tab = reponses_tab;
        this.index_bonneReponse = index_bonneReponse;
        this.titreSiBonneReponse = titreSiBonneReponse;
        this.titreSiMauvaiseReponse = titreSiMauvaiseReponse; 
        this.texteApresReponse = texteApresReponse;
    }

    generateFirestoreData() {

        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            question: this.question,
            reponses_tab: [
                this.reponses_tab[0],
                this.reponses_tab[1],
                this.reponses_tab[2],
                this.reponses_tab[3]
            ],
            index_bonneReponse: this.index_bonneReponse,
            titreSiBonneReponse: this.titreSiBonneReponse,
            titreSiMauvaiseReponse: this.titreSiMauvaiseReponse,
            texteApresReponse: this.texteApresReponse
        }

        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class JeuIntrus extends Etape {
    constructor(ordre, nom, question, images_tab, index_bonneReponse, titreSiBonneReponse, titreSiMauvaiseReponse, texteApresReponse) {
        // Commun attributes
        super(ordre, TypeEtape.jeu_intrus, nom, '');

        // Specific attributes
        this.question = question;
        this.images_tab = images_tab;
        this.index_bonneReponse = index_bonneReponse;
        this.titreSiBonneReponse = titreSiBonneReponse;
        this.titreSiMauvaiseReponse = titreSiMauvaiseReponse; 
        this.texteApresReponse = texteApresReponse;
    }

    generateFirestoreData() {

        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            question: this.question,
            images_tab: [
                this.images_tab[0],
                this.images_tab[1],
                this.images_tab[2],
                this.images_tab[3]
            ],
            index_bonneReponse: this.index_bonneReponse,
            titreSiBonneReponse: this.titreSiBonneReponse,
            titreSiMauvaiseReponse: this.titreSiMauvaiseReponse,
            texteApresReponse: this.texteApresReponse
        }

        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class JeuCesar extends Etape {
    constructor(ordre, nom, image_url, question, texteBrut, decalage, titreSiBonneReponse, titreSiMauvaiseReponse, texteApresReponse) {
        // Commun attributes
        super(ordre, TypeEtape.jeu_cesar, nom, image_url);

        // Specific attributes
        this.question = question;
        this.texteBrut = texteBrut;
        this.decalage = decalage;
        this.titreSiBonneReponse = titreSiBonneReponse;
        this.titreSiMauvaiseReponse = titreSiMauvaiseReponse;
        this.texteApresReponse = texteApresReponse;
    }

    generateFirestoreData(){
        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            question: this.question,
            texteBrut: this.texteBrut,
            decalage: this.decalage,
            titreSiBonneReponse: this.titreSiBonneReponse,
            titreSiMauvaiseReponse: this.titreSiMauvaiseReponse,
            texteApresReponse: this.texteApresReponse
        }
        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class JeuPyramide extends Etape {
    constructor(ordre, nom, image_url, question, nombre, titreSiBonneReponse, titreSiMauvaiseReponse, texteApresReponse) {
        // Commun attributes
        super(ordre, TypeEtape.jeu_pyramide, nom, image_url);

        // Specific attributes
        this.question = question;
        this.nombre = nombre;
        this.titreSiBonneReponse = titreSiBonneReponse;
        this.titreSiMauvaiseReponse = titreSiMauvaiseReponse;
        this.texteApresReponse = texteApresReponse;
    }

    generateFirestoreData(){
        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            question: this.question,
            nombre: this.nombre,
            titreSiBonneReponse: this.titreSiBonneReponse,
            titreSiMauvaiseReponse: this.titreSiMauvaiseReponse,
            texteApresReponse: this.texteApresReponse
        }

        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class JeuCode extends Etape {
    constructor(ordre, nom, image_url, texte, code){
        // Commun attributes
        super(ordre, TypeEtape.jeu_code, nom, image_url);

        // Specific attributes
        this.texte = texte;
        this.code = code;
    }

    generateFirestoreData() {
        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            texte: this.texte,
            code: this.code
        }
        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class JeuCharade extends Etape {
    constructor(ordre, nom, image_url, charade, reponse, titreSiBonneReponse, titreSiMauvaiseReponse, texteApresReponse){
        // Commun attributes
        super(ordre, TypeEtape.jeu_charade, nom, image_url);

        // Specific attributes
        this.charade = charade;
        this.reponse = reponse;
        this.titreSiBonneReponse = titreSiBonneReponse;
        this.titreSiMauvaiseReponse = titreSiMauvaiseReponse;
        this.texteApresReponse = texteApresReponse;
    }

    generateFirestoreData() {
        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            charade: this.charade,
            reponse: this.reponse,
            titreSiBonneReponse: this.titreSiBonneReponse,
            titreSiMauvaiseReponse: this.titreSiMauvaiseReponse,
            texteApresReponse: this.texteApresReponse
        }
        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class JeuCompterImage extends Etape {
    constructor(ordre, nom, image_url, texte, reponse, titreSiBonneReponse, titreSiMauvaiseReponse, texteApresReponse){
        // Commun attributes
        super(ordre, TypeEtape.jeu_compterimage, nom, image_url);

        // Specific attributes
        this.texte = texte;
        this.reponse = reponse;
        this.titreSiBonneReponse = titreSiBonneReponse;
        this.titreSiMauvaiseReponse = titreSiMauvaiseReponse;
        this.texteApresReponse = texteApresReponse;
    }

    generateFirestoreData() {
        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            texte: this.texte,
            reponse: this.reponse,
            titreSiBonneReponse: this.titreSiBonneReponse,
            titreSiMauvaiseReponse: this.titreSiMauvaiseReponse,
            texteApresReponse: this.texteApresReponse
        }
        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class JeuRebus extends Etape {
    constructor(ordre, nom, image_url, question, reponse, titreSiBonneReponse, titreSiMauvaiseReponse, texteApresReponse){
        // Commun attributes
        super(ordre, TypeEtape.jeu_rebus, nom, image_url);

        // Specific attributes
        this.question = question;
        this.reponse = reponse;
        this.titreSiBonneReponse = titreSiBonneReponse;
        this.titreSiMauvaiseReponse = titreSiMauvaiseReponse;
        this.texteApresReponse = texteApresReponse;
    }

    generateFirestoreData() {
        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            question: this.question,
            reponse: this.reponse,
            titreSiBonneReponse: this.titreSiBonneReponse,
            titreSiMauvaiseReponse: this.titreSiMauvaiseReponse,
            texteApresReponse: this.texteApresReponse
        }
        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class JeuEcogeste extends Etape {
    constructor(ordre, nom, image_url, texte){
        super(ordre, TypeEtape.jeu_ecogeste, nom, image_url);
        this.texte = texte;
    }

    generateFirestoreData() {
        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            texte: this.texte
        }
        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class TransiInfo extends Etape {
    constructor(ordre, nom, image_url, texte){
        // Commun attributes
        super(ordre, TypeEtape.transi_info, nom, image_url);

        // Specific attributes
        this.texte = texte;
    }

    generateFirestoreData(){
        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            texte: this.texte
        }

        return data;
    }
}

// eslint-disable-next-line no-unused-vars
class TransiGPS extends Etape {
    constructor(ordre, nom, image_url, texte, latitude, longitude){
        //Commun attributes
        super(ordre, TypeEtape.transi_gps, nom, image_url);
        
        //Specific attributes
        this.texte = texte;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    generateFirestoreData(){
        const data = {
            ordre: this.ordre,
            type: this.type,
            nom: this.nom,
            image_url: this.image_url,
            texte: this.texte,
            latitude: this.latitude,
            longitude: this.longitude
        }

        return data;
    }
}

export { Etape, JeuBlague, JeuCesar, JeuInfo, JeuQCM, JeuPyramide, JeuIntrus, JeuCode, JeuCharade, JeuCompterImage, JeuRebus, JeuEcogeste, TransiGPS, TransiInfo};

// Exemple d'utilisation
//const qcm = new QCM(1, "qcm");
//qcm.generateFirestoreData();
