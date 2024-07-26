let containers = [];
let selectCombo = [];
let possibComboTop = ['3 / 9', '3 / 6', '3 / 5', '3 / 7'];
let possibComboBot = ['none', '6 / 9',  '5 / 9', '7 / 9'];
let finalCombo = [];

let vertImgCount = 308;
let sqImgCount = 94;
let horizImgCount = 36;

for(let a = 1; a <= 6; a++){
    containers[a] = document.getElementById("archive_"+(a));
    containers[a].style.display = 'block';
}

setupGrid();

function setupGrid(){
    for(let c = 1; c < 6; c+=2){
    if(c % 2 == 1){
        let randSelect = Math.floor(random(0, possibComboTop.length));
        selectCombo[c] = randSelect;    
    }

    if(selectCombo[c] == 0){
        containers[c].style.gridRow = possibComboTop[selectCombo[c]];
        finalCombo[c] = 'vert';
        containers[c+1].style.display = 'none';
        finalCombo[c+1] = 'none';
    }
    else {
        containers[c].style.gridRow = possibComboTop[selectCombo[c]];
        containers[c+1].style.gridRow = possibComboBot[selectCombo[c]];
        containers[c].style.display = 'block';
        containers[c+1].style.display = 'block';
        
        if(selectCombo[c] == 1){
            finalCombo[c] = 'square';
            finalCombo[c+1] = 'square';
        }
        else if(selectCombo[c] == 2){
            finalCombo[c] = 'horiz';
            finalCombo[c+1] = 'vert';
        }
        else if(selectCombo[c] == 3){
            finalCombo[c] = 'vert';
            finalCombo[c+1] = 'horiz';
        }
    }
}
setImages();
}


function setImages(){
    for(let c = 1; c < finalCombo.length; c++){
        let randImg;
        let imgPath;
        console.log(finalCombo[c]);
        if(finalCombo[c] == 'vert'){
            randImg = Math.floor(random(1, vertImgCount));
            imgPath = './assets/archive/Vertical/'+randImg+'.jpg';
           
        }
        else if(finalCombo[c] == 'horiz'){
            randImg = Math.floor(random(1, horizImgCount));
            imgPath = './assets/archive/Horizontal/'+randImg+'.jpg';
        }
        else if(finalCombo[c] == 'square'){
            randImg = Math.floor(random(1, sqImgCount));
            imgPath = './assets/archive/Square/'+randImg+'.jpg';
        }

        if(finalCombo[c]!='none'){
            containers[c].style.backgroundImage = 'url(' + imgPath + ')';
           
          }
        
    }
}

advance.addEventListener('click', ()=>{
    setupGrid();
    setImages();
})


function random(min, max) {
    return Math.random() * (max - min) + min;
  }
