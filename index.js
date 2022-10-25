let nomfic = "data.json"

let nb_anime = 2;
let nb_musique = 6;

var tab_anime = [];
var tab_musique = [];

let tab = [tab_anime, tab_musique];

function data(nom_fic)
{
    var j = 0;
    var k = 0;
    var l = 0;
    $.ajaxSetup({
        async: false
    });
    $.getJSON(nom_fic, function (data) {
        $.each(data, function (key, val) {
            if (key == "anime") {
                $.each(val, function (key, val) {
                    tab[0].push([]);
                    tab[0][j].push(val.nom);
                    tab[0][j].push(val.id);
                    tab[0][j].push(val.nb_musique);
                    tab[0][j].push(k);
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
    var bg = "red";
    for (var i = 0; i < tab_anime.length; ++i) {
        if (bg == "red") bg = "green";
        else bg = "red";
        items.push("<tr class='grey'><td colspan='6'>" + tab_anime[i][0] + "</td></tr>");
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

data(nomfic);
affich(tab[0],tab[1]);

console.log(tab);
console.log(tab[0][0][0]);