let nomfic = "data.json"

let nb_anime = 2;
let nb_musique = 6;

let tab_anime = [];
let tab_musique = [];

function data(nom_fic)
{
    var k = 0;
    var l = 0;
    $.getJSON(nom_fic, function (data) {
        $.each(data, function (key, val) {
            if (key == "anime") {
                $.each(val, function (key, val) {
                    var tab_anim = [];
                    tab_anim.push(val.nom);
                    tab_anim.push(val.id);
                    tab_anim.push(val.nb_musique);
                    tab_anim.push(k);
                    tab_anime.push(tab_anim);
                    k += val.nb_musique;
                    for (var i = 0; i < val.nb_musique; ++i) {
                        $.each(val, function (key, val) {
                            if (key == "musique") {
                                tab_musique.push([]);
                                tab_musique[l].push(val[i].type);
                                tab_musique[l].push(val[i].numero);
                                tab_musique[l].push(val[i].nom);
                                tab_musique[l].push(val[i].artiste);
                                tab_musique[l].push(val[i].lien);
                                l++;
                            }
                        });
                    }
                });
            }
        });
    });
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
    console.log(items);
    $("<table/>", {
        "class": "AnimeMusicList",
        html: items.join("")
    }).appendTo("body");
}

data(nomfic);
console.log(tab_anime);
console.log(tab_musique);
console.log(typeof (tab_anime[0][0]));
console.log(typeof (tab_anime[0]));
console.log(tab_anime[0]);
affich();

