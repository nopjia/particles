
var helpBox = document.getElementById("help-box");

var showHelpBox = function(show) {
    if (show) {
        helpBox.classList.remove("hidden");
    }
    else {
        helpBox.classList.add("hidden");
    }
};

// show help box for first time
if (!localStorage["iamnop.particles.helpShown"]) {
    helpBox.classList.remove("hidden");
    localStorage["iamnop.particles.helpShown"] = true;
}

// start app
var app = new App();