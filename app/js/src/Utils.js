var Utils = {};

Utils.loadTextFile = function(url) {
    var result;

    $.ajax({
        url:      url,
        type:     "GET",
        async:    false,
        dataType: "text",
        success:  function(data) {
            result = data;
        }
    });

    return result;
};