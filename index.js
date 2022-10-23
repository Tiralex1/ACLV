function data(nom_fic)
{
    $.getJSON(nom_fic, function (data) {
        var items = [];
        $.each(data, function (key, val) {
            $.each(val, function (key, val) {
                items.push("<tr><td colspan='6'>" + val.nom + "</td></tr>");
                for (var i = 0; i < val.nb_musique; ++i) {
                    items.push("<tr id='" + key + "'>");
                    $.each(val, function (key, val) {
                        if (key == "musique") {
                            items.push("<td>" + val[i].type + "</td>");
                            items.push("<td>" + val[i].numero + "</td>");
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