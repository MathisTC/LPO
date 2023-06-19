import { storage } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateImageUrlParcours, updateImageUrlEtape, updateImageUrlJeu } from './queries';

// Input : file byte docName and fileName
// Output : URL where the file has been upload (need to store this url in firestore after that)
export function uploadImage(fileByte, docName,  fileName, id_parcours) {
    // Upload file to the object '<docName>/<fileName>'
    const storageRef = ref(storage, docName + "/" + fileName +'.jpg');
    const metadata = {
        contentType: 'image/jpeg'
    }
    const uploadTask = uploadBytesResumable(storageRef, fileByte, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
    (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            if(docName == 'image_parcours') {
                updateImageUrlParcours(fileName, downloadURL);
            } else {
                if(docName == 'image_jeu') {
                    //updateImageUrlJeu(fileName, downloadURL, id_parcours)
                } else {
                    updateImageUrlEtape(fileName, downloadURL, id_parcours)

                }
            }
            return downloadURL;
        });
    }
    );

    return "";
}

export function uploadMultipleImages(fileByte_tab, docName, fileName, id_parcours) {
    var downloadURLs = ['','','','']
    console.log("Starting upload " + fileByte_tab.length + " images");

    const uploadPromises = fileByte_tab.map((fileByte, i) => {
        return new Promise((resolve, reject) => {
            // Upload file to the object '<docName>/<fileName>_i'
            const path = docName + "/" + fileName + "_" + i + ".jpg";
            const storageRef = ref(storage, path);
            const metadata = {
                contentType: 'image/jpeg'
            }
            const uploadTask = uploadBytesResumable(storageRef, fileByte, metadata);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
                    // Upload completed successfully, now we can get the download URL
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
