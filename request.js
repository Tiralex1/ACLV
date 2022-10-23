import { writeFileSync } from 'fs';

function ajout() {
    var anime = {
        "nom": "Tokyo Ghoul",
        "type": "OP",
        "nb_mus": 5
    }

    var donnees = JSON.stringify(anime);
    writeFileSync('data.json', donnees);
}
