let nomfic = "data.json"

function nb_anime_search(nom_fic) {
    var nb_anime = 0;
    $.getJSON(nom_fic, function (key, val) {
        if (key == "nb_anime") nb_anime = val;
    });
    return nb_anime;
}

function nb_musique_search(nom_fic) {
    var nb_music = 0;
    $.getJSON(nom_fic, function (key, val) {
        if (key == "nb_musique") nb_music = val;
    });
    return nb_music;
}

let tab_anime = new Array(nb_anime_search(nomfic));
for (var i = 0; i < tab_anime.length; ++i) {
    tab_anime[i] = new Array(4);
}
let tab_musique = new Array(nb_musique_search(nomfic));
for (var i = 0; i < tab_anime.length; ++i) {
    tab_musique[i] = new Array(5);
}


function data(nom_fic)
{
    var j = 0;
    var k = 0;
    $.getJSON(nom_fic, function (data) {
        var items = [];
        var bg = "red";
        $.each(data, function (key, val) {
            if (key == "anime") {
                $.each(val, function (key, val) {
                    tab_anime[j][0] = val.nom;
                    tab_anime[j][1] = val.id;
                    tab_anime[j][2] = val.nb_musique;
                    tab_anime[j][3] = k;
                    j++;
                    k += val.nb_musique;
                    if (bg == "red") bg = "green";
                    else bg = "red";
                    items.push("<tr class='grey'><td colspan='6'>" + val.nom + "</td></tr>");
                    for (var i = 0; i < val.nb_musique; ++i) {
                        items.push("<tr class=" + bg + ">");
                        $.each(val, function (key, val) {
                            if (key == "musique") {
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
    });
    console.log(tab_anime);
}

data(nomfic);
console.log(tab_anime);
