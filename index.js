function data(nom_fic)
{
    $.getJSON(nom_fic, function (data) {
        var items = [];
        var bg = "red";
        $.each(data, function (key, val) {
            $.each(val, function (key, val) {
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
                        else if (key=="nom") items.push("<td>" + val + "</td>");
                    });
                    items.push("</tr>");
                }
            });
        });
        $("<table/>", {
            "class": "AnimeMusicList",
            html: items.join("")
        }).appendTo("body");
    });
}

data("data.json");