if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

async function init () {
    if (window.location.href.startsWith("https://hypeddit-gates-prod.s3.amazonaws.com/")) {
        document.querySelector("video").pause();
        const a = document.createElement("a");
        a.href = window.location.href;
        a.download = await getFileName(pullId(window.location.href));
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        routeToDownloadPage();
    }
}

function routeToDownloadPage () {
    const getEntryInterval = setInterval(getEntry, 100);
    const getEntryTimeout = setTimeout(() => {
        clearInterval(getEntryInterval);
        window.alert("could not find entry id");
    }, 10000);

    async function getEntry () {
        const entry = performance.getEntriesByType("resource").find(entry => (
            entry.name.startsWith("https://hypeddit-gates-prod.s3.amazonaws.com/") &&
            entry.name.match(/https:\/\/hypeddit-gates-prod\.s3\.amazonaws\.com\/([^_]+)/)[1]
        ));
        if (entry) {
            clearTimeout(getEntryTimeout);
            clearInterval(getEntryInterval);
            const id = pullId(entry.name);

            await setFileName(id);

            window.location = `https://hypeddit-gates-prod.s3.amazonaws.com/${id}_main`;
        }
    }
}

function setFileName(id) {
    const artist = document.querySelector('.sidebar-heading > h1').innerHTML;
    const songTitle = document.querySelector('.sidebar-heading > h2').innerHTML;

    const fn = `${artist} - ${songTitle}`
    const o = {};
    o[id] = fn
    return chrome.storage.session.set(o)
}

function getFileName(id) {

    return chrome.storage.session.get([id]).then(r => {
        return r[id] ?? ''
    })
}

function pullId(s) {
    return s.match(/https:\/\/hypeddit-gates-prod\.s3\.amazonaws\.com\/([^_]+)/)[1];
}