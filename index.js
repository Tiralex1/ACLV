function data(nom_fic)
{
    $.getJSON(nom_fic, function (data) {
        var items = [];
        $.each(data, function (key, val) {
            items.push("<tr id='" + key + "'>" + val + "</tr>");
        });

        $("<table/>", {
            "class": "AnimeMusicList",
            html: items.join("")
        }).appendTo("body");
    });
}

data("data.json");