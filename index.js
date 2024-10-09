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
            clickAudio(music.getLien.replace(serveurCatbox[0], serveurCatbox[serveurCatboxChoice]), button);
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
            div1 = createSimpleNode("div", { "className": "_1 grey" }, "<abbr class='info' title='" + this.getHtmlGenres(anime) + "'>&#9432;</abbr>&ensp;" + anime.getNom + "&ensp;");
            div1.appendChild(createSimpleNode("a", { "href": anime.getLien, "target": "_blank", "style": "color : darkblue;" }, "&#9032;"));
        }
        else {
            div1 = createSimpleNode("div", { "className": "_1 grey" }, "<abbr class='info' title='" + this.getHtmlGenres(anime) + "'>&#9432;</abbr>&ensp;");
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
    getHtmlGenres(anime) {
        let str = "";
        for (let i = 0; i < TabGenres.length; ++i) {
            if (anime.getEtatGenre(i)) str += (TabGenres[i] + "\n");
        }
        str = str.trim();
        return str;
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
    #nom; #id; #mal_id; #tabMusic = []; #tabGenres = []; #tabUsers = []; #html;
    // constructor
    constructor(nom, id, mal_id, html = null) {
        if (typeof nom === "string" && Number.isInteger(id) && Number.isInteger(mal_id)) {
            this.#nom = nom;
            this.#id = id;
            this.#mal_id = mal_id;
            if (html !== null) this.#html = html;
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
    resetUsers() {
        this.#tabUsers = [];
    }
    ajouteGenre(bool) {
        if (!typeof bool === "boolean") throw new Error("illegal Argument (ajouteGenre Method in Class Anime)");
        this.#tabGenres.push(bool);
    }
    copieUsers(anime) {
        if (!anime instanceof Anime) throw new Error("illegal Argument (copieUsers Method in Class Anime)");
        for (var i = 0; i < TabStringUsers.length; ++i) this.ajouteUser(anime.getEtatUser(i));
    }
    copieGenres(anime) {
        if (!anime instanceof Anime) throw new Error("illegal Argument (copieGenres Method in Class Anime)");
        for (var i = 0; i < TabGenres.length; ++i) this.ajouteUser(anime.getEtatGenre(i));
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
        if (el.id != "lecture_auto" && el.id != "inclusOnHoldDropped") {
            el.addEventListener("change", async function () {
                filtre();
            });
        }
    });
    document.querySelectorAll("input[type='text']").forEach(el => {
        el.addEventListener("input", async function () {
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
    document.addEventListener("scroll", async function () {
        if (nbAffich == HTMLTab.length) return;
        if (window.scrollY >= nbPixelAvantUpdate) {
            for (let i = nbAffich; i < (nbAffich + 100 < HTMLTab.length ? nbAffich + 100 : HTMLTab.length); ++i) charger(HTMLTab[i]);
            nbAffich = (nbAffich + 100 < HTMLTab.length ? nbAffich + 100 : HTMLTab.length);
            nbPixelAvantUpdate = Math.ceil(120 + (Math.ceil(nbAffich / 100) - 1) * 6000 + (100 * 60) * (3 / 4));
        }
    });
    AudioActuel.addEventListener("ended", function () {
        clickAudio.button.click();
        if (lectureAutomatique) {
            let button2 = chercheNextBouton(clickAudio.button);
            if (button2 != null) button2.click();
        }
    });
    inputLectureAuto.addEventListener("click", async function () {
        lectureAutomatique = !lectureAutomatique;
    });
    document.querySelectorAll("input[type='radio']").forEach(radio => {
        radio.addEventListener("change", async function () {
            modifModeAffich();
        })
    });
    document.getElementById("AudioChangeServeur").addEventListener("click", function (event) {
        if (!AudioActuel.paused) clickAudio.button.click();
        serveurCatboxChoice++;
        if (serveurCatboxChoice >= serveurCatbox.length) serveurCatboxChoice = 0;
        AudioActuel.src = "";
        event.target.value = "ServeurCatbox : " + serveurCatbox[serveurCatboxChoice];
    });
    document.getElementById("inclusOnHoldDropped").addEventListener("click", function () {
        modifUsersData(loadJsonUsers);
    });
}

// ------------------------------Data Traitement---------------------------------------------------------------------------------------------------------------------//
async function lancementData() {
    doCorsRequest("get", "data.json", genereData);
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

function genereData(data) {
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
    doCorsRequest("get", "loadJsonUsers.json", setUsersData);
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
    globalList.generateHTML();
    setupAffich();
    setupFav(fav, favori);
    loadAdditionalData();
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

function setupAffich() {
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
    filtre();
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
        var Abis = new Anime(A.getNom, A.getId, A.getMalId, A.getHtml);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getType == val) Abis.ajouteMusic(A.getMusic(j));
            else decharger(listeFiltreAnime.getAnime(i).getMusic(j).getHtml.getTr);
        Abis.copieUsers(A);
        Abis.copieGenres(A);
        if (Abis.getNbMusic > 0) listeA.ajouteAnime(Abis);
        else decharger(listeFiltreAnime.getAnime(i).getHtml.getTr);
    }
    return listeA;
}

function filtreNomMusic(listeFiltreAnime, val) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var A = listeFiltreAnime.getAnime(i);
        var Abis = new Anime(A.getNom, A.getId, A.getMalId, A.getHtml);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getNom.toLowerCase().includes(val.toLowerCase())) Abis.ajouteMusic(A.getMusic(j));
            else decharger(listeFiltreAnime.getAnime(i).getMusic(j).getHtml.getTr);
        Abis.copieUsers(A);
        Abis.copieGenres(A);
        if (Abis.getNbMusic > 0) listeA.ajouteAnime(Abis);
        else decharger(listeFiltreAnime.getAnime(i).getHtml.getTr);
    }
    return listeA;
}

function filtreNomArtistMusic(listeFiltreAnime, val) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        var A = listeFiltreAnime.getAnime(i);
        var Abis = new Anime(A.getNom, A.getId, A.getMalId, A.getHtml);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getArtist.toLowerCase().includes(val.toLowerCase())) Abis.ajouteMusic(A.getMusic(j));
            else decharger(listeFiltreAnime.getAnime(i).getMusic(j).getHtml.getTr);
        Abis.copieUsers(A);
        Abis.copieGenres(A);
        if (Abis.getNbMusic > 0) listeA.ajouteAnime(Abis);
        else decharger(listeFiltreAnime.getAnime(i).getHtml.getTr);
    }
    return listeA;
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
        if (!stop) listeFiltreAnime.getAnime(i).getHtml.dechargerAll();
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
        else listeFiltreAnime.getAnime(i).getHtml.dechargerAll();
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
        else listeFiltreAnime.getAnime(i).getHtml.dechargerAll();
    }
    return listeA;
}

function filtreGenres(listeFiltreAnime, val) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        if (listeFiltreAnime.getAnime(i).getEtatGenre(val)) listeA.ajouteAnime(listeFiltreAnime.getAnime(i));
        else listeFiltreAnime.getAnime(i).getHtml.dechargerAll();
    }
    return listeA;
}

function checkboxListeModif(tabUsersVal) {
    for (let i = 0; i < TabStringUsers.length; ++i) if (tabUsersVal[i]) return true;
    return false;
}

function filtre() {
    let listeFiltreAnime = globalList;
    AffichageFavori = false;

    let val = correctString(filtreNomAnimeInput.value);
    if (val != "") { listeFiltreAnime = filtreNomAnime(listeFiltreAnime, val); }

    val = filtreTypeMusicSelect.value;
    if (val != "") { listeFiltreAnime = filtreTypeMusic(listeFiltreAnime, val); }

    val = correctString(filtreNomMusicInput.value);
    if (val != "") { listeFiltreAnime = filtreNomMusic(listeFiltreAnime, val); }

    val = correctString(filtreNomArtistInput.value);
    if (val != "") { listeFiltreAnime = filtreNomArtistMusic(listeFiltreAnime, val); }

    val = correctString(filtreGenresSelect.value);
    if (val != "") listeFiltreAnime = filtreGenres(listeFiltreAnime, parseInt(val));

    let tabUsersVal = [A, C, L, V, T, Q];
    val = filtreJointureSelect.value;
    if (val == "Union" && checkboxListeModif(tabUsersVal)) { listeFiltreAnime = filtreUsersUnion(listeFiltreAnime, tabUsersVal); }
    else if (val == "Intersection") { listeFiltreAnime = filtreUsersIntersection(listeFiltreAnime, tabUsersVal); }
    else if (val == "Exact") { listeFiltreAnime = filtreUsersExact(listeFiltreAnime, tabUsersVal); }

    listeFiltre = listeFiltreAnime;
    affichFiltr();
}
// fin filtrage

async function resetFiltre() {
    if (ModeAffichLien == "2") AffichLien2.checked = true;
    filtreNomAnimeInput.value = "";
    filtreTypeMusicSelect.value = "";
    filtreNomMusicInput.value = "";
    filtreNomArtistInput.value = "";
    filtreJointureSelect.value = "Union";
    A.checked = true;
    C.checked = true;
    L.checked = true;
    V.checked = true;
    T.checked = true;
    Q.checked = true;
    filtreGenresSelect.value = "";
}

// audio

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
        AudioActuel.src = lien;
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

function modifModeAffich() {
    ModeAffichLien = AffichLien1.checked ? AffichLien1.value : AffichLien2.value;
    localStorage.setItem("modeAffichLien", ModeAffichLien);
    location.reload();
}

// favori

async function setupFavori() {
    if (localStorage.getItem("favori")) {
        var favori_string = localStorage.getItem("favori");
        favori = favori_string.split("|");
        var i = 0;
        while (i < favori.length) {
            favori[i] = favori[i].replace("catbox.moe", "catbox.video");
            favori[i] = favori[i].replace("nl.catbox.video", "nawdist.animemusicquiz.com");
            if (favori[i].startsWith("https://")) i++;
            else favori.splice(i, 1);
        }
        let sav = favori.join("|");
        localStorage.setItem("favori", sav);
    }
    else localStorage.setItem("favori", favori);
}

async function saveFav() {
    const a = document.createElement('a');
    var nomf = prompt("Nom du fichier : ", "SaveFav.txt");
    if (nomf == null) nomf = "saveFav.txt";
    a.download = nomf;
    a.href = "data:text/plain," + localStorage.getItem("favori");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function loadFav() {
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

async function sauvegardeFav() {
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

async function ajoutFav(anime, music) {
    var pos = posAnime(anime, fav);
    if (pos == -1 || pos == fav.getNbAnime || !identiqueAnime(fav.getAnime(pos), anime)) {
        var A = new Anime(anime.getNom, anime.getId, anime.getMalId, anime.getHtml);
        A.ajouteMusic(music);
        fav.ajoutePosAnime(A, pos);
    }
    else {
        var posMus = posMusic(music, fav.getAnime(pos), anime);
        if (posMus > -1) fav.ajoutePosMusic(pos, music, posMus);
    }
}

async function suppFav(anime, music) {
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
        let A = new Anime(globalList.getAnime(i).getNom, globalList.getAnime(i).getId, globalList.getAnime(i).getMalId, globalList.getAnime(i).getHtml);
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

async function affichFav() {
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

// additional-data

async function setScoreUsers(data) {
    if (data !== undefined) {
        for (let i = 0; i < globalList.getNbAnime; ++i) {
            let A = globalList.getAnime(i);
            if (data[A.getMalId] !== undefined) {
                let j = 2;
                TabStringUsers.forEach(user => {
                    if (data[A.getMalId].scores[user] !== undefined && data[A.getMalId].scores[user] != 0) {
                        let div = A.getHtml.getTr.querySelector("._" + j);
                        div.innerHTML += ("<br/>" + data[A.getMalId].scores[user]);
                        div.style.padding = "5px";
                    }
                    j++;
                });
            }
        }
    }
}

async function loadJson(method, url) {
    let x = new XMLHttpRequest();
    x.open(method, url);
    x.onload = x.onerror = function () {
        let res = x.responseText;
        res = JSON.parse(res);
        setScoreUsers(res);
    }
    x.send();
}

async function loadAdditionalData() {
    try { loadJson("get", "https://aclvt.tchm.dev/additional-data.json"); }
    catch (e) { console.log(e); }
}

// constantes et variables globales
const TabStringUsers = ["A", "C", "L", "V", "T", "Q"];
const TabStringPseudo = ["Tiralex1", "Cycygonzales", "49Leo", "Gyrehio", "tchm", "QGWolfWarrior"]
const TabGenres = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];
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
let A = document.getElementById("A");
let C = document.getElementById("C");
let L = document.getElementById("L");
let V = document.getElementById("V");
let T = document.getElementById("T");
let Q = document.getElementById("Q");
let filtreGenresSelect = document.getElementById("genres");

let AudioActuel = new Audio("");
let stateAudio = 0;
let inputLectureAuto = document.querySelector("#lecture_auto");
let lectureAutomatique = inputLectureAuto.checked;

let serveurCatbox = ["nl.catbox.video", "ladist1.catbox.video"];
let serveurCatboxChoice = 0;

document.getElementById("AudioChangeServeur").value = "ServeurCatbox : " + serveurCatbox[serveurCatboxChoice];

let AffichLien1 = document.getElementById("affich_lien1");
let AffichLien2 = document.getElementById("affich_lien2");
let ModeAffichLien = "1";

if (localStorage.getItem("modeAffichLien")) ModeAffichLien = localStorage.getItem("modeAffichLien");
else localStorage.setItem("modeAffichLien", ModeAffichLien);

let AffichageFavori = false;
let favori = [];

var loadJsonUsers;

// programme principal
(async function () {
    resetFiltre().then(() => setupFavori()).then(() => lancementData()).then(() => setupListenersFiltrage());
})();