function data(nom_fic)
{
    $.getJSON(nom_fic, function (data) {
        var items = [];
        $.each(data, function (key, val) {
            $.each(val, function (key, val2) {
                items.push("<tr id='" + key + "'>");
                var j = 0;
                while (val2.musique[j] != null) {
                    items.push("<td id='nom_anime'>" + val2.nom + "</td>");
                    items.push("<td id='type'>" + val2.musique[j].type + "</td>");
                    items.push("<td id='numero'>" + val2.musique[j].numero + "</td>");
                    items.push("<td id='nom'>" + val2.musique[j].nom + "</td>");
                    items.push("<td id='artiste'>" + val2.musique[j].artiste + "</td>");
                    j++;
                }
                items.push("</tr>");
            });
        });

        $("<table/>", {
            "class": "AnimeMusicList",
            html: items.join("")
        }).appendTo("body");
    });
}

data("data.json");