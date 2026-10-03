//create an array of pads that have unique ids
let pads = [];
let padElems = [];
let keys = ['1', '2', '3', '4', 'q', 'w', 'e', 'r', 'a', 's', 'd', 'f', 'z', 'x', 'c','v'];
let banks = 6;
let sounds = [];
let players = [];
let panners = [];
let bank = 1;
let keyGlyphs = ['🁣', '🁤', '🁥', '🁦', '🁧', '🁨', '🁩', '🁪', '🁫', '🁬', '🁭', '🁮', '🁯', '🁰', '🁱', '🁲', '🂒']
let bankText = document.querySelector('#bankText');
let sampleText = document.querySelector('#samplePlaying')
for (let s = 1; s <= 89; s++ ) {
    let sound = `sounds/${s}.mp3`
    sounds.push(sound)
}

let delaySlider = document.querySelector("#delayTime")
let feedbackSlider = document.querySelector("#feedback")
let reverbSlider = document.querySelector("#reverbSlider")

async function setup() {
    delay = new p5.Delay('0.210', 0.72 )
    delaySlider.addEventListener("input", function() {
        delay.delayTime(delaySlider.value)
        delayText.innerHTML = "DelayAmt: " + (delaySlider.value * 1000) + "ms"
    });
    feedbackSlider.addEventListener("input", function() {
        delay.feedback(feedback.value)
        fbText.innerHTML = "FeedbackAmt: " + ceil(100) + "%"
    });

    wetSlider.addEventListener("input", function() {
        delay.wet(wetSlider.value)
        wetText.innerHTML = "Wet: " + ceil(float(wetSlider.value)) + "%"
    });

    delay.wet(0.5)
    reverb = new p5.Reverb(2);

    reverbSlider.addEventListener("input", function() {
        reverb.set(reverbSlider.value)
        reverbText.innerHTML = "ReverbTime: " + ceil(reverbSlider.value * 1000) + "ms" 
    });
    reverb.wet(0.6)
    delay.disconnect();
    delay.connect(reverb);
    for (let i = 0; i < sounds.length; i++) {
        let player = await loadSound(sounds[i]);
        let myPanner = new p5.Panner()
        panners.push(myPanner)
        myPanner.disconnect();
        player.amp(0.6);
        player.disconnect();
        player.connect(myPanner)
        myPanner.connect(delay);
        players.push(player);
    }
    
}



let padIndex = 0;

function switchBank() {
    bank++;
    if (bank == banks + 1) { bank = 1 }
    try {
        bankText.textContent = `Bank: ${bank}`;
        // Update pad sounds based on the new bank
    } catch (error) {
        console.error('Error occurred while switching bank:', error);
    }
}

for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        let pad = {
            id: `pad-${i}-${j}`,
            playID: padIndex++,
            x: i * 100,
            y: j * 100,
            width: 80,
            height: 80,
            isActive: false
        };
        padRender = document.createElement('button');
        padElems.push(padRender);
        padRender.innerHTML = ''
        padRender.setAttribute('id', pad.id);
        padRender.setAttribute('class', 'pressed, pad')
        document.getElementById('pads').appendChild(padRender);
        padRender.addEventListener('mousedown', () => {
            let player = players[pad.playID + (16 * bank)];
            let panner = panners[pad.playID + (16 * bank)]
            if (player) {
                panner.pan((random() * 2) - 1)
                player.play();
            }    
        });

        document.getElementById(pad.id).style.position = 'absolute';
        document.getElementById(pad.id).style.left = `${pad.x + 8}px`;
        document.getElementById(pad.id).style.top = `${pad.y}px`;
        document.getElementById(pad.id).style.width = `${pad.width}px`;
        document.getElementById(pad.id).style.height = `${pad.height}px`;
        document.getElementById(pad.id).style.backgroundColor = pad.color;
        pads.push(pad);
    }
    bankText.textContent = `Bank: ${bank}`;
}

//keypress stuff
window.addEventListener("keydown", checkKeyPressed, false)

function checkKeyPressed(e) {
    if (keys.indexOf(e.key) < 0) {
        return
    }
    players[keys.indexOf(e.key) + (16 * bank)].play();
    panners[keys.indexOf(e.key) + (16 * bank)].pan((random() * 2) - 1)
    padElems[keys.indexOf(e.key)].classList.toggle('pressed')
    setTimeout(() => {
        padElems[keys.indexOf(e.key)].classList.toggle('pressed')
    }, 100);
}


function goToBank(b) {
    bank = b;
    bankText.innerHTML = `Bank: ${bank}`
}

function keyPressed() {
    if (key === '5') {
        goToBank(1)
    }
    if (key === '6') {
        goToBank(2)
    }
    if (key === '7') {
        goToBank(3)
    }
    if (key === '8') {
        goToBank(4)
    }
    if (key === '9') {
        goToBank(5)
    }
}