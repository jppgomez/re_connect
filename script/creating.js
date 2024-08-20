//buttons appearance change
document.getElementById("play").addEventListener("mouseenter", () => document.getElementById("play_img").src = "./assets/icons/PlayFull.svg");
document.getElementById("play").addEventListener("mouseleave", () => document.getElementById("play_img").src = "./assets/icons/Play.svg");
document.getElementById("pause").addEventListener("mouseenter", () => document.getElementById("pause_img").src = "./assets/icons/PauseFull.svg");
document.getElementById("pause").addEventListener("mouseleave", () => document.getElementById("pause_img").src = "./assets/icons/Pause.svg");
document.getElementById("volume_mute").addEventListener("mouseenter", () => {
    if (document.getElementById("volume_mute").classList.contains("mute")) document.getElementById("volume_img").src = "./assets/icons/VolumeOffFull.svg";
    else document.getElementById("volume_img").src = "./assets/icons/VolumeOnFull.svg";
});
document.getElementById("volume_mute").addEventListener("mouseleave", () => {
    if (document.getElementById("volume_mute").classList.contains("mute")) document.getElementById("volume_img").src = "./assets/icons/VolumeOff.svg";
    else document.getElementById("volume_img").src = "./assets/icons/VolumeOn.svg";
});

//footer button action
let bgAudio = document.getElementById("bg_audio");
document.getElementById("play").addEventListener("click", () => {
    if (bgAudio.paused) bgAudio.play();
});
document.getElementById("pause").addEventListener("click", () => {
    if (!bgAudio.paused) bgAudio.pause();
});
document.getElementById("volume_mute").addEventListener("click", () => {
    if (bgAudio.volume == 0.2) {
        bgAudio.volume = 0;
        document.getElementById("volume_mute").classList.remove("mute");
    }
    else if (bgAudio.volume == 0) {
        bgAudio.volume = 0.2;
        document.getElementById("volume_mute").classList.add("mute");
    }
});



let canvas = document.getElementById("score");

//840x1188
//let cH = (canvas.offsetHeight * 900) / 1080;
//let cW = (cH * 840) / 1188;

//A3 SIZE (print ready) - 3508x4961
let cW = 3508;
let cH = 4961;
let allData, oneData, allClicks;
let playerCaract = [], playerData, playerDataPerGM;
let currentGame = 5;

let maxMin = {
    maxRhythm: -1,
    minRhythm: 0,
    maxConsist: -1,
    minConsist: 1,
    maxEngag: -1,
    minEngag: 0,
    minStabil: 0,
    maxStabil: 1,
    maxDev: -1,
    minDev: 100,
    maxTime: -1,

    maxAvgRhythm: -50000000,
    minAvgRhythm: 50000000,
    maxAvgConsist: -50000000,
    minAvgConsist: 50000000,
    maxAvgEngag: -50000000,
    minAvgEngag: 50000000,
    maxAvgStabil: -1,
    minAvgStabil: 2,
    maxAvgDev: -50000000,
    minAvgDev: 50000000,
}

//graphic score
let scoreSettings = {
    timeDiv: 60, //scale
    numLines: 8,
    lineMarginH: 0,
    lineMarginW: 0,
    lineInterval: 0,
    timeTickHeight: 10,//2.5x4
    tickTimeDiv: 5, //1tick = 5sec
    baseEllipRad: 0,

    diskCenterHeight: 0,
    maxEllipseDiam: 0,
    minEllipseDiam: 0,
    minEngagDesloc: 0,
    maxEngagDesloc: 0,

    maxEllipDev: 8,//2x4

    gridStroke: 2.4,//0.6x4
    gridColor: '#ffffff',
    gridDiv: 8,

    holeSize: 40,//10x4
    holeStroke: 12,//3x4

    maxInsideDeviation: 0,
    insideStroke: 2,//0.5x4
    insideColor: 0,
    maxOutsideDeviation: 0,
    outsideStroke: 4,//1x4
    outsideColor: '#ffffff',

    ellipseSize: 30,//7.5x4
    ellipseStroke: 4,//1x4
    ellipseColor: '#ffffff',
    ellipseStrokeColor: '#0a0a0a',

    pointsLineStroke: 0.8,//0.2x4

    minPointsLineStroke: 1,//0.25x4
    maxPointsLineStroke: 2,//0.5x4
    pointsLineStrokeCol: '#ffffff',

    canvasMultiplier: 210 / 840,
    textGridW: 0,
    textGridH: 0,

    textColor: '#ffffff',
    titleSize: 120,//30x4
    text1Size: 48,//12x4
    text2Size: 10,//1x4
    text3Size: 16,//4x4
    text4Size: 8,//2x4
    textLineStroke: 4,//1x4

}
let scoreTxt = {
    botLeft3: "[visual score]",
    descText3: "this piece is a visual representation of a player's experience throughout the entirety of a play session (sum of eight mini-games). this analysis is done according to five different metrics calculated upon player interactions - presented on the left and further converted into the visual cues - presented above. these five calculated metrics reflect the players' personality in relation to the in-game content (being based on established correlations proposed by game-behavioural theory researchers) and while they can be combined into a more expressive and unified result, they represent singularly the characteristics mentioned above.",
    descText4: "[rhythm]: rate at which the player interacts with in-game assets; \n[consistency]: adoption of unestablished rules that guide the play session \n in a regulated manner; \n[engagement]: lasting intensity of player interaction with a single game mode; \n[stability]: deviation from established consistency, resulting in unexpected interactions; \n[deviation]: relation to other player's data;",
    bottomText4: "play is defined as a free, unproductive, unpredictable and self-contained activity, that consciously lives outside of seriousness and has \n no concrete goal and meaning, present in a variety of creative practices as well as in other aspects of everyday life. [re]connect serves \n as a vehicle  of reflection, appropriation and analysis of this concept, encouraging viewers to engage in more meanigful and expressive \n experiences with the help of digital media technologies.",
    topLeft3: "[re]connect"
}
let robotoThin, robotoMedium;
let bgLayer, rhythmGridLayer, rhythmDrawLayer, consistGridLayer, consistDrawInsideLayer, consistDrawOutsideLayer, engagGridLayer, engagDrawLayer, stabilDrawLayer, textLayer, charCircleLayer;
let re_logo, bgTexture;
let scoreDone = false;

//ambient music
let ambientSettings = {
    metronomePlay: false,
    bpm: 0,
    maxBpm: 60,
    baseScale: [],
    scale: [],
    scaleLocation: [3],
    polarVal: 0,
    polarChar: '',

    clicksPerTime: [],

    chanceOfPlay: 0,
    changeInstrumProb: 3.5, //10% prob of getting 1 strike -> MaxStrike strike = change instrument
    playArpProb: 30,
    playChordProb: 40,

    maxConsistProb: 80,
    minConsistProb: 60,

    maxVoices: 8, //max plyphonic voices for performance issues

    baseTopScaleRhythm: 6,
    rhythmVarTimeMultiply: 10,
    baseTopBassScale: 2,

    consistVarArray: [],
    oscPianoTopScaleLoc: [3],

    maxGrainDetuneRandomness: 1200,

    scaleDeriveOscPiano: 20,

    offClickPlayProb: 15,

    initScaleConsistVar: 2,
    oscConsistTimeMultiply: 4,

    barCount: 0,

    finalBufferLength: 240, //in seconds - 240sec=4min
}
let synths = {
    mainRhythm: 0,
    rhythmVar: 0,
    engag: 0,
    consist: 0,
    stabilBass: 0,
    bassChorus: 0,
    noiseSynth: 0,
    oscPianoSynth: 0,
    grainSynthEngag: 0,
    birdSong: 0,
    vinyl: 0,
    offClickChoir: 0,
    oscConsistPiano: 0,
    vocalSampler: 0,
}
let fadeInTime = {
    master: 0,
    grainSynthEngag: 90, //seconds
    offClickChoir: 45, //seconds
    oscConsistPiano: 60, //bars
    vocalSampler: 130, //seconds
    finalTrack: 5, //seconds
}
let mastering = {
    mainRhythm: -30,
    rhythmVar: -40,
    stabilBass: -30,
    bassChorus: 0,
    noiseSynth: -33,
    oscPianoSynth: -30,
    initGrainSynthEngag: -40,
    endGrainSynthEngag: -30,
    birdSong: -44,
    vinyl: -40,
    offClickChoir: -35,
    oscConsistPiano: -35,
    vocalSampler: -38,
    master: 0
}
let scales = {
    folk: [['C', 'D', 'E', 'F', 'G', 'A', 'B'], ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'], ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'], ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb']],
    pop: [['C', 'D', 'E', 'F', 'G', 'A', 'B'], ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb']],
    jazz: [['C', 'D', 'Eb', 'F', 'G', 'A', 'B'], ['C', 'D', 'E', 'F', 'G', 'G#', 'A', 'B'], ['C', 'Db', 'D#', 'E', 'Gb', 'G#', 'Bb'], ['C', 'D', 'Eb', 'E', 'F#', 'G', 'G#', 'A', 'B']],
    metal: [['C', 'D', 'Eb', 'F', 'G', 'Ab', 'B'], ['C', 'D', 'E', 'G', 'A'], ['C', 'Eb', 'F', 'G', 'Bb']],
    edm: [['C', 'D', 'Eb', 'F', 'G', 'Ab', 'B'], ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb']],
    epic: [['C', 'D', 'E', 'F', 'G', 'A', 'Bb'], ['C', 'D', 'E', 'F#', 'G', 'A', 'B']],
    country: [['C', 'Eb', 'F', 'Gb', 'G', 'Bb'], ['C', 'D', 'E', 'F', 'G', 'A', 'B'], ['C', 'D', 'E', 'G', 'A']],
    punk: [['C', 'D', 'E', 'G', 'A'], ['C', 'Eb', 'F', 'G', 'Bb']],
    blues: [['C', 'D', 'Eb', 'E', 'G', 'A'], ['C', 'Eb', 'F', 'Gb', 'G', 'Bb'], ['C', 'Eb', 'F', 'G', 'Bb']],
    soul: [['C', 'Eb', 'F', 'G', 'Bb'], ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'], ['C', 'Eb', 'F', 'Gb', 'G', 'Bb']],
}//all scales in c major - transpose -3 to a minor
let loaderStatus = {
    buffer: false,
    synths: false,
    noiseLayer: false,
    topRhythm: false,
    engagGranularSynth: false,
    mainRhythm: false,
    oscPianoSynth: false,
    stabilBass: false,
    offClickChoir: false,
    oscConsistPiano: false,
    vocalSampler: false,
    loopLoader: false,
    finalTrack: false,
}
let AudioBuffer, LoadedAudioBuffer = [], BirdSongBuffer, VinylBuffer;
let choirBuffer = [], oscPianoBuffer = [], vocalBuffer = [];
let metronome, finalPlayer, finalBuffer;
let offlineContext;
let dateTime;
let gotData = false;

let progressDiv = document.getElementById("load_prog");
let progressText = document.getElementById("state_text");
let advanceButton = document.getElementById("advance");

let canvasRenderLoaded = false;
let divHeight;

let cnv;

let loaderTime = 0;
let currentProgressLoaderText = 0;

function getJSON(fileType) {
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

                let reader = new FileReader();
                reader.onload = function (event) {
                    const jsonData =
                        JSON.parse(event.target.result);
                    
                    oneData = jsonData;
                    console.log(oneData);
                };
                reader.readAsText(imgFile);



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

function getData() {
    fetch('https://reconnect-server-fe5eed935188.herokuapp.com/')
        .then((res) => res.json())
        .then((json) => {
            allData = json.Data;
            console.log(allData[allData.length - 1]);
            for (let d1 = 0; d1 < allData.length; d1++) {
                playerCaract[d1] = getChars(allData[d1]);
            }

            for (let d3 = 0; d3 < playerCaract.length; d3++) {
                playerCaract[d3].deviationAvg = getDev(playerCaract[d3]).devAvg;
                playerCaract[d3].deviationPerClick = getDev(playerCaract[d3]).devPerClick;
                playerCaract[d3].deviationPerStat = getDev(playerCaract[d3]).devPerStat;

                playerCaract[d3].color = getColor(playerCaract[d3]);
            }

            console.log(allData);

            playerData = getChars(oneData);
            playerData.deviationAvg = getDev(playerData).devAvg;
            playerData.deviationPerClick = getDev(playerData).devPerClick;
            playerData.deviationPerStat = getDev(playerData).devPerStat;
            playerData.color = getColor(playerData);
            currentGame = allData.length;
            //playerData = playerCaract[currentGame];
            //oneData = allData[currentGame];
            //console.log(oneData);

            allClicks = oneData.clicks.true.concat(oneData.clicks.false);
            allClicks.sort((a, b) => a[1] - b[1]);
            allClicks = allClicks.filter(item => item[1] != null || item[4] >= 0)

            allClicks = allClicks.filter(item => item[1] < oneData.finalStats.finalTime + 30);
            //fix gamelength counter error by changing to last click time
            oneData.finalStats.finalTime = allClicks[allClicks.length - 1][1];

            setupScore();
            setupAmbient();
        }).then(gotData = true);
}

function preload() {
    getJSON("application/json");
    //score
    bgTexture = loadImage('./assets/textures/paint.jpg');
    robotoThin = loadFont('./assets/fonts/RobotoMono-Thin.ttf');
    robotoMedium = loadFont('./assets/fonts/RobotoMono-Medium.ttf');
    re_logo = loadImage('./assets/Logo.svg');

    //ambient
    LoadedAudioBuffer[0] = new Tone.ToneAudioBuffer("./assets/sound/GrainPlayer/1.mp3", () => {
        LoadedAudioBuffer[1] = new Tone.ToneAudioBuffer("./assets/sound/GrainPlayer/2.mp3", () => {
            LoadedAudioBuffer[2] = new Tone.ToneAudioBuffer("./assets/sound/GrainPlayer/3.mp3", () => {
                LoadedAudioBuffer[3] = new Tone.ToneAudioBuffer("./assets/sound/GrainPlayer/4.mp3", () => {
                    BirdSongBuffer = new Tone.ToneAudioBuffer("./assets/sound/Birds.mp3", () => {
                        VinylBuffer = new Tone.ToneAudioBuffer("./assets/sound/Vinyl.mp3", () => {
                            choirBuffer[0] = new Tone.ToneAudioBuffer("./assets/sound/Choir/C3.mp3", () => {
                                choirBuffer[1] = new Tone.ToneAudioBuffer("./assets/sound/Choir/E3.mp3", () => {
                                    choirBuffer[2] = new Tone.ToneAudioBuffer("./assets/sound/Choir/G3.mp3", () => {
                                        choirBuffer[3] = new Tone.ToneAudioBuffer("./assets/sound/Choir/B3.mp3", () => {
                                            oscPianoBuffer[0] = new Tone.ToneAudioBuffer("./assets/sound/PianoTape/A3.mp3", () => {
                                                oscPianoBuffer[1] = new Tone.ToneAudioBuffer("./assets/sound/PianoTape/C3.mp3", () => {
                                                    oscPianoBuffer[2] = new Tone.ToneAudioBuffer("./assets/sound/PianoTape/C4.mp3", () => {
                                                        oscPianoBuffer[3] = new Tone.ToneAudioBuffer("./assets/sound/PianoTape/E3.mp3", () => {
                                                            vocalBuffer[0] = new Tone.ToneAudioBuffer("./assets/sound/Vocals/Benzi.mp3", () => {
                                                                vocalBuffer[1] = new Tone.ToneAudioBuffer("./assets/sound/Vocals/Eno.mp3", () => {
                                                                    vocalBuffer[2] = new Tone.ToneAudioBuffer("./assets/sound/Vocals/Fred1.mp3", () => {
                                                                        vocalBuffer[3] = new Tone.ToneAudioBuffer("./assets/sound/Vocals/Fred2.mp3", () => {
                                                                            vocalBuffer[4] = new Tone.ToneAudioBuffer("./assets/sound/Vocals/Huizinga.mp3", () => {
                                                                                vocalBuffer[5] = new Tone.ToneAudioBuffer("./assets/sound/Vocals/Ikeda.mp3", () => {
                                                                                    vocalBuffer[6] = new Tone.ToneAudioBuffer("./assets/sound/Vocals/Refik.mp3", () => {
                                                                                        AudioBuffer = LoadedAudioBuffer[0];
                                                                                        Tone.start();
                                                                                        Tone.Transport.bpm.value = ambientSettings.bpm;
                                                                                        //Tone.Transport.start();

                                                                                        //master volume control
                                                                                        Tone.Destination.volume.value = mastering.master;

                                                                                        loaderStatus.buffer = true;

                                                                                        console.log("Buffers Loaded");

                                                                                        getData();
                                                                                    });
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function setup() {
    getData();
    cnv = createCanvas(cW, cH); //30"x 40" paint canvas
    cnv.parent('score');
    //console.log(cW, cH)

    background('#0a0a0a');
    imageMode(CENTER);

    scoreCreateLayers();
}

function draw() {
    if (loaderStatus.finalTrack == false) {
        if (millis() >= loaderTime + 1000) {
            if (currentProgressLoaderText < progressLoaderText.length - 1) currentProgressLoaderText += 1;
            else currentProgressLoaderText = 0;
            progressText.innerHTML = progressLoaderText[currentProgressLoaderText];
            loaderTime = millis();
        }
    }

    if (playerData != undefined) {
        if (scoreDone == false) showScore();
    }
    else getData();

    if (gotData == true) runAmbient();
}

//graphic score
//setup graphic layout settings
function setupScore() {
    scoreSettings.numLines = int(constrain(map(oneData.finalStats.finalTime, 0, maxMin.maxTime, 3, 9), 3, 9));
    scoreSettings.timeDiv = oneData.finalStats.finalTime / scoreSettings.numLines;

    scoreSettings.ellipseSize = map(scoreSettings.numLines, 3, 9, scoreSettings.ellipseSize, 2 * (scoreSettings.ellipseSize / 3));
    //if (int(oneData.finalStats.finalTime) % scoreSettings.timeDiv == 0) scoreSettings.numLines = int(oneData.finalStats.finalTime / scoreSettings.timeDiv);
    //else scoreSettings.numLines = int(oneData.finalStats.finalTime / scoreSettings.timeDiv) + 1;

    for (let a = 0; a < allClicks.length; a++) {
        if (allClicks[a][1] > oneData.finalStats.finalTime + 50) allClicks.splice(a, a);
    }

    //setup margins
    scoreSettings.lineMarginW = cW / 15;
    scoreSettings.diskCenterHeight = scoreSettings.lineMarginW + ((cW - (scoreSettings.lineMarginW * 2)) / 2);
    scoreSettings.maxEllipseDiam = cW - (2 * scoreSettings.lineMarginW);
    scoreSettings.lineInterval = ((0.95 * scoreSettings.maxEllipseDiam / 2) / (scoreSettings.numLines + 4));
    scoreSettings.minEngagDesloc = -1 * ((scoreSettings.maxEllipseDiam / 2) / 20);
    scoreSettings.maxEngagDesloc = (scoreSettings.maxEllipseDiam / 2) / 20;


    scoreSettings.maxInsideDeviation = scoreSettings.lineInterval;
    scoreSettings.insideColor = playerData.color;
    scoreSettings.maxOutsideDeviation = scoreSettings.lineInterval;

    //set grid division according to number of clicks
    if (playerData.consistencyPerClick.length % 8 == 0) scoreSettings.gridDiv = 8;
    else if (playerData.consistencyPerClick.length % 6 == 0) scoreSettings.gridDiv = 6;
    else if (playerData.consistencyPerClick.length % 4 == 0) scoreSettings.gridDiv = 4;
    else scoreSettings.gridDiv = 2;

    //calculate text size
    //calculate text size
    scoreSettings.titleSize = scoreSettings.titleSize / scoreSettings.canvasMultiplier;
    scoreSettings.text1Size = scoreSettings.text1Size / scoreSettings.canvasMultiplier;
    scoreSettings.text2Size = scoreSettings.text2Size / scoreSettings.canvasMultiplier;
    scoreSettings.text3Size = scoreSettings.text3Size / scoreSettings.canvasMultiplier;
    scoreSettings.text4Size = scoreSettings.text4Size / scoreSettings.canvasMultiplier;

    //calculate text grid size
    scoreSettings.textGridW = (cW - (2 * scoreSettings.lineMarginW)) / 4;
    scoreSettings.textGridH = (cH - (4 * scoreSettings.lineMarginW) - (scoreSettings.maxEllipseDiam)) / 3;
}
//create layers
function scoreCreateLayers() {
    bgLayer = createGraphics(cW, cH);

    rhythmGridLayer = createGraphics(cW, cH);
    rhythmDrawLayer = createGraphics(cW, cH);

    consistGridLayer = createGraphics(cW, cH);
    consistDrawInsideLayer = createGraphics(cW, cH);
    consistDrawOutsideLayer = createGraphics(cW, cH);

    engagGridLayer = createGraphics(cW, cH);
    engagDrawLayer = createGraphics(cW, cH);

    stabilDrawLayer = createGraphics(cW, cH);

    textLayer = createGraphics(cW, cH);

    charCircleLayer = createGraphics(cW, cH);

}
//display final score
function showScore() {
    //background
    tint(100);
    image(bgTexture, cW / 2, cH / 2, bgTexture.width, bgTexture.height);
    noTint();

    drawRhythm();
    drawEngagement();
    drawConsistency();
    drawStability();

    drawText();
    drawCharCircle();
    //noLoop();
    scoreDone = true;
}
//get player characteristics
function getChars(data) {
    let allClicks = data.clicks.true.concat(data.clicks.false);
    allClicks.sort((a, b) => a[1] - b[1]);

    allClicks = allClicks.filter(item => item[1] != null || item[4] >= 0);

    let minSpeed, maxSpeed, minConsist, maxConsist, minEngag = 0, maxEngag = 0, minStabil, maxStabil;

    //get maxClicks length
    if (allClicks.length >= maxMin.maxClicks) maxMin.maxClicks = allClicks.length;
    //get maxGameLength
    if (allClicks[allClicks.length - 1][1] >= maxMin.maxTime) maxMin.maxTime = allClicks[allClicks.length - 1][1];

    //accuracy
    let playerAccuracy = (data.clicks.true.length / (allClicks.length - 1)) * 100;

    //speed and consistency
    let speedSum = 0, consistencySum = 0, consistency = [], speed = [];
    for (let c = 0; c < allClicks.length; c++) {
        if (c == 0) {
            speed[c] = getSpeed(data.device.width / 2, data.device.height / 2, allClicks[c][2], allClicks[c][3], 0, allClicks[c][1]); //calc speed for initial click
            minSpeed = speed[c];
            maxSpeed = speed[c];
            consistency[c] = { consist: 0, lastIncr: 0 };
            minConsist = consistency[c].consist;
            maxConsist = consistency[c].consist;

        }
        else {
            speed[c] = getSpeed(allClicks[c - 1][2], allClicks[c - 1][3], allClicks[c][2], allClicks[c][3], allClicks[c - 1][1], allClicks[c][1]); //calc speed for rest of clicks
            if (speed[c] >= maxSpeed) maxSpeed = speed[c];
            if (speed[c] < minSpeed) minSpeed = speed[c];
            consistency[c] = getConsist(allClicks[c - 1][5], allClicks[c][5], consistency[c - 1]);
            if (consistency[c].consist >= maxConsist) maxConsist = consistency[c].consist;
            if (consistency[c].consist < minConsist) minConsist = consistency[c].consist;
        }

        speedSum += speed[c];
        consistencySum += consistency[c].consist;
    }

    let speedAverage = speedSum / allClicks.length;
    let consistencyAverage = consistencySum / allClicks.length;

    //stability
    let stabilitySum = 0, stability = [];
    for (let s = 0; s < allClicks.length; s++) {
        if (s == 0) {
            stability[s] = 0;
            minStabil = stability[s];
            maxStabil = stability[s];
        }
        else {
            if (consistency[s - 1].lastIncr != consistency[s].lastIncr) stability[s] = 1;
            else stability[s] = 0;
        }
        stabilitySum += stability[s];
        if (stabilitySum >= maxStabil) maxStabil = stabilitySum;
        if (stabilitySum < minStabil) minStabil = stabilitySum;
    }

    let stabilityAverage = stabilitySum / allClicks.length;

    //engagement
    let engagementSum = 0, engagement = [];
    let gmPerS = data.finalStats.gameModes.sort((a, b) => a.finalTime - b.finalTime);
    let gmPerSec = gmPerS.filter(item => item.finalTime != null);
    let clicksPerGM = [];

    for (let g = 0; g < gmPerSec.length; g++) {
        clicksPerGM[g] = allClicks.filter((e) => {
            if (g == 0) return e[1] <= gmPerSec[g].finalTime && e[1] > 0;
            else return e[1] > gmPerSec[g - 1].finalTime && e[1] <= gmPerSec[g].finalTime;
        });
    }
    if (clicksPerGM.length >= 1) {
        for (let e = 0; e < clicksPerGM.length; e++) {
            if (clicksPerGM[e].length == 0) {
                if (e == 0) {
                    engagement[e] = {
                        minTime: 0,
                        maxTime: clicksPerGM[e + 1][0][1],
                        engagement: 0
                    }
                }
                else if (e == clicksPerGM.length - 1) {
                    engagement[e] = {
                        minTime: clicksPerGM[e - 1][clicksPerGM[e - 1].length - 1][1],
                        maxTime: data.finalStats.finalTime,
                        engagement: 0
                    }
                }
                else {
                    engagement[e] = {
                        minTime: clicksPerGM[e - 1][clicksPerGM[e - 1].length - 1][1],
                        maxTime: clicksPerGM[e + 1][0][1],
                        engagement: 0
                    }
                }
            }
            else {
                let engag = getEngagement(clicksPerGM[e].length, clicksPerGM[e][0][1], clicksPerGM[e][clicksPerGM[e].length - 1][1])
                engagement[e] = {
                    minTime: clicksPerGM[e][0][1],
                    maxTime: clicksPerGM[e][clicksPerGM[e].length - 1][1],
                    engagement: engag
                };
            }

            engagementSum += engagement[e].engagement;
        }
    }

    let currentEngagMode = 0;
    let engagementPerClick = [];
    if (scoreSettings.singleGM != true) {
        for (let i = 0; i < allClicks.length; i++) {
            if (allClicks[i][1] > engagement[currentEngagMode].maxTime) {
                if (currentEngagMode < engagement.length - 1) currentEngagMode += 1;
            }

            engagementPerClick[i] = engagement[currentEngagMode];
            if (engagementPerClick[i].engagement >= maxEngag) maxEngag = engagementPerClick[i].engagement;
            if (engagementPerClick[i].engagement < minEngag) minEngag = engagementPerClick[i].engagement;
        }
    }
    else {
        for (let i = 0; i < allClicks.length; i++) {
            engagementPerClick[i] = engagement[currentMode];
            if (engagementPerClick[i].engagement >= maxEngag) maxEngag = engagementPerClick[i].engagement;
            if (engagementPerClick[i].engagement < minEngag) minEngag = engagementPerClick[i].engagement;
        }
    }

    let engagementAverage = engagementSum / clicksPerGM.length;

    //estabilish average limits
    if (speedAverage >= maxMin.maxAvgRhythm) maxMin.maxAvgRhythm = speedAverage;
    else if (speedAverage <= maxMin.minAvgRhythm) maxMin.minAvgRhythm = speedAverage;
    if (consistencyAverage >= maxMin.maxAvgConsist) maxMin.maxAvgConsist = consistencyAverage;
    else if (consistencyAverage <= maxMin.minAvgConsist) maxMin.minAvgConsist = consistencyAverage;
    if (engagementAverage >= maxMin.maxAvgEngag) maxMin.maxAvgEngag = engagementAverage;
    else if (engagementAverage <= maxMin.minAvgEngag) maxMin.minAvgEngag = engagementAverage;
    if (stabilityAverage >= maxMin.maxAvgStabil) maxMin.maxAvgStabil = stabilityAverage;
    else if (stabilityAverage <= maxMin.minAvgStabil) maxMin.minAvgStabil = stabilityAverage;

    let playerChar = {
        numClicks: allClicks.length,
        maxTime: allClicks[allClicks.length - 1][1],
        color: '',
        accuracy: playerAccuracy,
        speedPerClick: speed,
        speedAvg: speedAverage,
        consistencyPerClick: consistency,
        consistencyAvg: consistencyAverage,
        engagementPerGM: engagement,
        engagementPerClick: engagementPerClick,
        engagementAvg: engagementAverage,
        stabilityPerClick: stability,
        stabilityAvg: stabilityAverage,
        deviationPerStat: [],
        deviationAvg: 0,
        deviationPerClick: [],

        maxSp: maxSpeed,
        minSp: minSpeed,
        maxC: maxConsist,
        minC: minConsist,
        maxE: maxEngag,
        minE: minEngag,
        maxSt: maxStabil,
        minSt: minStabil,
    }


    return playerChar;
}
//get characteristics deviation
function getDev(playerChars) {
    //average deviation
    let totalRythmAvg = (maxMin.maxAvgRhythm - maxMin.minAvgRhythm) / 2;
    let totalConsistAvg = (maxMin.maxAvgConsist - maxMin.minAvgConsist) / 2;
    let totalEngagAvg = (maxMin.maxAvgEngag - maxMin.minAvgEngag) / 2;
    let totalStabilAvg = (maxMin.maxAvgStabil - maxMin.minAvgStabil) / 2;


    let devPerStats = {
        rythmDev: (abs(totalRythmAvg - playerChars.speedAvg) / (totalRythmAvg * 2)),
        consistDev: (abs(totalConsistAvg - playerChars.consistencyAvg) / (totalConsistAvg * 2)),
        engagDev: (abs(totalEngagAvg - playerChars.engagementAvg) / (totalEngagAvg * 2)),
        stabilDev: (abs(totalStabilAvg - playerChars.stabilityAvg) / (totalStabilAvg * 2))
    }

    let deviationAverage = (devPerStats.rythmDev + devPerStats.consistDev + devPerStats.engagDev + devPerStats.stabilDev) / 4;

    let deviat = [];
    for (let a = 0; a < playerChars.numClicks; a++) {
        let userSum = (playerChars.speedPerClick[a] + playerChars.consistencyPerClick[a].consist + playerChars.engagementPerClick[a].engagement + playerChars.stabilityPerClick[a]) / 4;
        let avgSum = (totalRythmAvg + totalConsistAvg + totalEngagAvg + totalStabilAvg) / 4;
        deviat[a] = (abs(avgSum - userSum) / (avgSum * 4));

        if (a == 0) {
            playerChars.minD = deviat[a];
            playerChars.maxD = deviat[a];
        }
        else {
            if (deviat[a] >= playerChars.maxD) playerChars.maxD = deviat[a];
            if (deviat[a] < playerChars.minD) playerChars.minD = deviat[a];
        }
    }

    if (deviationAverage >= maxMin.maxAvgDev) maxMin.maxAvgDev = deviationAverage;
    if (deviationAverage <= maxMin.minAvgDev) maxMin.minAvgDev = deviationAverage;

    return dev = {
        devPerClick: deviat,
        devAvg: deviationAverage,
        devPerStat: devPerStats,
    }
}
//get player color
function getColor(playerChars) {
    let playerColor;

    let personas_colors = ['#ffffff', '#e74836', '#60cb77', '#255285', '#48a6b2', '#e7f75a'];  //left, right, down, up
    //white,red,green,darkblue,blue,yellow

    //COLOR MAPPING
    let accuracy_map = constrain(map(playerChars.accuracy, 0, 100, 0, 1), 0, 1);
    let speed_map = constrain(map(playerChars.speedAvg, maxMin.minAvgRhythm, maxMin.maxAvgRhythm, 0, accuracy_map), 0, accuracy_map);
    let consistency_map = constrain(map(playerChars.consistencyAvg, maxMin.minAvgConsist, maxMin.maxAvgConsist, 0, accuracy_map), 0, accuracy_map);
    let engagement_map = constrain(map(playerChars.engagementAvg, maxMin.minAvgEngag, maxMin.maxAvgEngag, 0, accuracy_map), 0, accuracy_map);
    let stability_map = constrain(map(playerChars.stabilityAvg, maxMin.minAvgStabil, maxMin.maxAvgStabil, 0, accuracy_map), 0, accuracy_map);
    let deviation_map = constrain(playerChars.deviationAvg, 0, 1);

    //FINAL COLOR CALCULATION
    let speed_col = chroma.mix(personas_colors[0], personas_colors[1], speed_map).hex();
    let consistency_col = chroma.mix(personas_colors[0], personas_colors[2], consistency_map).hex();
    let engag_col = chroma.mix(personas_colors[0], personas_colors[3], engagement_map).hex();
    let stabil_col = chroma.mix(personas_colors[0], personas_colors[4], stability_map).hex();
    let deviat_col = chroma.mix(personas_colors[0], personas_colors[5], deviation_map).hex();

    let playerColors = [speed_col, consistency_col, engag_col, stabil_col, deviat_col];

    playerColor = chroma.average(playerColors, 'lch', [speed_map, consistency_map, engagement_map, stability_map, deviation_map]).hex();
    //console.log(playerColor);

    return playerColor;
}
//individual stats functions
function getSpeed(c1x, c1y, c2x, c2y, t1, t2) {
    let dist = Math.abs(Math.hypot(c2x - c1x, c2y - c1y));
    let time = t2 - t1;

    if (time == 0) time = 1;

    return Math.abs(dist / time);
}
function getConsist(id1, id2, lastCon) {
    let lastConsist = lastCon.consist;
    let lastInc = lastCon.lastIncr;
    let currentInc;

    if (id1 == undefined) id1 = -1;
    if (id2 == undefined) id2 = -1;

    if (lastInc == -1) {
        if (id2 == id1) currentInc = 0;
        else currentInc = -1;
    }
    else if (lastInc == 1) {
        if (id2 == id1) currentInc = 1;
        else currentInc = 0;

    }
    else if (lastInc == 0) {
        if (id2 == id1) currentInc = 1;
        else currentInc = -1;
    }

    let incConsist;
    if (currentInc > 0) incConsist = lastConsist + 4 * currentInc;
    else incConsist = lastConsist + currentInc

    let retCons = {
        consist: incConsist,
        lastIncr: currentInc,
    }

    return retCons;
}
function getEngagement(numClicks, initTime, finalTime) {
    let duration = finalTime - initTime;
    let sumEng = duration + numClicks;
    return sumEng;
}
//draw rhythm layer - dots
function drawRhythm() {
    let linePoints = [];
    //grid
    for (let l = 0; l < scoreSettings.numLines; l++) {
        rhythmGridLayer.noFill();
        rhythmGridLayer.stroke(scoreSettings.gridColor);
        rhythmGridLayer.strokeWeight(scoreSettings.gridStroke);
        //ellipse radius base
        scoreSettings.baseEllipRad = ((scoreSettings.maxEllipseDiam / 2) / (scoreSettings.numLines + 4));
        //ellipse radius with size variation
        let ellipseRad = scoreSettings.baseEllipRad + (scoreSettings.numLines - l + 2) * scoreSettings.lineInterval;
        rhythmGridLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, ellipseRad * 2, ellipseRad * 2);

        //time ticks
        for (let t = 0; t < scoreSettings.timeDiv; t++) {
            let tickXTop = (cW / 2) + (ellipseRad + scoreSettings.timeTickHeight) * cos(t * (TWO_PI / scoreSettings.timeDiv));
            let tickYTop = (scoreSettings.diskCenterHeight) + (ellipseRad + scoreSettings.timeTickHeight) * sin(t * (TWO_PI / scoreSettings.timeDiv));
            let tickXBot = (cW / 2) + (ellipseRad - scoreSettings.timeTickHeight) * cos(t * (TWO_PI / scoreSettings.timeDiv));
            let tickYBot = (scoreSettings.diskCenterHeight) + (ellipseRad - scoreSettings.timeTickHeight) * sin(t * (TWO_PI / scoreSettings.timeDiv));

            rhythmGridLayer.line(tickXTop, tickYTop, tickXBot, tickYBot);
        }
    }
    //inside circle lines
    for (let t = 0; t < 2 * scoreSettings.timeDiv; t++) {
        let xAng = cos(t * (TWO_PI / (2 * scoreSettings.timeDiv)));
        let yAng = sin(t * (TWO_PI / (2 * scoreSettings.timeDiv)));

        rhythmGridLayer.strokeWeight(scoreSettings.gridStroke / 2);
        //bigger lines (outside)
        if (t % 2) rhythmGridLayer.line((cW / 2) + (scoreSettings.lineMarginW * xAng), scoreSettings.diskCenterHeight + (scoreSettings.lineMarginW * yAng), (cW / 2) + ((scoreSettings.holeSize) * xAng), scoreSettings.diskCenterHeight + ((scoreSettings.holeSize) * yAng));
        else rhythmGridLayer.line((cW / 2) + ((2 * scoreSettings.lineMarginW / 5) * xAng), scoreSettings.diskCenterHeight + ((2 * scoreSettings.lineMarginW / 5) * yAng), (cW / 2) + ((scoreSettings.holeSize) * xAng), scoreSettings.diskCenterHeight + ((scoreSettings.holeSize) * yAng));
        //small lines (inside)
    }

    //center circle - hole
    rhythmGridLayer.strokeWeight(scoreSettings.gridStroke / 4);
    rhythmGridLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, scoreSettings.holeSize, scoreSettings.holeSize);
    //border circle - outside
    rhythmGridLayer.strokeWeight(scoreSettings.gridStroke * 2.5);
    rhythmGridLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, (cW - (scoreSettings.lineMarginW * 2)), (cW - (scoreSettings.lineMarginW * 2)))
    //inside cicles - with player color
    rhythmGridLayer.stroke(playerData.color);
    rhythmGridLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, scoreSettings.lineMarginW * 2, scoreSettings.lineMarginW * 2);
    rhythmGridLayer.strokeWeight(scoreSettings.holeStroke);
    rhythmGridLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, scoreSettings.lineMarginW, scoreSettings.lineMarginW);

    image(rhythmGridLayer, cW / 2, cH / 2);

    //dots
    for (let c = 0; c < allClicks.length; c++) {
        let lineSelect = (floor(allClicks[c][1] / scoreSettings.timeDiv)); //select line
        let baseRad = scoreSettings.baseEllipRad + (scoreSettings.numLines - lineSelect + 2) * scoreSettings.lineInterval; //ellipse radius - base
        //calc desloc with speed - + speed = + desloc
        //console.log(playerData.speedPerClick[c], playerData.minSp, playerData.maxSp);
        let des = playerData.speedAvg - playerData.speedPerClick[c];
        let desloc = constrain(map(des, -playerData.speedAvg, playerData.speedAvg, -scoreSettings.lineInterval / 4, scoreSettings.lineInterval / 4), -scoreSettings.lineInterval / 4, scoreSettings.lineInterval / 4);
        //deviation from second tick - decimal
        let decimalRemainder = (allClicks[c][1] - floor(allClicks[c][1])) * 10;
        //angle according to time (integer - seconds)
        let timeAng = ((floor(allClicks[c][1]) % scoreSettings.timeDiv)) * (TWO_PI / scoreSettings.timeDiv);
        //circle angle
        timeAng = degrees(timeAng) + decimalRemainder;

        //dot coordenates
        let cXT = (cW / 2) + (baseRad + desloc) * cos(radians(timeAng));
        //let cXB = (cW / 2) + (baseRad - desloc) * cos(radians(timeAng));
        let cYT = (scoreSettings.diskCenterHeight) + (baseRad + desloc) * sin(radians(timeAng));
        //let cYB = (scoreSettings.diskCenterHeight) + (baseRad - desloc) * sin(radians(timeAng));

        if (allClicks[c][4] >= 0) { //draw dots
            let point = {
                xT: cXT,
                yT: cYT,
                //xB: cXB,
                //yB: cYB,
                ang: timeAng - decimalRemainder,
                time: allClicks[c][1]
            }
            linePoints.push(point);
        }
    }

    //connecting lines
    rhythmDrawLayer.stroke(scoreSettings.ellipseColor);
    rhythmDrawLayer.strokeWeight(scoreSettings.pointsLineStroke);
    rhythmDrawLayer.noFill();
    for (let m = 0; m < scoreSettings.numLines; m++) {
        for (let p = 0; p < linePoints.length; p++) {
            if (p > 0) { //on draw if distance is less than 30deg and if is on same circle
                if (linePoints[p].ang - linePoints[p - 1].ang <= 30 && floor(linePoints[p].time / scoreSettings.timeDiv) == floor(linePoints[p - 1].time / scoreSettings.timeDiv)) {
                    rhythmDrawLayer.line(linePoints[p].xT, linePoints[p].yT, linePoints[p - 1].xT, linePoints[p - 1].yT);
                    //rhythmDrawLayer.line(linePoints[p].xB, linePoints[p].yB, linePoints[p - 1].xB, linePoints[p - 1].yB);
                }
            }
        }
    }

    //dots layer
    rhythmDrawLayer.strokeWeight(scoreSettings.ellipseStroke);
    for (let c = 0; c < linePoints.length; c++) {
        if (allClicks[c][0] == true) { //on target clicks
            rhythmDrawLayer.fill(scoreSettings.ellipseColor);
            rhythmDrawLayer.stroke(scoreSettings.ellipseStrokeColor);
        }
        else { //off target clicks
            rhythmDrawLayer.stroke(scoreSettings.ellipseColor);
            rhythmDrawLayer.fill(scoreSettings.ellipseStrokeColor);
        }

        if (allClicks[c][4] >= 0) { //draw dots
            //deviation per click
            let sizeDeviat = constrain(map(playerData.deviationPerClick[c], playerData.minD, playerData.maxD, 0, scoreSettings.maxEllipDev), 0, scoreSettings.maxEllipDev);
            rhythmDrawLayer.ellipse(linePoints[c].xT, linePoints[c].yT, scoreSettings.ellipseSize + sizeDeviat, scoreSettings.ellipseSize + sizeDeviat);
            //rhythmDrawLayer.ellipse(linePoints[c].xB, linePoints[c].yB, scoreSettings.ellipseSize, scoreSettings.ellipseSize);
        }
    }
    image(rhythmDrawLayer, cW / 2, cH / 2);
}
//draw consistency layer - outside + inside spikes
function drawConsistency() {
    //grid
    for (let l = 0; l <= scoreSettings.numLines; l++) {
        consistGridLayer.noFill();
        consistGridLayer.stroke(scoreSettings.gridColor);
        consistGridLayer.strokeWeight(scoreSettings.gridStroke);
        //ellipse radius base
        scoreSettings.baseEllipRad = ((cW - scoreSettings.lineMarginW) / scoreSettings.numLines / 1.5) / 2;
        //ellipse radius with size variation
        //let ellipseRad = (cW / 2 - scoreSettings.lineMarginW) - (scoreSettings.numLines + 1 - l) * scoreSettings.baseEllipRad;
        //if (l == 4 || l == 6 || l == 0) consistGridLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, ellipseRad * 2, ellipseRad * 2);
        //max deviation
        scoreSettings.minEllipseDiam = scoreSettings.lineMarginW;
    }
    //inside circle lines
    for (let t = 0; t < scoreSettings.timeDiv; t++) {
        let xAng = cos(t * (TWO_PI / (scoreSettings.timeDiv)));
        let yAng = sin(t * (TWO_PI / (scoreSettings.timeDiv)));

        consistGridLayer.strokeWeight(scoreSettings.gridStroke / 2);
        //bigger lines (outside)
        if (t % 2) consistGridLayer.line((cW / 2) + (scoreSettings.lineMarginW * xAng), scoreSettings.diskCenterHeight + (scoreSettings.lineMarginW * yAng), (cW / 2) + ((scoreSettings.holeSize) * xAng), scoreSettings.diskCenterHeight + ((scoreSettings.holeSize) * yAng));
        else consistGridLayer.line((cW / 2) + ((2 * scoreSettings.lineMarginW / 5) * xAng), scoreSettings.diskCenterHeight + ((2 * scoreSettings.lineMarginW / 5) * yAng), (cW / 2) + ((scoreSettings.holeSize) * xAng), scoreSettings.diskCenterHeight + ((scoreSettings.holeSize) * yAng));
        //small lines (inside)
    }
    consistGridLayer.strokeWeight(scoreSettings.gridStroke / 4);
    for (let v = 0; v < scoreSettings.gridDiv; v++) {
        let minX = cW / 2 + scoreSettings.minEllipseDiam * cos(v * (TWO_PI / scoreSettings.gridDiv));
        let minY = scoreSettings.diskCenterHeight + scoreSettings.minEllipseDiam * sin(v * (TWO_PI / scoreSettings.gridDiv));
        let maxX = cW / 2 + (scoreSettings.maxEllipseDiam / 2) * cos(v * (TWO_PI / scoreSettings.gridDiv));
        let maxY = scoreSettings.diskCenterHeight + (scoreSettings.maxEllipseDiam / 2) * sin(v * (TWO_PI / scoreSettings.gridDiv));

        consistGridLayer.line(minX, minY, maxX, maxY);
    }
    //center circle - hole
    consistGridLayer.strokeWeight(scoreSettings.gridStroke / 4);
    consistGridLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, scoreSettings.holeSize, scoreSettings.holeSize);
    //border circle - outside
    consistGridLayer.strokeWeight(scoreSettings.gridStroke * 2.5);
    consistGridLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, (cW - (scoreSettings.lineMarginW * 2)), (cW - (scoreSettings.lineMarginW * 2)))
    //inside cicles
    consistGridLayer.stroke(scoreSettings.gridColor);
    consistGridLayer.strokeWeight(scoreSettings.holeStroke);
    consistGridLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, scoreSettings.lineMarginW * 2, scoreSettings.lineMarginW * 2);
    consistGridLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, scoreSettings.lineMarginW, scoreSettings.lineMarginW);

    //consistency values
    consistDrawInsideLayer.stroke(scoreSettings.insideColor);
    consistDrawInsideLayer.strokeWeight(scoreSettings.insideStroke);
    consistDrawOutsideLayer.stroke(scoreSettings.outsideColor);
    consistDrawOutsideLayer.strokeWeight(scoreSettings.outsideStroke);
    consistDrawOutsideLayer.noFill();
    //consistDrawOutsideLayer.beginShape();
    for (let c = 0; c < playerData.consistencyPerClick.length; c++) {
        let consist = constrain(map(playerData.consistencyPerClick[c].consist, playerData.minC, playerData.maxC, 0, scoreSettings.maxInsideDeviation), 0, scoreSettings.maxInsideDeviation);
        let lxMax = cW / 2 + (scoreSettings.minEllipseDiam + consist) * cos(c * (TWO_PI / playerData.consistencyPerClick.length));
        let lyMax = scoreSettings.diskCenterHeight + (scoreSettings.minEllipseDiam + consist) * sin(c * (TWO_PI / playerData.consistencyPerClick.length));
        let lxMin = cW / 2 + (scoreSettings.minEllipseDiam) * cos(c * (TWO_PI / playerData.consistencyPerClick.length));
        let lyMin = scoreSettings.diskCenterHeight + (scoreSettings.minEllipseDiam) * sin(c * (TWO_PI / playerData.consistencyPerClick.length));

        consistDrawInsideLayer.line(lxMin, lyMin, lxMax, lyMax);

        let consistVar = constrain(map(playerData.consistencyPerClick[c].lastIncr, -2, 2, 0, scoreSettings.maxOutsideDeviation), 0, scoreSettings.maxOutsideDeviation);
        let oxMin = cW / 2 + ((scoreSettings.maxEllipseDiam / 2) - consistVar) * cos(c * (TWO_PI / playerData.consistencyPerClick.length));
        let oyMin = scoreSettings.diskCenterHeight + ((scoreSettings.maxEllipseDiam / 2) - consistVar) * sin(c * (TWO_PI / playerData.consistencyPerClick.length));
        let oxMax = cW / 2 + (scoreSettings.maxEllipseDiam / 2) * cos(c * (TWO_PI / playerData.consistencyPerClick.length));
        let oyMax = scoreSettings.diskCenterHeight + (scoreSettings.maxEllipseDiam / 2) * sin(c * (TWO_PI / playerData.consistencyPerClick.length));

        //let oxMin2 = cW / 2 + ((scoreSettings.maxEllipseDiam / 3) - consistVar) * cos(c * (TWO_PI / playerData.consistencyPerClick.length));
        //let oyMin2 = scoreSettings.diskCenterHeight + ((scoreSettings.maxEllipseDiam / 3) - consistVar) * sin(c * (TWO_PI / playerData.consistencyPerClick.length));

        consistDrawOutsideLayer.line(oxMin, oyMin, oxMax, oyMax);
        //consistDrawOutsideLayer.curveVertex(oxMin2, oyMin2);
    }
    //consistDrawOutsideLayer.endShape(CLOSE);
    consistDrawInsideLayer.noFill();
    consistDrawInsideLayer.stroke(scoreSettings.gridColor);
    consistDrawInsideLayer.strokeWeight(scoreSettings.holeStroke);
    consistDrawInsideLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, scoreSettings.lineMarginW * 2, scoreSettings.lineMarginW * 2);

    image(consistGridLayer, cW / 2, cH / 2);
    image(consistDrawInsideLayer, cW / 2, cH / 2);
    image(consistDrawOutsideLayer, cW / 2, cH / 2);
}
//draw engagement layer - fluid lines
function drawEngagement() {
    //grid
    for (let l = 0; l <= scoreSettings.numLines; l++) {
        engagGridLayer.noFill();
        engagGridLayer.stroke(scoreSettings.gridColor);
        engagGridLayer.strokeWeight(scoreSettings.gridStroke);
        //ellipse radius base
        scoreSettings.baseEllipRad = ((cW - scoreSettings.lineMarginW) / scoreSettings.numLines / 1.5) / 2;
        //ellipse radius with size variation
        let ellipseRad = (cW / 2 - scoreSettings.lineMarginW) - (scoreSettings.numLines + 1 - l) * scoreSettings.baseEllipRad;
        if (l == 0 || l == scoreSettings.numLines) engagGridLayer.ellipse(cW / 2, scoreSettings.diskCenterHeight, ellipseRad * 2, ellipseRad * 2);

        if (l != 0) {
            //time ticks
            engagGridLayer.strokeWeight(scoreSettings.gridStroke / 10);
            for (let t = 0; t < scoreSettings.timeDiv; t++) {
                let maxEllipseRad = (cW / 2 - scoreSettings.lineMarginW) - (scoreSettings.numLines + 1 - 0) * scoreSettings.baseEllipRad;
                let minEllipseRad = (cW / 2 - scoreSettings.lineMarginW) - (1) * scoreSettings.baseEllipRad;
                let tickXTop = (cW / 2) + (maxEllipseRad) * cos(t * (TWO_PI / scoreSettings.timeDiv));
                let tickYTop = (scoreSettings.diskCenterHeight) + (maxEllipseRad) * sin(t * (TWO_PI / scoreSettings.timeDiv));
                let tickXBot = (cW / 2) + (minEllipseRad) * cos(t * (TWO_PI / scoreSettings.timeDiv));
                let tickYBot = (scoreSettings.diskCenterHeight) + (minEllipseRad) * sin(t * (TWO_PI / scoreSettings.timeDiv));

                engagGridLayer.line(tickXTop, tickYTop, tickXBot, tickYBot);
            }
        }
        else {
            //inside circle lines
            for (let t = 0; t < 2 * scoreSettings.timeDiv; t++) {
                let xAng = cos(t * (TWO_PI / (2 * scoreSettings.timeDiv)));
                let yAng = sin(t * (TWO_PI / (2 * scoreSettings.timeDiv)));

                engagGridLayer.strokeWeight(scoreSettings.gridStroke / 2);
                //bigger lines (outside)
                if (t % 2) engagGridLayer.line((cW / 2) + (scoreSettings.lineMarginW * xAng), scoreSettings.diskCenterHeight + (scoreSettings.lineMarginW * yAng), (cW / 2) + ((scoreSettings.holeSize) * xAng), scoreSettings.diskCenterHeight + ((scoreSettings.holeSize) * yAng));
                else engagGridLayer.line((cW / 2) + ((2 * scoreSettings.lineMarginW / 5) * xAng), scoreSettings.diskCenterHeight + ((2 * scoreSettings.lineMarginW / 5) * yAng), (cW / 2) + ((scoreSettings.holeSize) * xAng), scoreSettings.diskCenterHeight + ((scoreSettings.holeSize) * yAng));
                //small lines (inside)
            }
        }
    }
    //image(engagGridLayer,cW/2,cH/2);

    //engag line
    engagDrawLayer.noFill();
    engagDrawLayer.stroke(scoreSettings.pointsLineStrokeCol);
    for (let m = 0; m < playerData.engagementPerGM.length; m++) {
        engagDrawLayer.strokeWeight(random(scoreSettings.minPointsLineStroke, scoreSettings.maxPointsLineStroke));
        let curveV = [];
        engagDrawLayer.beginShape();
        for (let g = 0; g < playerData.engagementPerGM.length; g++) {
            let desloc = random(-playerData.engagementPerGM[g].engagement, playerData.engagementPerGM[g].engagement);
            desloc = constrain(map(desloc, playerData.minE, playerData.maxE, scoreSettings.minEngagDesloc, scoreSettings.maxEngagDesloc), scoreSettings.minEngagDesloc, scoreSettings.maxEngagDesloc);
            let avgTime = playerData.engagementPerGM[g].minTime + ((playerData.engagementPerGM[g].maxTime - playerData.engagementPerGM[g].minTime) / 2);
            let dotAngle;
            if (scoreSettings.singleGM == true) dotAngle = map(avgTime, 0, oneData.finalStats.finalTime, 0, TWO_PI);
            else dotAngle = map(avgTime, allClicks[0][1], oneData.finalStats.finalTime, 0, TWO_PI);
            let vX = (cW / 2) + ((scoreSettings.lineInterval * 3) + desloc) * cos(dotAngle);
            let vY = (scoreSettings.diskCenterHeight) + ((scoreSettings.lineInterval * 3) + desloc) * sin(dotAngle);
            vX = constrain(vX, cW / 2 - (scoreSettings.maxEllipseDiam / 2), cW / 2 + (scoreSettings.maxEllipseDiam / 2));
            vY = constrain(vY, scoreSettings.diskCenterHeight - (scoreSettings.maxEllipseDiam / 2), scoreSettings.diskCenterHeight + (scoreSettings.maxEllipseDiam / 2));
            engagDrawLayer.curveVertex(vX, vY);
            curveV.push({ xx: vX, yy: vY });
        }
        for (let v = 0; v < curveV.length; v++) {
            engagDrawLayer.curveVertex(curveV[v].xx, curveV[v].yy);
        }
        engagDrawLayer.endShape();
    }

    image(engagDrawLayer, cW / 2, cH / 2);
}
//draw stability layer - spikes inside middle circle
function drawStability() {
    stabilDrawLayer.noFill();
    stabilDrawLayer.stroke(scoreSettings.pointsLineStrokeCol);
    stabilDrawLayer.strokeWeight(scoreSettings.minPointsLineStroke);
    for (let s = 0; s < playerData.stabilityPerClick.length; s++) {
        if (playerData.stabilityPerClick[s] == 1) {
            let sXM = cW / 2 + (0.8 * scoreSettings.lineMarginW) * cos(s * (TWO_PI / playerData.stabilityPerClick.length));
            let sYM = scoreSettings.diskCenterHeight + (0.8 * scoreSettings.lineMarginW) * sin(s * (TWO_PI / playerData.stabilityPerClick.length));
            let sXm = cW / 2 + (scoreSettings.lineMarginW / 2) * cos(s * (TWO_PI / playerData.stabilityPerClick.length));
            let sYm = scoreSettings.diskCenterHeight + (scoreSettings.lineMarginW / 2) * sin(s * (TWO_PI / playerData.stabilityPerClick.length));
            stabilDrawLayer.line(sXm, sYm, sXM, sYM);
        }
    }
    image(stabilDrawLayer, cW / 2, cH / 2);
}
//draw text and extra graphics layer
function drawText() {

    //graphics
    textLayer.strokeWeight(scoreSettings.textLineStroke);
    textLayer.stroke(scoreSettings.textColor);
    //top line
    textLayer.line(scoreSettings.lineMarginW, (cW - (2 * scoreSettings.lineMarginW)) + (2 * scoreSettings.lineMarginW), cW - scoreSettings.lineMarginW, (cW - (2 * scoreSettings.lineMarginW)) + (2 * scoreSettings.lineMarginW));
    //bottom line
    textLayer.line(scoreSettings.lineMarginW, cH - (1.5 * scoreSettings.lineMarginW), cW - scoreSettings.lineMarginW, cH - (1.5 * scoreSettings.lineMarginW));

    //guide for logo align
    //textLayer.line(scoreSettings.lineMarginW, ((cW - (2 * scoreSettings.lineMarginW)) + (2 * scoreSettings.lineMarginW)) - (scoreSettings.lineMarginW/2), cW - scoreSettings.lineMarginW, ((cW - (2 * scoreSettings.lineMarginW)) + (2 * scoreSettings.lineMarginW)) - (scoreSettings.lineMarginW/2));

    //graphics //text
    textLayer.fill(scoreSettings.textColor);
    textLayer.noStroke();
    textLayer.textSize(scoreSettings.text3Size);
    textLayer.textFont(robotoThin);
    //top left
    textLayer.textAlign(LEFT, TOP);
    textLayer.text(scoreTxt.topLeft3, scoreSettings.lineMarginW, scoreSettings.lineMarginW);
    //top right
    textLayer.textAlign(RIGHT, TOP);
    let indexText;
    if (currentGame < 10) {
        if (allData.length < 10) indexText = "[0" + (currentGame) + "/0" + (allData.length) + "]";
        else indexText = "[0" + (currentGame) + "/" + (allData.length) + "]";
    }
    else indexText = "[" + currentGame + "/" + allData.length + "]";
    textLayer.text(indexText, cW - scoreSettings.lineMarginW, scoreSettings.lineMarginW);
    //bottom left
    textLayer.textAlign(LEFT, BOTTOM);
    textLayer.text(scoreTxt.botLeft3, scoreSettings.lineMarginW, ((cW - (2 * scoreSettings.lineMarginW)) + (2 * scoreSettings.lineMarginW)) - (scoreSettings.lineMarginW / 2));
    //logo
    textLayer.imageMode(CORNER);
    textLayer.image(re_logo, (cW - scoreSettings.lineMarginW) - (scoreSettings.lineMarginW), ((cW - (2 * scoreSettings.lineMarginW)) + (2 * scoreSettings.lineMarginW)) - (1.75 * scoreSettings.lineMarginW), scoreSettings.lineMarginW, ((scoreSettings.lineMarginW) * re_logo.height) / re_logo.width);

    ///bottom text - play
    textLayer.textSize(scoreSettings.text4Size);
    textLayer.textAlign(CENTER, CENTER);
    textLayer.text(scoreTxt.bottomText4, scoreSettings.lineMarginW, cH - (1.4 * scoreSettings.lineMarginW), cW - (2 * scoreSettings.lineMarginW), scoreSettings.lineMarginW);

    //center description
    textLayer.textSize(scoreSettings.text2Size);
    textLayer.textAlign(LEFT, CENTER);
    textLayer.text(scoreTxt.descText4 + '\n' + scoreTxt.descText3, 1.5 * scoreSettings.textGridW, ((((cW - (2 * scoreSettings.lineMarginW)) + (2 * scoreSettings.lineMarginW)) + (cH - (1.5 * scoreSettings.lineMarginW))) / 2) - scoreSettings.textGridW / 2, 2.8 * scoreSettings.textGridW, scoreSettings.textGridW);

    image(textLayer, cW / 2, cH / 2);
}
//draw extra elements - values circle below
function drawCharCircle() {
    charCircleLayer.noFill();
    charCircleLayer.strokeWeight(scoreSettings.textLineStroke);
    charCircleLayer.stroke(scoreSettings.textColor);
    charCircleLayer.ellipseMode(CENTER);
    let circX = scoreSettings.lineMarginW + (scoreSettings.textGridW / 2);
    let circY = (((cW - (2 * scoreSettings.lineMarginW)) + (2 * scoreSettings.lineMarginW)) + (cH - (1.5 * scoreSettings.lineMarginW))) / 2;
    charCircleLayer.ellipse(circX, circY, scoreSettings.textGridW, scoreSettings.textGridW)
    charCircleLayer.strokeWeight(scoreSettings.textLineStroke / 4);
    for (let i = 0; i < 4; i++) {
        let sz = i * (scoreSettings.textGridW / 4);
        charCircleLayer.ellipse(circX, circY, sz, sz);
    }
    for (let d = 0; d < 5; d++) {
        let ang = d * (TWO_PI / 5);
        let px1 = circX + (scoreSettings.textGridW / 8) * cos(ang);
        let px2 = circX + (scoreSettings.textGridW / 2) * cos(ang);
        let py1 = circY + (scoreSettings.textGridW / 8) * sin(ang);
        let py2 = circY + (scoreSettings.textGridW / 2) * sin(ang);
        charCircleLayer.line(px1, py1, px2, py2);
    }

    let rytMap = constrain(map(playerData.speedAvg, maxMin.minAvgRhythm, maxMin.maxAvgRhythm, scoreSettings.textGridW / 8, scoreSettings.textGridW / 2), scoreSettings.textGridW / 8, scoreSettings.textGridW / 2);
    let consistMap = constrain(map(playerData.consistencyAvg, maxMin.minAvgConsist, maxMin.maxAvgConsist, scoreSettings.textGridW / 8, scoreSettings.textGridW / 2), scoreSettings.textGridW / 8, scoreSettings.textGridW / 2);
    let engagMap = constrain(map(playerData.engagementAvg, maxMin.minAvgEngag, maxMin.maxAvgEngag, scoreSettings.textGridW / 8, scoreSettings.textGridW / 2), scoreSettings.textGridW / 8, scoreSettings.textGridW / 2);
    let stabilMap = constrain(map(playerData.stabilityAvg, maxMin.minAvgStabil, maxMin.maxAvgStabil, scoreSettings.textGridW / 8, scoreSettings.textGridW / 2), scoreSettings.textGridW / 8, scoreSettings.textGridW / 2);
    let devMap = constrain(map(playerData.deviationAvg, maxMin.minAvgDev, maxMin.maxAvgDev, scoreSettings.textGridW / 8, scoreSettings.textGridW / 2), scoreSettings.textGridW / 8, scoreSettings.textGridW / 2);

    charCircleLayer.noStroke();
    let pxR = circX + rytMap * cos(0);
    let pyR = circY + rytMap * sin(0);
    //consistency
    let pxC = circX + consistMap * cos(TWO_PI / 5);
    let pyC = circY + consistMap * sin(TWO_PI / 5);
    //engagement
    let pxE = circX + engagMap * cos(2 * TWO_PI / 5);
    let pyE = circY + engagMap * sin(2 * TWO_PI / 5);
    //stability
    let pxS = circX + stabilMap * cos(3 * TWO_PI / 5);
    let pyS = circY + stabilMap * sin(3 * TWO_PI / 5);
    //deviation
    let pxD = circX + devMap * cos(4 * TWO_PI / 5);
    let pyD = circY + devMap * sin(4 * TWO_PI / 5);

    charCircleLayer.noFill();
    charCircleLayer.strokeWeight(scoreSettings.textLineStroke);
    charCircleLayer.stroke(scoreSettings.textColor);
    charCircleLayer.beginShape();
    charCircleLayer.vertex(pxR, pyR);
    charCircleLayer.vertex(pxC, pyC);
    charCircleLayer.vertex(pxE, pyE);
    charCircleLayer.vertex(pxS, pyS);
    charCircleLayer.vertex(pxD, pyD);
    charCircleLayer.endShape(CLOSE);

    let accMap = constrain(map(playerData.accuracy, 0, 100, scoreSettings.textGridW / 4, scoreSettings.textGridW), scoreSettings.textGridW / 4, scoreSettings.textGridW);
    charCircleLayer.noFill();
    charCircleLayer.strokeWeight(scoreSettings.textLineStroke / 2);
    charCircleLayer.stroke(playerData.color);
    charCircleLayer.ellipse(circX, circY, accMap, accMap);

    charCircleLayer.stroke(scoreSettings.textColor);
    charCircleLayer.strokeWeight(scoreSettings.textLineStroke);

    //rhythm
    charCircleLayer.fill('#e74836');
    charCircleLayer.ellipse(pxR, pyR, scoreSettings.ellipseSize, scoreSettings.ellipseSize);
    //consistency
    charCircleLayer.fill('#60cb77');
    charCircleLayer.ellipse(pxC, pyC, scoreSettings.ellipseSize, scoreSettings.ellipseSize);
    //engagement
    charCircleLayer.fill('#255285');
    charCircleLayer.ellipse(pxE, pyE, scoreSettings.ellipseSize, scoreSettings.ellipseSize);
    //stability
    charCircleLayer.fill('#48a6b2');
    charCircleLayer.ellipse(pxS, pyS, scoreSettings.ellipseSize, scoreSettings.ellipseSize);
    //deviation
    charCircleLayer.fill('#e7f754');
    charCircleLayer.ellipse(pxD, pyD, scoreSettings.ellipseSize, scoreSettings.ellipseSize);
    //resulting color
    charCircleLayer.fill(playerData.color);
    charCircleLayer.ellipse(circX, circY, scoreSettings.ellipseSize, scoreSettings.ellipseSize);

    image(charCircleLayer, cW / 2, cH / 2);
}

//ambient music
//define settings
function setupAmbient() {
    ambientSettings.bpm = int(constrain(map(allClicks.length / oneData.finalStats.finalTime, 0, 4, 10, ambientSettings.maxBpm), 10, ambientSettings.maxBpm));
    console.log('BPM: ' + ambientSettings.bpm);

    //map all chars to 100%
    let rhythmMap = constrain(map(playerData.speedAvg, maxMin.minAvgRhythm, maxMin.maxAvgRhythm, 0, 100), 0, 100);
    let consistMap = constrain(map(playerData.consistencyAvg, maxMin.minAvgConsist, maxMin.maxAvgConsist, 0, 100), 0, 100);
    let engagMap = constrain(map(playerData.engagementAvg, maxMin.minAvgEngag, maxMin.maxAvgEngag, 0, 100), 0, 100);
    let devMap = constrain(map(playerData.deviationAvg, 0, 1, 0, 100), 0, 100);
    let stabilMap = constrain(map(playerData.stabilityAvg, maxMin.minAvgStabil, maxMin.maxAvgStabil, 0, 100), 0, 100);

    if (abs(rhythmMap - 50) >= ambientSettings.polarVal) {
        ambientSettings.polarVal = abs(rhythmMap - 50);
        if (rhythmMap - 50 <= 0) ambientSettings.polarChar = 'rhythmMin';
        else ambientSettings.polarChar = 'rhythmMax';
    }
    else if (abs(consistMap - 50) > ambientSettings.polarVal) {
        ambientSettings.polarVal = abs(consistMap - 50);
        if (consistMap - 50 <= 0) ambientSettings.polarChar = 'consistMin';
        else ambientSettings.polarChar = 'consistMax';
    }
    else if (abs(engagMap - 50) > ambientSettings.polarVal) {
        ambientSettings.polarVal = abs(engagMap - 50);
        if (engagMap - 50 <= 0) ambientSettings.polarChar = 'engagMin';
        else ambientSettings.polarChar = 'engagMax';
    }
    else if (abs(devMap - 50) > ambientSettings.polarVal) {
        ambientSettings.polarVal = abs(devMap - 50);
        if (devMap - 50 <= 0) ambientSettings.polarChar = 'devMin';
        else ambientSettings.polarChar = 'devMax';
    }
    else if (abs(stabilMap - 50) > ambientSettings.polarVal) {
        ambientSettings.polarVal = abs(stabilMap - 50);
        if (stabilMap - 50 <= 0) ambientSettings.polarChar = 'stabilMin';
        else ambientSettings.polarChar = 'stabilMax';
    }

    //scale selection
    if (ambientSettings.polarChar == 'rhythmMin') ambientSettings.baseScale = scales.epic[floor(random(scales.epic.length))];
    else if (ambientSettings.polarChar == 'rhythmMax') ambientSettings.baseScale = scales.edm[floor(random(scales.edm.length))];
    else if (ambientSettings.polarChar == 'consistMin') ambientSettings.baseScale = scales.pop[floor(random(scales.pop.length))];
    else if (ambientSettings.polarChar == 'consistMax') ambientSettings.baseScale = scales.folk[floor(random(scales.folk.length))];
    else if (ambientSettings.polarChar == 'engagMin') ambientSettings.baseScale = scales.punk[floor(random(scales.punk.length))];
    else if (ambientSettings.polarChar == 'engagMax') ambientSettings.baseScale = scales.country[floor(random(scales.country.length))];
    else if (ambientSettings.polarChar == 'devMin') ambientSettings.baseScale = scales.metal[floor(random(scales.metal.length))];
    else if (ambientSettings.polarChar == 'devMax') ambientSettings.baseScale = scales.jazz[floor(random(scales.jazz.length))];
    else if (ambientSettings.polarChar == 'stabilMin') ambientSettings.baseScale = scales.soul[floor(random(scales.soul.length))];
    else if (ambientSettings.polarChar == 'stabilMax') ambientSettings.baseScale = scales.blues[floor(random(scales.blues.length))];
    ambientSettings.scale = ambientSettings.baseScale;
    console.log('Scale: ' + ambientSettings.scale);

    //group clicks per time
    let currentEngag = 0;
    for (let c = 0; c < allClicks.length; c++) {
        if (allClicks[c][1] && allClicks[c][1] > playerData.engagementPerGM[currentEngag].maxTime && currentEngag < playerData.engagementPerGM.length - 1) currentEngag++;

        if (allClicks[c][1]) {
            if (!ambientSettings.clicksPerTime[floor(allClicks[c][1])]) {
                ambientSettings.clicksPerTime[floor(allClicks[c][1])] = [];
                ambientSettings.clicksPerTime[floor(allClicks[c][1])].push([c, allClicks[c][1], playerData.speedPerClick[c], playerData.consistencyPerClick[c], playerData.engagementPerGM[currentEngag].engagement, playerData.deviationPerClick[c], playerData.stabilityPerClick[c]]);
            }
            else {
                ambientSettings.clicksPerTime[floor(allClicks[c][1])].push([c, allClicks[c][1], playerData.speedPerClick[c], playerData.consistencyPerClick[c], playerData.engagementPerGM[currentEngag].engagement, playerData.deviationPerClick[c], playerData.stabilityPerClick[c]]);
            }
        }
    }

    //loop playback
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = playerData.maxTime;
}
//create ambient
function runAmbient() {
    if (loaderStatus.buffer == true && loaderStatus.synths == false) {
        Tone.Offline((context) => {
            offlineContext = context;
            context.transport.bpm.value = ambientSettings.bpm;
            context.transport.loop = true;
            context.transport.loopStart = 0;
            context.transport.loopEnd = playerData.maxTime;
            createSynths(context);

        }, ambientSettings.finalBufferLength).then((buffer) => {
            //console.log(offlineContext);
            console.log(buffer);
            finalBufer = buffer;

            /*finalPlayer = new Tone.Player(buffer).toDestination();
            finalPlayer.fadeIn = fadeInTime.finalTrack;
            finalPlayer.fadeOut = fadeInTime.finalTrack;
            finalPlayer.loop = true;
            finalPlayer.start();
            */
            loaderStatus.finalTrack = true;


            if (qs == 'prt') progressText.innerHTML = 'carregado :)';
            else progressText.innerHTML = 'loaded :)';
            progressDiv.style.width = '100%';
            //console.log(int(frameCount / frameRate()));

            let cv = document.querySelector("canvas")
            let canvasBlob = cv.toBlob((blob) => {
                console.log(blob);
                uploadToDb(blob);
            });

            let wavBlob = bufferToWave(buffer, buffer.length);
            console.log(wavBlob);
            uploadToDb(wavBlob);
            //downloadWav(buffer, buffer.length);
        });
        //createSynths();
    }

    if (loaderStatus.synths == true) {
        if (Tone.Transport.state != 'started') Tone.Transport.start('+0.1');

        dateTime = new Date();
        if (Tone.Transport.state == 'started' && offlineContext.transport.state == 'started' && dateTime.getSeconds() % 5 == 0 && loaderStatus.finalTrack == false) {
            audioProgress = constrain(map(offlineContext._context.currentTime, 0, offlineContext._duration, 0, 100), 0, 100);
            //console.log(floor(audioProgress));
            //to avvoid repeated update of progress bar
            //if(getElemeent.progress != progress) getEleme.progress = progress
            progressDiv.style.width = floor(audioProgress) + '%';
            //console.log('width: ' + progressDiv.style.width)

            let divScore = document.getElementById("score_frame");
            if (scoreDone == true && canvasRenderLoaded == false) {
                let cv = document.querySelector("canvas")
                divScore.style.border = "2.5px solid white";
                divScore.style.backgroundImage = 'url(' + cv.toDataURL("image/png") + ")";
                divHeight = divScore.offsetHeight;
                divScore.style.height = 0.2 * divHeight + "px";
                divScore.style.backgroundPosition = "center top";
                divScore.style.backgroundSize = "100% auto";

                canvasRenderLoaded = true;
            }
            else if (canvasRenderLoaded == true) {
                let loadProg = constrain(map(audioProgress, 0, 30, 0.2, 1), 0.2, 1);
                divScore.style.height = loadProg * divHeight + "px";
            }
        }
    }
}
//setup instruments
function createSynths(context) {
    context.transport.start();
    metronome = new Tone.MembraneSynth({
        'envelope': {
            'sustain': 0,
            'attack': 0.02,
            'decay': 0.8
        },
        'octaves': 10,
    }).toDestination();
    metronome.volume.value = -5;

    //effects
    let compressor = new Tone.Compressor();
    let reverb = new Tone.Reverb(0.8);
    let vibrato = new Tone.Vibrato("2n", 0.35);
    let autoFilter = new Tone.AutoFilter("4n");
    let autoFilterTop = new Tone.AutoFilter({
        depth: 0.81,
        frequency: 0,
        octaves: 1.98
    });
    let noiseFilter = new Tone.AutoFilter({
        frequency: 1,
        type: "sine",
        depth: 1,
        baseFrequency: 200,
        octaves: 2.6,
        filter: {
            type: 'lowpass',
            rolloff: -12,
            Q: 1,
        },
        wet: 0.5
    });
    let eq1 = new Tone.EQ3(0.8, 0.1, 0.0001);
    let eq2 = new Tone.EQ3(0.5, 0.5, 0.0001);
    let pitchShift = new Tone.PitchShift({
        pitch: 2,
        windowSize: 0.04,
        delayTime: 0.03,
        feedback: 0.5,
        wet: 0.5
    });
    let delay = new Tone.PingPongDelay({
        delayTime: 0.2,
        feedback: 0.4,
        wet: 0.5,
    });
    let woah = new Tone.AutoWah({
        baseFrequency: 250,
        octaves: 3.1,
        sensitivity: 0,
        Q: 2,
        gain: 5,
        rolloff: -24,
        follower: {
            attack: 0.3,
            release: 0.1
        },
        wet: 0.5
    });
    let chorus = new Tone.Chorus({
        frequency: 45,
        delay: 150,
        depth: 0
    });

    //noise synth
    synths.noiseSynth = new Tone.NoiseSynth({
        noise: {
            type: 'pink',
            playbackRate: 0.06,
        },
        envelope: {
            attack: 1.5,
            decay: 2,
            sustain: 0.5,
            release: 3
        }
    }).chain(pitchShift, delay, noiseFilter, compressor, context.destination);
    synths.noiseSynth.volume.value = mastering.noiseSynth;

    //engag granular synth
    //grain synth engag
    synths.grainSynthEngag = new Tone.GrainPlayer(AudioBuffer);
    synths.grainSynthEngag.set({
        overlap: 5,
        grainSize: 0.8,
        playBackRate: 1,
        detune: random(-1200, 1200),
        loop: true,
        loopStart: random(0, AudioBuffer._buffer.duration),
        loopEnd: 0,
        reverse: false
    });
    synths.grainSynthEngag.chain(reverb, eq1, compressor, context.destination);
    synths.grainSynthEngag.volume.value = mastering.initGrainSynthEngag;

    //base rhythm - rhytm variation
    synths.rhythmVar = new Tone.PolySynth({
        harmonicity: 2,
        modulationIndex: 61,
        detune: 1000,
        oscillator: {
            type: 'square',
            partialCount: 5,
        },
        envelope: {
            attack: 1.5,
            decay: 0.4,
            sustain: 0.7,
            release: 4,
        },
        modulation: {
            type: 'triangle',
            partialCount: 5,
        },
        modulationEnvelope: {
            attack: 1.5,
            decay: 0.4,
            sustain: 0.8,
            release: 4,
        }
    }).chain(autoFilterTop, chorus, reverb, compressor, context.destination);
    synths.rhythmVar.volume.value = mastering.rhythmVar;

    //main rhythm - map rhythm values
    synths.mainRhythm = new Tone.PolySynth({
        portamento: 0,
        oscillator: {
            type: 'square2',
            harmonicity: 1,
        },
        envelope: {
            attack: 2,
            decay: 1,
            sustain: 0.8,
            release: 6
        }
    }).chain(reverb, delay, autoFilter, eq1, compressor, context.destination);
    synths.mainRhythm.volume.value = mastering.mainRhythm;

    //oscilating piano
    synths.oscPianoSynth = new Tone.MonoSynth({
        oscillator: {
            type: 'sine',
        },
        filter: {
            Q: 2,
            type: 'lowpass',
            rolloff: -12
        },
        envelope: {
            attack: 1.1,
            decay: 1,
            sustain: 0.5,
            release: 0.4
        },
        filterEnvelope: {
            attack: 0.1,
            decay: 0.32,
            sustain: 0.9,
            release: 3,
            baseFrequency: 700,
            octaves: 2.3
        }
    });
    synths.oscPianoSynth.chain(reverb, eq1, compressor, context.destination);
    synths.oscPianoSynth.volume.value = mastering.oscPianoSynth;

    //stability bass
    synths.stabilBass = new Tone.MonoSynth({
        oscillator: {
            type: "fmsquare5",
            modulationType: "triangle",
            modulationIndex: 1,
            harmonicity: 0.5
        },
        filter: {
            Q: 1,
            type: "lowpass",
            rolloff: -24
        },
        envelope: {
            attack: 1.5,
            decay: 0.1,
            sustain: 0.3,
            release: 15
        },
        filterEnvelope: {
            attack: 1,
            decay: 0.1,
            sustain: 0.9,
            release: 1.5,
            baseFrequency: 100,
            octaves: 2
        }
    }).chain(reverb, vibrato, woah, autoFilter, eq2, compressor, context.destination);
    synths.stabilBass.volume.value = mastering.stabilBass;

    //bird song player
    synths.birdSong = new Tone.Player(BirdSongBuffer).chain(reverb, eq1, compressor, context.destination);
    synths.birdSong.loop = true;
    synths.birdSong.start(0);
    synths.birdSong.volume.value = mastering.birdSong;

    //vinyl crackle player
    synths.vinyl = new Tone.Player(VinylBuffer).chain(eq1, compressor, context.destination);
    synths.vinyl.loop = true;
    synths.vinyl.start(0);
    synths.vinyl.volume.value = mastering.vinyl;

    //off click player
    synths.offClickChoir = new Tone.Sampler({
        C3: choirBuffer[0],
        E3: choirBuffer[1],
        G3: choirBuffer[2],
        B3: choirBuffer[3],
    }, () => {
        synths.offClickChoir.volume.value = mastering.offClickChoir;
    }).chain(reverb, compressor, context.destination);

    //oscillating consistency piano pad
    synths.oscConsistPiano = new Tone.Sampler({
        A3: oscPianoBuffer[0],
        C3: oscPianoBuffer[1],
        C4: oscPianoBuffer[2],
        E3: oscPianoBuffer[3]
    }, () => {
        synths.oscConsistPiano.volume.value = mastering.oscConsistPiano;
    }).chain(reverb, compressor, context.destination);

    //vocal samples
    synths.vocalSampler = new Tone.Sampler({
        A2: vocalBuffer[0],
        A3: vocalBuffer[1],
        A4: vocalBuffer[2],
        A5: vocalBuffer[3],
        A6: vocalBuffer[4],
        A7: vocalBuffer[5],
        A8: vocalBuffer[6]
    }, () => {
        synths.vocalSampler.volume.value = mastering.vocalSampler;
    }).chain(reverb, delay, eq1, compressor, context.destination);

    //master effects
    //let masterCompressor = new Tone.Compressor().toDestination();
    //let masterLimiter = new Tone.Limiter(0).toDestination();

    let masterEq = new Tone.EQ3(0.8, 0.25, 0.01).connect(context.destination);
    let masterCompressor = new Tone.Compressor().connect(context.destination);
    let masterLimiter = new Tone.Limiter(0).connect(context.destination);
    context.destination.volume.value = mastering.master;

    loaderStatus.synths = true;
    console.log('Synths Loaded');

    //create individual tracks
    //createMetronome();
    createNoiseLayer();
    createEngagGranularSynth();
    createRhythmVar();
    createMainRhythm();
    createOscilatingPiano();
    createStabilBass();
    createOffClickChoir();
    createOscConsistPiano();
}
//base time
function createMetronome() {
    let loop = new Tone.Loop(function (time) {
        //metronome
        /*if (ambientSettings.metronomePlay == true) {
          if (ambientSettings.barCount % 4 == 0) metronome.triggerAttackRelease("Gb2", "8n", time, 0.5);
          else metronome.triggerAttackRelease("Gb1", "8n", time, 0.5);
        }*/

        //roll instrument change chance
        /*if (ambientSettings.barCount % 8 == 0 && ambientSettings.barCount > 0) {
          let randChangeInstrum = random(0, 100);
          if (ambientSettings.changeInstrumentStrike == ambientSettings.changeInstrumentMaxStrike && randChangeInstrum <= ambientSettings.changeInstrumDiceProb) {
            //play vocal chops
            if(ambientSettings.barCount >= 50){
              console.log('sample');
              let sampleRand = floor(random(2,9));
              synths.vocalSampler.triggerAttackRelease('A'+sampleRand, "1n", time);
                
            }
            //instruments change
            ambientSettings.changeInstrumentStrike = 0;
            ambientSettings.changeInstrumDiceProb = 10;
          }
          else ambientSettings.changeInstrumDiceProb += 5;
        }*/

        //granular synth ambientSettings modulation
        let mapEngagToDetune = constrain(map(playerData.engagementPerClick[ambientSettings.barCount].engagement, maxMin.minEngag, maxMin.maxEngag, 0, ambientSettings.maxGrainDetuneRandomness), 0, ambientSettings.maxGrainDetuneRandomness);
        let mapEngagStartPoint = constrain(map(playerData.engagementPerClick[ambientSettings.barCount].engagement, maxMin.minEngag, maxMin.maxEngag, 0, AudioBuffer._buffer.duration), 0, AudioBuffer._buffer.duration);
        synths.grainSynthEngag.set({
            loopStart: mapEngagStartPoint,
            detune: random(-mapEngagToDetune, mapEngagToDetune),
        });

        ambientSettings.barCount++;
        console.log("Step: " + ambientSettings.barCount);

        if (ambientSettings.barCount >= playerData.numClicks) {
            ambientSettings.barCount = 0;
            loaderStatus.loopLoader = true;
        }
    }, 4 + "n").start(0);
    loop.humanize = true;
}
//setup individual tracks
//ambient noise
function createNoiseLayer() {
    //noise synths
    synths.noiseSynth.triggerAttack('+4n', 0.3);
    loaderStatus.noiseLayer = true;
    console.log('Noise Loaded');
}
//granular synth - engagement
function createEngagGranularSynth() {
    synths.grainSynthEngag.grainSize = constrain(map(playerData.engagementAvg, maxMin.minAvgEngag, maxMin.maxAvgEngag, 0.5, 1.5), 0.5, 1.5);
    synths.grainSynthEngag.overlap = constrain(map(playerData.engagementAvg, maxMin.minAvgEngag, maxMin.maxAvgEngag, 10, 5), 10, 5);

    //set audiobuffer for grainplayer based on engagementavg
    let engagAvgMap = constrain(map(playerData.engagementAvg, maxMin.minAvgEngag, maxMin.maxAvgEngag, 1, 4), 1, 4);
    if (engagAvgMap == 1) synths.grainSynthEngag.buffer = LoadedAudioBuffer[0];
    else if (engagAvgMap == 2) synths.grainSynthEngag.buffer = LoadedAudioBuffer[1];
    else if (engagAvgMap == 3) synths.grainSynthEngag.buffer = LoadedAudioBuffer[2];
    else if (engagAvgMap == 4) synths.grainSynthEngag.buffer = LoadedAudioBuffer[3];
    //grain synth
    synths.grainSynthEngag.start('+' + fadeInTime.grainSynthEngag);
    loaderStatus.engagGranularSynth = true;
    console.log('Granular Loaded');
}
//main oscillating synth - rhythm variation
function createRhythmVar() {
    synths.rhythmVar.options.detune = constrain(map(playerData.speedAvg, maxMin.minAvgRhythm, maxMin.maxAvgRhythm, -600, 600), -600, 600);
    synths.mainRhythm.options.oscillator.harmonicity = constrain(map(playerData.speedAvg, maxMin.minAvgRhythm, maxMin.maxAvgRhythm, 0.5, 2), 0.5, 2);

    //base rhythm - rhythm variation
    let topRhythmNoteDev = 0, topRhythmCurrentBaseNote = 0, topRhythmCurrentScale = ambientSettings.baseTopScaleRhythm;

    for (let s = 0; s < allClicks.length; s++) {
        if (allClicks[s][1] != null) {
            if (s > 0) {
                //note deviation according to ryhtm variation
                if (playerData.speedPerClick[s] > playerData.speedPerClick[s - 1]) topRhythmNoteDev = 1;
                else topRhythmNoteDev = -1;
            }
            else topRhythmNoteDev = 0;

            //calculate note to play
            if ((topRhythmNoteDev + topRhythmCurrentBaseNote) >= ambientSettings.baseScale.length) {
                topRhythmCurrentBaseNote = abs((topRhythmNoteDev + topRhythmCurrentBaseNote) - ambientSettings.baseScale.length);
                if (topRhythmCurrentScale <= ambientSettings.baseTopScaleRhythm + 2) topRhythmCurrentScale += 1;
                else topRhythmCurrentScale += 0;
            }
            else if ((topRhythmCurrentBaseNote + topRhythmNoteDev) < 0) {
                topRhythmCurrentBaseNote = ambientSettings.baseScale.length - abs(0 - (topRhythmCurrentBaseNote + topRhythmNoteDev));
                if (topRhythmCurrentScale >= ambientSettings.baseTopScaleRhythm - 2) topRhythmCurrentScale -= 1;
                else topRhythmCurrentScale += 0;
            }
            else topRhythmCurrentBaseNote += topRhythmNoteDev;

            let topRhythmKey = Tone.Midi(ambientSettings.baseScale[floor(topRhythmCurrentBaseNote)] + topRhythmCurrentScale).transpose(-3);
            let topRhythmPlayTime = Tone.TransportTime(allClicks[s][1] * ambientSettings.rhythmVarTimeMultiply).quantize("64n");

            playChord(synths.rhythmVar, topRhythmKey, topRhythmPlayTime, 0, "2n");
        }
    }
    loaderStatus.topRhythm = true;
    console.log("Top Rhythm Loaded");
}
//main synth layer - rhythm
function createMainRhythm() {
    synths.mainRhythm.options.oscillator.harmonicity = constrain(map(playerData.speedAvg, maxMin.minAvgRhythm, maxMin.maxAvgRhythm, 0.5, 2), 0.5, 2);

    let mainRhythmScaleLoc = ambientSettings.scaleLocation;
    for (let l = 0; l < allClicks.length; l++) {
        if (allClicks[l][1] && allClicks[l][0] == true) {
            //consistency variation - add/remove scale variation for keys
            if (playerData.consistencyPerClick[l].lastIncr == -1 && mainRhythmScaleLoc > 1) {
                let selectRemove = floor(random(1, mainRhythmScaleLoc.length));
                mainRhythmScaleLoc.splice(selectRemove, 1);
            }
            else if (playerData.consistencyPerClick[l].lastIncr == 1) {
                let selectAdd = floor(random(2, 7));
                mainRhythmScaleLoc.push(selectAdd);
            }

            //note determination base upon ryhthm value
            let rhytMap = constrain(map(playerData.speedPerClick[l], maxMin.minRhythm, maxMin.maxRhythm, 0, mainRhythmScaleLoc.length - 1), 0, mainRhythmScaleLoc.length - 1);
            //deviation map - number of notes to play whitin a chord
            let devMap = constrain(map(playerData.deviationPerClick[l], maxMin.minDev, maxMin.maxDev, -3, 3), -3, 3);

            let t = Tone.TransportTime(allClicks[l][1]).quantize("16n");
            //consistency general - chance of playing / chance of playing arpeggio
            //map consist 0-100
            let consistMap = constrain(map(playerData.consistencyPerClick[l].consist, maxMin.minConsist, maxMin.maxConsist, ambientSettings.minConsistProb, ambientSettings.maxConsistProb), ambientSettings.minConsistProb, ambientSettings.maxConsistProb);
            let randConsist = random(0, consistMap);
            if (randConsist <= ambientSettings.changeInstrumProb) {
                if (t >= fadeInTime.vocalSampler) {
                    //console.log('sample');
                    let sampleRand = floor(random(2, 9));
                    synths.vocalSampler.triggerAttackRelease('A' + sampleRand, "1n", t);
                }
                //if (ambientSettings.changeInstrumentStrike < ambientSettings.changeInstrumentMaxStrike) ambientSettings.changeInstrumentStrike += 1;
                //ambientSettings.changeInstrumDiceProb += 5;
            }
            else if (randConsist <= ambientSettings.playArpProb) {
                if (synths.mainRhythm.activeVoices <= ambientSettings.maxVoices) playArpeggio(synths.mainRhythm, createChords(floor(rhytMap), floor(devMap)), t, 0, "4n");
            }
            else if (randConsist <= ambientSettings.playChordProb) {
                if (synths.mainRhythm.activeVoices <= ambientSettings.maxVoices) playChord(synths.mainRhythm, createChords(floor(rhytMap), floor(devMap)), t, 0, "4n");
            }
        }
    }
    console.log('Main Rhythm Loaded');
    loaderStatus.mainRhythm = true;
}
//oscilating piano
function createOscilatingPiano() {
    //piano top line - each 4 bars check for consistency variation value -> if 1 = play bottom note -> if -1 = play top note -> if 0 = dont play
    let oscilateBarCount = 0;
    let loop = new Tone.Loop(function (time) {
        if (oscilateBarCount % 20 == 0 && oscilateBarCount > 0) {
            ambientSettings.oscPianoTopScaleLoc[ambientSettings.oscPianoTopScaleLoc.length] = ambientSettings.oscPianoTopScaleLoc[0] + floor(random(-1, 1));
        }

        if (oscilateBarCount % 4 == 0 && oscilateBarCount > fadeInTime.oscConsistPiano) {
            let randomChanceOfScaleDerive = random(100);
            let deviation = 0;
            if (randomChanceOfScaleDerive < ambientSettings.scaleDeriveOscPiano) deviation = -1;
            else if (randomChanceOfScaleDerive >= ambientSettings.scaleDeriveOscPiano && randomChanceOfScaleDerive < 2 * ambientSettings.scaleDeriveOscPiano) deviation = 1;

            let randConsistArray = [playerData.consistencyPerClick[oscilateBarCount].lastIncr, playerData.consistencyPerClick[oscilateBarCount - 1].lastIncr, playerData.consistencyPerClick[oscilateBarCount - 2].lastIncr, playerData.consistencyPerClick[oscilateBarCount - 3].lastIncr];
            let randConsistVarVal = floor(random(randConsistArray.length));
            randConsistVarVal = randConsistArray[randConsistVarVal];

            let topScaleLocRand = floor(random(ambientSettings.oscPianoTopScaleLoc.length));
            let scaleLoc = ambientSettings.oscPianoTopScaleLoc[topScaleLocRand] + deviation;
            if (randConsistVarVal == -1) playChord(synths.oscPianoSynth, Tone.Midi(ambientSettings.baseScale[0] + scaleLoc).transpose(-3), time, 0, "2n");
            else if (randConsistVarVal == 1) playChord(synths.oscPianoSynth, Tone.Midi(ambientSettings.baseScale[0] + (scaleLoc - 2)).transpose(-3), time, 0, "2n");

        }
        oscilateBarCount++;

        if (oscilateBarCount >= playerData.numClicks) oscilateBarCount = 0;
    }, 4 + "n").start('+2n');
    loop.humanize = true;

    loaderStatus.oscPianoSynth = true;
    console.log('Oscilating Piano Loaded');
}
//bass layer - stability
function createStabilBass() {
    synths.stabilBass.detune = constrain(map(playerData.stabilityAvg, maxMin.minAvgStabil, maxMin.maxAvgStabil, 600, 0), 600, 0);
    synths.stabilBass.filterEnvelope.octaves = constrain(map(playerData.stabilityAvg, maxMin.minAvgStabil, maxMin.maxAvgStabil, 2, 1), 2, 1);
    //stability bass
    let stabilBassBarCount = 0;
    let loop = new Tone.Loop(function (time) {
        if (playerData.stabilityPerClick[stabilBassBarCount] == 1) {
            //note determination base upon ryhthm value
            let bassRhytMap = constrain(map(playerData.speedPerClick[stabilBassBarCount], maxMin.minRhythm, maxMin.maxRhythm, 0, ambientSettings.baseScale.length - 1), 0, ambientSettings.baseScale.length - 1);
            playChord(synths.stabilBass, Tone.Midi(ambientSettings.baseScale[floor(bassRhytMap)] + 3).transpose(-3), time, 0, "2n");
        }
        stabilBassBarCount++;

        if (stabilBassBarCount >= playerData.numClicks) stabilBassBarCount = 0;
    }, 2 + "n").start('1m');
    loop.humanize = true;

    loaderStatus.stabilBass = true;
    console.log('Stability Bass Loaded');
}
//off clicks - choir synth
function createOffClickChoir() {
    for (let l = 0; l < allClicks.length; l++) {
        if (allClicks[l][1] && allClicks[l][0] == false && allClicks[l][1] >= fadeInTime.offClickChoir) {
            //note determination base upon ryhthm value
            let rhytMap = constrain(map(playerData.speedPerClick[l], maxMin.minRhythm, maxMin.maxRhythm, 0, ambientSettings.baseScale.length - 1), 0, ambientSettings.baseScale.length - 1);
            //calculate time to play
            let t = Tone.TransportTime(allClicks[l][1]).quantize("16n");
            let key = Tone.Midi(ambientSettings.baseScale[floor(rhytMap)] + 3).transpose(-3);

            playChord(synths.offClickChoir, key, t, 0, '1n');
        }
    }
    console.log('Off Click Choir Loaded');
    loaderStatus.offClickChoir = true;
}
//oscilating synth - cosistency
function createOscConsistPiano() {
    let consistVarNote = floor(ambientSettings.baseScale.length / 2);
    let consistVarScale = ambientSettings.initScaleConsistVar;
    for (let l = 0; l < allClicks.length; l++) {
        if (allClicks[l][1] && l > 0) {
            if (playerData.consistencyPerClick[l].lastIncr != playerData.consistencyPerClick[l - 1].lastIncr) {
                if (playerData.consistencyPerClick[l].lastIncr > playerData.consistencyPerClick[l - 1].lastIncr) consistVarNote += 1;
                else if (playerData.consistencyPerClick[l].lastIncr < playerData.consistencyPerClick[l - 1].lastIncr) consistVarNote -= 1;

                if (consistVarNote < 0) consistVarScale -= 1;
                else if (consistVarNote > ambientSettings.baseScale.length) consistVarScale += 1;

                consistVarNote = constrain(consistVarNote, 0, ambientSettings.baseScale.length - 1);
                //calculate time to play
                let t = Tone.TransportTime(allClicks[l][1] * ambientSettings.oscConsistTimeMultiply).quantize("16n");
                let key = Tone.Midi(ambientSettings.baseScale[floor(consistVarNote)] + consistVarScale).transpose(-3);

                playChord(synths.oscConsistPiano, key, t, 0, '1m');

            }
        }
    }
    console.log('Osc Consistency Piano Loaded');
    loaderStatus.oscConsistPiano = true;
}
//play functions
function createChords(baseNote, steps) {
    let rootNote = ambientSettings.baseScale[baseNote];// + '4';
    let scaleLoc = ambientSettings.scaleLocation[floor(random(ambientSettings.scaleLocation.length - 1))];
    let keysToPlay = [];

    //play single root note
    if (steps == 0) {
        let noteToPlay = rootNote + scaleLoc;
        keysToPlay.push(noteToPlay);
    }
    else { //play multiple notes - variation -> numOfStep = numOfNotes played whithin a chord
        if (steps > 0) { //progress forward
            for (let n = 0; n < steps; n++) {
                let noteToAdd;
                //note belongs to scale
                if ((baseNote + (n * 2)) < ambientSettings.baseScale.length) {
                    noteToAdd = ambientSettings.baseScale[baseNote + (n * 2)] + scaleLoc;
                }
                else { //note belongs to next octave
                    let loopRemainder = abs(ambientSettings.baseScale.length - (baseNote + (n * 2)));
                    noteToAdd = ambientSettings.baseScale[loopRemainder] + (scaleLoc + 1);
                }
                keysToPlay.push(noteToAdd);
            }
        }
        else { //progress backwards
            for (let n = 0; n < abs(steps); n++) {
                let noteToAdd;
                //note belongs to scale
                if ((baseNote - (abs(n) * 2)) >= 0) noteToAdd = ambientSettings.baseScale[baseNote - (abs(n) * 2)] + scaleLoc;
                else { //note belongs to previous octave
                    let loopRemainder = abs(0 - (baseNote - (abs(n) * 2)));
                    noteToAdd = ambientSettings.baseScale[loopRemainder] + (scaleLoc - 1);
                }
                keysToPlay.push(noteToAdd);
            }
        }
    }
    //transpose keys to aMinor
    for (let t = 0; t < keysToPlay.length; t++) {
        keysToPlay[t] = Tone.Midi(keysToPlay[t]).transpose(-3);
    }

    return keysToPlay;
}
function playChord(syn, keys, time, timeDev, length) {
    let t = Tone.TransportTime(timeDev * 1).quantize("16n");
    t = time + t;

    syn.triggerAttackRelease(keys, length, t);
}
function playArpeggio(syn, keys, time, timeDev, length) {
    for (let p = 0; p < keys.length; p++) {
        let t = Tone.Time((timeDev * 1) + (p * 1)).quantize("16n");
        t = '+' + t;
        syn.triggerAttackRelease(keys[p], length, t);
    }
}

//file convert to .wav - from https://russellgood.com/how-to-convert-audiobuffer-to-audio-file/
function downloadWav(abuffer, total_samples) {
    // get duration and sample rate
    var duration = abuffer.duration,
        rate = abuffer.sampleRate,
        offset = 0;

    var new_file = URL.createObjectURL(bufferToWave(abuffer, total_samples));

    const a = document.createElement("a");
    a.href = new_file;
    var name = 'finalTrack_4min_EQMaster_' + currentGame + '.wav';
    a.download = name;
    a.click();
}
// Convert an AudioBuffer to a Blob using WAVE representation
function bufferToWave(abuffer, len) {
    var numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        offset = 0,
        pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {             // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true);          // write 16-bit sample
            pos += 2;
        }
        offset++                                     // next source sample
    }

    // create Blob
    return new Blob([buffer], { type: "audio/wav" });

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
}

function uploadToDb(blob) {
    let f = blob;
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

        getFile = function (blob) {
            putInDb(blob);
        },
        putInDb = function (blob) {
            console.log("Putting in IndexedDB");

            // Open a transaction to the database
            var transaction = db.transaction(["files"], "readwrite");
            console.log(transaction);

            // Put the blob into the dabase
            var put = transaction.objectStore("files").put(blob, blob.type);

            // Retrieve the file that was just stored
            transaction.objectStore("files").get(blob.type).onsuccess = function (event) {
                var imgFile = event.target.result;
                console.log("Got file!" + imgFile);

                advanceButton.style.display = 'block';
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
                    getFile(f);
                };
            }
            else {
                getFile(f);
            }
        }
        else {
            getFile(f);
        }
    }

    // For future use. Currently only in latest Firefox versions
    request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
    };
}
