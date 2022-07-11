if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

function init () {
    if (window.location.href.startsWith("https://hypeddit-gates-prod.s3.amazonaws.com/")) {
        document.querySelector("video").pause();
        const a = document.createElement("a");
        a.href = window.location.href;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        routeToDownloadPage();
    }
}

function routeToDownloadPage () {
    const entry = performance.getEntriesByType("resource").find(entry => (
        entry.name.startsWith("https://hypeddit-gates-prod.s3.amazonaws.com/") &&
        entry.name.match(/https:\/\/hypeddit-gates-prod\.s3\.amazonaws\.com\/([^_]+)/)[1]
    ));
    if (!entry) {
        window.alert("can't find entry");
        return;
    }

    const id = entry.name.match(/https:\/\/hypeddit-gates-prod\.s3\.amazonaws\.com\/([^_]+)/)[1];
    window.location = `https://hypeddit-gates-prod.s3.amazonaws.com/${id}_main`;
}
