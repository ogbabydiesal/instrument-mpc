//create an array of pads that have unique ids
let pads = [];
let keys = ['1', '2', '3', '4', 'q', 'w', 'e', 'r', 'a', 's', 'd', 'f', 'z', 'x', 'c','v'];
let banks = 6;
let sounds = [];
let players = [];
let bank = 1;
let keyGlyphs = ['🁣', '🁤', '🁥', '🁦', '🁧', '🁨', '🁩', '🁪', '🁫', '🁬', '🁭', '🁮', '🁯', '🁰', '🁱', '🁲', '🂒']
let bankText = document.querySelector('#bankText');
let sampleText = document.querySelector('#samplePlaying')
for (let s = 1; s <= 89; s++ ) {
    let sound = `sounds/${s}.mp3`
    sounds.push(sound)
}

async function setup() {
    delay = new p5.Delay('0.210', 0.72 )
    delay.wet(0.5)
    reverb = new p5.Reverb(2);
    reverb.wet(0.6)
    delay.disconnect();
    delay.connect(reverb);
    for (let i = 0; i < sounds.length; i++) {
        let player = await loadSound(sounds[i]);
        player.amp(0.3);
        player.disconnect();
        player.connect(delay);
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
        padRender.innerHTML = keyGlyphs[padIndex]
        padRender.setAttribute('id', pad.id);
        padRender.setAttribute('class', 'pad');
        document.getElementById('pads').appendChild(padRender);
        padRender.addEventListener('mousedown', () => {
            let player = players[pad.playID + (16 * bank)];
            if (player) {
                player.play();
      d      }   
        });

        document.getElementById(pad.id).style.position = 'absolute';
        document.getElementById(pad.id).style.left = `${pad.x}px`;
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
    players[keys.indexOf(e.key) + (16 * bank)].play();
    sampleText.innerHTML = `sample playing`

}



function goToBank(b) {
    bank = b;
    bankText.innerHTML = `Bank: ${bank}`
}