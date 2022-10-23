function ajout() {
    const fs = require('fs');
    var anime = {
        "nom": "Tokyo Ghoul",
        "type": "OP",
        "nb_mus": 5
    }

    var donnees = JSON.stringify(anime);
    fs.writeFileSync('data.json', donnees);
}
