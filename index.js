let nomfic = "data.json"

let nb_anime = 2;
let nb_musique = 6;

let tab_anime = new Array(nb_anime);
for (var i = 0; i < tab_anime.length; ++i) {
    tab_anime[i] = new Array(4);
}
let tab_musique = new Array(nb_musique);
for (var i = 0; i < tab_musique.length; ++i) {
    tab_musique[i] = new Array(5);
}


function data(nom_fic)
{
    var j = 0;
    var k = 0;
    var l = 0;
    $.getJSON(nom_fic, function (data) {
        var items = [];
        var tab_anim;
        var bg = "red";
        $.each(data, function (key, val) {
            if (key == "anime") {
                $.each(val, function (key, val) {
                    tab_anim[j][0] = val.nom;
                    tab_anim[j][1] = val.id;
                    tab_anim[j][2] = val.nb_musique;
                    tab_anim[j][3] = k;
                    j++;
                    k += val.nb_musique;
                    if (bg == "red") bg = "green";
                    else bg = "red";
                    items.push("<tr class='grey'><td colspan='6'>" + val.nom + "</td></tr>");
                    for (var i = 0; i < val.nb_musique; ++i) {
                        items.push("<tr class=" + bg + ">");
                        $.each(val, function (key, val) {
                            if (key == "musique") {
                                tab_musique[l][0] = val[i].type;
                                tab_musique[l][1] = val[i].numero;
                                tab_musique[l][2] = val[i].nom;
                                tab_musique[l][3] = val[i].artiste;
                                tab_musique[l][4] = val[i].lien;
                                l++;
                                items.push("<td>" + val[i].type + "</td>");
                                if (val[i].numero != 0) items.push("<td>" + val[i].numero + "</td>");
                                else items.push("<td></td>");
                                items.push("<td>" + val[i].nom + "</td>");
                                items.push("<td>" + val[i].artiste + "</td>");
                                if (val[i].lien != "") items.push("<td><a href='" + val[i].lien + "' target='_blank'>Lien</td>");
                                else items.push("<td>Lien</td>");
                            }
                            else if (key == "nom") items.push("<td>" + val + "</td>");
                        });
                        items.push("</tr>");
                    }
                });
            }
        });
        $("<table/>", {
            "class": "AnimeMusicList",
            html: items.join("")
        }).appendTo("body");
        $(tab_anim).appendTo(tab_anime);
    });
    console.log(tab_anime[0][0]);
}

function affich() {
    var items = [];
    var bg = "red";
    for (var i = 0; i < tab_anime.length; ++i) {
        if (bg == "red") bg = "green";
        else bg = "red";
        items.push("<tr class='grey'><td colspan='6'>" + tab_anime[i][0] + "</td></tr>");
        for (var j = tab_anime[i][3]; j < tab_anime[i][2]; ++j) {
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

var json = JSON.stringify(tab_anime);

console.log(tab_anime);
console.log(tab_musique);
console.log(json);
