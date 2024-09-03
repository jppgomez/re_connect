let stateTextArray = pausedArray, stateTextTime = 0, stateTextCurrent = 0;
let stateText = document.getElementById("state_text");
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

let progressBar = document.getElementById("load_prog");

//footer button action
let bgAudio = document.getElementById("bg_audio");
document.getElementById("play").addEventListener("click", () => {
    if (!audioSource.isPlaying()) audioSource.loop();
    stateTextArray = playingArray;
});
document.getElementById("pause").addEventListener("click", () => {
    if (audioSource.isPlaying()) audioSource.pause();
    stateTextArray = pausedArray;
});
document.getElementById("volume_mute").addEventListener("click", () => {
    if (document.getElementById("volume_mute").classList.contains("mute")) {
        audioSource.setVolume(0, 0.2);
        document.getElementById("volume_mute").classList.remove("mute");
    }
    else {
        audioSource.setVolume(1, 0.2);
        document.getElementById("volume_mute").classList.add("mute");
    }
});



let cW = window.innerWidth, cH = window.innerHeight;

let allData, oneData, allClicks;
let playerCaract = [], playerData, playerDataPerGM;
let gotData = false;

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

let analysis = {
    spectrum: 0,
    wvfrm: 0,
    bands: 0,
    bandsAvg: 0,
    freqRange: [],
    freqRangeColors: ['#e74836', '#e7f754', '#48a6b2', '#60cb77', '#ffffff']
}
let settings = {
    currentGame: 4,
    spectrumW: 256,
    spectrumH: 100,
    mainRad: 200,
    mainRadMaxDesloc: 1,
    minMainRad: 150,
    maxMainRad: 250,
    currentDraw: [0],
    currentRange: 0, //freq range to move visuals //selected range to move visuals
    minThreshold: 170,
    maxThreshold: 200,
    strokeC: '#ffffff',
    ellipseStrokeW: 2.5,
    bgCol: '#0a0a0a',

    modeChance3: 5, //chance of triggering 3 modes
    modeChance2: 15, //chance of triggering 2 modes
    modeChance1: 40, //chance of breaking normal chain of sequence

    changeRate: 15, //seconds
    currentStep: 0,

};
let settings00 = {
    startPos: 0,
    endPos: 0,
    growAngDiv: 0,
    minGrowAngDiv: 3, //TWO_PI/maxGrowAngdiv = lenght of arc
    maxGrowAngDiv: 6,
    growVel: 0,
    minGrowVel: 0.05,
    maxGrowVel: 0.1,
    chaseVel: 0,
    minChaseVel: 0.05,
    maxChaseVel: 0.09,
    dimVel: 0,
    minDimVel: 0.04,
    maxDimVel: 0.07,
    strokeW: 2.5,
    animPlay: false,
    activateThreshold: 200, //fft value to activate animation
}
let settings01 = {
    numDiv: 1,
    maxNumDiv: 1024,
    minNumDiv: 1,
    baseLineSize: 0,
    lineStrokeW: 1,
    frameInterval: 10,
    loopEnd: false,
}
let settings02 = {
    lines: [],
    maxNumLines: 1024,
    minNumLines: 0,
    lineStrokeW: 1,
    frameInterval: 7,
    loopEnd: false,
}
let settings03 = {
    numCircles: 1,
    minNumCircles: 1,
    maxNumCircles: 256,
    lineStrokeW: 1,
    frameInterval: 5,
    loopEnd: false,
}
let settings04 = {
    circles: [],
    numAngDiv: 15,
    numRadDiv: 5,
    circleSize: 0,
    minNumCircles: 0,
    maxNumCircles: 256,
    lineStrokeW: 1,
    frameInterval: 4,
    loopEnd: false,
}
let settings05 = {
    circles: [],
    numAngDiv: 20,
    numRadDivW: 10,
    numRadDivH: 5,
    circleSize: 0,
    minNumCircles: 0,
    maxNumCircles: 256,
    lineStrokeW: 1,
    frameInterval: 8,
    loopEnd: false,
}
let settings06 = {
    numVertex: 180,
    frameInterval: 8,
    maxVertDesloc: 20,
}
let settings0708 = {
    numPart: 100,
    angMult: 10,
    angTurn: 10,
    zOffInc: 0.003,
    inc: 1,
    scl: 20,
    cols: 0,
    rows: 0,
    zoff: 0,
    particles: [],
    flowfield: 0,
    p: 1,
    points: [],

    canvas: 0,
    ellipse: 0,

    draw07: false,
    draw08: true,
}
let settings0910 = {
    vertexX: [],
    vertexY: [],
    cols: 0,
    rows: 0,
    scl: 100,

    gridStroke: 1,
    canvas: 0,
    ellipse: 0,
    frameInterval: 4,
    maxMoveDesloc: 100,
    maxMovePoints: 10,

    pointsOfSelect: [],

    draw09: false,
    draw10: true,
}
let settings1112 = {
    textSize: 15,
    textSizeDev: 5,
    text: ['[re]connect', '[play]', 'rhythm', 'consistency', 'engagement', 'stability', 'deviation', 'data', 'performance'],
    textArray: [],

    canvas: 0,
    ellipse: 0,
    frameInterval: 2,
    maxText: 40,

    draw11: false,
    draw12: true,
}
let settings13 = {
    maxNumLines: 5,
    numLines: 0,
    minRotSpeed: 60,
    maxRotSpeed: 40,
    frameInterval: 10,
    rotateProb: 50,
    rotateAng: [],
    rotEllipseStroke: 1,
    animPlay: [],
}
let settingsMarble = {
    //From Daniel Shiffman's interpretation of Reza Ali's Supershapes
    // Daniel Shiffman
    // http://codingtra.in
    // http://patreon.com/codingtrain
    // Code for: https://youtu.be/akM4wMZIBWg

    //Reza Ali: https://www.syedrezaali.com/3d-supershapes
    globe: [],
    globeCol: [],
    numVertex: 20,
    radius: 200,
    minSides: 3,
    maxSides: 30,
    minWidth: 0.8, //out of 1 => b
    maxWidth: 0.95,
    minN: 0.5,
    maxN: 1.5,

    maxColorDev: 40,
    sphereStroke: 0.4,
    soulStroke: 0.2,
    strokeCol: '#ffffff',
    sphereOpac: 30,

    m: 0,
    a: 0,
    b: 0,
    n1: 0,
    n2: 0,
    n3: 0,

    marbleGenerated: false,

    rot: 0,
    saved: false,
}

let audioSource;
let fft;

let selectedRange = 1;
let robotoThin;
let cam;
let cnv;

let time = 0;

function getData() {
    fetch('https://reconnect-server-fe5eed935188.herokuapp.com/')
        .then((res) => res.json())
        .then((json) => {
            allData = json.Data;

            for (let d1 = 0; d1 < allData.length; d1++) {
                playerCaract[d1] = getChars(allData[d1]);
            }

            for (let d3 = 0; d3 < playerCaract.length; d3++) {
                playerCaract[d3].deviationAvg = getDev(playerCaract[d3]).devAvg;
                playerCaract[d3].deviationPerClick = getDev(playerCaract[d3]).devPerClick;
                playerCaract[d3].deviationPerStat = getDev(playerCaract[d3]).devPerStat;

                playerCaract[d3].color = getColor(playerCaract[d3]);
            }

            currentGame = allData.length - 1;
            playerData = playerCaract[currentGame];
            oneData = allData[currentGame];

            allClicks = oneData.clicks.true.concat(oneData.clicks.false);
            allClicks.sort((a, b) => a[1] - b[1]);
            allClicks = allClicks.filter(item => item[1] != null || item[4] >= 0)

            allClicks = allClicks.filter(item => item[1] < oneData.finalStats.finalTime + 30);

            //fix gamelength counter error by changing to last click time
            oneData.finalStats.finalTime = allClicks[allClicks.length - 1][1];
            for (let a = 0; a < allClicks.length; a++) {
                if (allClicks[a][1] > oneData.finalStats.finalTime + 50) allClicks.splice(a, a);
            }

            gotData = true;
        });
}

function preload() {
    robotoThin = loadFont('./assets/fonts/RobotoMono-Thin.ttf');
    getFromDB("audio/wav");
}

function setup() {
    getData();
    cnv = createCanvas(windowWidth, windowHeight, WEBGL);
    cnv.parent(document.querySelector("body"));

    fft = new p5.FFT(0.8, 256);
    stroke(255);
    noFill();
    textFont(robotoThin);

    cam = createCamera();
    cam.camera(windowWidth / 2, windowHeight / 2, 1000);
    cam.lookAt(windowWidth / 2, windowHeight / 2, 0);
    noiseDetail(3, 0.6);

    setupSettings();

    setupMarble();
}

function draw() {
    if (millis() >= stateTextTime + 1000) {
        if (stateTextArray.length > 1) {
            if (stateTextCurrent < stateTextArray.length - 1) stateTextCurrent += 1;
            else stateTextCurrent = 0;

            stateText.innerHTML = stateTextArray[stateTextCurrent];
        }
        else {
            stateTextCurrent = 0;
            stateText.innerHTML = stateTextArray[stateTextCurrent];
        }
        stateTextTime = millis();

        let prog = constrain(map(audioSource.currentTime(), 0, audioSource.duration(), 0, 100), 0, 100);
        progressBar.style.width = floor(prog) + '%';
    }


    if (gotData == true && settingsMarble.marbleGenerated == false) generateMarble(settings.mainRad);
    //change visuals mode
    if (millis() >= time + (settings.changeRate * 1000)) {
        push();
        stroke(settings.strokeC);
        fill(settings.bgCol);
        strokeWeight(settings.ellipseStrokeW);
        ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
        pop();

        settings.currentDraw = [];

        let nextStep;
        if (settings.currentStep < 14) {
            nextStep = settings.currentStep + 1;
        }
        else {
            nextStep = floor(random(15));
        }
        console.log(settings.currentStep);
        if (nextStep != 14) {
            let rand = floor(random(100));
            if (rand <= settings.modeChance3) {
                settings.currentDraw.push(nextStep);
                for (let r = 0; r < 2; r++) {
                    let randMode = floor(random(14));
                    settings.currentDraw.push(randMode);
                }
            }
            else if (rand <= settings.modeChance2) {
                settings.currentDraw.push(nextStep);
                let randMode = floor(random(14));
                settings.currentDraw.push(randMode);
            }
            else if (rand <= settings.modeChance1) {
                let randMode = floor(random(14));
                settings.currentDraw.push(randMode);
            }
            else {
                settings.currentDraw.push(nextStep);
            }
        }
        else settings.currentDraw.push(nextStep);

        settings.currentStep += 1;
        time = millis();
    }

    background(settings.bgCol);
    orbitControl();
    if (audioSource.isLoaded() && audioSource.isPlaying()) {
        soundAnalysis();
        showVisuals();
    }

}

function mousePressed() {
    //getAudioContext().resume();
}

function setupSettings() {
    settings0708.cols = floor(windowWidth / settings0708.scl);
    settings0708.rows = floor(windowHeight / settings0708.scl);
    settings0708.flowfield = new Array(settings0708.cols * settings0708.rows);
    for (let p = 0; p < settings0708.numPart; p++) settings0708.particles[p] = new Particle();
    settings0708.canvas = createGraphics(windowWidth, windowHeight);
    settings0708.ellipse = createGraphics(windowWidth, windowHeight);

    settings0910.cols = floor(windowWidth / settings0910.scl) + 1;
    settings0910.rows = floor(windowHeight / settings0910.scl) + 1;
    for (let c = 0; c < settings0910.cols + 2; c++) {
        let x = c * (windowWidth / settings0910.cols);
        settings0910.vertexX.push(x);
    }
    for (let r = 0; r < settings0910.rows + 2; r++) {
        let y = r * (windowHeight / settings0910.rows);
        settings0910.vertexY.push(y);
    }
    settings0910.canvas = createGraphics(windowWidth, windowHeight);
    settings0910.ellipse = createGraphics(windowWidth, windowHeight);

    settings1112.canvas = createGraphics(windowWidth, windowHeight);
    settings1112.ellipse = createGraphics(windowWidth, windowHeight);
    settings1112.canvas.textFont(robotoThin);

    for (let a = 0; a < settings13.maxNumLines; a++) {
        settings13.rotateAng[a] = 0;
        settings13.animPlay[a] = false;
    }
}

function soundAnalysis() {
    //spectrum view
    analysis.spectrum = fft.analyze();
    /*let sz = settings.spectrumW / analysis.spectrum.length;
    for (let i = 0; i < analysis.spectrum.length; i++) {
        let x = i * sz;
        let y = map(analysis.spectrum[i], 0, -255, 0, settings.spectrumH);

        rect(x, settings.spectrumH, sz, y);
    }
    rect(0, 0, settings.spectrumW, settings.spectrumH)
*/
    //waveform view
    analysis.wvfrm = fft.waveform();
    /*let sz2 = settings.spectrumW / analysis.wvfrm.length;
      beginShape();
      for (let i = 0; i < analysis.wvfrm.length; i++) {
          let x = settings.spectrumW + (i * sz2);
          let y = map(analysis.wvfrm[i], -1, 1, 0, settings.spectrumH);
          vertex(x, y);
      }
      endShape();
      rect(settings.spectrumW, 0, settings.spectrumW, settings.spectrumH);
  */
    //octave bands
    analysis.bands = fft.getOctaveBands(2);
    analysis.bandsAvg = fft.logAverages(analysis.bands);
    /*let sz3 = settings.spectrumW / analysis.bands.length;
    for (let i = 0; i < analysis.bands.length; i++) {
        let x = (settings.spectrumW * 2) + (i * sz3);
        let y = map(analysis.bandsAvg[i], 0, 255, settings.spectrumH, 0);
        rect(x, y, sz3, settings.spectrumH - y)
    }
    rect(settings.spectrumW * 2, 0, settings.spectrumW, settings.spectrumH);
*/
    //freq ranges ("bass", "lowMid", "mid", "highMid", "treble"
    analysis.freqRange[0] = fft.getEnergy('bass');
    analysis.freqRange[1] = fft.getEnergy('lowMid');
    analysis.freqRange[2] = fft.getEnergy('mid');
    analysis.freqRange[3] = fft.getEnergy('highMid');
    analysis.freqRange[4] = fft.getEnergy('treble');
    /*for (let i = 0; i < analysis.freqRange.length; i++) {
        push();
        if (i == settings.currentRange) fill(analysis.freqRangeColors[i]);
        else stroke(analysis.freqRangeColors[i]);
        let x = (settings.spectrumW * 3) + i * (settings.spectrumW / analysis.freqRange.length);
        let y = map(analysis.freqRange[i], 0, 255, settings.spectrumH, 0);
        rect(x, y, (settings.spectrumW / analysis.freqRange.length), settings.spectrumH - y);
        pop();
    }
    rect(settings.spectrumW * 3, 0, settings.spectrumW, settings.spectrumH);
*/
}

function showVisuals() {
    //circle light pulse according to amplitude
    settings.mainRad += constrain(map(analysis.freqRange[settings.currentRange], 100, 255, -settings.mainRadMaxDesloc, settings.mainRadMaxDesloc), -settings.mainRadMaxDesloc, settings.mainRadMaxDesloc);
    settings.mainRad = constrain(settings.mainRad, settings.minMainRad, settings.maxMainRad);

    //07 - noise outside / 08 - inside
    if (settings.currentDraw.includes(7) || settings.currentDraw.includes(8)) draw0708(analysis.freqRange[settings.currentRange]);
    //09 - grid inside / 10 - inside 
    if (settings.currentDraw.includes(9) || settings.currentDraw.includes(10)) draw0910(analysis.freqRange[settings.currentRange]);
    //11 - text outside / 12 - text inside
    if (settings.currentDraw.includes(11) || settings.currentDraw.includes(12)) draw1112(analysis.freqRange[settings.currentRange]);

    //00 - circle pulse
    if (settings.currentDraw.includes(0)) {
        if (analysis.freqRange[settings.currentRange] >= settings.minThreshold && settings00.animPlay == false) settings00.animPlay = true;
        if (settings00.animPlay == true) draw00(analysis.freqRange[settings.currentRange]);
    }
    //01 - circle fractions
    if (settings.currentDraw.includes(1)) draw01(analysis.freqRange[settings.currentRange]);
    //02 - random lines
    if (settings.currentDraw.includes(2)) draw02(analysis.freqRange[settings.currentRange]);
    //03 - inner circles
    if (settings.currentDraw.includes(3)) draw03(analysis.freqRange[settings.currentRange]);
    //04 - cymatics flower
    if (settings.currentDraw.includes(4)) draw04(analysis.freqRange[settings.currentRange]);
    //05 - outside circles
    if (settings.currentDraw.includes(5)) draw05(analysis.freqRange[settings.currentRange]);
    //06 - fluid main circle
    if (settings.currentDraw.includes(6)) draw06(analysis.bandsAvg);
    //13 - rotate lines
    if (settings.currentDraw.includes(13)) {
        if (analysis.freqRange[settings.currentRange] >= settings.minThreshold && settings13.animPlay == false) settings13.animPlay = true;
        draw13(analysis.freqRange[settings.currentRange]);
    }
    if (settings.currentDraw.includes(14) && settingsMarble.marbleGenerated == true) {
        push();
        settingsMarble.rot += map(analysis.freqRange[settings.currentRange], settings.minThreshold, 255, TWO_PI / 30, TWO_PI / 50);
        translate(cW / 2, cH / 2);
        rotateY(settingsMarble.rot);
        showMarble(settings.mainRad);
        pop();
        if (settingsMarble.saved == false) {
            let cv = document.querySelector("canvas")
            let canvasBlob = cv.toBlob((blob) => {
                console.log(blob);
                uploadToDb(blob);
            }, "image/jpeg", 1);
            settingsMarble.saved = true;
            document.getElementById("advance_files").style.display = "block";
        }
    }
}

function draw00(mapVal) {
    settings00.growAngDiv = constrain(map(mapVal, settings00.activateThreshold, 255, settings00.maxGrowAngDiv, settings00.minGrowAngDiv), settings00.maxGrowAngDiv, settings00.minGrowAngDiv);
    settings00.growVel = constrain(map(mapVal, settings00.activateThreshold, 255, settings00.minGrowVel, settings00.maxGrowVel), settings00.minGrowVel, settings00.maxGrowVel);
    settings00.chaseVel = constrain(map(mapVal, settings00.activateThreshold, 255, settings00.minChaseVel, settings00.maxChaseVel), settings00.minChaseVel, settings00.maxChaseVel);
    settings00.dimVel = constrain(map(mapVal, settings00.activateThreshold, 255, settings00.minDimVel, settings00.maxDimVel), settings00.minDimVel, settings00.maxDimVel);

    if (settings00.animPlay == true) {
        push();
        stroke(settings.strokeC);
        strokeWeight(settings00.strokeW);
        noFill();
        if (settings00.endPos <= TWO_PI / settings00.growAngDiv) settings00.endPos += settings00.growVel;
        else if (settings00.endPos > TWO_PI / settings00.growAngDiv && settings00.endPos <= TWO_PI) {
            settings00.endPos += settings00.chaseVel;
            if (settings00.startPos < settings00.endPos) settings00.startPos += settings00.chaseVel + 0.01 * noise(frameCount);
        }
        else if (settings00.endPos > TWO_PI && settings00.startPos < TWO_PI) {
            settings00.startPos += settings00.dimVel;
        }
        else {
            settings00.startPos = 0;
            settings00.endPos = 0;

            settings00.animPlay = false;
        }
        if (settings00.startPos < settings00.endPos) arc(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2, settings00.startPos - (TWO_PI / 4), settings00.endPos - (TWO_PI / 4))
        pop();
    }
}

function draw01(mapVal) {
    if (frameCount % settings01.frameInterval == 0) {
        if (settings01.loopEnd == false) {
            if (mapVal < settings.minThreshold && settings01.numDiv * 0.5 >= settings01.minNumDiv) settings01.numDiv *= 0.5;
            else if (mapVal > settings.maxThreshold && settings01.numDiv * 2 <= settings01.maxNumDiv) settings01.numDiv *= 2;
        }
        else {
            if (mapVal < settings.minThreshold && settings01.numDiv * 2 <= settings01.maxNumDiv) settings01.numDiv *= 2;
            else if (mapVal > settings.maxThreshold && settings01.numDiv * 0.5 >= settings01.minNumDiv) settings01.numDiv *= 0.5;
        }

        if (settings01.numDiv >= settings01.maxNumDiv && settings01.loopEnd == false) settings01.loopEnd = true;
        else if (settings01.numDiv <= settings01.minNumDiv && settings01.loopEnd == true) settings01.loopEnd = false;
    }

    push();
    noFill();
    stroke(settings.strokeC);
    for (let d = 0; d < settings01.numDiv; d++) {
        if (d == settings01.numDiv - 1) settings01.baseLineSize = constrain(map(mapVal, settings.minThreshold, settings.maxThreshold, 0, settings.mainRad), 0, settings.mainRad);
        else settings01.baseLineSize = settings.mainRad;

        let lineX1 = (cW / 2) + settings01.baseLineSize * cos(d * (PI / settings01.numDiv));
        let lineX2 = (cW / 2) - settings01.baseLineSize * cos(d * (PI / settings01.numDiv));
        let lineY1 = (cH / 2) + settings01.baseLineSize * sin(d * (PI / settings01.numDiv));
        let lineY2 = (cH / 2) - settings01.baseLineSize * sin(d * (PI / settings01.numDiv));

        if (d == settings01.numDiv - 1) strokeWeight(settings.ellipseStrokeW);
        else strokeWeight(settings01.lineStrokeW);

        line(lineX1, lineY1, lineX2, lineY2);
    }

    strokeWeight(settings.ellipseStrokeW);
    if (!settings.currentDraw.includes(6)) ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    pop();
}

function draw02(mapVal) {
    if (frameCount % settings02.frameInterval == 0) {
        if (settings02.loopEnd == false) {
            if (mapVal < settings.minThreshold && settings02.lines.length - 1 >= settings02.minNumLines) settings02.lines.pop();
            else if (mapVal > settings.maxThreshold && settings02.lines.length + 1 <= settings02.maxNumLines) {
                let ang1 = random(TWO_PI);
                let ang2 = random(TWO_PI);
                let x1 = (cW / 2) + settings.mainRad * cos(ang1);
                let x2 = (cW / 2) - settings.mainRad * cos(ang2);
                let y1 = (cH / 2) + settings.mainRad * sin(ang1);
                let y2 = (cH / 2) - settings.mainRad * sin(ang2);
                settings02.lines.push([x1, y1, x2, y2]);
            }
        }
        else {
            if (mapVal < settings.minThreshold && settings02.lines.length + 1 <= settings02.maxNumLines) {
                let ang1 = random(TWO_PI);
                let ang2 = random(TWO_PI);
                let x1 = (cW / 2) + settings.mainRad * cos(ang1);
                let x2 = (cW / 2) - settings.mainRad * cos(ang2);
                let y1 = (cH / 2) + settings.mainRad * sin(ang1);
                let y2 = (cH / 2) - settings.mainRad * sin(ang2);
                settings02.lines.push([x1, y1, x2, y2]);
            }
            else if (mapVal > settings.maxThreshold && settings02.lines.length - 1 >= settings02.minNumLines) settings02.lines.pop();
        }

        if (settings02.lines.length >= settings02.maxNumLines && settings02.loopEnd == false) settings02.loopEnd = true;
        else if (settings02.lines.length <= settings02.minNumLines && settings02.loopEnd == true) settings02.loopEnd = false;
    }

    push();
    noFill();
    stroke(settings.strokeC);
    for (let d = 0; d < settings02.lines.length; d++) {
        if (d == settings02.lines.length - 1) strokeWeight(settings.ellipseStrokeW);
        else strokeWeight(settings02.lineStrokeW);

        line(settings02.lines[d][0], settings02.lines[d][1], settings02.lines[d][2], settings02.lines[d][3]);
    }

    strokeWeight(settings.ellipseStrokeW);
    if (!settings.currentDraw.includes(6)) ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    pop();
}

function draw03(mapVal) {
    if (frameCount % settings03.frameInterval == 0) {
        if (settings03.loopEnd == false) {
            if (mapVal < settings.minThreshold && settings03.numCircles * 0.5 >= settings03.minNumCircles) settings03.numCircles *= 0.5;
            else if (mapVal > settings.maxThreshold && settings03.numCircles * 2 <= settings03.maxNumCircles) settings03.numCircles *= 2;
        }
        else {
            if (mapVal < settings.minThreshold && settings03.numCircles * 2 <= settings03.maxNumCircles) settings03.numCircles *= 2;
            else if (mapVal > settings.maxThreshold && settings03.numCircles * 0.5 >= settings03.minNumCircles) settings03.numCircles *= 0.5;
        }

        if (settings03.numCircles >= settings03.maxNumCircles && settings03.loopEnd == false) settings03.loopEnd = true;
        else if (settings03.numCircles <= settings03.minNumCircles && settings03.loopEnd == true) settings03.loopEnd = false;
    }

    push();
    noFill();
    stroke(settings.strokeC);
    for (let d = 0; d < settings03.numCircles; d++) {
        let ellipSize = d * ((settings.mainRad * 2) / settings03.numCircles);

        if (d == settings03.numCircles - 1) ellipSize += constrain(map(mapVal, settings.minThreshold, settings.maxThreshold, -(settings.mainRad / (settings03.maxNumCircles / 2)), (settings.mainRad / (settings03.maxNumCircles / 2))), -(settings.mainRad / (settings03.maxNumCircles / 2)), (settings.mainRad / (settings03.maxNumCircles / 2)));

        if (d == settings03.numCircles - 1) strokeWeight(settings.ellipseStrokeW);
        else strokeWeight(settings03.lineStrokeW);

        ellipse(cW / 2, cH / 2, ellipSize, ellipSize);
    }

    strokeWeight(settings.ellipseStrokeW);
    if (!settings.currentDraw.includes(6)) ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    pop();
}

function draw04(mapVal) {
    settings04.circleSize = settings.mainRad / settings04.numRadDiv;
    if (frameCount % settings04.frameInterval == 0) {
        if (settings04.loopEnd == false) {
            if (mapVal < settings.minThreshold && settings04.circles.length - 1 >= settings04.minNumCircles) settings04.circles.pop();
            else if (mapVal > settings.maxThreshold && settings04.circles.length + 1 <= settings04.maxNumCircles) {
                let circleToAdd = [floor(random(settings04.numRadDiv)), floor(random(settings04.numAngDiv))];
                settings04.circles.push(circleToAdd);
            }
        }
        else {
            if (mapVal < settings.minThreshold && settings04.circles.length + 1 <= settings04.maxNumCircles) {
                let circleToAdd = [floor(random(settings04.numRadDiv)), floor(random(settings04.numAngDiv))];
                settings04.circles.push(circleToAdd);
            }
            else if (mapVal > settings.maxThreshold && settings04.circles.length - 1 >= settings04.minNumCircles) settings04.circles.pop();
        }

        if (settings04.circles.length >= settings04.maxNumCircles && settings04.loopEnd == false) settings04.loopEnd = true;
        else if (settings04.circles.length <= settings04.minNumCircles && settings04.loopEnd == true) settings04.loopEnd = false;
    }
    push();
    noFill();
    stroke(settings.strokeC);
    for (let d = 0; d < settings04.circles.length; d++) {
        let ellipSize = settings04.circleSize;

        let radDiv = settings.mainRad / settings04.numRadDiv;
        let angDiv = TWO_PI / settings04.numAngDiv;
        let cX = cW / 2 + (settings04.circles[d][0] * radDiv) * cos(settings04.circles[d][1] * angDiv);
        let cY = cH / 2 + (settings04.circles[d][0] * radDiv) * sin(settings04.circles[d][1] * angDiv);

        if (d == settings04.circles.length - 1) {
            ellipSize += constrain(map(mapVal, settings.minThreshold, settings.maxThreshold, -(settings04.circleSize / 10), (settings04.circleSize / 10)), -(settings04.circleSize / 10), (settings04.circleSize / 10));
            strokeWeight(settings.ellipseStrokeW);
        }
        else strokeWeight(settings04.lineStrokeW);

        ellipse(cX, cY, ellipSize * 2, ellipSize * 2);
    }

    strokeWeight(settings.ellipseStrokeW);
    if (!settings.currentDraw.includes(6)) ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    pop();
}

function draw05(mapVal) {
    if (frameCount % settings05.frameInterval == 0) {
        if (settings05.loopEnd == false) {
            if (mapVal < settings.minThreshold && settings05.circles.length - 1 >= settings05.minNumCircles) settings05.circles.pop();
            else if (mapVal > settings.maxThreshold && settings05.circles.length + 1 <= settings05.maxNumCircles) {
                let circleToAdd = [floor(random(1, settings05.numRadDivW)), floor(random(1, settings05.numRadDivH)), floor(random(settings05.numAngDiv)), mapVal]; //radW,radH, div, size
                settings05.circles.push(circleToAdd);
            }
        }
        else {
            if (mapVal < settings.minThreshold && settings05.circles.length + 1 <= settings05.maxNumCircles) {
                let circleToAdd = [floor(random(1, settings05.numRadDivW)), floor(random(1, settings05.numRadDivH)), floor(random(settings05.numAngDiv)), mapVal]; //radW,radH, div, size
                settings05.circles.push(circleToAdd);
            }
            else if (mapVal > settings.maxThreshold && settings05.circles.length - 1 >= settings05.minNumCircles) settings05.circles.pop();
        }

        if (settings05.circles.length >= settings05.maxNumCircles && settings05.loopEnd == false) settings05.loopEnd = true;
        else if (settings05.circles.length <= settings05.minNumCircles && settings05.loopEnd == true) settings05.loopEnd = false;
    }
    push();
    noFill();
    stroke(settings.strokeC);

    for (let l = 0; l < settings05.circles.length; l++) {
        let radDivW = ((cW / 2 - settings.mainRad) / settings05.numRadDivW);
        let radDivH = (cH / 2 - settings.mainRad) / settings05.numRadDivH;
        let angDiv = TWO_PI / settings05.numAngDiv;

        let ellipSize;
        if (cW > cH) ellipSize = constrain(map(settings05.circles[l][3], settings.maxThreshold, 255, radDivH / 2, radDivH), radDivH / 2, radDivH);
        else ellipSize = constrain(map(settings05.circles[l][3], settings.maxThreshold, 255, radDivW / 2, radDivW), radDivW / 2, radDivW);


        let cX = cW / 2 + (settings.mainRad + (ellipSize / 2) + (settings05.circles[l][0] * radDivW)) * cos(settings05.circles[l][2] * angDiv);
        let cY = cH / 2 + (settings.mainRad + (ellipSize / 2) + (settings05.circles[l][1] * radDivH)) * sin(settings05.circles[l][2] * angDiv);

        if (l > 0) {
            push();
            cX0 = cW / 2 + (settings.mainRad + (ellipSize / 2) + (settings05.circles[l - 1][0] * radDivW)) * cos(settings05.circles[l - 1][2] * angDiv);
            cY0 = cH / 2 + (settings.mainRad + (ellipSize / 2) + (settings05.circles[l - 1][1] * radDivH)) * sin(settings05.circles[l - 1][2] * angDiv);
            strokeWeight(settings05.lineStrokeW);
            line(cX, cY, cX0, cY0);
            pop();
        }
    }

    for (let d = 0; d < settings05.circles.length; d++) {
        let radDivW = (cW / 2 - settings.mainRad) / settings05.numRadDivW;
        let radDivH = (cH / 2 - settings.mainRad) / settings05.numRadDivH;
        let angDiv = TWO_PI / settings05.numAngDiv;

        let ellipSize;
        if (cW > cH) ellipSize = constrain(map(settings05.circles[d][3], settings.maxThreshold, 255, radDivH / 2, radDivH), radDivH / 2, radDivH);
        else ellipSize = constrain(map(settings05.circles[d][3], settings.maxThreshold, 255, radDivW / 2, radDivW), radDivW / 2, radDivW);

        if (d == settings05.circles.length - 1) {
            ellipSize += constrain(map(mapVal, settings.minThreshold, settings.maxThreshold, -(ellipSize / 15), (ellipSize / 15)), -(ellipSize / 15), (ellipSize / 15));
            strokeWeight(settings.ellipseStrokeW);
        }
        else strokeWeight(settings05.lineStrokeW);


        let cX = cW / 2 + (settings.mainRad + (ellipSize / 2) + (settings05.circles[d][0] * radDivW)) * cos(settings05.circles[d][2] * angDiv);
        let cY = cH / 2 + (settings.mainRad + (ellipSize / 2) + (settings05.circles[d][1] * radDivH)) * sin(settings05.circles[d][2] * angDiv);

        fill(settings.bgCol)
        ellipse(cX, cY, ellipSize * 2, ellipSize * 2);
    }

    strokeWeight(settings.ellipseStrokeW);
    if (!settings.currentDraw.includes(6)) ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    pop();
}

function draw06(mapVal) {
    settings06.numVertex = mapVal.length;
    push();
    noFill();
    stroke(settings.strokeC);
    strokeWeight(settings.ellipseStrokeW);
    beginShape();
    for (let v = 0; v < settings06.numVertex; v++) {
        let vertexDesloc = map(mapVal[v], 0, 255, 0, settings06.maxVertDesloc);
        let pX = cW / 2 + (settings.mainRad + vertexDesloc) * cos(v * (TWO_PI / settings06.numVertex));
        let pY = cH / 2 + (settings.mainRad + vertexDesloc) * sin(v * (TWO_PI / settings06.numVertex));
        curveVertex(pX, pY);
    }
    endShape(CLOSE);
    pop();
}

//from: https://editor.p5js.org/Maritega/sketches/5sqSS5_0p
function draw0708(mapVal) {
    push();
    settings0708.inc = constrain(map(mapVal, settings.minThreshold, 255, 0.2, 1), 0.2, 1);
    let numPartShow = constrain(map(mapVal, settings.minThreshold, 255, settings0708.particles.length / 2, settings0708.particles.length), settings0708.particles.length / 2, settings0708.particles.length);
    if (settings0708.p > 0) {
        var yoff = 0;
        for (var y = 0; y < settings0708.rows; y++) {
            var xoff = 0;
            for (var x = 0; x < settings0708.cols; x++) {
                var index = x + y * settings0708.cols;
                var angle = noise(xoff, yoff, settings0708.zoff) * settings0708.angMult + settings0708.angTurn;
                var v = p5.Vector.fromAngle(angle);
                v.setMag(1);
                settings0708.flowfield[index] = v;
                xoff += settings0708.inc;
            }
            yoff += settings0708.inc;

            settings0708.zoff += settings0708.zOffInc;
        }

        for (var i = 0; i < numPartShow; i++) {
            settings0708.particles[i].maxSpeed = map(mapVal, settings.minThreshold, 255, 5, 15);
            settings0708.particles[i].follow(settings0708.flowfield);
            settings0708.particles[i].update();
            settings0708.particles[i].edges();
            settings0708.particles[i].show();
        }
    }

    stroke(settings.strokeC);
    strokeWeight(settings.ellipseStrokeW);
    if (settings0708.draw07 == true) {
        fill(settings.bgCol);
        image(settings0708.canvas, 0, 0);
        if (!settings.currentDraw.includes(6)) ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    }
    else if (settings0708.draw08 == true) {
        //settings0708.ellipse.background(settings.bgCol);
        settings0708.ellipse = createGraphics(windowWidth, windowHeight);
        settings0708.ellipse.ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
        let canv = settings0708.canvas.get();
        let msk = settings0708.ellipse.get();

        canv.mask(msk);
        image(canv, 0, 0);

        ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    }

    pop();
}

function draw0910(mapVal) {
    push();
    let move = map(mapVal, settings.minThreshold, 255, 0, settings0910.maxMoveDesloc);
    let moveSelect = map(mapVal, settings.minThreshold, 255, 0, settings0910.maxMovePoints);
    settings0910.canvas.background(settings.bgCol);
    settings0910.canvas.stroke(settings.strokeC);
    settings0910.canvas.strokeWeight(settings0910.gridStroke);

    for (let x = 0; x < settings0910.vertexX.length; x++) {
        let x1 = settings0910.vertexX[x];
        for (let y = 1; y < settings0910.vertexY.length; y++) {
            let y1 = settings0910.vertexY[y - 1];
            let y2 = settings0910.vertexY[y];

            settings0910.canvas.line(x1, y1, x1, y2);
        }
    }
    for (let y = 0; y < settings0910.vertexY.length; y++) {
        let y1 = settings0910.vertexY[y];
        for (let x = 1; x < settings0910.vertexX.length; x++) {
            let x1 = settings0910.vertexX[x - 1];
            let x2 = settings0910.vertexX[x];

            settings0910.canvas.line(x1, y1, x2, y1);
        }
    }

    if (frameCount % settings0910.frameInterval == 0 && audioSource._playing == true) {
        let pointsOfSelect = floor(random(moveSelect));
        for (let s = 0; s < pointsOfSelect; s++) {
            let randX = floor(random(settings0910.vertexX.length));
            let randY = floor(random(settings0910.vertexY.length));
            settings0910.pointsOfSelect.push([randX, randY]);
        }

        for (let p = 0; p < settings0910.pointsOfSelect.length; p++) {
            settings0910.vertexX[settings0910.pointsOfSelect[p][0]] += random(-move, move);
            settings0910.vertexY[settings0910.pointsOfSelect[p][1]] += random(-move, move);
        }
    }
    stroke(settings.strokeC);
    strokeWeight(settings.ellipseStrokeW);
    if (settings0910.draw09 == true) {
        image(settings0910.canvas, 0, 0);
        fill(settings.bgCol);
        if (!settings.currentDraw.includes(6)) ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    }
    else if (settings0910.draw10 == true) {
        settings0910.ellipse = createGraphics(windowWidth, windowHeight);
        settings0910.ellipse.ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
        let canv = settings0910.canvas.get();
        let msk = settings0910.ellipse.get();

        canv.mask(msk);
        image(canv, 0, 0);

        ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    }
    pop();
}

function draw1112(mapVal) {
    push();
    settings1112.canvas.fill("#ffffff");
    settings1112.canvas.noStroke();
    settings1112.canvas.textAlign(CENTER, CENTER);
    settings1112.canvas.background(settings.bgCol);
    if (frameCount % settings1112.frameInterval == 0) {
        if (mapVal > settings.minThreshold) {
            let textToAppear = map(mapVal, settings.minThreshold, 255, 1, settings1112.maxText);
            let textNum = floor(random(1, textToAppear));

            for (let n = 0; n < textNum; n++) {
                let txt;
                let randSelect = random(100);
                let txtSize = settings1112.textSize + random(-settings1112.textSizeDev, settings1112.textSizeDev);

                if (randSelect >= 60) txt = random(100);
                else if (randSelect < 60 && randSelect >= 30) txt = '[0' + floor(random(10)) + ']';
                else if (randSelect < 30) txt = settings1112.text[floor(random(settings1112.text.length - 1))];

                let marginW = windowWidth / 30;
                let marginH = windowHeight / 20;
                let x = random(marginW, windowWidth - marginW);
                let y = random(marginH, windowHeight - marginH);

                settings1112.textArray.push([txt, x, y, txtSize]);
            }
        }
        else {
            let textToRemove = map(mapVal, settings.minThreshold, 0, 1, settings1112.maxText);
            for (let r = 0; r < floor(textToRemove); r++) {
                settings1112.textArray.pop();
            }
        }
    }
    for (let t = 0; t < settings1112.textArray.length; t++) {
        settings1112.canvas.textSize(settings1112.textArray[t][3]);
        settings1112.canvas.text(settings1112.textArray[t][0], settings1112.textArray[t][1], settings1112.textArray[t][2]);
    }

    stroke(settings.strokeC);
    strokeWeight(settings.ellipseStrokeW);

    if (settings1112.draw11 == true) {
        image(settings1112.canvas, 0, 0);
        fill(settings.bgCol);
        if (!settings.currentDraw.includes(6)) ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    }
    else if (settings1112.draw12 == true) {
        settings1112.ellipse = createGraphics(windowWidth, windowHeight);
        settings1112.ellipse.ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
        let canv = settings1112.canvas.get();
        let msk = settings1112.ellipse.get();

        canv.mask(msk);
        image(canv, 0, 0);

        ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    }
    pop();
}

function draw13(mapVal) {
    push();
    stroke(settings.strokeC);
    strokeWeight(settings.ellipseStrokeW);

    let numLines = map(mapVal, settings.minThreshold, 255, 1, settings13.maxNumLines);
    let rotSpeed = map(mapVal, settings.minThreshold, 255, PI / settings13.minRotSpeed, PI / settings13.maxRotSpeed);

    settings13.numLines += floor(numLines);
    settings13.numLines = constrain(settings13.numLines, 0, settings13.maxNumLines);

    for (let l = 0; l < settings13.numLines; l++) {
        if (settings13.animPlay[l] == false) settings13.animPlay[l] = true;
    }

    for (let r = 0; r < settings13.numLines; r++) {
        if (settings13.animPlay[r] == true) {
            if (settings13.rotateAng[r] < TWO_PI) settings13.rotateAng[r] += rotSpeed;
            else {
                settings13.rotateAng[r] = 0;
                settings13.animPlay[r] = false;
            }
            push();
            strokeWeight(settings13.rotEllipseStroke);
            translate(windowWidth / 2, windowHeight / 2, 0)
            rotateY(settings13.rotateAng[r]);
            ellipse(0, 0, settings.mainRad * 2, settings.mainRad * 2);
            pop();
        }
    }



    ellipse(cW / 2, cH / 2, settings.mainRad * 2, settings.mainRad * 2);
    pop();
}

function setupMarble() {
    for (let x = 0; x < settingsMarble.numVertex + 1; x++) {
        settingsMarble.globe[x] = [];
        settingsMarble.globeCol[x] = [];
        for (let y = 0; y < settingsMarble.numVertex + 1; y++) {
            settingsMarble.globe[x][y] = 0;
            settingsMarble.globeCol[x][y] = 0;
        }
    }
}

function generateMarble(rad) {
    settingsMarble.a = 1;
    settingsMarble.b = constrain(map(playerData.consistencyAvg, maxMin.minAvgConsist, maxMin.maxAvgConsist, settingsMarble.maxWidth, settingsMarble.minWidth), settingsMarble.minWidth, settingsMarble.maxWidth);
    settingsMarble.m = constrain(map(playerData.stabilityAvg, 0, 1, settingsMarble.maxSides, settingsMarble.minSides), settingsMarble.minSides, settingsMarble.maxSides);
    settingsMarble.n1 = constrain(map(playerData.speedAvg, maxMin.minAvgRhythm, maxMin.maxAvgRhythm, settingsMarble.minN, settingsMarble.maxN), settingsMarble.minN, settingsMarble.maxN);
    settingsMarble.n2 = constrain(map(playerData.engagementAvg, maxMin.minAvgEngag, maxMin.maxAvgEngag, settingsMarble.minN, settingsMarble.maxN), settingsMarble.minN, settingsMarble.maxN);
    settingsMarble.n3 = constrain(map(playerData.deviationAvg, maxMin.minAvgDev, maxMin.maxAvgDev, settingsMarble.minN, settingsMarble.maxN), settingsMarble.minN, settingsMarble.maxN);

    for (let i = 0; i < settingsMarble.numVertex + 1; i++) {
        let lat = map(i, 0, settingsMarble.numVertex, -HALF_PI, HALF_PI);
        let r2 = superShape(settingsMarble.a, settingsMarble.b, lat, settingsMarble.m, settingsMarble.n1, 1.7, 1.7);
        for (let j = 0; j < settingsMarble.numVertex + 1; j++) {
            let lon = map(j, 0, settingsMarble.numVertex, -PI, PI);
            let r1 = superShape(settingsMarble.a, settingsMarble.b, lon, settingsMarble.m, settingsMarble.n1, 1.7, 1.7);

            let xx = rad * r1 * cos(lon) * r2 * cos(lat);
            let yy = rad * r1 * sin(lon) * r2 * cos(lat);
            let zz = rad * r2 * sin(lat);

            settingsMarble.globe[i][j] = createVector(xx, yy, zz);

            let rr = red(playerData.color) + random(-settingsMarble.maxColorDev, settingsMarble.maxColorDev);
            rr = constrain(rr, 0, 255);
            let gg = green(playerData.color) + random(-settingsMarble.maxColorDev, settingsMarble.maxColorDev);
            gg = constrain(gg, 0, 255);
            let bb = blue(playerData.color) + random(-settingsMarble.maxColorDev, settingsMarble.maxColorDev);
            bb = constrain(bb, 0, 255);

            settingsMarble.globeCol[i][j] = [rr, gg, bb];
        }
    }
    settingsMarble.marbleGenerated = true;
    console.log(settingsMarble.marbleGenerated)
}

function superShape(a, b, theta, m, n1, n2, n3) {
    let t1 = abs((1 / a) * cos(m * theta / 4));
    t1 = pow(t1, n2);
    let t2 = abs((1 / b) * sin(m * theta / 4));
    t2 = pow(t2, n3);
    let t3 = t1 + t2;
    let r = pow(t3, -1 / n1);
    return r;
}

function showMarble(rad) {
    for (let n = 0; n < settingsMarble.numVertex; n++) {
        push();
        stroke(settingsMarble.strokeCol);
        strokeWeight(settingsMarble.soulStroke);
        beginShape(TRIANGLE_STRIP);
        //beginShape();
        for (let m = 0; m < settingsMarble.numVertex + 1; m++) {
            fill(settingsMarble.globeCol[n][m][0], settingsMarble.globeCol[n][m][1], settingsMarble.globeCol[n][m][2]);
            let v1 = settingsMarble.globe[n][m];
            vertex(v1.x, v1.y, v1.z);
            fill(settingsMarble.globeCol[n + 1][m][0], settingsMarble.globeCol[n + 1][m][1], settingsMarble.globeCol[n + 1][m][2]);
            let v2 = settingsMarble.globe[n + 1][m];
            vertex(v2.x, v2.y, v2.z);
        }
        endShape();
        pop();
    }



    //marble container sphere
    push();
    //noFill();
    fill(red(settingsMarble.strokeCol), green(settingsMarble.strokeCol), blue(settingsMarble.strokeCol), settingsMarble.sphereOpac)
    stroke(settingsMarble.strokeCol);
    strokeWeight(settingsMarble.sphereStroke);
    sphere(settings.maxMainRad);
    pop();

}



//From Daniel Shiffman: https://youtu.be/BjoM9oKOAKY
class Particle {
    constructor() {
        this.pos = createVector(random(windowWidth), random(windowHeight));
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxspeed = 10;
        this.prevPos = this.pos.copy();
        this.stroke = random(0.5, 1.2);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    follow(vectors) {
        var x = floor(this.pos.x / settings0708.scl);
        var y = floor(this.pos.y / settings0708.scl);
        var index = x + y * settings0708.cols;
        var force = vectors[index];
        this.applyForce(force);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    show() {
        settings0708.canvas.stroke(255);
        settings0708.canvas.strokeWeight(this.stroke);
        settings0708.canvas.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        this.updatePrev();
    }

    updatePrev() {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    }

    edges() {
        if (this.pos.x > windowWidth) {
            this.pos.x = 0;
            this.updatePrev();
        }
        if (this.pos.x < 0) {
            this.pos.x = windowWidth;
            this.updatePrev();
        }
        if (this.pos.y > windowHeight) {
            this.pos.y = 0;
            this.updatePrev();
        }
        if (this.pos.y < 0) {
            this.pos.y = windowHeight;
            this.updatePrev();
        }

    }

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

                // Set img src to ObjectURL
                //var imgDisplay = document.getElementById("elephant");
                //imgDisplay.setAttribute("src", imgURL);
                audioSource = loadSound(imgURL);
                console.log(audioSource);

                if (audioSource.isLoaded()) {
                    // Revoking ObjectURL
                    URL.revokeObjectURL(imgURL);
                }

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



//MISSING LETTER ADD ON
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
    let gmPerSec = data.finalStats.gameModes.sort((a, b) => a.finalTime - b.finalTime);
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
    for (let i = 0; i < allClicks.length; i++) {
        if (allClicks[i][1] > engagement[currentEngagMode].maxTime) {
            if (currentEngagMode < engagement.length - 1) currentEngagMode += 1;
        }

        engagementPerClick[i] = engagement[currentEngagMode];
        if (engagementPerClick[i].engagement >= maxEngag) maxEngag = engagementPerClick[i].engagement;
        if (engagementPerClick[i].engagement < minEngag) minEngag = engagementPerClick[i].engagement;

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