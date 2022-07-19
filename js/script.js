/*----- constants -----*/

const allChords = ['A Major', 'A Minor', 'B Major', 'B Minor', 'C Major', 'C# Minor', 'D Major', 'E Major', 'E Minor', 'F# Minor', 'G Major', 'G# Minor']
const allKeys = ['AMaj', 'DMaj', 'EMaj', 'GMaj']

// from MDN tutorial on audio API
var AudioContext = window.AudioContext || window.webkitAudioContext
var context = new AudioContext({
  latencyHint: 'interactive',
  sampleRate: 44100
})

var chordObjects = [
    {key: 'AMaj', chordArray: ['A Major', 'B Minor', 'C# Minor', 'D Major', 'E Major', 'F# Minor']},
    {key: 'DMaj', chordArray: ['A Major', 'B Minor', 'D Major', 'E Minor', 'F# Minor', 'G Major']},
    {key: 'EMaj', chordArray: ['A Major', 'B Major', 'C# Minor', 'E Major', 'F# Minor', 'G# Minor']},
    {key: 'GMaj', chordArray: ['A Minor', 'B Minor', 'C Major', 'D Major', 'E Minor', 'G Major']},
]

var scaleObjects = [
    {key: 'AMaj', scaleArray: ['A2', 'B2', 'C#3', 'D3', 'E3', 'F#3', 'G#3', 'A3', 'B3', 'C#4', 'D4', 'E4', 'F#4', 'G#4']},
    {key: 'DMaj', scaleArray: ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C#4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5']},
    {key: 'EMaj', scaleArray: ['E3', 'F#3', 'G#3', 'A3', 'B3', 'C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5', 'D#5']},
    {key: 'GMaj', scaleArray: ['G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4']},
]

var noteObjects = [
    {note: 'G2', frequency: 98.00},
    {note: 'A2', frequency: 110.0},
    {note: 'B2', frequency: 123.5},
    {note: 'C3', frequency: 130.8},
    {note: 'C#3', frequency: 138.6},
    {note: 'D3', frequency: 146.8},
    {note: 'E3', frequency: 164.8},
    {note: 'F#3', frequency: 185.0},
    {note: 'G3', frequency: 196.0},
    {note: 'G#3', frequency: 207.7},
    {note: 'A3', frequency: 220},
    {note: 'B3', frequency: 246.9},
    {note: 'C4', frequency: 261.6},
    {note: 'C#4', frequency: 277.2},
    {note: 'D4', frequency: 293.7},
    {note: 'D#4', frequency: 311.13},
    {note: 'E4', frequency: 329.6},
    {note: 'F#4', frequency: 370.0},
    {note: 'G4', frequency: 392.0},
    {note: 'G#4', frequency: 415.3},
    {note: 'A4', frequency: 440},
    {note: 'B4', frequency: 493.9}, 
    {note: 'C#5', frequency: 554.4},
    {note: 'D#5', frequency: 622.25}
]


/*----- app's state (variables) -----*/


var availableChords = []
var availableKeys = []
var selectedChords = []
var forChordButton = []
var selectedScale = ''
var currentKey = ''
var noteFreq = 0
var keyFreq = 0
var intervalValue = 1200
var playOn = "no"



/*----- cached element references -----*/


var chordListEl = document.getElementById('chord-list')
var loopAddBtnEl = document.getElementById('loop-add-btn')
var loopToggleBtnEl = document.getElementById('loop-tog-btn')
var selectedChordEl = document.getElementById('chord-btn-list')
var scaleButtonListEl = document.getElementById('scale-btn-list')
var noteButtonListEl = document.getElementById('note-btn-list')
var tempoInputEl = document.getElementById('tempo-select')


/*----- event listeners -----*/

chordListEl.addEventListener('click', chordSelect)
selectedChordEl.addEventListener('click', clickChord)
scaleButtonListEl.addEventListener('click', scaleSelector)
noteButtonListEl.addEventListener('click', clickNote)
loopAddBtnEl.addEventListener('click', activateLooper)
loopToggleBtnEl.addEventListener('click', toggleLoop)
document.addEventListener('keydown', keyedChord) 
document.addEventListener('keydown', keyedNote)




/*----- functions -----*/

window.onload = function firstListPopulation() {
    allChords.forEach(function(item) {
        let newEl = document.createElement('li')
        newEl.innerText = item
        newEl.classList.add('list-item')
        chordListEl.appendChild(newEl)
    })
    allKeys.forEach(function(item) {
        let newEl = document.createElement('button')
        newEl.innerText = item
        newEl.classList.add('scale-btn')
        newEl.classList.add('inactive')
        newEl.id = item
        scaleButtonListEl.appendChild(newEl)
    })
    for(var i=1; i<=4; i++) {
        let newEl = document.createElement('button')
        newEl.innerText = ''
        newEl.classList.add('pad-btn')
        selectedChordEl.appendChild(newEl)        
    }
    for(var i=1; i<=14; i++) {
        let buttonEl = document.createElement('button') 
        buttonEl.innerText = i
        buttonEl.classList.add('pad-btn')
        noteButtonListEl.appendChild(buttonEl)
    }
}


// Meat and potatoes

function chordSelect(evt) {
    var clickedChord = evt.target    
    selectedChords.push(clickedChord.innerText)
    forChordButton.push(clickedChord.innerText)
    addChord()
    playChord(clickedChord.innerText)
    iterationTest()
    rePopulateChordList()
    scaleBtnActivator()    
}
function addChord() {
    for(var i=0; i<4; i++) {
        selectedChordEl.childNodes[i].innerText = forChordButton[i]
    }
} 
function toggleLoop() {
    if(loopToggleBtnEl.classList.contains('inactive')) {
        loopToggleBtnEl.classList.remove('inactive')
        loopToggleBtnEl.classList.add('active')
        changeIntervalValue()
        tempoInputEl.disabled = true
        playOn = "yes"
        return playOn
    } else if(loopToggleBtnEl.classList.contains('active')) {
        loopToggleBtnEl.classList.remove('active')
        loopToggleBtnEl.classList.add('inactive')
        intervalValue = 0
        tempoInputEl.disabled = false
        playOn = "no"
        return playOn
    }
}
function changeIntervalValue() {
    if(tempoInputEl.value === 'slower') {
        intervalValue = 2000
    } else if(tempoInputEl.value === 'slow') {
        intervalValue = 1500
    }else if(tempoInputEl.value === 'moderate') {
        intervalValue = 1200
    }else if(tempoInputEl.value === 'fast') {
        intervalValue = 1000
    }else if(tempoInputEl.value === 'faster') {
        intervalValue = 858
    }   
}
function activateLooper() {
    if(playOn === "no") {
        return
    } else {
    loopChords()
    }
}
function loopChords() {
    if(playOn === "yes"){
    playChord(selectedChordEl.childNodes[0].innerText)
    setTimeout(playChord, intervalValue, selectedChordEl.childNodes[1].innerText)
    setTimeout(playChord, (intervalValue * 2), selectedChordEl.childNodes[2].innerText)
    setTimeout(playChord, (intervalValue * 3), selectedChordEl.childNodes[3].innerText)
    setTimeout(loopChords, (intervalValue * 4))
    } else {
        return
    }
} 
function iterationTest() {
    availableChords = []
    availableKeys = []
    chordObjects.forEach(function(obj) {
        // arrow function from newbdev: https://newbedev.com/typescript-check-if-array-is-subset-of-another-array-javascript-code-example
        if(selectedChords.every(testItem => obj.chordArray.includes(testItem))) {
            availableChords = availableChords.concat(obj.chordArray)
            availableChords = [...new Set([...availableChords,...obj.chordArray])]
            availableKeys.push(obj.key)
        } 
    })    
}
function rePopulateChordList() {
    chordListEl.innerHTML = ''
    availableChords.forEach(function(item) {
        let newEl = document.createElement('li')
        newEl.innerText = item
        newEl.classList.add('list-item')
        chordListEl.appendChild(newEl)
    })
}
function scaleBtnActivator() {
    scaleObjects.forEach(function(obj) {
        var test = availableKeys.includes(obj.key)
        if(test) {
            let keyEl = obj.key
            let btnEl = document.getElementById(keyEl)         
            btnEl.classList.remove('inactive')
            btnEl.classList.add('active')
        }else if(!test) {
            let keyEl = obj.key
            let btnEl = document.getElementById(keyEl)         
            btnEl.classList.remove('active')
            btnEl.classList.add('inactive')
        }
    })
}

// gravy 

function scaleSelector(evt) {
    var clickedButton = evt.target
    let activeBtnEl = document.querySelectorAll('.in-use')
    activeBtnEl.forEach(function(item) {
        item.classList.remove('in-use')     
    })      
    if(chordListEl.childElementCount === allChords.length) {
        return
    } else if(clickedButton.classList.contains('inactive')) {
        return
    } else {   
        clickedButton.classList.add('in-use')
        selectedScale = clickedButton.id
    }
    notePopulator()
}
function notePopulator() {
    scaleObjects.forEach(function(item) {
        if(item.key === selectedScale) {
            for(i=0; i<14; i++) {
                noteButtonListEl.childNodes[i].innerText = item.scaleArray[i]
            } 
        }
    })
}

// dessert

function keyedNote(evt) {
    if(evt.code === 'Numpad0' || evt.code === 'KeyB') {
        noteObjects.forEach(function(item) {
            if(noteButtonListEl.childNodes[0].innerText === item.note) {
                noteFreq = item.frequency
            }
        })
        playNote('sawtooth', noteFreq)        
    }
    if(evt.code === 'Numpad1' || evt.code === 'KeyH') {
        noteObjects.forEach(function(item) {
            if(noteButtonListEl.childNodes[1].innerText === item.note) {
                noteFreq = item.frequency
            }
        })
        playNote('sawtooth', noteFreq)
    }
    if(evt.code === 'Numpad2' || evt.code === 'KeyJ') {
        noteObjects.forEach(function(item) {
            if(noteButtonListEl.childNodes[2].innerText === item.note) {
                noteFreq = item.frequency
            }
        })
        playNote('sawtooth', noteFreq)
    }
    if(evt.code === 'Numpad3' || evt.code === 'KeyK') {
        noteObjects.forEach(function(item) {
            if(noteButtonListEl.childNodes[3].innerText === item.note) {
                noteFreq = item.frequency
            }
        })
        playNote('sawtooth', noteFreq)
    }
    if(evt.code === 'Numpad4' || evt.code === 'KeyU') {
        noteObjects.forEach(function(item) {
            if(noteButtonListEl.childNodes[4].innerText === item.note) {
                noteFreq = item.frequency
            }
        })
        playNote('sawtooth', noteFreq)
    }
    if(evt.code === 'Numpad5' || evt.code === 'KeyI') {
        noteObjects.forEach(function(item) {
            if(noteButtonListEl.childNodes[5].innerText === item.note) {
                noteFreq = item.frequency
            }
        })
        playNote('sawtooth', noteFreq)
    }
    if(evt.code === 'Numpad6' || evt.code === 'KeyO') {
        noteObjects.forEach(function(item) {
            if(noteButtonListEl.childNodes[6].innerText === item.note) {
                noteFreq = item.frequency
            }
        })
        playNote('sawtooth', noteFreq)
    }
    if(evt.code === 'Numpad7' || evt.code === 'Digit8') {
        noteObjects.forEach(function(item) {
            if(noteButtonListEl.childNodes[7].innerText === item.note) {
                noteFreq = item.frequency
            }
        })
        playNote('sawtooth', noteFreq)
    }
    if(evt.code === 'Numpad8' || evt.code === 'Digit9') {
        noteObjects.forEach(function(item) {
            if(noteButtonListEl.childNodes[8].innerText === item.note) {
                noteFreq = item.frequency
            }
        })
        playNote('sawtooth', noteFreq)
    }
    if(evt.code === 'Numpad9' || evt.code === 'Digit0') {
        noteObjects.forEach(function(item) {
            if(noteButtonListEl.childNodes[9].innerText === item.note) {
                noteFreq = item.frequency
            }
        })
        playNote('sawtooth', noteFreq)
    }
}
function keyedChord(evt) {
    if(evt.code === 'Digit1') {
        playChord(forChordButton[0])
    } else if(evt.code === 'Digit2') {
        playChord(forChordButton[1])
    } else if(evt.code === 'Digit3') {
        playChord(forChordButton[2])
    } else if(evt.code === 'Digit4') {
        playChord(forChordButton[3])
    }
}
function clickNote(evt) {
    let clickedNote = evt.target
    noteObjects.forEach(function(item) {
        if(clickedNote.innerText === item.note) {
            noteFreq = item.frequency
        }
    })
    playNote('sawtooth', noteFreq)
}
function clickChord(evt) {
    let chordForSfx = evt.target
    playChord(chordForSfx.innerText)
}
// inspired by https://codesandbox.io/s/javascript-synthesizer-7i16o?file=/js/main.js
function playNote(wave, freq) {
    var gainNode = context.createGain()
    gainNode.connect(context.destination)
    gainNode.gain.value = 0.36
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.15)
    var oscNode = context.createOscillator()
    oscNode.type = wave
    oscNode.frequency.value = freq
    oscNode.connect(gainNode)
    oscNode.start(0)
    
    
}
function playChord(name) {
    if(name === 'A Major') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord A Maj.mp3"
        chordSfx.play()
    }
    if(name === 'A Minor') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord A Min.mp3"
        chordSfx.play()
    }
    if(name === 'B Major') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord B Maj.mp3"
        chordSfx.play()
    }
    if(name === 'B Minor') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord B Min.mp3"
        chordSfx.play()
    }
    if(name === 'C# Minor') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord CshpMin.mp3"
        chordSfx.play()
    }
    if(name === 'C Major') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord C Maj.mp3"
        chordSfx.play()
    }
    if(name === 'C Minor') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord C Min.mp3"
        chordSfx.play()
    }
    if(name === 'D Major') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord D Maj.mp3"
        chordSfx.play()
    }
    if(name === 'D Minor') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord D Min.mp3"
        chordSfx.play()
    }
    if(name === 'E Major') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord E Maj.mp3"
        chordSfx.play()
    }
    if(name === 'E Minor') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord E Min.mp3"
        chordSfx.play()
    }
    if(name === 'G Major') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord G Maj.mp3"
        chordSfx.play()
    }
    if(name === 'G# Minor') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord GshpMin.mp3"
        chordSfx.play()
    }
    if(name === 'F# Minor') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = "chordSfx/scratch-pad chord FshpMin.mp3"
        chordSfx.play()
    }
    if(name === '') {
        var chordSfx = document.createElement("AUDIO")
        chordSfx.src = ''
        chordSfx.play()
    }
}

