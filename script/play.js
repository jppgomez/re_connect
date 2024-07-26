
//let serverUrl = "https://re-connect-server.cyclic.app/save";
//let serverUrl = "http://localhost:5000/save";
let serverUrl = "https://reconnect-server-fe5eed935188.herokuapp.com/save";

let language = parent.document.URL.substring(parent.document.URL.indexOf('?lang=')+6, parent.document.URL.indexOf('?lang=')+9);
let audioProg = parent.document.URL.substring(parent.document.URL.indexOf('?lang=') + 12, parent.document.URL.length-1);
       
let dots = [];
let numDots = 9;

let colorPallete = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93', '#FFFFFF'];
let shapes = ['ellipse', 'rectangle', 'triangle', 'star'];
let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let sounds = [];
let score = 0;

let font;

let gameMode = 0;

let time;
let gameModeTimer = 0;
let gameModeChangingRate = 10;

let gameModeChangeRandom = true; //change to false in order to have a random tour in the beggining - passing through all game modes before allowing user to choose
let gameModeChangeRandomCounter = 0;

let gameModeRandom = false;
let nGameModes = 8;

let enterButton, exitButton;

/*GAMEMODES:
[00] .default
[01] .colors
[02] .shapes
[03] .letters
[04] .lines (connected dots)
[05] .sound feedback
[06] .random score (reach 100 points) - add or remove 1 point on click (random)
[07] .one colored dot only (challenge)
*/


let data = {
  device: {
    browser: window.navigator.userAgent,
    width: window.innerWidth,
    height: window.innerHeight
  },
  clicks: {
    true: [],
    false: []
  },
  gameModes: {
    colors: {
      show: [0,0,0,0,0,0],
      click: [0,0,0,0,0,0]
    },
    shapes: {
      show: [0,0,0,0],
      click: [0,0,0,0]
    },
    letters: {
      show: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      click: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    },
    lines: [],
    sounds: [0,0,0,0,0],
    maxScore: 0,
    target: {
      targetHits: 0,
      totalClicks: 0
    }
  },
  finalStats: {
    finalTime: 0,
    gameModes: [],
    finalPositions: []
  }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  font = loadFont('../assets/fonts/RobotoMono-Regular.ttf');
  textFont(font);
  imageMode(CENTER);
  textAlign(CENTER,CENTER);

  let initSize;
  if(windowWidth > windowHeight) initSize = windowWidth/20;
  else initSize = windowHeight/18;

  //INIT SOUNDS
  for(let s = 0; s < 5; s++){
    sounds[s] = loadSound('./assets/sound/Game/' + s + '.wav');
  }

  //INIT DOTS
  for(let m = 0; m < numDots; m++){
    dots[m] = new Dot(m, m*100, m*100, initSize, color(255,255,255), 'ellipse');
  }
  //INIT MOVE DOTS
  for(let t = 0; t < dots.length; t++){
    dots[t].move();
  }
}

function draw() {
  background(0);


  //PLAY SCREEN
  cursor('./assets/MainCursor.svg');
  time = roundToTwo(frameCount/frameRate());
  for(let i = 0; i < dots.length; i++) dots[i].show();  

  //CONNECT DOTS
  if(gameMode == 4) connectDots();

  //SCORE
  if(gameMode == 6) {
    document.querySelector("#scoreLog").style.display = "flex";
  }
  else document.querySelector("#scoreLog").style.display = "none";

  //GAMEMODE TIMER
  gameModeTimer += 1/frameRate();
  if(time > 1 && time % gameModeChangingRate == 0 && gameModeTimer > 6){
  if(gameModeChangeRandomCounter >= 7) gameModeChangeRandom = true; 
  
  if(gameModeChangeRandom == false) changeModeSequential();
  }
  if(gameModeChangeRandom == true) changeModeSelect();

  //RECORD FINAL TIME + FINAL DOTS POSITION
  data.finalStats.finalTime = time;
  for(let d = 0; d < dots.length; d++){
    let position = [int(dots[d].pX), int(dots[d].pY)];
    if(data.finalStats.finalPositions[d]) data.finalStats.finalPositions[d] = position;
    else data.finalStats.finalPositions.push(position);
  }
}

function mousePressed(){
  //PLAY GAME
  let click = [false, time, mouseX, mouseY, gameMode];
  for(let i = 0; i < dots.length; i++){
    //TRUE CLICKS
    if(dist(mouseX, mouseY, dots[i].pX, dots[i].pY) <= dots[i].size){
       //dots[i].prevX = dots[i].pX;
       //dots[i].prevY = dots[i].pY;

       //CLICK LOG
       click = [true, time, int(dots[i].pX), int(dots[i].pY), gameMode, dots[i].id, [red(dots[i].color),green(dots[i].color),blue(dots[i].color)], dots[i].shape];

       //GAMEMODE DOT CHANGE
       if(gameMode == 1) dots[i].chageColor();
       else if(gameMode == 2) dots[i].changeShape();
       else if(gameMode == 3) dots[i].changeLetters();
       //gameMode == 4 => draw();
       else if(gameMode == 5) dots[i].playSound();
       else if(gameMode == 6) dots[i].changeScore();
       else if(gameMode == 7) dots[i].changeTarget();
       
       //RECORD POSITION OF CONNECTED DOTS
       if(gameMode == 4){
        for(let c = 0; c < dots.length; c++){
          let pos = [int(dots[c].pX), int(dots[c].pY)];
          if(data.gameModes.lines[c]) data.gameModes.lines[c] = pos;
          else data.gameModes.lines.push(pos);
        }
       }

       dots[i].move();
    }
  }
  //RECORD CLICK
  if(click[0] == true) data.clicks.true.push(click);
  else if(click[0] == false) data.clicks.false.push(click);
}

//EXIT GAME - SUBMIT DATA
document.querySelector("#exit").addEventListener("click", () => {
  svJSON(data);
    fetch(serverUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
  })
  .then(response => console.log(response))
  .then(setTimeout(() => {
    //window.location.reload();
    window.location.href = "./creating.html?lang=" + language + '&t=' + audioProg;
  }, 500))
  .catch(error => console.log('Authorization failed : ' + error.message))
    console.log(data);
  }
  );

  function svJSON(data){
    let st = JSON.stringify(data);
    let bb = new Blob([st],  { type : 'application/json' });

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
            putInDb(bb);
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

                let reader = new FileReader();
                reader.onload = function (event) {
                  const jsonData = 
                      JSON.parse(event.target.result);
                      console.log(jsonData);
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
                    getFile(bb);
                };
            }
            else {
                getFile(bb);
            }
        }
        else {
            getFile(bb);
        }
    }
    
    // For future use. Currently only in latest Firefox versions
    request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
    };
  }


function changeModeSequential(){
  let gM = {
    gameMode: gameMode,
    finalTime: time
  }
  data.finalStats.gameModes.push(gM);

  gameModeTimer = 0;
  dotsReset();

  gameModeChangeRandomCounter ++;
  gameMode++;
  console.log('Game Mode Changed :)');

  if(gameMode == 3) resetToLetters();
  else if(gameMode == 7) {
    dotsReset();
    let randomDot = int(random(0, dots.length));
    dots[randomDot].color = color(255,0,0);
  }
  else if(gameMode == 2) data.gameModes.shapes.show[0]+=numDots;
  else if(gameMode == 1) data.gameModes.colors.show[5]+=numDots;
}

function changeModeSelect(){
  document.querySelector("#selectGame").style.display = "flex"; 
  document.querySelector("#exit").style.display = "flex";

  if(gameModeRandom == false){
    dotsReset();
    gameMode = Math.trunc(random(0, 8));
    console.log('Game Mode Changed :)');

    if(gameMode == 3) resetToLetters();
    else if(gameMode == 7) {
      dotsReset();
      let randomDot = int(random(0, dots.length));
      dots[randomDot].color = color(255,0,0);
    }
    else if(gameMode == 2) data.gameModes.shapes.show[0]+=numDots;
    else if(gameMode == 1) data.gameModes.colors.show[5]+=numDots;
    
    document.querySelector("#GM" + gameMode).innerHTML = "<b>[0" + gameMode + "]</b>";
    let gM = {
      gameMode: gameMode,
      finalTime: time
    }
    data.finalStats.gameModes.push(gM);
    gameModeRandom = true;
  }
  
  
  
}


for(let g = 0; g < nGameModes; g++){ 
  document.querySelector("#GM" + g).addEventListener("click", () => {
    for(let f = 0; f < nGameModes; f++) document.querySelector("#GM" + f).innerHTML = "[0" + f + "]";
    document.querySelector("#GM" + g).innerHTML = "<b>[0" + g + "]</b>";
    dotsReset();
    let gM = {
      gameMode: gameMode,
      finalTime: time
    }
    data.finalStats.gameModes.push(gM);
    
    gameModeTimer = 0;
    gameMode = g;
    
    if(gameMode == 3) resetToLetters();
    else if(gameMode == 7) {
    dotsReset();
    let randomDot = int(random(0, dots.length));
    dots[randomDot].color = color(255,0,0);
    }
    else if(gameMode == 2) data.gameModes.shapes.show[0]+=numDots;
    else if(gameMode == 1) data.gameModes.colors.show[5]+=numDots;
  });
}

class Dot {
  constructor(id, pX, pY, size, color, shape){
    this.id = id; 
    this.pX = pX;
    this.pY = pY;
    this.size = size;
    this.color = color;
    this.shape = shape;
    //this.prevX;
    //this.prevY;
  }

  show(){
    fill(this.color);
    noStroke();

    if(this.shape == 'ellipse') ellipse(this.pX, this.pY, this.size, this.size);
    else if(this.shape == 'rectangle') rect(this.pX, this.pY, this.size, this.size);
    else if(this.shape == 'triangle') triangle(this.pX, this.pY-this.size/2, this.pX+this.size/2, this.pY+this.size/2, this.pX-this.size/2, this.pY+this.size/2);
    else if(this.shape == 'star') star(this.pX, this.pY, this.size/3, 2*this.size/3, 5);
    else text(this.shape, this.pX, this.pY);
  }

  move(){
    let randompX = random(this.size, windowWidth-this.size);
    let randompY = random(this.size, windowHeight-this.size); 

    let overlap = false;
    for(let j = 0; j < dots.length; j++){
      if(j != this.id && abs(dist(randompX, randompY, dots[j].pX, dots[j].pY))< this.size + dots[j].size) {
        overlap = true;
        this.move();
      }
    }
    if(!overlap){
      this.pX = randompX;
      this.pY = randompY;
    } 
  }

  chageColor(){
    //RECORD CLICKED COLOR
    if(red(this.color) == 255 && green(this.color) == 89 && blue(this.color) == 94) data.gameModes.colors.click[0]+=1;
    else if(red(this.color) == 255 && green(this.color) == 202 && blue(this.color) == 58) data.gameModes.colors.click[1]+=1;
    else if(red(this.color) == 138 && green(this.color) == 201 && blue(this.color) == 38) data.gameModes.colors.click[2]+=1;
    else if(red(this.color) == 25 && green(this.color) == 130 && blue(this.color) == 196) data.gameModes.colors.click[3]+=1;
    else if(red(this.color) == 106 && green(this.color) == 76 && blue(this.color) == 147) data.gameModes.colors.click[4]+=1;
    else data.gameModes.colors.click[5]+=1;

    //CHANGE COLOR
    let randomColor = int(random(0,colorPallete.length));
    this.color = color(colorPallete[randomColor]);
    
    //RECORD SHOWN COLOR
    data.gameModes.colors.show[randomColor]+=1;
  }

  changeShape(){
    //RECORD CLICKED SHAPE
    if(this.shape=="ellipse") data.gameModes.shapes.click[0]+=1;
    else if(this.shape=="rectangle") data.gameModes.shapes.click[1]+=1;
    else if(this.shape=="triangle") data.gameModes.shapes.click[2]+=1;
    else if(this.shape=="star") data.gameModes.shapes.click[3]+=1;

    //CHANGE SHAPE
    let randomShape = int(random(0, shapes.length));
    this.shape = shapes[randomShape];

    //RECORD SHOWN SHAPE
    data.gameModes.shapes.show[randomShape]+=1;
  }

  changeLetters(){
    //RECORD CLICKED LETTER
    for(let l=0; l<letters.length;l++){
      if(this.shape == letters[l]) data.gameModes.letters.click[l]+=1;
    }

    //CHANGE LETTER
    let randomLetter = int(random(0, letters.length));
    this.shape = letters[randomLetter];

    //RECORD SHOWN LETTER
    data.gameModes.letters.show[randomLetter]+=1;
  }

  playSound(){
    //PLAY RANDOM SOUND && RECORD SOUND PLAYED
    let randomSound = int(random(0, sounds.length*2));
    if(randomSound < sounds.length){
      sounds[randomSound].play();
      data.gameModes.sounds[randomSound]+=1;
    }
  }

  changeScore(){
    //CHANGE SCORE RANDOMLY
    let randomScore;
    if(score <= 5)  randomScore = int(random(0,2)); 
    else randomScore = int(random(-2,2));
    score += randomScore;
    
    if(language == 'eng'){
      document.querySelector("#scoreLog").innerHTML = "[reach 15 points] <br> current score: " + score;  
    }
    else if(language == 'prt'){
      document.querySelector("#scoreLog").innerHTML = "[atingir 15 pontos] <br> pontuação atual: " + score;
    }
    //RECORD SCORE
    data.gameModes.maxScore = score;
  }

  changeTarget(){
    //RECORD TARGET HIT OR MISS
    if(red(this.color) == 255 && green(this.color) == 0 && blue(this.color) == 0) data.gameModes.target.targetHits += 1;
    data.gameModes.target.totalClicks += 1;

    //MOVE TARGET TO OTHER DOT (20% CHANCE) - ELSE ONLY MOVES RED DOT
    let changeTarget = int(random(0,10));
    if(changeTarget >= 8){
      dotsReset();
      let randomDot = int(random(0, dots.length));
      dots[randomDot].color = color(255,0,0);
    }
  }
}

function connectDots(){
  //CONNECT DOTS
  strokeWeight(5);
  stroke(255,255,255);
  for(let i = 1; i < dots.length; i++){
    line(dots[i].pX, dots[i].pY, dots[i-1].pX, dots[i-1].pY);
  }
}

function dotsReset(){
  //RESET DOTS COLOR AND SHAPE
  noStroke();
  for(let i = 0; i < dots.length; i++){
    dots[i].color = color(255,255,255);
    dots[i].shape = 'ellipse';
  }
}

function resetToLetters(){
  //RESET DOTS TO LETTERS
  textSize(windowWidth/15);
  textAlign(CENTER);
  for(let i = 0; i < dots.length; i++){
    let randomLetter = int(random(0, letters.length));
    dots[i].shape = letters[randomLetter];

    //RECORD PRESENTED LETTERS
    data.gameModes.letters.show[randomLetter]+=1;
  }
}

//DRAW STAR
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

//round value to two decimal places - from https://stackoverflow.com/a/18358056
function roundToTwo(num){
  return +(Math.round(num + "e+2")  + "e-2");
}

//RESIZE CANVAS
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  //RECORD UPDATED DATA
  data.device.width = windowWidth;
  data.device.height = windowHeight;

  window.location.reload();
}