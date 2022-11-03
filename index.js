let nomfic = "data.json"

let nb_anime = 0;
let nb_musique = 0;

let naf = document.getElementById("name_anime");
let typm = document.getElementById("type_music");
let nam = document.getElementById("name_music");
let naa = document.getElementById("name_artist");
let a = document.getElementById("A");
let c = document.getElementById("C");
let l = document.getElementById("L");
let v = document.getElementById("V");

var tab_anime = [];
var tab_musique = [];

let tab = [tab_anime, tab_musique];

const Red = "red";
const Green = "green";

function correctString(str) {
    var string = str.split("<");
    console.log(string + " | " + typeof (string));
    for (var i = 0; i < string.length; ++i) {
        if (string[i] == "<") string[i] = "\<";
    }
    string = string.join();
    string = str.split(">");
    for (var i = 0; i < string.length; ++i) {
        if (string[i] == ">") string[i] = "\>";
    }
    string = string.join();
    return string;
}

function data(nom_fic)
{
    var j = 0;
    var k = 0;
    var l = 0;
    $.ajaxSetup({
        async: false
    });
    $.getJSON(nom_fic, function (data) {
        nb_anime = data.nb_anime;
        nb_musique = data.nb_musique;
        $.each(data, function (key, val) {
            if (key == "anime") {
                $.each(val, function (key, val) {
                    tab[0].push([]);
                    tab[0][j].push(correctString(val.nom));
                    tab[0][j].push(val.id);
                    tab[0][j].push(val.nb_musique);
                    tab[0][j].push(k);
                    tab[0][j].push(val.users[0].A);
                    tab[0][j].push(val.users[0].C);
                    tab[0][j].push(val.users[0].L);
                    tab[0][j].push(val.users[0].V);
                    j++;
                    k += val.nb_musique;
                    for (var i = 0; i < val.nb_musique; ++i) {
                        $.each(val, function (key, val) {
                            if (key == "musique") {
                                tab[1].push([]);
                                tab[1][l].push(val[i].type);
                                tab[1][l].push(val[i].numero);
                                tab[1][l].push(correctString(val[i].nom));
                                tab[1][l].push(correctString(val[i].artiste));
                                tab[1][l].push(val[i].lien);
                                l++;
                            }
                            return tab;
                        });
                    }
                    return tab;
                });
            }
            return tab;
        });
        return tab;
    });
    $.ajaxSetup({
        async: true
    });
}

function affich(tab_anime, tab_musique) {
    var items = [];
    var bg = Red;
    for (var i = 0; i < tab_anime.length; ++i) {
        if (bg == Red) bg = Green;
        else bg = Red;
        var bg_us = 'no-watch';
        items.push("<tr class='grey'><td colspan='6'><div class='tete'><div class='un grey'>" + tab_anime[i][0] + "</div><div class='deux ");
        if (tab_anime[i][4]==0) items.push("no-watch");
        else items.push("watch");
        items.push("'>A</div><div class='trois ");
        if (tab_anime[i][5] == 0) items.push("no-watch");
        else items.push("watch");
        items.push("'>C</div><div class='quatre ");
        if (tab_anime[i][6] == 0) items.push("no-watch");
        else items.push("watch");
        items.push("'>L</div><div class='cinq ");
        if (tab_anime[i][7] == 0) items.push("no-watch");
        else items.push("watch");
        items.push("'>V</div></div></td></tr>");
        for (var j = tab_anime[i][3]; j < tab_anime[i][2] + tab_anime[i][3]; ++j) {
            items.push("<tr class=" + bg + ">");
            items.push("<td class='noman'>" + tab_anime[i][0] + "</td>");
            items.push("<td class='typm'>" + tab_musique[j][0] + "</td>");
            if (tab_musique[j][1] != 0) items.push("<td class='num'>" + tab_musique[j][1] + "</td>");
            else items.push("<td class='num'></td>");
            items.push("<td class='nomm'>" + tab_musique[j][2] + "</td>");
            items.push("<td class='nomart'>" + tab_musique[j][3] + "</td>");
            if (tab_musique[j][4] != "") items.push("<td class='lien'><a href='" + tab_musique[j][4] + "' target='_blank'>Lien</td>");
            else items.push("<td class='lien'>Lien</td>");
            items.push("</tr>");
        }
    }
    $("<table/>", {
        "id": "AnimeMusicList",
        html: items.join("")
    }).appendTo("body");
}

function filtre() {
    var tab_anime = [];
    var tab_musique = [];
    for (var i = 0; i < tab[0].length; ++i) {
        tab_anime.push([]);
        for (var j = 0; j < 8; ++j) {
            tab_anime[i][j] = tab[0][i][j];
        }
    }
    for (var i = 0; i < tab[1].length; ++i) {
        tab_musique.push([]);
        for (var j = 0; j < 5; ++j) {
            tab_musique[i][j] = tab[1][i][j];
        }
    }
    var child = document.getElementById("AnimeMusicList");
    var tab_filtr = [];
    var tab_filtr2 = [];
    var val = naf.value;
    if (val != "") {
        var j = 0;
        for (var i = 0; i < tab_anime.length; ++i) {
            if (tab_anime[i][0].toLowerCase().includes(val.toLowerCase())) {
                for (var k = tab_anime[i][3]; k < tab_anime[i][2] + tab_anime[i][3]; ++k)
                {
                    tab_filtr2.push(tab_musique[k]);
                }
                tab_filtr.push(tab_anime[i]);
                tab_filtr[tab_filtr.length - 1][3] = j;
                j += tab_filtr[tab_filtr.length - 1][2];
            }
        }
        tab_anime = tab_filtr;
        tab_musique = tab_filtr2;
    }
    tab_filtr = [];
    tab_filtr2 = [];
    val = a.checked;
    var val2 = c.checked;
    var val3 = l.checked;
    var val4 = v.checked;
    if (val == false || val2==false || val3 == false || val4 == false) {
        var j = 0;
        for (var i = 0; i < tab_anime.length; ++i) {
            if ((tab_anime[i][4] == true && val == true) || (tab_anime[i][5] == true && val2 == true) || (tab_anime[i][6] == true && val3 == true) || (tab_anime[i][7] == true && val4 == true)) {
                for (var k = tab_anime[i][3]; k < tab_anime[i][2] + tab_anime[i][3]; ++k) {
                    tab_filtr2.push(tab_musique[k]);
                }
                tab_filtr.push(tab_anime[i]);
                tab_filtr[tab_filtr.length - 1][3] = j;
                j += tab_filtr[tab_filtr.length - 1][2];
            }
        }
        tab_anime = tab_filtr;
        tab_musique = tab_filtr2;
    }
    tab_filtr = [];
    tab_filtr2 = [];
    val = nam.value;
    if (val != "") {
        var j = 0;
        for (var i = 0; i < tab_anime.length; ++i) {
            for (var k = tab_anime[i][3]; k < tab_anime[i][2] + tab_anime[i][3]; ++k) {
                if (tab_musique[k][2].toLowerCase().includes(val.toLowerCase())) tab_filtr2.push(tab_musique[k]);
            }
            if (tab_filtr2.length-j > 0) {
                tab_filtr.push(tab_anime[i]);
                tab_filtr[tab_filtr.length - 1][3] = j;
                tab_filtr[tab_filtr.length - 1][2] = tab_filtr2.length - j;
                j += tab_filtr[tab_filtr.length - 1][2];
            }
        }
        tab_anime = tab_filtr;
        tab_musique = tab_filtr2;
    }
    tab_filtr = [];
    tab_filtr2 = [];
    val = naa.value;
    if (val != "") {
        var j = 0;
        for (var i = 0; i < tab_anime.length; ++i) {
            for (var k = tab_anime[i][3]; k < tab_anime[i][2] + tab_anime[i][3]; ++k) {
                if (tab_musique[k][3].toLowerCase().includes(val.toLowerCase())) tab_filtr2.push(tab_musique[k]);
            }
            if (tab_filtr2.length - j > 0) {
                tab_filtr.push(tab_anime[i]);
                tab_filtr[tab_filtr.length - 1][3] = j;
                tab_filtr[tab_filtr.length - 1][2] = tab_filtr2.length - j;
                j += tab_filtr[tab_filtr.length - 1][2];
            }
        }
        tab_anime = tab_filtr;
        tab_musique = tab_filtr2;
    }
    tab_filtr = [];
    tab_filtr2 = [];
    val = typm.value;
    if (val != "") {
        var j = 0;
        for (var i = 0; i < tab_anime.length; ++i) {
            for (var k = tab_anime[i][3]; k < tab_anime[i][2] + tab_anime[i][3]; ++k) {
                if (tab_musique[k][0].toLowerCase().includes(val.toLowerCase())) tab_filtr2.push(tab_musique[k]);
            }
            if (tab_filtr2.length - j > 0) {
                tab_filtr.push(tab_anime[i]);
                tab_filtr[tab_filtr.length - 1][3] = j;
                tab_filtr[tab_filtr.length - 1][2] = tab_filtr2.length - j;
                j += tab_filtr[tab_filtr.length - 1][2];
            }
        }
        tab_anime = tab_filtr;
        tab_musique = tab_filtr2;
    }
    console.log(tab_anime);
    console.log(tab_musique);
    document.body.removeChild(child);
    affich(tab_anime, tab_musique);
}

data(nomfic);
affich(tab[0], tab[1]);
naf.value = "";
nam.value = "";
naa.value = "";
typm.value = "";
a.checked = true;
c.checked = true;
l.checked = true;
v.checked = true;

console.log(tab);