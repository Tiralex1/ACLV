function data(nom_fic)
{
    $.getJSON(nom_fic, function (data) {
        var items = [];
        $.each(data, function (key, val) {
            $.each(val, function (key, val) {
                items.push("<tr id='" + key + "'>");
                $.each(val, function (key, val) {
                    if (key == "musique") {
                        $.each(val, function (key, val) {
                            items.push("<td>" + val + "</td>");
                        });
                    }
                    else items.push("<td>" + val + "</td>");
                });
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