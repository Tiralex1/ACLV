import * as fs from 'fs';

function ajout() {
    var anime = {
        "nom": "Tokyo Ghoul",
        "type": "OP",
        "nb_mus": 5
    }

    var donnees = JSON.stringify(anime);
    fs.writeFileSync('data.json', donnees);
}
