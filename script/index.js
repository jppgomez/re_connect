let ptFlag = document.getElementById("lang_pt");
let engFlag = document.getElementById("lang_eng");
let fieldText = document.getElementById("select_lang_text");

ptFlag.addEventListener("mouseenter", () => {
    ptFlag.style.backgroundImage = "url('./assets/flags/PT_Inv.svg')";
    fieldText.innerHTML = 'português';

    document.getElementById("descript_text").innerHTML = "<b>[nota:]</b> selecionar <i>fullscreen</i> [f11] horizontal no dispositivo</br> e utilizar <i>headphones</i> para uma melhor experiência."
});

ptFlag.addEventListener("mouseleave", () => {
    ptFlag.style.backgroundImage = "url('./assets/flags/PT_Reg.svg')";
    fieldText.innerHTML = '[selecione idioma]';
});

engFlag.addEventListener("mouseenter", () => {
    engFlag.style.backgroundImage = "url('./assets/flags/UK_Inv.svg')";
    fieldText.innerHTML = 'english';

    document.getElementById("descript_text").innerHTML = "<b>[note:]</b> turn your device into horizontal fullscreen [f11]</br> and wear headphones for a better experience."
});

engFlag.addEventListener("mouseleave", () => {
    engFlag.style.backgroundImage = "url('./assets/flags/UK_Reg.svg')";
    fieldText.innerHTML = '[select laguage]';
});

ptFlag.addEventListener("click", () =>{
    location.href = "./enter.html?lang=prt";
})

engFlag.addEventListener("click", () => {
    location.href = "./enter.html?lang=eng";
})