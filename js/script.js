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
    {key: 'AMaj', scaleArray: ['A2', 'B2', 'C#3', 'E3', 'F#3', 'A3', 'B3', 'C#4', 'E4', 'F#4']},
    {key: 'DMaj', scaleArray: ['D3', 'E3', 'F#3', 'A3', 'B3', 'D4', 'E4', 'F#4', 'A4', 'B4']},
    {key: 'EMaj', scaleArray: ['E3', 'F#3', 'G#3', 'B3', 'C#4', 'E4', 'F#4', 'G#4', 'B4', 'C#5']},
    {key: 'GMaj', scaleArray: ['G2', 'A2', 'B2', 'D3', 'E3', 'G3', 'A3', 'B3', 'D4', 'E4']},
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
    {note: 'E4', frequency: 329.6},
    {note: 'F#4', frequency: 370.0},
    {note: 'G4', frequency: 392.0},
    {note: 'G#4', frequency: 415.3},
    {note: 'A4', frequency: 440},
    {note: 'B4', frequency: 493.9}, 
    {note: 'C#5', frequency: 554.4},
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
var intervalValue = 2400


/*----- cached element references -----*/


var chordListEl = document.getElementById('chord-list')
var selectedChordEl = document.getElementById('chord-btn-list')
var scaleButtonListEl = document.getElementById('scale-btn-list')
var noteButtonListEl = document.getElementById('note-btn-list')


/*----- event listeners -----*/

chordListEl.addEventListener('click', chordSelect)
selectedChordEl.addEventListener('click', clickChord)
scaleButtonListEl.addEventListener('click', scaleSelector)
noteButtonListEl.addEventListener('click', clickNote)
document.addEventListener('keydown', keyedChord) 
document.addEventListener('keydown', keyedNote)




/*----- functions -----*/


// >set time between calling playChord fuction (for set tempo)
// 	        >must repeat
//          >pause/play function would be nice
//          >consider setInterval methods


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
    for(var i=1; i<=10; i++) {
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

// setInterval(loopPlayer, 2400, playChord(selectedChordEl.childNodes[0].innerText), playChord(selectedChordEl.childNodes[1].innerText), playChord(selectedChordEl.childNodes[2].innerText), playChord(selectedChordEl.childNodes[3].innerText))

// function loopPlayer()



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
            for(i=0; i<10; i++) {
                noteButtonListEl.childNodes[i].innerText = item.scaleArray[i]
            } 
        }
    })
}

function keyedNote(evt) {
    if(evt.code === 'Numpad0' || evt.code === 'Space') {
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

// dessert
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
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1)
    gainNode.gain.value = 0.25
    var oscNode = context.createOscillator()
    oscNode.type = wave
    oscNode.frequency.value = freq
    oscNode.connect(gainNode)
    oscNode.start(0)
}

function playChord(name) {
    if(name === 'A Major') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord A Maj.mp3"
        aMajSfx.play()
    }
    if(name === 'A Minor') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord A Min.mp3"
        aMajSfx.play()
    }
    if(name === 'B Major') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord B Maj.mp3"
        aMajSfx.play()
    }
    if(name === 'B Minor') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord B Min.mp3"
        aMajSfx.play()
    }
    if(name === 'C# Minor') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord CshpMin.mp3"
        aMajSfx.play()
    }
    if(name === 'C Major') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord C Maj.mp3"
        aMajSfx.play()
    }
    if(name === 'C Minor') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord C Min.mp3"
        aMajSfx.play()
    }
    if(name === 'D Major') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord D Maj.mp3"
        aMajSfx.play()
    }
    if(name === 'D Minor') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord D Min.mp3"
        aMajSfx.play()
    }
    if(name === 'E Major') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord E Maj.mp3"
        aMajSfx.play()
    }
    if(name === 'E Minor') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord E Min.mp3"
        aMajSfx.play()
    }
    if(name === 'G Major') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord G Maj.mp3"
        aMajSfx.play()
    }
    if(name === 'G# Minor') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord GshpMin.mp3"
        aMajSfx.play()
    }
    if(name === 'F# Minor') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = "chordSfx/scratch-pad chord FshpMin.mp3"
        aMajSfx.play()
    }
    if(name === '') {
        var aMajSfx = document.createElement("AUDIO")
        aMajSfx.src = ''
        aMajSfx.play()
    }
}

