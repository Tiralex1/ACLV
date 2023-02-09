let NomFicData = "data.json";
let NB_USERS = 5;
let TabStringUsers = ["A", "C", "L", "V", "T"];
let AlternateColor1 = "green";
let AlternateColor2 = "red";
let AffichageFavori = false;

let filtreNomAnime = document.getElementById("name_anime");
let filtreTypeMusic = document.getElementById("type_music");
let filtreNomMusic = document.getElementById("name_music");
let filtreNomArtist = document.getElementById("name_artist");
let filtreJointure = document.getElementById("jointure");
for (var i = 0; i < NB_USERS; ++i) eval("let " + TabStringUsers[i] + " = document.getElementById(\"" + TabStringUsers[i] + "\");");

let favori = [];
if (localStorage.getItem("favori")) {
    var favori_string = localStorage.getItem("favori");
    favori = favori_string.split("|");
    var i = 0;
    while (i < favori.length) {
        if (favori[i].startsWith("https://")) i++;
        else favori.splice(i, 1);
    }
}
else localStorage.setItem("favori", favori);

class Music {
    #type; #numero; #nom; #artist; #lien; #favori;
    constructor(type, numero, nom, artist, lien, fav = false) {
        this.#type = type;
        this.#numero = numero;
        this.#nom = nom;
        this.#artist = artist;
        this.#lien = lien;
        this.#favori = fav;
    }
    get getType() { return this.#type; }
    get getNom() { return this.#nom; }
    get getNumero() { return this.#numero; }
    get getArtist() { return this.#artist; }
    get getLien() { return this.#lien; }
    get getFavori() { return this.#favori; }
    ModifFavori() { this.#favori = !this.#favori }
}

class Anime {
    #nom; #id; #nbMusic = 0; #TabMusic = []; #tabUsers = [];
    constructor(nom, id = 0) {
        this.#nom = nom;
        this.#id = id;
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
    get getNom() { return this.#nom; }
    get getId() { return this.#id; }
    get getNbMusic() { return this.#nbMusic; }
    getEtatUser(i) { return this.#tabUsers[i] }
    getMusic(j) { return this.#TabMusic[j] }
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
    SupprimePosAnime(animeref, pos) {
        this.#TabAnime.splice(pos, 1);
        this.#nbAnime --;
    }
    IncrementeMusic() { this.#nbMusic ++; }
    DecrementeMusic() { this.#nbMusic --; }
    get getNbAnime() { return this.#nbAnime; }
    get getNbMusic() { return this.#nbMusic; }
    getAnime(i) { return this.#TabAnime[i] }
}

let Liste_Anime = new ListeAnime();
let listeFiltre = Liste_Anime;
let fav = new ListeAnime();

function reset_filtre() {
    filtreNomAnime.value = "";
    filtreTypeMusic.value = "";
    filtreNomMusic.value = "";
    filtreNomArtist.value = "";
    filtreJointure.value = "Union";
    for (var i = 0; i < NB_USERS; ++i) eval(TabStringUsers[i] + ".checked = true");
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
                    var A = new Anime(correctString(val.nom), val.id);
                    var Afav = new Anime(correctString(val.nom), val.id);
                    var mus = val.musique;
                    for (var i = 0; i < val.nb_musique; ++i) {
                        var M;
                        if (cpt < favori.length && mus[i].lien == favori[cpt]) {
                            M = new Music(mus[i].type, mus[i].numero, correctString(mus[i].nom), correctString(mus[i].artiste), mus[i].lien, true);
                            Afav.AjouteMusic(M);
                            cpt++;
                        }
                        else M = new Music(mus[i].type, mus[i].numero, correctString(mus[i].nom), correctString(mus[i].artiste), mus[i].lien);
                        A.AjouteMusic(M);
                    }
                    for (var i = 0; i < NB_USERS; ++i) eval("A.AjouteUser(val.users[0]." + TabStringUsers[i] + ");");
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

function affich(listeA) {
    var child = document.getElementById("info");
    if (!(child === null)) document.body.removeChild(child);
    child = document.getElementById("AnimeMusicList");
    if (!(child === null)) document.body.removeChild(child);

    var items = [];
    var BackGround = AlternateColor2;
    for (var i = 0; i < listeA.getNbAnime; ++i) {

        var A = listeA.getAnime(i);
        if (BackGround == AlternateColor2) BackGround = AlternateColor1;
        else BackGround = AlternateColor2;

        items.push("<tr class='grey'><td colspan='7'><div class='tete'>");
        items.push("<div class='_1 grey'>" + A.getNom + "</div>");
        for (var j = 0; j < NB_USERS; j++) {
            items.push("<div class='_" + (j + 2) + " ");
            if (!A.getEtatUser(j)) items.push("no-watch");
            else items.push("watch");
            items.push("'>" + TabStringUsers[j] + "</div>");
        }
        items.push("</div></td></tr>");

        for (var j = 0; j < A.getNbMusic; ++j) {
            var M = A.getMusic(j);
            items.push("<tr class=" + BackGround + ">");

            if (!M.getFavori) items.push("<td class='favo' onclick='modif_fav(" + i + "," + j + ");'>&#10025;</td>");
            else items.push("<td class='favo' onclick='modif_fav(" + i + "," + j + ");'>&#9733;</td>");

            items.push("<td class='nom_anime'>" + A.getNom + "</td>");
            items.push("<td class='type_music'>" + M.getType + "</td>");
            if (M.getNumero) items.push("<td class='numero_music'>" + M.getNumero + "</td>");
            else items.push("<td class='numero_music'></td>");
            items.push("<td class='nom_music'>" + M.getNom + "</td>");
            items.push("<td class='nom_artist'>" + M.getArtist + "</td>");
            items.push("<td class='lien'><a href='" + M.getLien + "' target='_blank'>Lien</td>");

            items.push("</tr>");
        }
    }
    $("<div/>", {
        "id": "info",
        html: "&nbsp;Nb Anime: " + listeA.getNbAnime + " | Nb Musique: " + listeA.getNbMusic
    }).appendTo("body");
    $("<table/>", {
        "id": "AnimeMusicList",
        html: items.join("")
    }).appendTo("body");
}

function affich_fav() {
    if (AffichageFavori) {
        AffichageFavori = false;
        filtre();
    }
    else {
        AffichageFavori = true;
        listeFiltre = fav;
        reset_filtre();

        var child = document.getElementById("info");
        document.body.removeChild(child);
        child = document.getElementById("AnimeMusicList");
        document.body.removeChild(child);

        var items = [];
        var BackGround = AlternateColor2;
        for (var i = 0; i < fav.getNbAnime; ++i) {

            var A = fav.getAnime(i);
            if (BackGround == AlternateColor2) BackGround = AlternateColor1;
            else BackGround = AlternateColor2;

            for (var j = 0; j < A.getNbMusic; ++j) {
                var M = A.getMusic(j);
                items.push("<tr class=" + BackGround + ">");

                if (!M.getFavori) items.push("<td class='favo' onclick='modif_fav(" + i + "," + j + ");'>&#10025;</td>");
                else items.push("<td class='favo' onclick='modif_fav(" + i + "," + j + ");'>&#9733;</td>");

                items.push("<td class='nom_anime'>" + A.getNom + "</td>");
                items.push("<td class='type_music'>" + M.getType + "</td>");
                if (M.getNumero) items.push("<td class='numero_music'>" + M.getNumero + "</td>");
                else items.push("<td class='numero_music'></td>");
                items.push("<td class='nom_music'>" + M.getNom + "</td>");
                items.push("<td class='nom_artist'>" + M.getArtist + "</td>");
                items.push("<td class='lien'><a href='" + M.getLien + "' target='_blank'>Lien</td>");

                items.push("</tr>");
            }
        }
        $("<div/>", {
            "id": "info",
            html: "&nbsp;Nb Anime: " + fav.getNbAnime + " | Nb Musique: " + fav.getNbMusic
        }).appendTo("body");
        $("<table/>", {
            "id": "AnimeMusicList",
            html: items.join("")
        }).appendTo("body");
    }
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
        if (listeA.getAnime(m).getNom > anime.getNom) j = m;
        else if (listeA.getAnime(m).getNom < anime.getNom) i = m + 1;
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

function ajout_fav(i, j) {
    var pos = posAnime(listeFiltre.getAnime(i), fav);
    if (pos == -1 || pos == fav.getNbAnime || !identiqueAnime(fav.getAnime(pos), listeFiltre.getAnime(i))) {
        var A = new Anime(listeFiltre.getAnime(i).getNom, listeFiltre.getAnime(i).getId);
        A.AjouteMusic(listeFiltre.getAnime(i).getMusic(j));
        fav.AjoutePosAnime(A, pos);
    }
    else {
        var posMus = posMusic(listeFiltre.getAnime(i).getMusic(j), fav.getAnime(pos), listeFiltre.getAnime(i));
        if (posMus > -1) fav.getAnime(pos).AjoutePosMusic(listeFiltre.getAnime(i).getMusic(j), posMus);
        fav.IncrementeMusic();
    }
}

function supp_fav(i, j) {
    var posAfav = posAnime(listeFiltre.getAnime(i), fav);
    var posM = posMusic(listeFiltre.getAnime(i).getMusic(j), fav.getAnime(posAfav), listeFiltre.getAnime(i));
    fav.getAnime(posAfav).SupprimePosMusic(posM);
    fav.DecrementeMusic();
    if (fav.getAnime(posAfav).getNbMusic == 0) fav.SupprimePosAnime(posAfav);
}

function modif_fav(i, j) {
    if (!listeFiltre.getAnime(i).getMusic(j).getFavori) ajout_fav(i, j);
    else supp_fav(i, j);
    listeFiltre.getAnime(i).getMusic(j).ModifFavori();
    affich(listeFiltre);
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
        A = listeFiltreAnime.getAnime(i);
        var Abis = new Anime(A.getNom, A.getId);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getType == val) Abis.AjouteMusic(A.getMusic(j));
        if (Abis.getNbMusic > 0) listeA.AjouteAnime(Abis);
    }
    return listeA;
}

function filtre_nomMusic(listeFiltreAnime, val) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        A = listeFiltreAnime.getAnime(i);
        var Abis = new Anime(A.getNom, A.getId);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getNom.toLowerCase().includes(val.toLowerCase())) Abis.AjouteMusic(A.getMusic(j));
        if (Abis.getNbMusic > 0) listeA.AjouteAnime(Abis);
    }
    return listeA;
}

function filtre_nomArtistMusic(listeFiltreAnime, val) {
    var listeA = new ListeAnime();
    for (var i = 0; i < listeFiltreAnime.getNbAnime; ++i) {
        A = listeFiltreAnime.getAnime(i);
        var Abis = new Anime(A.getNom, A.getId);
        for (var j = 0; j < A.getNbMusic; ++j)
            if (A.getMusic(j).getArtist.toLowerCase().includes(val.toLowerCase())) Abis.AjouteMusic(A.getMusic(j));
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
    var listeFiltreAnime = Liste_Anime;

    var val = correctString(filtreNomAnime.value);
    if (val != "") { listeFiltreAnime = filtre_nomAnime(listeFiltreAnime, val); }

    val = filtreTypeMusic.value;
    if (val != "") { listeFiltreAnime = filtre_typeMusic(listeFiltreAnime, val); }

    val = filtreNomMusic.value;
    if (val != "") { listeFiltreAnime = filtre_nomMusic(listeFiltreAnime, val); }

    val = filtreNomArtist.value;
    if (val != "") { listeFiltreAnime = filtre_nomArtistMusic(listeFiltreAnime, val); }

    val = filtreJointure.value;
    if (val == "Union") { listeFiltreAnime = filtre_usersUnion(listeFiltreAnime); }
    else { listeFiltreAnime = filtre_usersIntersection(listeFiltreAnime); }

    affich(listeFiltreAnime);
    listeFiltre = listeFiltreAnime;
}

reset_filtre();
data(NomFicData);
affich(Liste_Anime);