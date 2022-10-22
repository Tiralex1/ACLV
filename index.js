function data(nom_fic)
{
    $.getJSON(nom_fic, function (data) {
        var items = [];
        $.each(data, function (key, val) {
            var i = 0;
            items.push("<tr id='" + key + "'>");
            while (val[i] != null) { items.push("<td>" + val[i].nom + "</td>"); i++; }
            items.push("</tr>");
        });

        $("<table/>", {
            "class": "AnimeMusicList",
            html: items.join("")
        }).appendTo("body");
    });
}

data("data.json");