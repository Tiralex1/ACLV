function data(nom_fic)
{
    $.getJSON(nom_fic, function (data) {
        var items = [];
        $.each(data, function (key, val) {
            items.push("<tr id='" + key + "'>");
            $.each(val, function (key, val2) {
                $.each(val2, function (key, val3) {
                    items.push("<td id='" + key + "'>" + val3 + "</td>");
                });
            });
            items.push("</tr>");
        });

        $("<table/>", {
            "class": "AnimeMusicList",
            html: items.join("")
        }).appendTo("body");
    });
}

data("data.json");