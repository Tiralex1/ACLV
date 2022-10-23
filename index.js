function data(nom_fic)
{
    var j = 0;
    var k = 0;
    var tab_anime, tab_musique;
    $.getJSON(nom_fic, function (data) {
        var items = [];
        var bg = "red";
        $.each(data, function (key, val) {
            if (key == "nb_anime") tab_anime = new Array(val);
            if (key == "anime") {
                $.each(val, function (key, val) {
                    tab_anime[j] = new Array(4);
                    tab_anime[j][0] = val.nom;
                    tab_anime[j][1] = val.id;
                    tab_anime[j][2] = val.nb_musique;
                    tab_anime[j][3] = k;
                    j++;
                    k += val.nb_musique;
                    console.log(tab_anime);
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

data("data.json");

