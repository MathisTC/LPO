/* eslint-disable no-undef */
import { JeuBlague, JeuInfo, JeuCesar, JeuQCM,JeuIntrus, JeuPyramide, JeuCode, TransiInfo, TransiGPS } from '../src/utils/etapeCreator'

test('test jeu blague', () => {

    const jeublague = new JeuBlague(1, "blague", '', "lol");
    const resData = jeublague.generateFirestoreData();

    expect(resData.ordre).toBe(1);
    expect(resData.type).toBe("jeu_blague");
    expect(resData.nom).toBe("blague");
    expect(resData.image_url).toBe('');
    expect(resData.texte).toBe("lol");

});

test('test jeu info', () => {

    const obj = new JeuInfo(2, "Le saviez-vous ?", "image.jpeg", "Tout les oiseaux ne volent pas");
    const resData = obj.generateFirestoreData();

    expect(resData.ordre).toBe(2);
    expect(resData.type).toBe("jeu_info");
    expect(resData.nom).toBe("Le saviez-vous ?");
    expect(resData.image_url).toBe("image.jpeg");
    expect(resData.texte).toBe("Tout les oiseaux ne volent pas");

});

test('test jeu cesar', () => {

    const obj = new JeuCesar(1, "césar", "", "Question ?", "texte brut", 3, "Vrai", "Faux", "oui");
    const resData = obj.generateFirestoreData();

    expect(resData.ordre).toBe(1);
    expect(resData.type).toBe("jeu_cesar");
    expect(resData.nom).toBe("césar");
    expect(resData.image_url).toBe("");
    expect(resData.question).toBe("Question ?");
    expect(resData.texteBrut).toBe("texte brut");
    expect(resData.titreSiBonneReponse).toBe("Vrai");
    expect(resData.titreSiMauvaiseReponse).toBe("Faux");
    expect(resData.texteApresReponse).toBe("oui");
});

test('test jeu QCM', () => {

    const res_tab = [1,2,3,4];
    const obj = new JeuQCM(1, "QCM", "", "Question ?", res_tab, 2, "Vrai", "Faux", "oui");
    const resData = obj.generateFirestoreData();

    expect(resData.ordre).toBe(1);
    expect(resData.type).toBe("jeu_qcm");
    expect(resData.nom).toBe("QCM");
    expect(resData.image_url).toBe("");
    expect(resData.question).toBe("Question ?");
    expect(resData.reponses_tab).toStrictEqual(res_tab);
    expect(resData.index_bonneReponse).toBe(2);
    expect(resData.titreSiBonneReponse).toBe("Vrai");
    expect(resData.titreSiMauvaiseReponse).toBe("Faux");
    expect(resData.texteApresReponse).toBe("oui");
});

test('test jeu intrus', () => {

    const res_tab = ['url1','url2','url3','url4'];
    const obj = new JeuIntrus(1, "INTRUS", "Trouvez l'intrus ?", res_tab, "2", "Vrai", "Faux", "oui");
    const resData = obj.generateFirestoreData();

    expect(resData.ordre).toBe(1);
    expect(resData.type).toBe("jeu_intrus");
    expect(resData.nom).toBe("INTRUS");
    expect(resData.question).toBe("Trouvez l'intrus ?");
    expect(resData.images_tab).toStrictEqual(res_tab);
    expect(resData.index_bonneReponse).toBe("2");
    expect(resData.titreSiBonneReponse).toBe("Vrai");
    expect(resData.titreSiMauvaiseReponse).toBe("Faux");
    expect(resData.texteApresReponse).toBe("oui");
});

test('test jeu pyramide', () => {
    const obj = new JeuPyramide(1, "Pyramide", "", "Question ?",47, "Vrai", "Faux", "oui");

    const resData = obj.generateFirestoreData();

    expect(resData.ordre).toBe(1);
    expect(resData.type).toBe("jeu_pyramide");
    expect(resData.nom).toBe("Pyramide");
    expect(resData.image_url).toBe("");
    expect(resData.question).toBe("Question ?");
    expect(resData.nombre).toBe(47);
    expect(resData.titreSiBonneReponse).toBe("Vrai");
    expect(resData.titreSiMauvaiseReponse).toBe("Faux");
    expect(resData.texteApresReponse).toBe("oui");
})

test('test jeu code', () => {

    const obj = new JeuCode(2, "Code panneau ?", "image.jpeg", "Retrouver le code dans les alentours", "ABC123");
    const resData = obj.generateFirestoreData();

    expect(resData.ordre).toBe(2);
    expect(resData.type).toBe("jeu_code");
    expect(resData.nom).toBe("Code panneau ?");
    expect(resData.image_url).toBe("image.jpeg");
    expect(resData.texte).toBe("Retrouver le code dans les alentours");
    expect(resData.code).toBe("ABC123");

});

test('test transi info', () => {

    const obj = new TransiInfo(1, "Transition", "", "Introduction")
    const resData = obj.generateFirestoreData();

    expect(resData.ordre).toBe(1);
    expect(resData.type).toBe("transi_info");
    expect(resData.nom).toBe("Transition");
    expect(resData.image_url).toBe("");
    expect(resData.texte).toBe("Introduction");

});

test('test transi gps', () => {

    const obj = new TransiGPS(1, "GPS", "", "position GPS", 10.23, 20.56);
    const resData = obj.generateFirestoreData();

    expect(resData.ordre).toBe(1);
    expect(resData.type).toBe("transi_gps");
    expect(resData.nom).toBe("GPS");
    expect(resData.image_url).toBe("");
    expect(resData.texte).toBe("position GPS");
    expect(resData.latitude).toBe(10.23);
    expect(resData.longitude).toBe(20.56);

});