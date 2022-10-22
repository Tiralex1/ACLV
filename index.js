function data(nom_fic)
{
    $.getJSON(nom_fic, function (data) {
        var items = [];
        $.each(data, function (key, val) {
            var i = 0;
            while (val[i] != null) {
                items.push("<tr id='" + i + "'>");
                var j = 0;
                while (val[i].musique[j] != null) { 
                    items.push("<td id='nom_anime'>" + val[i].nom + "</td>");
                    items.push("<td id='type'>" + val[i].musique[j].type + "</td>");
                    items.push("<td id='numero'>" + val[i].musique[j].numero + "</td>");
                    items.push("<td id='nom'>" + val[i].musique[j].nom + "</td>");
                    items.push("<td id='artiste'>" + val[i].musique[j].artiste + "</td>");
                    j++;
                }
                items.push("</tr>");
                i++;
            }
        });

        $("<table/>", {
            "class": "AnimeMusicList",
            html: items.join("")
        }).appendTo("body");
    });
}

data("data.json");