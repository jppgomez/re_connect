import * as THREE from 'three';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';


let allData, oneData, allClicks;
let playerCaract = [], playerData, playerDataPerGM;
let currentGame = 0;
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

//From Daniel Shiffman's interpretation of Reza Ali's Supershapes
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/akM4wMZIBWg

//Reza Ali: https://www.syedrezaali.com/3d-supershapes


let settings = {
    globe: [],
    globeCol: [],
    numVertex: 100,
    radius: 1,
    minSides: 3,
    maxSides: 30,
    minWidth: 0.8, //out of 1 => b
    maxWidth: 0.95,
    minN: 0.5,
    maxN: 1.5,

    maxColorDev: 40,
    sphereStroke: 0.2,
    soulStroke: 0.1,
    strokeCol: '#ffffff',
    sphereOpac: 30,

    m: 0,
    a: 0,
    b: 0,
    n1: 0,
    n2: 0,
    n3: 0,

    marbleGenerated: false,

    geom: 0,
    vertArray: 0,
    vert: [],
    mat1: 0,
    mat2: 0,
    mesh: 0,
    sphereMesh: 0,
}


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

            currentGame = allData.length-1;
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

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
document.querySelector('canvas').style.display = 'none';

for (let x = 0; x < settings.numVertex + 1; x++) {
    settings.globe[x] = [];
    settings.globeCol[x] = [];
    for (let y = 0; y < settings.numVertex + 1; y++) {
        settings.globe[x][y] = 0;
        settings.globeCol[x][y] = 0;
    }
}

settings.geom = new THREE.BufferGeometry();
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.z = 3;
scene.add(directionalLight);

scene.add(new THREE.AmbientLight(0xffffff))

camera.position.z = 4;

// Instantiate an exporter
const exporter = new OBJExporter();
const marbleLink = document.createElement('a');
marbleLink.style.display = 'none';
document.body.appendChild(marbleLink);

document.getElementById("files_marble").addEventListener("click", (e) => {
    const data = exporter.parse(scene);
    let fileName;
    if (currentGame + 1 < 10) fileName = "ReConnect_Marble_[0" + (currentGame + 1) + '].obj';
    else fileName = "ReConnect_Marble_[" + (currentGame + 1) + '].obj';

    saveString(data, fileName);
});

function saveString(text, filename) {
    save(new Blob([text], { type: 'text/plain' }), filename);
}

function save(blob, filename){
    marbleLink.href = URL.createObjectURL( blob );
    marbleLink.download = filename;
    marbleLink.click();
}

function animate() {
    if (gotData == true) {
        if (settings.marbleGenerated == false) generateMarble();
        else {
            //settings.mesh.rotation.y += 0.05;
            //settings.sphereMesh.rotation.y += 0.05;
        }

        renderer.render(scene, camera);
    }
    else getData();
}

function superShape(a, b, theta, m, n1, n2, n3) {
    let t1 = Math.abs((1 / a) * Math.cos(m * theta / 4));
    t1 = Math.pow(t1, n2);
    let t2 = Math.abs((1 / b) * Math.sin(m * theta / 4));
    t2 = Math.pow(t2, n3);
    let t3 = t1 + t2;
    let r = Math.pow(t3, -1 / n1);

    return r;
}

function generateMarble() {
    settings.a = 1;
    settings.b = constrain(map(playerData.consistencyAvg, maxMin.minAvgConsist, maxMin.maxAvgConsist, settings.maxWidth, settings.minWidth), settings.minWidth, settings.maxWidth);
    settings.m = constrain(map(playerData.stabilityAvg, 0, 1, settings.maxSides, settings.minSides), settings.minSides, settings.maxSides);
    settings.n1 = constrain(map(playerData.speedAvg, maxMin.minAvgRhythm, maxMin.maxAvgRhythm, settings.minN, settings.maxN), settings.minN, settings.maxN);
    settings.n2 = constrain(map(playerData.engagementAvg, maxMin.minAvgEngag, maxMin.maxAvgEngag, settings.minN, settings.maxN), settings.minN, settings.maxN);
    settings.n3 = constrain(map(playerData.deviationAvg, maxMin.minAvgDev, maxMin.maxAvgDev, settings.minN, settings.maxN), settings.minN, settings.maxN);

    for (let i = 0; i < settings.numVertex + 1; i++) {
        let lat = map(i, 0, settings.numVertex, -(Math.PI / 2), (Math.PI / 2));
        let r2 = superShape(settings.a, settings.b, lat, settings.m, settings.n1, 1.7, 1.7);
        for (let j = 0; j < settings.numVertex + 1; j++) {
            let lon = map(j, 0, settings.numVertex, -(Math.PI), (Math.PI));
            let r1 = superShape(settings.a, settings.b, lon, settings.m, settings.n1, 1.7, 1.7);

            let xx = settings.radius * r1 * Math.cos(lon) * r2 * Math.cos(lat);
            let yy = settings.radius * r1 * Math.sin(lon) * r2 * Math.cos(lat);
            let zz = settings.radius * r2 * Math.sin(lat);
            settings.globe[i][j] = [xx, yy, zz];
            /*    let rr = red(playerData.color) + random(-settings.maxColorDev, settings.maxColorDev);
                  rr = constrain(rr, 0, 255);
                  let gg = green(playerData.color) + random(-settings.maxColorDev, settings.maxColorDev);
                  gg = constrain(gg, 0, 255);
                  let bb = blue(playerData.color) + random(-settings.maxColorDev, settings.maxColorDev);
                  bb = constrain(bb, 0, 255);
            
                  settings.globeCol[i][j] = [rr, gg, bb];*/
        }
    }
    for (let n = 0; n < settings.numVertex; n++) {
        for (let m = 0; m < settings.numVertex + 1; m++) {
            let v1 = settings.globe[n][m];
            let v2 = settings.globe[n + 1][m];
            settings.vert.push(v1[0], v1[1], v1[2]);
            settings.vert.push(v2[0], v2[1], v2[2]);
        }
    }

    settings.vertArray = new Float32Array(settings.vert);
    settings.geom.setAttribute('position', new THREE.BufferAttribute(settings.vertArray, 3));
    settings.geom = BufferGeometryUtils.toTrianglesDrawMode(settings.geom, THREE.TriangleStripDrawMode);
    settings.mesh = new THREE.Mesh(settings.geom, new THREE.MeshStandardMaterial({ color: 0xffffff }));
    scene.add(settings.mesh);

    const sphere = new THREE.SphereGeometry(settings.radius, 32, 16);
    settings.sphereMesh = new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
    //scene.add(settings.sphereMesh);

    settings.marbleGenerated = true;
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
        rythmDev: (Math.abs(totalRythmAvg - playerChars.speedAvg) / (totalRythmAvg * 2)),
        consistDev: (Math.abs(totalConsistAvg - playerChars.consistencyAvg) / (totalConsistAvg * 2)),
        engagDev: (Math.abs(totalEngagAvg - playerChars.engagementAvg) / (totalEngagAvg * 2)),
        stabilDev: (Math.abs(totalStabilAvg - playerChars.stabilityAvg) / (totalStabilAvg * 2))
    }

    let deviationAverage = (devPerStats.rythmDev + devPerStats.consistDev + devPerStats.engagDev + devPerStats.stabilDev) / 4;

    let deviat = [];
    for (let a = 0; a < playerChars.numClicks; a++) {
        let userSum = (playerChars.speedPerClick[a] + playerChars.consistencyPerClick[a].consist + playerChars.engagementPerClick[a].engagement + playerChars.stabilityPerClick[a]) / 4;
        let avgSum = (totalRythmAvg + totalConsistAvg + totalEngagAvg + totalStabilAvg) / 4;
        deviat[a] = (Math.abs(avgSum - userSum) / (avgSum * 4));

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

    let dev = {
        devPerClick: deviat,
        devAvg: deviationAverage,
        devPerStat: devPerStats,
    }

    return dev;
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

function constrain(val, min, max) {
    if (val > max) val = max;
    if (val < min) val = min;

    return val;
}

function map(val, min1, max1, min2, max2) {
    val = (val - min1) / (max1 - min1);
    return min2 + val * (max2 - min2);
}