/**
 * Aron Hrafnsson
 */
var score = 0;
var nrQuestion = 0;
var fjoldispurninga = 10;
var samtals = 0;


function Questions(q1, q2, answ, ransw, svar, rettsvar){
    this.q1 = q1;
    this.q2 = q2;
    this.answ = answ;
    this.ransw = ransw;
    this.svar = svar;
    this.rettsvar = rettsvar;
}

/**
 * Til að bua til random tölu
 * @param a
 * @returns {number}
 * @constructor
 */

function Rand(a) {
    return Math.floor(Math.random() * a) + 1;
}

/**
 * Til að finna id á index
 * @param id_nafn
 * @returns {Element}
 * @constructor
 */
function Get_id(id_nafn){ // Function fyrir getElementById
    return document.getElementById(id_nafn);
}

/**
 * Býr til spurningu úr random int frá 0 til 10
 * Svarið getur verið uppí 100
 * Ransw er array til að halda utanum öll svörin
 * @returns {Questions}
 * @constructor
 */

function Question(){
    var q1 = Rand(10);
    var q2 = Rand(10);

    var svar = q1 * q2; // Til að setja réttsvar í ransw arrayið
    var rettsvar = q1 * q2; // Svo að ég gat séð hvað væri rétt svar i CheckAnswer();

    var answ = [];
    answ.push(Rand(100)); // 0
    answ.push(Rand(100)); // 1
    answ.push(Rand(100)); // 2
    answ.push(Rand(100)); // 3

    var ransw = Rand(3);  // Setur svarið á random stað í arrayinu
    answ[ransw] = svar;   // setur það inní arrayið

    return new Questions(q1, q2, answ, ransw, svar, rettsvar); // Setur í Objectinn
}

function loadQuestion(){
    Progress_bar();
    var spurning = new Question(); // Byr til nýtt Question();
    var main = Get_id("main"); // Staðsetning á div id="main"
    var output = "";
    var rett =  "";

    var texti = '<h1><b>' + spurning.q1 +' * '+ spurning.q2 +' = ???</b></h1>'; // Aðal spurningin

    /**
     * Þegar notandi er buinn að svara 10 sp í röð þá fer þessi if í gang
     * Hún prentar út hversu mörg stig notandi var með í 10 hvert skipti og núll stillir svo
     * Hún spyr um nafn notanda og skráir niður í localstorage hvað scorið hja notandanum er yfir allt
     * Hún býr til takka sem notandi getur ítt á til að byrja aftur
     */
    if(nrQuestion >= fjoldispurninga){
        main.innerHTML = " ";
        var bar = Get_id("bar");
        bar.innerHTML = " ";
        samtals = 0;
        texti = "<h2>Þú varst með  " + score + " af " + fjoldispurninga + " spurningum rétt! </h2>";
        if (!localStorage.getItem('Name') >= 1) {
            this.name = prompt('Hvað er nafnið þitt? ');
            localStorage.setItem('Name', this.name);
        }
        texti += '<h1>' + localStorage.getItem('Name') + '</h1>';
        texti += "<h4>Samtals stig yfir allt: " + localStorage.score + "</h4>";
        texti += "<button class='spilaaftur btn btn-primary'>Spila aftur?</button>";
        main.innerHTML = texti;
        $('.spilaaftur').click(function(){
            SpilaAftur();
        });
        return false;
    }

    output += '<div class="btn-group btn-group-lg" role="group">'; // Css
    /**
     * For lykkja sem byrtir alla valmöguleikana þarna nær hann í rétta svarið sem ég bjó til í Question();
     */
    for (var i = 0; i < spurning.answ.length; i++) {
        rett = spurning.rettsvar == i; // Rétta svarið úr Question();
        output += ('<button class="takki btn btn-info" id="' + (i + 1) +'">' + spurning.answ[i] + '</button>'); // Býr til takkana
    }
    output += '</div>'; // Css
    output += ('<br><br><button class="sleppa btn btn-warning">Sleppa spurningu</button>'); // Takki til að sleppa spurningu færð merkt sem rangt ef þú ítir á hann

    utkoma = (texti + output); // Setur allt saman svo að það sé auðveldara að prenta út
    main.innerHTML = utkoma; // ^^

    /**
     * Function sem keyrir þegar það er ítt á einn af svarmöguleikunum
     * Þetta function nær í valuið úr takkanum sem var ítt á og sendir notanda svar (Takkan sem notandi ítti á) og rétta svarið
     */
    $(".swipe").on("swipeleft",function(){
        console.log('swipe');
        rett = spurning.rettsvar;
        var usersvar = ($(this).text());
        checkAnswer(usersvar, rett);
    });

    $('.takki').click(function(){
        rett = spurning.rettsvar; // Rétta svarið úr Question();
        var usersvar = ($(this).text()); // Nær í value frá svartakka
        checkAnswer(usersvar, rett); // Sendir þessi gildi í checkAnswer();
    });

    /**
     * Function sem keyrir þegar það er ítt á "sleppa" takkan þetta function er sér svo að það se hægt að eiga getur við að stíla ".takki"
     * en það gerir nákvæmlega það sama og Functionið fyrir ofan
     *
     * Þetta fall skilar bara "false" þar sem valuið af "sleppa" takkanum er "Sleppa spurningu"
     */
    $('.sleppa').click(function(){
        rett = spurning.rettsvar;
        var usersvar = ($(this).text());
        checkAnswer(usersvar, rett);
    });
}

/**
 * Function sem lætur notanda spila leikinn aftur
 * núll stillar bæði score og nrQuestion til að leikurinn hættir aftur í 10 spurningum
 * @constructor
 */
function SpilaAftur(){
    score = 0;
    nrQuestion = 0;
    loadQuestion();
}

/**
 * Þetta Function athugar hvort að takkinn sem notandi ítti á sé með rétt svar
 * Tekur inn tvö input usersvar (Value frá tökkum) og rétt (Value frá báðum tölunum margfölduðum saman)
 * Þetta Function setur líka score í localStrage til að halda utanum stigafjöldan þótt það sé lokað vafranum
 * Hérna er líka eytt og bætt við klösum á takkana til að notandi viti hvort hann svaraði rétt eða rangt
 * Í lok þessara falls er setTimeout, Ég nota það til að notandi hefur tækifæri á að sjá hvort hann svaraði rétt eða rangt (Svo að næsta spurning falli ekki strax ofaná það sem hann svaraði)
 *
 * @param usersvar
 * @param rett
 */
function checkAnswer(usersvar, rett){
    if(usersvar == rett){ // Ef val frá notanda sé sama og margföldun á tölunum þá fer þessi if í gang
        $(".takki").removeClass("btn-info").addClass("btn-success"); // Hérna er eytt klasa og bætt við öðrum
        console.log('%cRétt', 'background: #fff; color: green'); // Hérna er skrifað í consoleinn að svarið sé rétt
        score++; // Bætt við stigi svo að teljarinn telji rétt stig
        /**
         * localStorage fyrir stigin sem notandi fær
         */
        if(typeof(Storage) !== "undefined") {
            if (localStorage.score) {
                localStorage.score = Number(localStorage.score)+1;
            } else {
                localStorage.score = 1;
            }
        }
    }else{ // // Ef val frá notanda sé EKKI það sama og margföldun á tölunum þá fer þessi if í gang
        $(".takki").removeClass("btn-info").addClass("btn-danger"); // Hérna er eytt klasa og bætt við öðrum
        console.log('%cRangt', 'background: #fff; color: red'); // Hérna er skrifað í consoleinn að svarið sé rangt
    }

    nrQuestion++; // Telja hvað notandi er búinn að svara mörgum spurningum
    setTimeout(loadQuestion,500); // setTimeout til að það sé hægt að sjá hvað notandi valdi
}

function Progress_bar(){
    var bar = Get_id("bar");
    var prosenta = 100 / fjoldispurninga;
    bar.innerHTML = '<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + samtals + '%"></div></div>';
    samtals += prosenta;

}


window.addEventListener("load", loadQuestion, false); // Hleður inn appinu
