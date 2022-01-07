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
var selectedScale = ''
var currentKey = ''
var noteFreq = 0
var keyFreq = 0


/*----- cached element references -----*/


var chordListEl = document.getElementById('chord-list')
var selectedChordEl = document.getElementById('selected-chords')
var scaleButtonListEl = document.getElementById('scale-btn-list')
var noteButtonListEl = document.getElementById('note-btn-list')


/*----- event listeners -----*/

// key down strokes for music player buttons

chordListEl.addEventListener('click', chordSelect)
scaleButtonListEl.addEventListener('click', scaleSelector)
noteButtonListEl.addEventListener('click', clickNote)



/*----- functions -----*/


// >playChord function for any argument of notes
// >audio play function that plays each chord of selectionArray in key=''   
// >set time between calling playChord fuction (for set tempo)
// 	        >must repeat
//          >pause/play function


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
    for(var i=1; i<=10; i++) {
        let buttonEl = document.createElement('button') 
        buttonEl.innerText = i
        buttonEl.classList.add('pad-btn')
        buttonEl.classList.add('btn-'  + i)
        noteButtonListEl.appendChild(buttonEl)
    }
}


// Meat and potatoes
function chordSelect(evt) {    
    var clickedChord = evt.target
    addChord(clickedChord.innerText)
    iterationTest() 
    rePopulateChordList()
    scaleBtnActivator()
}


function addChord(item) {
    let newEl = document.createElement('li')
    newEl.innerText = item
    newEl.classList.add('list-item')
    selectedChordEl.appendChild(newEl)
    selectedChords.push(item)
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
    playAMaj()
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

// dessert
function clickNote(evt) {
    let clickedNote = evt.target
    noteObjects.forEach(function(item) {
        if(clickedNote.innerText === item.note) {
            noteFreq = item.frequency
            return noteFreq
        }
    })
    playNote('sawtooth', noteFreq)
}

// inspired by https://codesandbox.io/s/javascript-synthesizer-7i16o?file=/js/main.js
function playNote(wave, freq) {
    var gainNode = context.createGain()
    gainNode.connect(context.destination)
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1)
    var oscNode = context.createOscillator()
    oscNode.type = wave
    oscNode.frequency.value = freq
    oscNode.connect(gainNode)
    oscNode.start(0)
}





//*---------------------* My attempt at playing chords by hitting multiple oscillators/notes together
//*---------------------* I have made it work for one chord, A Major, and need to condense all the attributes
//*---------------------* of a chord into arguments for a single playChord function
function playAMaj () {
    var gainNode = context.createGain()
    gainNode.connect(context.destination)
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1)
    var oscOne = context.createOscillator()
    oscOne.type = 'sine'
    oscOne.frequency.value = 220.0  
    oscOne.connect(gainNode)  
    var oscTwo = context.createOscillator()
    oscTwo.type = 'sine'
    oscTwo.frequency.value = 329.6 
    oscTwo.connect(gainNode)   
    var oscThree = context.createOscillator()
    oscThree.connect(gainNode) 
    oscThree.type = 'sine'
    oscThree.frequency.value = 277.2
    oscOne.start(0)
    oscTwo.start(0)
    oscThree.start(0)
}

function playAMin () {
    var oscOne = context.createOscillator
    var oscTwo = context.createOscillator
    var oscThree = context.createOscillator
}
function playBMaj () {
    var oscOne = context.createOscillator
    var oscTwo = context.createOscillator
    var oscThree = context.createOscillator
}
function playBMin () {
    var oscOne = context.createOscillator
    var oscTwo = context.createOscillator
    var oscThree = context.createOscillator
}
function playCMaj () {
    var oscOne = context.createOscillator
    var oscTwo = context.createOscillator
    var oscThree = context.createOscillator
}
function playCshpMin () {
    var oscOne = context.createOscillator
    var oscTwo = context.createOscillator
    var oscThree = context.createOscillator
}
function playDMaj () {
    var oscOne = context.createOscillator
    var oscTwo = context.createOscillator
    var oscThree = context.createOscillator
}
function playEMaj () {
    var oscOne = context.createOscillator
    var oscTwo = context.createOscillator
    var oscThree = context.createOscillator
}
function playEMin () {
    var oscOne = context.createOscillator
    var oscTwo = context.createOscillator
    var oscThree = context.createOscillator
}
function playFshpMin () {
    var oscOne = context.createOscillator
    var oscTwo = context.createOscillator
    var oscThree = context.createOscillator
}
function playGMaj () {
    var oscOne = context.createOscillator
    var oscTwo = context.createOscillator
    var oscThree = context.createOscillator
}
function playGshpMin () {
    var oscOne = context.createOscillator
    var oscTwo = context.createOscillator
    var oscThree = context.createOscillator
}