import { db } from '../firebaseConfig';
import { setDoc, doc, updateDoc, getDoc, getDocs, collection, addDoc, deleteDoc, query, where } from "firebase/firestore";
import { storage } from '../firebaseConfig';
import { ref, deleteObject } from 'firebase/storage';

export async function addCity(nomCommune, code_insee) {
    try {
      // Add a new document in collection "cities"
      await setDoc(doc(db, "commune", (nomCommune.value).toLowerCase()), {
        nom: nomCommune.value,
        code_insee: code_insee.value
    });
    } catch(e) {
      console.error("Error adding document : ", e);
    }
}

export async function deleteCommune(nomCommune) {
    //Detete document from 'commune' collection
    await deleteDoc(doc(db, "commune", (nomCommune).toLowerCase()));

    //Delete all ref in 'parcours'
    // Get collection reference
    const parcoursCollectionRef = collection(db, 'parcours');
  
    // Create query (filter)
    const q = query(parcoursCollectionRef, where("commune", "==", nomCommune));
  
    const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          var id = doc.id;
          deleteParcours(id);
        });
}

export async function getAllCommunes() {
    const communes = [];
    const res = await getDocs(collection(db, "commune"));
    res.forEach((doc) => {
        communes.push(doc.data().nom);
    })
    return communes;
}

export async function getInseeCodeFromCommune(nomCommune){
  const q = query(collection(db, "commune"), where("nom", "==", nomCommune));

  const res = []
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res.push(doc.data().code_insee);
  })
  return res[0];
}

export async function getParcoursFromCommune(nomCommune) {
    const parcours = [];
    
    // Get collection reference
    const parcoursCollectionRef = collection(db, 'parcours');
  
    // Create query (filter)
    const q = query(parcoursCollectionRef, where("commune", "==", nomCommune));
  
    const querySnapshot = await getDocs(q);
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

//Return parcours content from id (identifiant)
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
// If the parcours doesnt exist : Output : []
export async function getParcoursContents(id) {
    const docRefParcours = doc(db, "parcours", id);
    const docSnap = await getDoc(docRefParcours);
    const pathColJeux = "/parcours/" + docSnap.id + "/etape";
    const res = {};
  
    if (docSnap.exists()) {
  
      const querySnapshot = await getDocs(collection(db, pathColJeux));
      const subColRes = [];
  
      // Iterate through the documents fetched
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
  
export async function createParcours(p_obj){

    // Add a new parcours with a auto generated id.
    const docRef = await addDoc(collection(db, "parcours"), {
        commune: p_obj.commune,
        titre: p_obj.titre,
        description: p_obj.description,
        difficulte: p_obj.difficulte,
        duree: p_obj.duree,
        image_url: p_obj.image_url !== "" ? p_obj.image_url : ""
    });
   
    //Return doc id
    return docRef.id
}

export async function modifyParcours(id, p_obj){

    const parcoursRef = doc(db, "parcours", id);

    // Update fields of the parcours
    await updateDoc(parcoursRef,  p_obj);

}

export async function updateImageUrlParcours(id, url){
    const parcoursRef = doc(db, "parcours", id);

    await updateDoc(parcoursRef, {
      image_url: url
    });
}

export async function deleteParcours(id){

    // FIRESTORE ------------------
    // Need to delete the sub collection "etape" first so we need to delete all docs in sub collection "etape"
    const q = query(collection(db, "parcours", id, "etape"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (etapeDoc) => {
      await deleteDoc(doc(db, "parcours/" + id + "/etape/" + etapeDoc.id));

      if(etapeDoc.image_url !== "") {
        const etapeRef = ref(storage, 'image_etape/'+ etapeDoc.id +'.jpg');
        // Delete the image
        deleteObject(etapeRef).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }

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

    // Delete parcours
    await deleteDoc(doc(db, "parcours", id));

    // STORAGE IMAGE ---------------
    // Create a reference to the file to delete
    const parcoursRef = ref(storage, 'image_parcours/'+ id +'.jpg');

    // Delete the file
    deleteObject(parcoursRef).then(() => {
    }).catch((error) => {
      console.log(error);
    });  
}

export async function addEtapeInParcours(id, data){  
  const pathParentCol = "parcours";
  const pathSubColEtape = "etape";
  const parcoursRef = doc(db, pathParentCol, id);

  const etapeSubCollectionRef = collection(parcoursRef, pathSubColEtape);

  //Add data in doc from sub collection etape
  const docRef = await addDoc(etapeSubCollectionRef, data);
  return docRef.id
}

export async function validateEtapesInParcours(id_parcours, data_etapes){
  let orderId = 1;
  for(let i = 0; i < data_etapes.length; i++){
    const etapeRef = doc(db, "parcours", id_parcours, "etape", data_etapes[i].id);
    await updateDoc(etapeRef, {
      ordre: orderId
    });
    orderId++;
  }
}

export async function modifyEtapeInParcours(id_parcours, id_etape, data){

  const etapeRef = doc(db, "parcours", id_parcours, "etape", id_etape);

  await updateDoc(etapeRef, data);
}

export async function updateImageUrlEtape(id, url, id_parcours){
  const etapeRef = doc(db,"parcours",id_parcours, "etape", id);

  await updateDoc(etapeRef, {
    image_url: url
  });
}

export async function updateImageUrlJeu(id, urls, id_parcours){
  const etapeRef = doc(db,"parcours",id_parcours, "etape", id);

  await updateDoc(etapeRef, {
    images_tab: urls
  });
}

export async function deleteEtapeInParcours(id_parcours, id_etape, data_etapes){

  const indexEtape = data_etapes.findIndex((item) => item.id === id_etape);

  if(indexEtape !== -1){

    //CASE of jeu_intrus
    if(data_etapes[indexEtape].etape.type === "jeu_intrus"){
      //Need to delete all images from the game
      for(var i=0; i<=3; i++){
        const etapeRef = ref(storage, 'image_jeu/' + id_etape + "_" + i + ".jpg");
        // Delete the image
        deleteObject(etapeRef).then(() => {

        }).catch((error) => {
          console.log(error);
        });
        }
    }
    else {
      //Common etape
      // STORAGE : Delete image linked to the deleted etape
      if(data_etapes[indexEtape].etape.image_url !== ""){
        const etapeRef = ref(storage, 'image_etape/'+ id_etape +'.jpg');
        // Delete the file
        deleteObject(etapeRef).then(() => {

        }).catch((error) => {
          console.log(error);
        });
      }
    }

    for(let i=indexEtape+1; i<data_etapes.length; i++){
      data_etapes[i].etape.ordre -= 1;
    }

    //Delete locally the etape in data_etapes
    data_etapes.splice(indexEtape, 1);

    //Delete on firestore
    await deleteDoc(doc(db, "parcours", id_parcours, "etape", id_etape));

    //Revalidate other ordre
    await validateEtapesInParcours(id_parcours, data_etapes);
    
  }
  else {
    console.log("L'étape n'a pas été trouvée dans les données étapes et n'a donc pas pu être supprimée");
  }
}