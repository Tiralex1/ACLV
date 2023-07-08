function correctString(str) {
    var string = str.replace("<", "&lt");
    string = string.replace(">", "&gt");
    return string;
}

function createSimpleNode(type, options, innerHTML = "") {
    let node = document.createElement(type);
    if (innerHTML !== "") node.innerHTML = innerHTML;
    for (let opt in options) node[opt] = options[opt];
    return node;
}

function charger(tr) {
    tr.style.display = "";
}
function decharger(tr) {
    tr.style.display = "none";
}

// ------------------------------Class-------------------------------------------------------------------------------------------------------------------------------//
let falseTd = createSimpleNode("td", {}, "&#10025;");

class HTMLMusic {
    // champs
    #htmlAnime; #tr; #tds = [];
    // constructor
    constructor(music, htmlAnime) {
        if (!music instanceof Music || !htmlAnime instanceof HTMLAnime) throw new Error("Illegal Argument (constructor HTMLMusic)");
        this.#htmlAnime = htmlAnime;
        let tdFavo = createSimpleNode("td", { "className": "favo" }, "&#10025;");
        tdFavo.addEventListener("click", function () {
            modifFav(music.getAnime, music, tdFavo.innerHTML == falseTd.innerHTML);
            tdFavo.innerHTML = tdFavo.innerHTML == falseTd.innerHTML ? "&#9733;" : "&#10025;";
        });
        this.#tds.push(tdFavo);
        this.#tds.push(createSimpleNode("td", { "className": "nom_anime" }, music.getAnime.getNom));
        this.#tds.push(createSimpleNode("td", { "className": "type_music" }, music.getType));
        this.#tds.push(createSimpleNode("td", { "className": "numero_music" }, music.getNumero));
        this.#tds.push(createSimpleNode("td", { "className": "nom_music" }, music.getNom));
        this.#tds.push(createSimpleNode("td", { "className": "nom_artist" }, music.getArtist));
        let a = createSimpleNode("a", { "href": music.getLien, "target": "_blank" }, "Lien");
        let br = createSimpleNode("br", {});
        let button = createSimpleNode("button", { "style": "background-color : transparent; border : transparent;" }, "&#9658;");
        button.addEventListener("click", async function () {
            clickAudio(music.getLien, button);
            setupEventListenerLectureAuto();
        });
        let tdLien = createSimpleNode("td", { "className": "lien" });
        tdLien.appendChild(a);
        tdLien.appendChild(br);
        tdLien.appendChild(button);
        this.#tds.push(tdLien);
        this.#tr = document.createElement("tr");
        this.#tds.forEach(td => {
            this.#tr.appendChild(td);
        });
    }
    // getters
    get getHTMLAnime() { return this.#htmlAnime; }
    get getTr() { return this.#tr; }
    getTd(ind) { return this.#tds[ind]; }
    // méthodes
    setBackground(background) {
        if (!typeof background === "string") throw new Error("Illegal Argument (setBackground HTMLMusic)");
        this.#tr.style.backgroundColor = background;
    }
}

class Music {
    // champs
    #anime; #type; #numero; #nom; #artist; #lien; #html;
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
    get getHtml() { return this.#html; }
    // setters
    setHTML(html) {
        if (!html instanceof HTMLMusic) throw new Error("Illegal Argument (setHTML HTMLAnime)")
        this.#html = html;
    }
}

class HTMLAnime {
    // champs
    #tr; #htmlMusics = [];
    // constructor
    constructor(anime) {
        if (!anime instanceof Anime) throw new Error("Illegal Argument (constructor HTMLAnime)");
        this.#tr = createSimpleNode("tr", { "className": "grey" });
        let tdPrincipal = createSimpleNode("td", { "colSpan": "7" });
        this.#tr.appendChild(tdPrincipal);
        let divTete = createSimpleNode("div", { "className": "tete" });
        tdPrincipal.appendChild(divTete);
        let div1;
        if (ModeAffichLien == "2") {
            div1 = createSimpleNode("div", { "className": "_1 grey" }, anime.getNom + "&ensp;");
            div1.appendChild(createSimpleNode("a", { "href": anime.getLien, "target": "_blank", "style": "color : darkblue;" }, "&#9032;"));
        }
        else {
            div1 = createSimpleNode("div", { "className": "_1 grey" });
            div1.appendChild(createSimpleNode("a", { "href": anime.getLien, "target": "_blank" }, anime.getNom));
        }
        divTete.appendChild(div1);
        for (var j = 0; j < TabStringUsers.length; j++) {
            let div = createSimpleNode("div", { "className": "_" + (j + 2) + (anime.getEtatUser(j) ? " watch" : " no-watch") }, TabStringUsers[j]);
            divTete.appendChild(div);
        }
        for (let i = 0; i < anime.getNbMusic; ++i) {
            let htmlMusic = new HTMLMusic(anime.getMusic(i), this);
            this.#htmlMusics.push(htmlMusic);
            anime.getMusic(i).setHTML(htmlMusic);
        }
    }
    // getters
    get getTr() { return this.#tr; }
    get getTabTrMusic() {
        let tab = [];
        this.#htmlMusics.forEach(htmlMusic => {
            tab.push(htmlMusic.getTr);
        });
        return tab;
    }
    // méthodes
    setBackground(background) {
        if (!typeof background === "string") throw new Error("Illegal Argument (setBackground HTMLAnime)");
        this.#htmlMusics.forEach(htmlMusic => {
            htmlMusic.setBackground(background);
        });
    }
    dechargerAll() {
        decharger(this.#tr);
        this.#htmlMusics.forEach(htmlMusic => {
            decharger(htmlMusic.getTr);
        });
    }
}

class Anime {
    // champs
    #nom; #id; #lien; #tabMusic = []; #tabUsers = []; #html;
    // constructor
    constructor(nom, id, lien, html = null) {
        if (typeof nom === "string" && Number.isInteger(id) && typeof lien === "string") {
            this.#nom = nom;
            this.#id = id;
            this.#lien = lien;
            if (html !== null) this.#html = html;
        }
        else throw new Error("Illegal Argument (constructor Anime)");
    }
    // getters
    get getNom() { return this.#nom; }
    get getId() { return this.#id; }
    get getLien() { return this.#lien; }
    getMusic(ind) {
        if (!Number.isInteger(ind)) throw new Error("illegal Argument (getMusic Method in Class Anime)");
        return this.#tabMusic[ind];
    }
    get getNbMusic() { return this.#tabMusic.length; }
    getEtatUser(ind) {
        if (!Number.isInteger(ind)) throw new Error("illegal Argument (getEtatUser Method in Class Anime)");
        return this.#tabUsers[ind];
    }
    get getHtml() { return this.#html; }
    // méthodes
    generateHTML() {
        this.#html = new HTMLAnime(this);
    }
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
    copieUsers(anime) {
        if (!anime instanceof Anime) throw new Error("illegal Argument (copieUsers Method in Class Anime)");
        for (var i = 0; i < TabStringUsers.length; ++i) eval("this.ajouteUser(anime.getEtatUser(" + i + "));");
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
    generateHTML() {
        this.#tabAnime.forEach(anime => {
            anime.generateHTML();
        });
    }
    ajouteAnime(anime) {
        if (!anime instanceof Anime) throw new Error("Illegal Argument (ajouteAnime Method in Class ListeAnime)");
        this.#tabAnime.push(anime);
        this.#nbMusic += anime.getNbMusic;
    }
    ajoutePosAnime(anime, pos) {
        if (!anime instanceof Anime || !Number.isInteger(pos)) throw new Error("Illegal Argument (ajoutePosAnime Method in Class ListeAnime)");
        this.#tabAnime.splice(pos, 0, anime);
        this.#nbMusic += anime.getNbMusic;
    }
    ajoutePosMusic(i, music, pos) {
        if (!music instanceof Music || !Number.isInteger(i) || !Number.isInteger(pos)) throw new Error("Illegal Argument (ajoutePosMusic Method in Class ListeAnime)");
        this.#nbMusic ++;
        this.#tabAnime[i].ajoutePosMusic(music, pos);
    }
    supprimePosAnime(pos) {
        if (!Number.isInteger(pos)) throw new Error("Illegal Argument (supprimePosAnime Method in Class ListeAnime)");
        this.#tabAnime.splice(pos, 1);
    }
    supprimePosMusic(i, pos) {
        if (!Number.isInteger(i) || !Number.isInteger(pos)) throw new Error("Illegal Argument (supprimePosMusic Method in Class ListeAnime)");
        this.#tabAnime[i].supprimePosMusic(pos);
        this.#nbMusic --;
    }
    dechargerAllHtml() {
        this.#tabAnime.forEach(anime => {
            anime.getHtml.dechargerAll();
        });
    }
}

Object.seal(HTMLMusic);
Object.seal(Music);
Object.seal(HTMLAnime);
Object.seal(Anime);
Object.seal(ListeAnime);
// ------------------------------Class Fin---------------------------------------------------------------------------------------------------------------------------//

// event listeners pour (filtrage + affichage favori + save load favori)
async function setupListenersFiltrage() {
    document.querySelectorAll("input[type='checkbox'], select").forEach(el => {
        if (el.id != "lecture_auto") {
            el.addEventListener("change", function () {
                filtre();
            });
        }
    });
    document.querySelectorAll("input[type='text']").forEach(el => {
        el.addEventListener("input", function () {
            filtre();
        });
    });
    document.querySelector("#favori").addEventListener("click", async function () {
        affichFav();
    });
    document.querySelector("#save").addEventListener("click", async function () {
        saveFav();
    });
    document.querySelector("#load").addEventListener("click", async function () {
        loadFav();
    });
}

// ------------------------------Data Traitement---------------------------------------------------------------------------------------------------------------------//
async function lancementData() {
    doCorsRequest("get", "data.json");
}

async function doCorsRequest(method, url) {
    let x = new XMLHttpRequest();
    x.open(method, url);
    x.onload = x.onerror = function () {
        let res = x.responseText;
        res = JSON.parse(res);
        genereData(res);
    }
    x.send();
}

async function genereData(data) {
    data.anime.forEach(anime => {
        let A = new Anime(correctString(anime.nom), anime.id, anime.lien);
        anime.musique.forEach(music => {
            let M = new Music(A, music.type, music.numero, correctString(music.nom), correctString(music.artiste), music.lien);
            A.ajouteMusic(M);
        });
        let users = anime.users[0];
        TabStringUsers.forEach(user => {
            A.ajouteUser(users[user] == 1);
        });
        globalList.ajouteAnime(A);
    });
    globalList.generateHTML();
    setupAffich();
    setupFav(fav, favori);
}
// ------------------------------Data Traitement Fin-----------------------------------------------------------------------------------------------------------------//

// affichage
function genereTabTr(liste, affichTrAnime = true) {
    let tab = [];
    let color = AlternateColor1;
    for (let i = 0; i < liste.getNbAnime; ++i) {
        liste.getAnime(i).getHtml.setBackground(color);
        color = color == AlternateColor1 ? AlternateColor2 : AlternateColor1;
        if (affichTrAnime) tab.push(liste.getAnime(i).getHtml.getTr);
        for (let j = 0; j < liste.getAnime(i).getNbMusic; ++j) {
            tab.push(liste.getAnime(i).getMusic(j).getHtml.getTr);
        }
    }
    return tab;
}

async function setupAffich() {
    let info = document.createElement("div");
    info.id = "info";
    let table = document.createElement("table");
    table.id = "AnimeMusicList";
    HTMLTab = genereTabTr(globalList);
    for (let i = 100; i < HTMLTab.length; ++i) decharger(HTMLTab[i]);
    nbAffich = HTMLTab.length < 100 ? HTMLTab.length : 100;
    nbPixelAvantUpdate = Math.ceil(120 + (Math.ceil(nbAffich / 100) - 1) * 6000 + (100 * 60) * (3 / 4));
    for (let i = 0; i < HTMLTab.length; ++i) table.appendChild(HTMLTab[i]);
    info.innerHTML = "&nbsp;Nb Anime: " + globalList.getNbAnime + " | Nb Musique: " + globalList.getNbMusic;
    document.body.appendChild(info);
    document.body.appendChild(table);
}

function affichFiltr() {
    clickAudioStop();
    let info = document.getElementById("info");
    info.innerHTML = "&nbsp;Nb Anime: " + listeFiltre.getNbAnime + " | Nb Musique: " + listeFiltre.getNbMusic;
    HTMLTab = genereTabTr(listeFiltre, !AffichageFavori);
    for (let i = 100; i < HTMLTab.length; ++i) decharger(HTMLTab[i]);
    nbAffich = HTMLTab.length < 100 ? HTMLTab.length : 100;
    nbPixelAvantUpdate = Math.ceil(120 + (Math.ceil(nbAffich / 100) - 1) * 6000 + (100 * 60) * (3 / 4));
    for (let i = 0; i < nbAffich; ++i) charger(HTMLTab[i]);
}

document.addEventListener("scroll", async function () {
    if (nbAffich == HTMLTab.length) return;
    if (window.scrollY >= nbPixelAvantUpdate) {
        for (let i = nbAffich; i < (nbAffich + 100 < HTMLTab.length ? nbAffich + 100 : HTMLTab.length); ++i) charger(HTMLTab[i]);
        nbAffich = (nbAffich + 100 < HTMLTab.length ? nbAffich + 100 : HTMLTab.length);
        nbPixelAvantUpdate = Math.ceil(120 + (Math.ceil(nbAffich / 100) - 1) * 6000 + (100 * 60) * (3 / 4));
    }
});
// affichage fin

// filtrage
function filtreNomAnime(listeFiltreAnime, str) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        if (listeFiltreAnime.getAnime(i).getNom.toLowerCase().includes(str.toLowerCase())) listeA.ajouteAnime(listeFiltreAnime.getAnime(i));
        else listeFiltreAnime.getAnime(i).getHtml.dechargerAll();
    }
    return listeA;
}

function filtreTypeMusic(listeFiltreAnime, val) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var A = listeFiltreAnime.getAnime(i);
        var Abis = new Anime(A.getNom, A.getId, A.getLien, A.getHtml);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getType == val) Abis.ajouteMusic(A.getMusic(j));
            else decharger(listeFiltreAnime.getAnime(i).getMusic(j).getHtml.getTr);
        Abis.copieUsers(A);
        if (Abis.getNbMusic > 0) listeA.ajouteAnime(Abis);
        else decharger(listeFiltreAnime.getAnime(i).getHtml.getTr);
    }
    return listeA;
}

function filtreNomMusic(listeFiltreAnime, val) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var A = listeFiltreAnime.getAnime(i);
        var Abis = new Anime(A.getNom, A.getId, A.getLien, A.getHtml);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getNom.toLowerCase().includes(val.toLowerCase())) Abis.ajouteMusic(A.getMusic(j));
            else decharger(listeFiltreAnime.getAnime(i).getMusic(j).getHtml.getTr);
        Abis.copieUsers(A);
        if (Abis.getNbMusic > 0) listeA.ajouteAnime(Abis);
        else decharger(listeFiltreAnime.getAnime(i).getHtml.getTr);
    }
    return listeA;
}

function filtreNomArtistMusic(listeFiltreAnime, val) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var A = listeFiltreAnime.getAnime(i);
        var Abis = new Anime(A.getNom, A.getId, A.getLien, A.getHtml);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getArtist.toLowerCase().includes(val.toLowerCase())) Abis.ajouteMusic(A.getMusic(j));
            else decharger(listeFiltreAnime.getAnime(i).getMusic(j).getHtml.getTr);
        Abis.copieUsers(A);
        if (Abis.getNbMusic > 0) listeA.ajouteAnime(Abis);
        else decharger(listeFiltreAnime.getAnime(i).getHtml.getTr);
    }
    return listeA;
}

function filtreUsersUnion(listeFiltreAnime) {
    for (var i = 0; i < TabStringUsers.length; ++i) eval("var val" + i + " = " + TabStringUsers[i] + ".checked");
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var stop = false;
        var j = 0;
        while (j < TabStringUsers.length && !stop) {
            eval("if(val" + j + "==true && listeFiltreAnime.getAnime(" + i + ").getEtatUser(" + j + ")) stop = true;");
            if (stop) listeA.ajouteAnime(listeFiltreAnime.getAnime(i));
            else j++;
        }
        if (!stop) listeFiltreAnime.getAnime(i).getHtml.dechargerAll();
    }
    return listeA;
}

function filtreUsersIntersection(listeFiltreAnime) {
    for (var i = 0; i < TabStringUsers.length; ++i) eval("var val" + i + " = " + TabStringUsers[i] + ".checked");
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var stop = false;
        var j = 0;
        while (j < TabStringUsers.length && !stop) {
            eval("if(val" + j + "==true && !listeFiltreAnime.getAnime(" + i + ").getEtatUser(" + j + ")) stop = true;");
            j++;
        }
        if (!stop) {
            listeA.ajouteAnime(listeFiltreAnime.getAnime(i));
        }
        else listeFiltreAnime.getAnime(i).getHtml.dechargerAll();
    }
    return listeA;
}

function filtre() {
    let listeFiltreAnime = globalList;
    AffichageFavori = false;

    let val = filtreJointureSelect.value;
    if (val == "Union") { listeFiltreAnime = filtreUsersUnion(listeFiltreAnime); }
    else { listeFiltreAnime = filtreUsersIntersection(listeFiltreAnime); }

    val = correctString(filtreNomAnimeInput.value);
    if (val != "") { listeFiltreAnime = filtreNomAnime(listeFiltreAnime, val); }

    val = filtreTypeMusicSelect.value;
    if (val != "") { listeFiltreAnime = filtreTypeMusic(listeFiltreAnime, val); }

    val = correctString(filtreNomMusicInput.value);
    if (val != "") { listeFiltreAnime = filtreNomMusic(listeFiltreAnime, val); }

    val = correctString(filtreNomArtistInput.value);
    if (val != "") { listeFiltreAnime = filtreNomArtistMusic(listeFiltreAnime, val); }

    listeFiltre = listeFiltreAnime;
    affichFiltr();
}
// fin filtrage

function resetFiltre() {
    if (ModeAffichLien == "2") AffichLien2.checked = true;
    filtreNomAnimeInput.value = "";
    filtreTypeMusicSelect.value = "";
    filtreNomMusicInput.value = "";
    filtreNomArtistInput.value = "";
    filtreJointureSelect.value = "Union";
    for (var i of TabStringUsers) eval(i + ".checked = true");
}

// audio
let AudioActuel = new Audio("");
let stateAudio = 0;
let inputLectureAuto = document.querySelector("#lecture_auto");
let lectureAutomatique = inputLectureAuto.checked;
setupEventListenerLectureAuto();

inputLectureAuto.addEventListener("click", async function () {
    lectureAutomatique = !lectureAutomatique;
    setupEventListenerLectureAuto();
});

function setupEventListenerLectureAuto() {
    if (lectureAutomatique) {
        AudioActuel.addEventListener("ended", function () {
            clickAudio.button.click();
            let button2 = chercheNextBouton(clickAudio.button);
            if (button2 != null) button2.click();
        });
    }
    else {
        AudioActuel.addEventListener("ended", function () {
            clickAudio.button.click();
        });
    }
}

function chercheNextBouton(button) {
    let trActuel = button.parentElement.parentElement.nextElementSibling;
    while (trActuel != null && (trActuel.classList.contains("grey") || trActuel.style.display == "none")) {
        trActuel = trActuel.nextElementSibling;
    }
    if (trActuel != null) return trActuel.querySelector("button");
    else if (HTMLTab.length > 0) {
        if (HTMLTab[0].classList.contains("grey")) return HTMLTab[1].querySelector("button");
        else return HTMLTab[0].querySelector("button");
    }
    else return null;
}

function clickAudio(lien, button) {
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
    if (clickAudio.button != undefined) {
        clickAudio.button.innerHTML = "&#9658";
        clickAudio.button = undefined;
        AudioActuel.pause();
        stateAudio = 0;
    }
}

// affichageLien

let AffichLien1 = document.getElementById("affich_lien1");
let AffichLien2 = document.getElementById("affich_lien2");
let ModeAffichLien = "1";

if (localStorage.getItem("modeAffichLien")) ModeAffichLien = localStorage.getItem("modeAffichLien");
else localStorage.setItem("modeAffichLien", ModeAffichLien);

document.querySelectorAll("input[type='radio']").forEach(radio => {
    radio.addEventListener("change", function () {
        modifModeAffich();
    })
});

function modifModeAffich() {
    ModeAffichLien = AffichLien1.checked ? AffichLien1.value : AffichLien2.value;
    localStorage.setItem("modeAffichLien", ModeAffichLien);
    location.reload();
}

// favori

let AffichageFavori = false;
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

function sauvegardeFav() {
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

function ajoutFav(anime, music) {
    var pos = posAnime(anime, fav);
    if (pos == -1 || pos == fav.getNbAnime || !identiqueAnime(fav.getAnime(pos), anime)) {
        var A = new Anime(anime.getNom, anime.getId, anime.getLien, anime.getHtml);
        A.ajouteMusic(music);
        fav.ajoutePosAnime(A, pos);
    }
    else {
        var posMus = posMusic(music, fav.getAnime(pos), anime);
        if (posMus > -1) fav.ajoutePosMusic(pos, music, posMus);
    }
}

function suppFav(anime, music) {
    var posAfav = posAnime(anime, fav);
    var posM = posMusic(music, fav.getAnime(posAfav), fav.getAnime(posAfav));
    fav.supprimePosMusic(posAfav, posM);
    if (fav.getAnime(posAfav).getNbMusic == 0) fav.supprimePosAnime(posAfav);
}

function modifFav(anime, music, estfavori) {
    if (estfavori) ajoutFav(anime, music);
    else suppFav(anime, music);
    if (AffichageFavori) {
        AffichageFavori = !AffichageFavori;
        affichFav();
    }
    sauvegardeFav();
}

function setupFav(liste, tabLiens) {
    if (tabLiens.length == 0) return;
    let k = 0;
    for (let i = 0; i < globalList.getNbAnime && k < tabLiens.length; ++i) {
        let A = new Anime(globalList.getAnime(i).getNom, globalList.getAnime(i).getId, globalList.getAnime(i).getLien, globalList.getAnime(i).getHtml);
        for (let j = 0; j < globalList.getAnime(i).getNbMusic && k < tabLiens.length; ++j) {
            if (globalList.getAnime(i).getMusic(j).getLien == tabLiens[k]) {
                A.ajouteMusic(globalList.getAnime(i).getMusic(j));
                globalList.getAnime(i).getMusic(j).getHtml.getTd(0).innerHTML = "&#9733;";
                k++;
            }
        }
        if (A.getNbMusic > 0) liste.ajouteAnime(A);
    }
    if (fav.getNbMusic != favori.length) repareFav();
}

function affichFav() {
    resetFiltre();
    if (AffichageFavori) {
        AffichageFavori = false;
        listeFiltre = globalList;
    }
    else {
        AffichageFavori = true;
        listeFiltre = fav;
    }
    globalList.dechargerAllHtml();
    affichFiltr();
}

// reparateur de favori

function chercheMusique(lien) {
    for (let i = 0; i < globalList.getNbAnime; ++i) {
        for (let j = 0; j < globalList.getAnime(i).getNbMusic; ++j) {
            if (globalList.getAnime(i).getMusic(j).getLien == lien) return globalList.getAnime(i).getMusic(j);
        }
    }
    return null;
}

function repareFav() {
    let nb_supp = 0;
    for (let i = 0; i < favori.length; ++i) {
        let music = chercheMusique(favori[i]);
        if (music == null) nb_supp++;
        else if (music.getHtml.getTd(0).innerHTML == falseTd.innerHTML) ajoutFav(music.getAnime, music);
    }
    if (fav.getNbMusic != favori.length - nb_supp) throw new Error("repareFav don't working");
    else {
        sauvegardeFav();
        location.reload();
    }
}

// constantes et variables globales
const TabStringUsers = ["A", "C", "L", "V", "T"];
let globalList = new ListeAnime();
let fav = new ListeAnime();
let listeFiltre = globalList;
let AlternateColor1 = "lightgreen";
let AlternateColor2 = "lightcoral";
let HTMLTab;
let nbAffich = 0;
let nbPixelAvantUpdate = 120;

let filtreNomAnimeInput = document.getElementById("name_anime");
let filtreTypeMusicSelect = document.getElementById("type_music");
let filtreNomMusicInput = document.getElementById("name_music");
let filtreNomArtistInput = document.getElementById("name_artist");
let filtreJointureSelect = document.getElementById("jointure");
for (var i of TabStringUsers) eval("let " + i + " = document.getElementById(\"" + i + "\");");

// programme principal
(async function () {
    lancementData();
    resetFiltre();
    setupListenersFiltrage();
})();
