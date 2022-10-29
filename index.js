let nomfic = "data.json"

let nb_anime = 0;
let nb_musique = 0;

let naf = document.getElementById("name_anime");

var tab_anime = [];
var tab_musique = [];

let tab = [tab_anime, tab_musique];

const Red = "red";
const Green = "green";

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
                    tab[0][j].push(val.nom);
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
                                tab[1][l].push(val[i].nom);
                                tab[1][l].push(val[i].artiste);
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
            items.push("<td>" + tab_anime[i][0] + "</td>");
            items.push("<td>" + tab_musique[j][0] + "</td>");
            if (tab_musique[j][1] != 0) items.push("<td>" + tab_musique[j][1] + "</td>");
            else items.push("<td></td>");
            items.push("<td>" + tab_musique[j][2] + "</td>");
            items.push("<td>" + tab_musique[j][3] + "</td>");
            if (tab_musique[j][4] != "") items.push("<td><a href='" + tab_musique[j][4] + "' target='_blank'>Lien</td>");
            else items.push("<td>Lien</td>");
            items.push("</tr>");
        }
    }
    $("<table/>", {
        "class": "AnimeMusicList",
        html: items.join("")
    }).appendTo("body");
}

function filtre_naf() {
    var child = document.getElementsByClassName("AnimeMusicList");
    var tab_filtr = [];
    var val = naf.value;
    for (var i = 0; i < tab_anime.length; ++i) {
        if (tab_anime[i][0].startsWith(val)) tab_filtr.push(tab_anime[i]);
    }
    console.log(tab_filtr);
    document.body.removeChild(child);
    affich(tab_filtr, tab[1]);
}

data(nomfic);
affich(tab[0], tab[1]);

naf.addEventListener("change", filtre_naf(tab[0]));

console.log(tab);