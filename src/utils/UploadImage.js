import { storage } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateImageUrlParcours, updateImageUrlEtape, updateImageUrlJeu } from './queries';

// Input : file byte, document name, file name and parcours id
// Input : Byte du fichier, nom du dossier, nom du fichier et identifiant du parcours.
// Output : L'url par laquelle le fichier sera accessible une fois uploadé. 
// Besoin de mettre à jour cette url dans Firestore une fois obtenue
export function uploadImage(fileByte, docName,  fileName, id_parcours) {

    // Vérifier la taille de l'image
    const fileSizeInBytes = fileByte.length;
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 Mo

    if (fileSizeInBytes > maxSizeInBytes) {
        throw new Error("La taille de l'image dépasse la limite autorisée.");
    }
    
    // Upload le fichier dans le dossier <docName> avec le nom <fileName>
    const storageRef = ref(storage, docName + "/" + fileName +'.jpg');
    const metadata = {
        contentType: 'image/jpeg'
    }
    const uploadTask = uploadBytesResumable(storageRef, fileByte, metadata);

    // Ecoute les changements d'état, les erreurs et l'achèvement de téléchargement
    uploadTask.on('state_changed',
    (snapshot) => {
        // Récupération de la progression de la tâche incluant le nombre d'octet uploads et le nombre total d'octet à upload
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case 'paused':
            console.log('Upload is paused');
            break;
        case 'running':
            console.log('Upload is running');
            break;
        }
    }, 
    (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
            case 'storage/unauthorized':
                console.log("User doesn't have permission to access the object")
                break;
            case 'storage/canceled':
                console.log("User canceled the upload");
                break;

            case 'storage/unknown':
                console.log("Unknown error occurred, inspect error.serverResponse");
                break;
            }
    }, 
    () => {
        // Upload effectué avec succes, maintenant on peut obtenir l'url de téléchargement
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //console.log('File available at', downloadURL);
            if(docName == 'image_parcours') {
                updateImageUrlParcours(fileName, downloadURL);
            } else {
                if(docName !== 'image_jeu') {
                    updateImageUrlEtape(fileName, downloadURL, id_parcours)
                } 
            }
            return downloadURL;
        });
    }
    );

    return "";
}

// Même méthode que uploadImage mais gère l'upload de 4 images en parallèle 
// (utilisée pour l'upload des images de jeu_intrus)
export function uploadMultipleImages(fileByte_tab, docName, fileName, id_parcours) {

    // Vérifier la taille de l'image
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 Mo
    let fileSizeInBytes = 0;

    for(let i=0; i<fileByte_tab.length; i++){
        fileSizeInBytes = fileByte_tab[i].length;

        if (fileSizeInBytes > maxSizeInBytes) {
            throw new Error("La taille d'une des images dépasse la limite autorisée.");
        }
    }

    var downloadURLs = ['','','','']
    console.log("Starting upload " + fileByte_tab.length + " images");

    const uploadPromises = fileByte_tab.map((fileByte, i) => {
        return new Promise((resolve, reject) => {
            // Upload le fichier dans le dossier <docName> avec le nom <fileName>_i
            const path = docName + "/" + fileName + "_" + i + ".jpg";
            const storageRef = ref(storage, path);
            const metadata = {
                contentType: 'image/jpeg'
            }
            const uploadTask = uploadBytesResumable(storageRef, fileByte, metadata);

            // Ecoute les changements d'état, les erreurs et l'achèvement de téléchargement
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Récupération de la progression de la tâche incluant le nombre d'octet uploads et le nombre total d'octet à upload
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload [' + i + '] is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload [' + i + '] is paused');
                            break;
                        case 'running':
                            console.log('Upload [' + i + '] is running');
                            break;
                    }
                }, 
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            console.log("User doesn't have permission to access the object")
                            break;
                        case 'storage/canceled':
                            console.log("User canceled the upload");
                            break;

                        case 'storage/unknown':
                            console.log("Unknown error occurred, inspect error.serverResponse");
                            break;
                    }
                    reject(error);
                },
                () => {
                    // Upload effectué avec succes, maintenant on peut obtenir l'url de téléchargement
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        downloadURLs[i] = downloadURL;
                        console.log('Image ['+ i + '] available at', downloadURL);
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                }
            );
        });
    });

    if(docName == 'image_jeu'){
        Promise.all(uploadPromises).then(() => {
            updateImageUrlJeu(fileName, downloadURLs, id_parcours);
        }).catch((error) => {
            console.log("Failed to get download URLs:", error);
        });
    }
    else {
        console.log("Unknown docName");
        console.log("UPDATE IMAGE URLs FAIL");
    }
}
