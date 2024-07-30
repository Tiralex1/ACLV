class Music {
    // champs
    #anime; #type; #numero; #nom; #artist; #lien;
    // constructor
    constructor(anime, type, numero, nom, artist, lien) {
        if (anime instanceof Anime && typeof type === "string" && Number.isInteger(numero) && typeof nom === "string" && typeof artist === "string" && typeof lien === "string") {
            this.#anime = anime;
            this.#type = type;
            this.#numero = numero;
            this.#nom = nom;
            this.#artist = artist;
            this.#lien = lien;
        }
        else throw new Error("Illegal Argument (constructor Music)");
    }
    // getters
    get getAnime() { return this.#anime; }
    get getType() { return this.#type; }
    get getNom() { return this.#nom; }
    get getNumero() { return this.#numero; }
    get getArtist() { return this.#artist; }
    get getLien() { return this.#lien; }
}

class Anime {
    // champs
    #nom; #id; #mal_id; #tabMusic = []; #tabGenres = []; #tabUsers = [];
    // constructor
    constructor(nom, id, mal_id, html = null) {
        if (typeof nom === "string" && Number.isInteger(id) && Number.isInteger(mal_id)) {
            this.#nom = nom;
            this.#id = id;
            this.#mal_id = mal_id;
        }
        else throw new Error("Illegal Argument (constructor Anime)");
    }
    // getters
    get getNom() { return this.#nom; }
    get getId() { return this.#id; }
    get getLien() { return "https://myanimelist.net/anime/" + this.#mal_id; }
    get getMalId() { return this.#mal_id; }
    getMusic(ind) {
        if (!Number.isInteger(ind)) throw new Error("illegal Argument (getMusic Method in Class Anime)");
        return this.#tabMusic[ind];
    }
    get getNbMusic() { return this.#tabMusic.length; }
    getEtatUser(ind) {
        if (!Number.isInteger(ind)) throw new Error("illegal Argument (getEtatUser Method in Class Anime)");
        return this.#tabUsers[ind];
    }
    getEtatGenre(ind) {
        if (!Number.isInteger(ind)) throw new Error("illegal Argument (getEtatGenre Method in Class Anime)");
        return this.#tabGenres[ind];
    }
    // méthodes
    ajouteMusic(music) {
        if (!music instanceof Music) throw new Error("illegal Argument (ajouteMusic Method in Class Anime)");
        this.#tabMusic.push(music);
    }
    ajoutePosMusic(music, pos) {
        if (!music instanceof Music || !Number.isInteger(pos)) throw new Error("illegal Argument (ajouteMusic Method in Class Anime)");
        this.#tabMusic.splice(pos, 0, music);
    }
    supprimePosMusic(pos) {
        if (!Number.isInteger(pos)) throw new Error("illegal Argument (supprimePosMusic Method in Class Anime)");
        this.#tabMusic.splice(pos, 1);
    }
    ajouteUser(bool) {
        if (!typeof bool === "boolean") throw new Error("illegal Argument (ajouteUser Method in Class Anime)");
        this.#tabUsers.push(bool);
    }
    resetUsers() {
        this.#tabUsers = [];
    }
    ajouteGenre(bool) {
        if (!typeof bool === "boolean") throw new Error("illegal Argument (ajouteGenre Method in Class Anime)");
        this.#tabGenres.push(bool);
    }
}

class ListeAnime {
    // champs
    #tabAnime = []; #nbMusic = 0;
    // getters
    get getNbAnime() { return this.#tabAnime.length; }
    get getNbMusic() { return this.#nbMusic; }
    getAnime(i) { return this.#tabAnime[i] }
    // méthodes
    ajouteAnime(anime) {
        if (!anime instanceof Anime) throw new Error("Illegal Argument (ajouteAnime Method in Class ListeAnime)");
        this.#tabAnime.push(anime);
        this.#nbMusic += anime.getNbMusic;
    }
    getClassementNbMusique() {
        let tab = this.#tabAnime;
        tab.sort((a, b) => {
            return b.getNbMusic - a.getNbMusic;
        });
        console.log(tab);
    }
}

ListeAnime.prototype.getClassementNbMusique = function () {

}

function correctString(str) {
    var string = str.replace("<", "&lt");
    string = string.replace(">", "&gt");
    return string;
}

async function resetFiltre() {
    filtreJointureSelect.value = "Union";
    A.checked = true;
    C.checked = true;
    L.checked = true;
    V.checked = true;
    T.checked = true;
    Q.checked = true;
}

function listeParGenre(listeAnime, genre) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeAnime.getNbAnime; ++i) {
        if (listeAnime.getAnime(i).getEtatGenre(genre)) listeA.ajouteAnime(listeAnime.getAnime(i));
    }
    return listeA;
}

function construitObjectStats(object, liste) {
    for (let i = 0; i < liste.getNbAnime; ++i) {
        let CurrentAnime = liste.getAnime(i);
        if (CurrentAnime.getEtatUser(0)) object['A']++;
        if (CurrentAnime.getEtatUser(1)) object['C']++;
        if (CurrentAnime.getEtatUser(2)) object['L']++;
        if (CurrentAnime.getEtatUser(3)) object['V']++;
        if (CurrentAnime.getEtatUser(4)) object['T']++;
        if (CurrentAnime.getEtatUser(5)) object['Q']++;
    }
    return object;
}

function classementGenres() {
    let tabClassementGenre = [];
    for (let i = 0; i < TabGenres.length; ++i) {
        tabClassementGenre.push([TabGenres[i], listeParGenre(listeFiltre, i), {}]);
        tabClassementGenre[tabClassementGenre.length - 1][2] = construitObjectStats({ A: 0, C: 0, L: 0, V: 0, T: 0, Q: 0 }, tabClassementGenre[tabClassementGenre.length - 1][1]);
    }
    tabClassementGenre.sort(function (liste1, liste2) {
        if (liste1[1].getNbAnime != liste2[1].getNbAnime) return liste2[1].getNbAnime - liste1[1].getNbAnime;
        else return liste2[1].getNbMusic - liste1[1].getNbMusic;
    });
    document.querySelector("#info").innerHTML = "&nbsp;Nb Anime: " + listeFiltre.getNbAnime + " | Nb Musique: " + listeFiltre.getNbMusic;
    let tds = document.querySelectorAll("td");
    for (let i = 0; i < tabClassementGenre.length; ++i) {
        tds[i * 11 + 1].textContent = tabClassementGenre[i][0];
        tds[i * 11 + 2].textContent = tabClassementGenre[i][1].getNbAnime;
        tds[i * 11 + 3].textContent = tabClassementGenre[i][1].getNbMusic;
        tds[i * 11 + 4].textContent = (Math.round((tabClassementGenre[i][1].getNbAnime * 100 / listeFiltre.getNbAnime) * 1000) / 1000);
        tds[i * 11 + 5].textContent = Math.round(tabClassementGenre[i][2]['A'] / tabClassementGenre[i][1].getNbAnime * 100000) / 1000;
        tds[i * 11 + 6].textContent = Math.round(tabClassementGenre[i][2]['C'] / tabClassementGenre[i][1].getNbAnime * 100000) / 1000;
        tds[i * 11 + 7].textContent = Math.round(tabClassementGenre[i][2]['L'] / tabClassementGenre[i][1].getNbAnime * 100000) / 1000;
        tds[i * 11 + 8].textContent = Math.round(tabClassementGenre[i][2]['V'] / tabClassementGenre[i][1].getNbAnime * 100000) / 1000;
        tds[i * 11 + 9].textContent = Math.round(tabClassementGenre[i][2]['T'] / tabClassementGenre[i][1].getNbAnime * 100000) / 1000;
        tds[i * 11 + 10].textContent = Math.round(tabClassementGenre[i][2]['Q'] / tabClassementGenre[i][1].getNbAnime * 100000) / 1000;
    }
}

async function lancementData() {
    await doCorsRequest("get", "../data.json", genereData);
}

async function doCorsRequest(method, url, funct) {
    let x = new XMLHttpRequest();
    x.open(method, url);
    x.onload = x.onerror = function () {
        let res = x.responseText;
        res = JSON.parse(res);
        funct(res);
    }
    x.send();
}

async function genereData(data) {
    data.anime.forEach(anime => {
        let A = new Anime(correctString(anime.nom), anime.id, anime.mal_id);
        anime.musique.forEach(music => {
            let M = new Music(A, music.type, music.numero, correctString(music.nom), correctString(music.artiste), music.lien);
            A.ajouteMusic(M);
        });
        let genres = anime.genres;
        for (let i = 0; i < TabGenres.length; ++i) A.ajouteGenre(genres[i]);
        globalList.ajouteAnime(A);
    });
    doCorsRequest("get", "../loadJsonUsers.json", setUsersData);
}

function setUsersData(data) {
    loadJsonUsers = data;
    let limitUsers = document.getElementById("inclusOnHoldDropped").checked ? 4 : 2;
    for (let i = 0; i < globalList.getNbAnime; ++i) {
        let A = globalList.getAnime(i);
        TabStringPseudo.forEach(user => {
            let ok = false;
            for (let j = 1; j <= limitUsers && !ok; ++j) {
                if (data[user][j] != undefined && data[user][j].includes(A.getMalId)) {
                    ok = true;
                }
            }
            A.ajouteUser(ok);
        });
    }
    filtre();
}

function modifUsersData(data) {
    let limitUsers = document.getElementById("inclusOnHoldDropped").checked ? 4 : 2;
    for (let i = 0; i < globalList.getNbAnime; ++i) {
        let A = globalList.getAnime(i);
        A.resetUsers();
        TabStringPseudo.forEach(user => {
            let ok = false;
            for (let j = 1; j <= limitUsers && !ok; ++j) {
                if (data[user][j] != undefined && data[user][j].includes(A.getMalId)) {
                    ok = true;
                }
            }
            A.ajouteUser(ok);
        });
    }
    filtre();
}

function filtreUsersUnion(listeFiltreAnime, tabUsersVal) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var stop = false;
        var j = 0;
        while (j < TabStringUsers.length && !stop) {
            if (tabUsersVal[j].checked && listeFiltreAnime.getAnime(i).getEtatUser(j)) stop = true;
            if (stop) listeA.ajouteAnime(listeFiltreAnime.getAnime(i));
            else j++;
        }
    }
    return listeA;
}

function filtreUsersIntersection(listeFiltreAnime, tabUsersVal) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var stop = false;
        var j = 0;
        while (j < TabStringUsers.length && !stop) {
            if (tabUsersVal[j].checked && !listeFiltreAnime.getAnime(i).getEtatUser(j)) stop = true;
            else j++;
        }
        if (!stop) listeA.ajouteAnime(listeFiltreAnime.getAnime(i));
    }
    return listeA;
}

function filtreUsersExact(listeFiltreAnime, tabUsersVal) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var stop = false;
        var j = 0;
        while (j < TabStringUsers.length && !stop) {
            if (tabUsersVal[j].checked != listeFiltreAnime.getAnime(i).getEtatUser(j)) stop = true;
            j++;
        }
        if (!stop) listeA.ajouteAnime(listeFiltreAnime.getAnime(i));
    }
    return listeA;
}

function checkboxListeModif(tabUsersVal) {
    for (let i = 0; i < TabStringUsers.length; ++i) if (tabUsersVal[i]) return true;
    return false;
}

function filtre() {
    let listeFiltreAnime = globalList;

    let tabUsersVal = [A, C, L, V, T, Q];
    let val = filtreJointureSelect.value;
    if (val == "Union" && checkboxListeModif(tabUsersVal)) { listeFiltreAnime = filtreUsersUnion(listeFiltreAnime, tabUsersVal); }
    else if (val == "Intersection") { listeFiltreAnime = filtreUsersIntersection(listeFiltreAnime, tabUsersVal); }
    else if (val == "Exact") { listeFiltreAnime = filtreUsersExact(listeFiltreAnime, tabUsersVal); }

    listeFiltre = listeFiltreAnime;
    classementGenres();
}

const TabStringUsers = ["A", "C", "L", "V", "T", "Q"];
const TabStringPseudo = ["Tiralex1", "Cycygonzales", "49Leo", "Gyrehio", "tchm", "QGWolfWarrior"];
const TabGenres = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];
var loadJsonUsers;

let globalList = new ListeAnime();
let listeFiltre = globalList;
let filtreJointureSelect = document.getElementById("jointure");
let A = document.getElementById("A");
let C = document.getElementById("C");
let L = document.getElementById("L");
let V = document.getElementById("V");
let T = document.getElementById("T");
let Q = document.getElementById("Q");

document.querySelectorAll("input[type='checkbox'], select").forEach(el => {
    el.addEventListener("click", () => filtre());
});

document.getElementById("inclusOnHoldDropped").addEventListener("click", function () {
    modifUsersData(loadJsonUsers);
});

resetFiltre();
lancementData();