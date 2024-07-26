let score = document.getElementById('files_score');
let marble = document.getElementById('files_marble');
let ambient = document.getElementById('files_ambient');

let downloadNote = document.getElementById('download_note');

archive.addEventListener("click", () => {
    let prog = audio.currentTime;
    location.href = "./archive.html?lang=" + qs + '&t=' + prog});
credits.addEventListener("click", () => {
    let prog = audio.currentTime;
    location.href = "./credits.html?lang=" + qs + '&t=' + prog});
about.addEventListener("click", () => {
    let prog = audio.currentTime;
    location.href = "./about.html?lang=" + qs + '&t=' + prog});

score.addEventListener("mouseenter", () => { downloadNote.style.display = 'flex'; downloadNote.innerHTML = downloadText; });
marble.addEventListener("mouseenter", () => { downloadNote.style.display = 'flex'; downloadNote.innerHTML = downloadText; });
ambient.addEventListener("mouseenter", () => { downloadNote.style.display = 'flex'; downloadNote.innerHTML = downloadText; });
score.addEventListener("mouseleave", () => downloadNote.style.display = 'none');
marble.addEventListener("mouseleave", () => downloadNote.style.display = 'none');
ambient.addEventListener("mouseleave", () => downloadNote.style.display = 'none');

let visualScoreImg, marbleImg, audioWav;
getFromDB("image/png");
getFromDB("image/jpeg");
getFromDB("audio/wav");

const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);

score.addEventListener("click", () => {
    if (assetsLoaded == true) {
        let fileName = "ReConnect_VisualScore_Poster.png";
        save(visualScoreImg, fileName);
    }
    downloadNote.style.display = 'flex';
    if (qs == 'eng') downloadNote.innerHTML = '<b>[visual score]</b> downloaded :)';
    else downloadNote.innerHTML = '<b>[<i>visual score</i>]</b> descarregado :)';
});

marble.addEventListener("click", () => {
    downloadNote.style.display = 'flex';
    if (qs == 'eng') downloadNote.innerHTML = '<b>[marble]</b> downloaded :)';
    else downloadNote.innerHTML = '<b>[berlinde]</b> descarregado :)';
});

ambient.addEventListener("click", () => {
    if(assetsLoaded==true) save(audioWav, 'ReConnect_Ambient_Soundscape.wav');
    downloadNote.style.display = 'flex';
    if (qs == 'eng') downloadNote.innerHTML = '<b>[ambient music]</b> downloaded :)';
    else downloadNote.innerHTML = '<b>[música ambiente]</b> descarregado :)';
});

function save(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function getFromDB(fileType) {
    // IndexedDB
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
        IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
        dbVersion = 1;

    // Create/open database
    var request = indexedDB.open("playerFiles", dbVersion),
        db,
        createObjectStore = function (dataBase) {
            // Create an objectStore
            console.log("Creating objectStore")
            dataBase.createObjectStore("files");
        },

        getFile = function (type) {
            getFromDb(type);
        },
        getFromDb = function (type) {
            // Open a transaction to the database
            var transaction = db.transaction(["files"], "readwrite");

            // Retrieve the file that was just stored
            transaction.objectStore("files").get(type).onsuccess = function (event) {
                var imgFile = event.target.result;
                console.log("Got file!" + imgFile);

                // Create and revoke ObjectURL
                var imgURL = URL.createObjectURL(imgFile);

                if (type == 'image/png') {
                    visualScoreImg = imgFile;
                    score.style.backgroundImage = 'url(' + imgURL + ')';
                }
                else if (type == 'image/jpeg') {
                    marbleImg = imgFile;
                    marble.style.backgroundImage = 'url(' + imgURL + ')';
                }
                else if(type == 'audio/wav'){
                    audioWav = imgFile;
                    assetsLoaded = true;
                }
                // Set img src to ObjectURL
                //var imgDisplay = document.getElementById("elephant");
                //imgDisplay.setAttribute("src", imgURL);
                
            };
        };


    request.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database");
    };

    request.onsuccess = function (event) {
        console.log("Success creating/accessing IndexedDB database");
        db = request.result;

        db.onerror = function (event) {
            console.log("Error creating/accessing IndexedDB database");
        };

        // Interim solution for Google Chrome to create an objectStore. Will be deprecated
        if (db.setVersion) {
            if (db.version != dbVersion) {
                var setVersion = db.setVersion(dbVersion);
                setVersion.onsuccess = function () {
                    createObjectStore(db);
                    getFile(fileType);
                };
            }
            else {
                getFile(fileType);
            }
        }
        else {
            getFile(fileType);
        }
    }

    // For future use. Currently only in latest Firefox versions
    request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
    };
}
