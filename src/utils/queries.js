// queries.js 
// Fichier contenant toutes les méthodes liées à la lecture/écriture/suppression dans Firebase-Firestore.
// S'occupe également de supprimer les fichiers dans "Storage" qui sont liés à certaines données dans Firestore

import { db } from '../firebaseConfig';
import { setDoc, doc, updateDoc, getDoc, getDocs, collection, addDoc, deleteDoc, query, where } from "firebase/firestore";
import { storage } from '../firebaseConfig';
import { ref, deleteObject } from 'firebase/storage';

/* 
Méthode d'écriture dans Firestore d'un nouveau document dans la collection "commune".
Le document a pour identifiant le nom dans la commune en minuscule et contient 3 champs :
nom, code_insee et code_postal.
*/
export async function addCity(nomCommune, code_insee, code_postal) {
    try {
      // Ajout d'une nouveau document dans la collection "commune" avec comme identifiant le nom en minuscule
      await setDoc(doc(db, "commune", (nomCommune.value).toLowerCase()), {
        nom: nomCommune.value,
        code_insee: code_insee.value,
        code_postal: code_postal.value
    });
    } catch(e) {
      console.error("Error adding document : ", e);
    }
}

/* 
Méthode de suppression dans Firestore d'une commune dans la collection "commune".
La méthode se charge aussi de supprimer tout les parcours en lien avec le commune supprimée
*/
export async function deleteCommune(nomCommune) {
    
    // Suppression du document dans la collection "commune"
    await deleteDoc(doc(db, "commune", (nomCommune).toLowerCase()));

    //Delete all ref in 'parcours'
    // Suppression de tout les parcours liée à la commune supprimée
    // Récupération de la référence de la collection "parcours"
    const parcoursCollectionRef = collection(db, 'parcours');
  
    // Crée une requête qui filtre avec le bon nom de commune
    const q = query(parcoursCollectionRef, where("commune", "==", nomCommune));
  
    //Pour chaque document retourner par le requête, suppression du parcours.
    const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          var id = doc.id;
          deleteParcours(id);
        });
}

// Méthode de lecture qui retourne une liste de tout les noms de commune dans la collection "commune"
export async function getAllCommunes() {
    const communes = [];
    const res = await getDocs(collection(db, "commune"));
    res.forEach((doc) => {
        communes.push(doc.data().nom);
    })
    return communes;
}

// Méthode de lecture du champs "code_insee" à partir d'un nom de commune passé en paramètre
export async function getInseeCodeFromCommune(nomCommune){
  const q = query(collection(db, "commune"), where("nom", "==", nomCommune));

  const res = []
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res.push(doc.data().code_insee);
  })
  return res[0];
}

// Méthode de lecture qui récupère tout les parcours liée à la commune passé en paramètre.
export async function getParcoursFromCommune(nomCommune) {
    const parcours = [];
    
    // Référence à la collection parcours
    const parcoursCollectionRef = collection(db, 'parcours');
  
    // Création d'une requête qui récupère une référence de tout les parcours de la commune souhaitée
    const q = query(parcoursCollectionRef, where("commune", "==", nomCommune));
  
    // Récupération de tout les document à partir de la référence
    const querySnapshot = await getDocs(q);
        // Pour chaque document, on crée un objet avec les infomrations générales du parcours (sauf les étapes)
        querySnapshot.forEach((doc) => {
            const pa = {
              identifiant: doc.id,
              titre: doc.data().titre,
              description: doc.data().description,
              commune: doc.data().commune,
              image_url: doc.data().image_url
            }
            parcours.push(pa);
        });
  
    return parcours;
}

// Retourne le contenu d'un parcours à partir d'un identifiant de parcours (obtenu grâce à méthode getParcoursFromCommune())
// Input : parcours id (identifiant exp : V4gp7A6yWUAxcaPWnqc6)
// Output : 
// 
//   data : {
//     commune: 'Saint-Etienne',
//     description: 'Petite balade en forêt en compagnie des oiseaux',
//     titre: 'Balade en forêt'
//   },
//   etapes : [ 
//    { id: "IUHDAZUH", etapes : {ordre: 1, type: 'jeu_info', texte ...  }}, 
//    { id: "AZAOJDDA", etapes : {ordre: 2, type: 'jeu_blague', texte ...  }} 
//   ]
// 
// Si le parcours n'existe pas : Output : []
export async function getParcoursContents(id) {
    // Référence au document dans 'parcours' avec l'identificant souhaité
    const docRefParcours = doc(db, "parcours", id);
    // Récupération des champs du document à partir de la référence
    const docSnap = await getDoc(docRefParcours);
    // Chemin d'accès de la sous-collection 'etape' dans le document du parcours
    const pathColJeux = "/parcours/" + docSnap.id + "/etape";
    const res = {};
  
    if (docSnap.exists()) {
      // Récupération de tout les documents dans la sous-collection 'etape'
      const querySnapshot = await getDocs(collection(db, pathColJeux));
      const subColRes = [];
  
      // Parcourir les documents récupérés
      querySnapshot.forEach((queryDocumentSnapshot) => {
        const gameInfo = 
        {
          id: queryDocumentSnapshot.id,
          etape: queryDocumentSnapshot.data()
        }
  
        subColRes.push(gameInfo);
      })
  
      res.data =docSnap.data();
      res.etapes=subColRes;
      return res;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  
    return res;
  }
  
// Méthode d'écriture d'ajout d'un parcours dans la collection "parcours"
// L'identifiant du document est généré aléatoirement par Firebase
// Le document contiendra les champs indiqué dans l'objet d'entrée p_obj
export async function createParcours(p_obj){

    // Ajout d'un nouveau parcours avec un identifiant autogénéré par Firebase
    const docRef = await addDoc(collection(db, "parcours"), {
        commune: p_obj.commune,
        titre: p_obj.titre,
        description: p_obj.description,
        difficulte: p_obj.difficulte,
        duree: p_obj.duree,
        image_url: p_obj.image_url !== "" ? p_obj.image_url : ""
    });
   
    // Retourne le doc id autogénéré
    return docRef.id
}

// Méthode d'écriture qui va écraser le contenu d'un document parcours avec le nouveau p_obj d'entrée
// Besoin d'indiquer l'id du document à modifier
export async function modifyParcours(id, p_obj){

    // Récupération de la référence du document que l'on souhaite modifier
    const parcoursRef = doc(db, "parcours", id);

    // Mise à jour des champs du document avec le nouveau p_obj
    await updateDoc(parcoursRef,  p_obj);

}

// Méthode d'écriture qui met à jour uniquement le champs 'image_url' d'un parcours avec l'url passée en paramètre
// Cette méthode est appelée une fois qu'une image a été upload sur "Storage" et que l'on a obtenu l'url de téléchargement
export async function updateImageUrlParcours(id, url){
    const parcoursRef = doc(db, "parcours", id);

    await updateDoc(parcoursRef, {
      image_url: url
    });
}

// Méthode de suppression d'un parcours dans la collection "parcours" identifié à partir de l'identifiant donné en paramètre
export async function deleteParcours(id){

    // FIRESTORE ------------------
    // Besoin de supprimer la sous-collection "etape" en premier, 
    // il faut alors supprimer tout les docs de la sous-collection pour la supprimer
    const q = query(collection(db, "parcours", id, "etape"));

    // Récupération de toute les étapes de la sous-collection 'etape'
    const querySnapshot = await getDocs(q);

    // Pour chaque document dans la sous-collection 'etape', supprimer les documents
    querySnapshot.forEach(async (etapeDoc) => {
      await deleteDoc(doc(db, "parcours/" + id + "/etape/" + etapeDoc.id));

      // Si l'étape est liée à une image stockée dans "Storage", on appelle
      // la méthode de suppression d'image associée
      if(etapeDoc.image_url !== "") {
        const etapeRef = ref(storage, 'image_etape/'+ etapeDoc.id +'.jpg');
        // Suppression de l'image
        deleteObject(etapeRef).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }

      // Si on est dans le cas d'un jeu_intrus, il faut aussi supprimer les images dans le dossier "image_jeu"
      if(etapeDoc.type === "jeu_intrus"){
        //Need to delete all images from the game
        for(var i=0; i<=3; i++){
          const etapeRef = ref(storage, 'image_jeu/' + etapeDoc.id + "_" + i + ".jpg");
          // Delete the image
          deleteObject(etapeRef).then(() => {
          }).catch((error) => {
            console.log(error);
          });
          }
      }
    })

    // Enfin on supprime le parcours car la sous-collection 'etape' a été vidé
    await deleteDoc(doc(db, "parcours", id));

    // Il faut aussi supprimer l'image associée au parcours
    // STORAGE IMAGE ---------------
    // Création d'une référence au fichier à supprimer
    const parcoursRef = ref(storage, 'image_parcours/'+ id +'.jpg');

    // Suppression du fichier 
    deleteObject(parcoursRef).then(() => {
    }).catch((error) => {
      console.log(error);
    });  
}

// Méthode d'écriture qui ajoute une nouvelle étape dans un parcours à partir de son identifiant
// Le paramètre data a été généré par la méthode generateFirestoreData() de la classe Etape dans etapeCreator.js
export async function addEtapeInParcours(id, data){  
  const pathParentCol = "parcours";
  const pathSubColEtape = "etape";
  const parcoursRef = doc(db, pathParentCol, id);

  const etapeSubCollectionRef = collection(parcoursRef, pathSubColEtape);

  // Ajout de la donnée 'data' dans la sous-collectioné 'etape'
  const docRef = await addDoc(etapeSubCollectionRef, data);
  return docRef.id
}

// Méthode d'écriture qui met à jour l'ordre de toute les étapes en fonction de 'data_etape' passé en paramètre
export async function validateEtapesInParcours(id_parcours, data_etapes){
  let orderId = 1;
  // Pour chaque étape dans data_etapes, on met à jour le champs 'ordre' sur Firestore
  for(let i = 0; i < data_etapes.length; i++){
    const etapeRef = doc(db, "parcours", id_parcours, "etape", data_etapes[i].id);
    await updateDoc(etapeRef, {
      ordre: orderId
    });
    orderId++;
  }
}

// Méthode d'écriture qui va modifier l'étape d'un parcours avec les nouvelles data
// REMARQUE : Cette méthode n'a pas pu être implémenté dans le FRONT !!!
export async function modifyEtapeInParcours(id_parcours, id_etape, data){

  const etapeRef = doc(db, "parcours", id_parcours, "etape", id_etape);

  await updateDoc(etapeRef, data);
}

// Méthode d'écriture qui met à jour uniquement le champs 'image_url' d'une étape avec l'url passée en paramètre
// Cette méthode est appelée une fois qu'une image a été upload sur "Storage" et que l'on a obtenu l'url de téléchargement
export async function updateImageUrlEtape(id, url, id_parcours){
  const etapeRef = doc(db,"parcours",id_parcours, "etape", id);

  await updateDoc(etapeRef, {
    image_url: url
  });
}

// Méthode d'écriture qui met à jour uniquement le champs 'images_tab' d'un jeu (jeu_intrus) avec les urls passées en paramètre
// Cette méthode est appelée une fois que les images ont été upload sur "Storage" via updateMultipleImages dans UploadImage .js 
// et que l'on a obtenu l'url de téléchargement
export async function updateImageUrlJeu(id, urls, id_parcours){
  const etapeRef = doc(db,"parcours",id_parcours, "etape", id);

  await updateDoc(etapeRef, {
    images_tab: urls
  });
}

// Méthode de suppression d'une étape dans un parcours
// Le point important de cette méthode est qu'elle met à jour les ordres des étapes postérieures à celle supprimée
// afin de garder un ordre croissant cohérent entre les étapes
// On s'aide de data_etapes qui contient les ordres de toutes les étapes avant suppression 
export async function deleteEtapeInParcours(id_parcours, id_etape, data_etapes){

  // Récupération de l'index de l'étape qui va être supprimée
  const indexEtape = data_etapes.findIndex((item) => item.id === id_etape);

  if(indexEtape !== -1){ // Si index trouvé
    // Dans le cas d'un jeuintrus
    if(data_etapes[indexEtape].etape.type === "jeu_intrus"){
      //Il faut d'abbord supprimer toutes les images associées au jeu_intrus
      for(var i=0; i<=3; i++){
        const etapeRef = ref(storage, 'image_jeu/' + id_etape + "_" + i + ".jpg");
        // Suppression de l'image
        deleteObject(etapeRef).then(() => {

        }).catch((error) => {
          console.log(error);
        });
        }
    }
    else {
      //Si etape commune
      // STORAGE : Suppression de l'image liée à l'étape
      if(data_etapes[indexEtape].etape.image_url !== ""){
        const etapeRef = ref(storage, 'image_etape/'+ id_etape +'.jpg');
        // Suppression du fichier
        deleteObject(etapeRef).then(() => {

        }).catch((error) => {
          console.log(error);
        });
      }
    }

    // Mis à jour localement de l'ordre des étapes à partir de l'index de l'étape supprimée
    // On enlève 1 à l'ordre actuel de chaque étape postérieure
    for(let i=indexEtape+1; i<data_etapes.length; i++){
      data_etapes[i].etape.ordre -= 1;
    }

    // On supprime localement l'étape dans data_etapes
    data_etapes.splice(indexEtape, 1);

    //On supprime le document dans Firestore
    await deleteDoc(doc(db, "parcours", id_parcours, "etape", id_etape));

    //On envoit à Firestore le nouvel ordre des étapes déterminé plus haut
    await validateEtapesInParcours(id_parcours, data_etapes);
    
  }
  else {
    console.log("L'étape n'a pas été trouvée dans les données étapes et n'a donc pas pu être supprimée");
  }
}