let NomFicData = "data.json";
let NB_USERS = 5;
let TabStringUsers = ["A", "C", "L", "V", "T"];
let AlternateColor1 = "green";
let AlternateColor2 = "red";
let AffichageFavori = false;
let AudioActuel = new Audio("");
let stateAudio = 0;

// initialisation des variables représentant les champs de filtrages
let filtreNomAnime = document.getElementById("name_anime");
let filtreTypeMusic = document.getElementById("type_music");
let filtreNomMusic = document.getElementById("name_music");
let filtreNomArtist = document.getElementById("name_artist");
let filtreJointure = document.getElementById("jointure");
for (var i of TabStringUsers) eval("let " + i + " = document.getElementById(\"" + i + "\");");

let AffichLien1 = document.getElementById("affich_lien1");
let AffichLien2 = document.getElementById("affich_lien2");

let ModeAffichLien = "1";
if (localStorage.getItem("modeAffichLien")) { ModeAffichLien = localStorage.getItem("modeAffichLien"); }
else {
    ModeAffichLien = "1";
    localStorage.setItem("modeAffichLien", ModeAffichLien);
}

let favori = [];
if (localStorage.getItem("favori")) {
    var favori_string = localStorage.getItem("favori");
    favori = favori_string.split("|");
    var i = 0;
    while (i < favori.length) {
        if (favori[i].startsWith("https://")) i++;
        else favori.splice(i, 1);
    }
    let sav = favori.join("|");
    localStorage.setItem("favori", sav);
}
else localStorage.setItem("favori", favori);

function saveFav() {
    const a = document.createElement('a');
    var nomf = prompt("Nom du fichier : ", "SaveFav.txt");
    if (nomf == null) nomf = "saveFav.txt";
    a.download = nomf;
    a.href = "data:text/plain," + localStorage.getItem("favori");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function loadFav() {
    const button = document.createElement('input');
    button.type = "file";
    button.onchange = function () {
        let file = button.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            localStorage.setItem("favori", evt.target.result);
            location.reload();
        };
        reader.readAsText(file);
    };
    document.body.appendChild(button);
    button.click();
    document.body.removeChild(button);
}


class Music {
    #anime; #type; #numero; #nom; #artist; #lien; #favori; #html; #background;
    constructor(anime, type, numero, nom, artist, lien, fav = false) {
        this.#anime = anime;
        this.#type = type;
        this.#numero = numero;
        this.#nom = nom;
        this.#artist = artist;
        this.#lien = lien;
        this.#favori = fav;
        this.#background = "green";
        this.#html = this.#generateHTML();
    }
    get getAnime() { return this.#anime; }
    get getType() { return this.#type; }
    get getNom() { return this.#nom; }
    get getNumero() { return this.#numero; }
    get getArtist() { return this.#artist; }
    get getLien() { return this.#lien; }
    get getFavori() { return this.#favori; }
    getHtml(backgroundColor) {
        if (backgroundColor != this.#background) this.changeBackground();
        return this.#html;
    }
    get getBackgroundColor() { return this.#background; }
    ModifFavori() { this.#favori = !this.#favori }
    #generateHTML() {
        let tr = document.createElement("tr");
        tr.classList.add(this.getBackgroundColor);
        let td1 = document.createElement("td");
        if (!this.getFavori) td1.innerHTML = "&#10025;";
        else td1.innerHTML = "&#9733;";
        td1.classList.add("favo");
        let M = this;
        td1.addEventListener("click", function () {
            M.ModifFavori();
            if (!M.getFavori) td1.innerHTML = "&#10025;";
            else td1.innerHTML = "&#9733;";
            modif_fav(M.getAnime, M);
        });
        tr.appendChild(td1);
        let td2 = document.createElement("td");
        td2.innerHTML = this.getAnime.getNom;
        td2.classList.add("nom_anime");
        tr.appendChild(td2);
        let td3 = document.createElement("td");
        td3.innerHTML = this.getType;
        td3.classList.add("type_music");
        tr.appendChild(td3);
        let td4 = document.createElement("td");
        td4.innerHTML = this.getNumero;
        td4.classList.add("numero_music");
        tr.appendChild(td4);
        let td5 = document.createElement("td");
        td5.innerHTML = this.getNom;
        td5.classList.add("nom_music");
        tr.appendChild(td5);
        let td6 = document.createElement("td");
        td6.innerHTML = this.getArtist;
        td6.classList.add("nom_artist");
        tr.appendChild(td6);
        let td7 = document.createElement("td");
        let a = document.createElement("a");
        a.href = this.getLien;
        a.target = "_blank";
        a.innerHTML = "Lien";
        td7.appendChild(a);
        td7.appendChild(document.createElement("br"));
        let button = document.createElement("button");
        button.style.backgroundColor = "transparent";
        button.style.border = "transparent";
        button.innerHTML = "&#9658;";
        button.addEventListener("click", function () {
            clickAudio(M.getLien, button);
        });
        td7.appendChild(button);
        td7.classList.add("lien");
        tr.appendChild(td7);
        return tr;
    }
    changeBackground() {
        this.#html.classList.remove(this.#background);
        if (this.#background == "green") this.#background = "red";
        else this.#background = "green";
        this.#html.classList.add(this.#background);
    }
    setVisibleHTML(bool) {
        if (bool) {
            if (this.#html.style.display == "none") this.#html.style.display = "";
        }
        else {
            if (this.#html.style.display == "") this.#html.style.display = "none";
        }
    }
}

class Anime {
    #nom; #id; #lien; #nbMusic = 0; #TabMusic = []; #tabUsers = []; #html;
    constructor(nom, id = 0, lien = "") {
        this.#nom = nom;
        this.#id = id;
        this.#lien = lien;
    }
    AjouteMusic(music) {
        this.#TabMusic.push(music);
        this.#nbMusic ++;
    }
    AjoutePosMusic(music, pos) {
        this.#TabMusic.splice(pos, 0, music);
        this.#nbMusic ++;
    }
    SupprimePosMusic(pos) {
        this.#TabMusic.splice(pos, 1);
        this.#nbMusic --;
    }
    AjouteUser(bool) { this.#tabUsers.push(bool); }
    CopieUsers(anime) { for (var i = 0; i < NB_USERS; ++i) eval("this.AjouteUser(anime.getEtatUser(" + i + "));"); }
    GenereHtml() {
        this.#html = this.#generateHTML();
    }
    get getNom() { return this.#nom; }
    get getId() { return this.#id; }
    get getLien() { return this.#lien; }
    get getNbMusic() { return this.#nbMusic; }
    get getHtml() { return this.#html; }
    getEtatUser(i) { return this.#tabUsers[i] }
    getMusic(j) { return this.#TabMusic[j] }
    setVisibleHTML(bool) {
        if (bool) {
            if (this.#html.style.display == "none") this.#html.style.display = "";
        }
        else {
            if (this.#html.style.display == "") this.#html.style.display = "none";
            for (let music of this.#TabMusic) {
                music.setVisibleHTML(false);
            }
        }
    }
    #generateHTML() {
        let tr = document.createElement("tr");
        tr.classList.add("grey");
        let td1 = document.createElement("td");
        td1.colSpan = "7";
        tr.appendChild(td1);
        let div_tete = document.createElement("div");
        div_tete.classList.add("tete");
        td1.appendChild(div_tete);
        let div1 = document.createElement("div");
        div1.classList.add("_1");
        div1.classList.add("grey");
        let a = document.createElement("a");
        a.href = this.getLien;
        a.target = "_blank";
        if (ModeAffichLien == "1") { a.innerHTML = this.getNom; }
        else {
            div1.innerHTML = this.getNom + "&ensp;";
            a.style.color = "darkblue";
            a.innerHTML = "&#9032;";
        }
        div1.appendChild(a);
        div_tete.appendChild(div1);

        for (var j = 0; j < NB_USERS; j++) {
            let div = document.createElement("div");
            div.classList.add("_" + (j + 2));
            if (!this.getEtatUser(j)) div.classList.add("no-watch");
            else div.classList.add("watch");
            div.innerHTML = TabStringUsers[j];
            div_tete.appendChild(div);
        }
        return tr;
    }
}

class ListeAnime {
    #nbAnime = 0; #TabAnime = []; #nbMusic = 0;
    AjouteAnime(anime) {
        this.#TabAnime.push(anime);
        this.#nbAnime ++;
        this.#nbMusic += anime.getNbMusic;
    }
    AjoutePosAnime(anime, pos) {
        this.#TabAnime.splice(pos, 0, anime);
        this.#nbAnime ++;
        this.#nbMusic += anime.getNbMusic;
    }
    AjoutePosMusic(i, music, pos) {
        this.#nbMusic ++;
        this.#TabAnime[i].AjoutePosMusic(music, pos);
    }
    SupprimePosAnime(pos) {
        this.#TabAnime.splice(pos, 1);
        this.#nbAnime --;
    }
    SupprimePosMusic(i, pos) {
        this.#nbMusic --;
        this.#TabAnime[i].SupprimePosMusic(pos);
    }
    get getNbAnime() { return this.#nbAnime; }
    get getNbMusic() { return this.#nbMusic; }
    getAnime(i) { return this.#TabAnime[i] }
}

Object.seal(Music);
Object.seal(Anime);
Object.seal(ListeAnime);

let Liste_Anime = new ListeAnime();
let listeFiltre = Liste_Anime;
let fav = new ListeAnime();

function reset_filtre() {
    if (ModeAffichLien == "2") AffichLien2.checked = true;
    filtreNomAnime.value = "";
    filtreTypeMusic.value = "";
    filtreNomMusic.value = "";
    filtreNomArtist.value = "";
    filtreJointure.value = "Union";
    for (var i of TabStringUsers) eval(i + ".checked = true");
}

function modif_mode_affich() {
    if (AffichLien1.checked) ModeAffichLien = AffichLien1.value;
    else ModeAffichLien = AffichLien2.value;
    localStorage.setItem("modeAffichLien", ModeAffichLien);
    location.reload();
}

function correctString(str) {
    var string = str.replace("<", "&lt;");
    string = string.replace(">", "&gt;");
    return string;
}

function data(nom_fic) {
    $.ajaxSetup({
        async: false
    });
    $.getJSON(nom_fic, function (data) {
        $.each(data, function (key, val) {
            if (key == "anime") {
                var cpt = 0;
                $.each(val, function (key, val) {
                    var A = new Anime(correctString(val.nom), val.id, val.lien);
                    var Afav = new Anime(correctString(val.nom), val.id, val.lien);
                    var mus = val.musique;
                    for (var i = 0; i < val.nb_musique; ++i) {
                        var M;
                        if (cpt < favori.length && mus[i].lien == favori[cpt]) {
                            M = new Music(A, mus[i].type, mus[i].numero, correctString(mus[i].nom), correctString(mus[i].artiste), mus[i].lien, true);
                            Afav.AjouteMusic(M);
                            cpt++;
                        }
                        else M = new Music(A, mus[i].type, mus[i].numero, correctString(mus[i].nom), correctString(mus[i].artiste), mus[i].lien);
                        A.AjouteMusic(M);
                    }
                    for (var i of TabStringUsers) eval("A.AjouteUser(val.users[0]." + i + ");");
                    A.GenereHtml();
                    Liste_Anime.AjouteAnime(A);
                    if (Afav.getNbMusic > 0) fav.AjouteAnime(Afav);
                });
            }
        });
    });
    $.ajaxSetup({
        async: true
    });
}

function clickAudio(lien, button) { // &#9208;
    if (AudioActuel.src != lien) {
        AudioActuel.pause();
        if (clickAudio.button !== undefined) clickAudio.button.innerHTML = "&#9658;";
        AudioActuel = new Audio(lien);
        AudioActuel.play();
        button.innerHTML = "&#9208;";
        stateAudio = 1;
    }
    else if (stateAudio == 1) {
        AudioActuel.pause();
        button.innerHTML = "&#9658;";
        stateAudio = 0;
    }
    else {
        AudioActuel.play();
        button.innerHTML = "&#9208;";
        stateAudio = 1;
    }
    clickAudio.button = button;
}
function clickAudioStop() {
    clickAudio.ind = undefined;
    AudioActuel.pause();
    stateAudio = 0;
}

function affich(listeA) {
    let info = document.createElement("div");
    info.id = "info";
    let table = document.createElement("table");
    table.id = "AnimeMusicList";

    var BackGround = AlternateColor2;
    for (var i = 0; i < listeA.getNbAnime; ++i) {
        var A = listeA.getAnime(i);
        table.appendChild(A.getHtml);

        if (BackGround == AlternateColor2) BackGround = AlternateColor1;
        else BackGround = AlternateColor2;

        for (var j = 0; j < A.getNbMusic; ++j) {
            var M = A.getMusic(j);
            table.appendChild(M.getHtml(BackGround));
        }
    }

    info.innerHTML = "&nbsp;Nb Anime: " + listeA.getNbAnime + " | Nb Musique: " + listeA.getNbMusic;
    document.body.appendChild(info);
    document.body.appendChild(table);
}

function affich_filtr(listeA) {
    let info = document.getElementById("info");
    let BackGround = AlternateColor2;
    let k = 0;
    for (let i = 0; i < Liste_Anime.getNbAnime; ++i) {
        let A = Liste_Anime.getAnime(i);
        if (k < listeA.getNbAnime && identiqueAnime(listeA.getAnime(k), A)) {

            if (!AffichageFavori) A.setVisibleHTML(true);
            else A.setVisibleHTML(false);

            if (BackGround == AlternateColor2) BackGround = AlternateColor1;
            else BackGround = AlternateColor2;

            let l = 0;
            for (let j = 0; j < A.getNbMusic; ++j) {
                if (listeA.getAnime(k).getMusic(l) == A.getMusic(j)) {
                    A.getMusic(j).setVisibleHTML(true);
                    if (A.getMusic(j).getBackgroundColor != BackGround) A.getMusic(j).changeBackground();
                    l++;
                }
                else A.getMusic(j).setVisibleHTML(false);
            }
            k++;
        }
        else A.setVisibleHTML(false);
    }
    info.innerHTML = "&nbsp;Nb Anime: " + listeA.getNbAnime + " | Nb Musique: " + listeA.getNbMusic;
}

function affich_fav() {
    if (AffichageFavori) {
        AffichageFavori = false;
        listeFiltre = Liste_Anime;
    }
    else {
        AffichageFavori = true;
        listeFiltre = fav;
        reset_filtre();
    }
    affich_filtr(listeFiltre);
}

function sauvegarde_fav() {
    var tab = [];
    for (var i = 0; i < fav.getNbAnime; ++i) {
        for (var j = 0; j < fav.getAnime(i).getNbMusic; ++j) {
            tab.push(fav.getAnime(i).getMusic(j).getLien);
        }
    }
    var str = tab.join("|");
    localStorage.setItem("favori", str);
}

function posAnime(anime, listeA) {
    if (listeA.getNbAnime == 0) return -1;
    var i = 0;
    var j = listeA.getNbAnime;
    var m;
    while (i < j) {
        m = Math.trunc((i + j) / 2);
        if (listeA.getAnime(m).getNom.toLowerCase() > anime.getNom.toLowerCase()) j = m;
        else if (listeA.getAnime(m).getNom.toLowerCase() < anime.getNom.toLowerCase()) i = m + 1;
        else {
            if (listeA.getAnime(m).getId > anime.getId) j = m;
            else if (listeA.getAnime(m).getId < anime.getId) i = m + 1;
            else {
                i = m;
                j = m;
            }
        }
    }
    return i;
}

function posMusic(music, anime, animeref) {
    var pos = 0;
    for (var i = 0; i < animeref.getNbMusic; ++i) {
        if (music.getLien == animeref.getMusic(i).getLien) return pos;
        if (pos < anime.getNbMusic && anime.getMusic(pos).getLien == animeref.getMusic(i).getLien) pos++;
    }
    return -1;
}

function identiqueAnime(anime1, anime2) {
    return anime1.getNom == anime2.getNom && anime1.getId == anime2.getId;
}

function ajout_fav(anime, music) {
    var pos = posAnime(anime, fav);
    if (pos == -1 || pos == fav.getNbAnime || !identiqueAnime(fav.getAnime(pos), anime)) {
        var A = new Anime(anime.getNom, anime.getId);
        A.AjouteMusic(music);
        fav.AjoutePosAnime(A, pos);
    }
    else {
        var posMus = posMusic(music, fav.getAnime(pos), anime);
        if (posMus > -1) fav.AjoutePosMusic(pos, listeFiltre.getAnime(i).getMusic(j), posMus);
    }
}

function supp_fav(anime, music) {
    var posAfav = posAnime(anime, fav);
    var posM = posMusic(music, fav.getAnime(posAfav), fav.getAnime(posAfav));
    fav.SupprimePosMusic(posAfav, posM);
    if (fav.getAnime(posAfav).getNbMusic == 0) fav.SupprimePosAnime(posAfav);
}

function modif_fav(anime, music) {
    if (music.getFavori) ajout_fav(anime, music);
    else supp_fav(anime, music);
    if (AffichageFavori) {
        AffichageFavori = !AffichageFavori;
        affich_fav();
    }
    sauvegarde_fav();
}

function filtre_nomAnime(listeFiltreAnime, str) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        if (listeFiltreAnime.getAnime(i).getNom.toLowerCase().includes(str.toLowerCase())) listeA.AjouteAnime(listeFiltreAnime.getAnime(i));
    }
    return listeA;
}

function filtre_typeMusic(listeFiltreAnime, val) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var A = listeFiltreAnime.getAnime(i);
        var Abis = new Anime(A.getNom, A.getId, A.getLien);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getType == val) Abis.AjouteMusic(A.getMusic(j));
        Abis.CopieUsers(A);
        if (Abis.getNbMusic > 0) listeA.AjouteAnime(Abis);
    }
    return listeA;
}

function filtre_nomMusic(listeFiltreAnime, val) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var A = listeFiltreAnime.getAnime(i);
        var Abis = new Anime(A.getNom, A.getId, A.getLien);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getNom.toLowerCase().includes(val.toLowerCase())) Abis.AjouteMusic(A.getMusic(j));
        Abis.CopieUsers(A);
        if (Abis.getNbMusic > 0) listeA.AjouteAnime(Abis);
    }
    return listeA;
}

function filtre_nomArtistMusic(listeFiltreAnime, val) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var A = listeFiltreAnime.getAnime(i);
        var Abis = new Anime(A.getNom, A.getId, A.getLien);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getArtist.toLowerCase().includes(val.toLowerCase())) Abis.AjouteMusic(A.getMusic(j));
        Abis.CopieUsers(A);
        if (Abis.getNbMusic > 0) listeA.AjouteAnime(Abis);
    }
    return listeA;
}

function filtre_usersUnion(listeFiltreAnime) {
    for (var i = 0; i < NB_USERS; ++i) eval("var val" + i + " = " + TabStringUsers[i] + ".checked");
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var stop = false;
        var j = 0;
        while (j < NB_USERS && !stop) {
            eval("if(val" + j + "==true && listeFiltreAnime.getAnime(" + i + ").getEtatUser(" + j + ")) stop = true;");
            if (stop) listeA.AjouteAnime(listeFiltreAnime.getAnime(i));
            else j++;
        }
    }
    return listeA;
}

function filtre_usersIntersection(listeFiltreAnime) {
    for (var i = 0; i < NB_USERS; ++i) eval("var val" + i + " = " + TabStringUsers[i] + ".checked");
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var stop = false;
        var j = 0;
        while (j < NB_USERS && !stop) {
            eval("if(val" + j + "==true && !listeFiltreAnime.getAnime(" + i + ").getEtatUser(" + j + ")) stop = true;");
            j++;
        }
        if (!stop) {
            listeA.AjouteAnime(listeFiltreAnime.getAnime(i));
        }
    }
    return listeA;
}

function filtre() {
    let listeFiltreAnime = Liste_Anime;
    AffichageFavori = false;

    let val = filtreJointure.value;
    if (val == "Union") { listeFiltreAnime = filtre_usersUnion(listeFiltreAnime); }
    else { listeFiltreAnime = filtre_usersIntersection(listeFiltreAnime); }

    val = correctString(filtreNomAnime.value);
    if (val != "") { listeFiltreAnime = filtre_nomAnime(listeFiltreAnime, val); }

    val = filtreTypeMusic.value;
    if (val != "") { listeFiltreAnime = filtre_typeMusic(listeFiltreAnime, val); }

    val = filtreNomMusic.value;
    if (val != "") { listeFiltreAnime = filtre_nomMusic(listeFiltreAnime, val); }

    val = filtreNomArtist.value;
    if (val != "") { listeFiltreAnime = filtre_nomArtistMusic(listeFiltreAnime, val); }

    affich_filtr(listeFiltreAnime);
    listeFiltre = listeFiltreAnime;
}

reset_filtre();
data(NomFicData);
affich(Liste_Anime);