/*----- constants -----*/

// "notes" sound fx assigned a frequency in JS
// 4 scaleArrays of sound objects for 4 major pentatonic scales (5 or 10 elements each)
// 4 chordArrays of chord combinations of 4 major keys (6 elements each)(will be linked to a corresponding scaleArray by class)
// music player made of buttons

const allChords = ['A Major', 'A Minor', 'B Major', 'B Minor', 'C Major', 'C# Minor', 'D Major', 'E Major', 'E Minor', 'F# Minor', 'G Major', 'G# Minor']
const allKeys = ['A', 'D', 'E', 'G']

var chordObjects = [
    {key: 'A', chordArray: ['A Major', 'B Minor', 'C# Minor', 'D Major', 'E Major', 'F# Minor']},
    {key: 'D', chordArray: ['A Major', 'B Minor', 'D Major', 'E Minor', 'F# Minor', 'G Major']},
    {key: 'E', chordArray: ['A Major', 'B Major', 'C# Minor', 'E Major', 'F# Minor', 'G# Minor']},
    {key: 'G', chordArray: ['A Minor', 'B Minor', 'C Major', 'D Major', 'E Minor', 'G Major']},
]

var scaleObjects = [
    {key: 'A', scaleArray: ['a', 'b', 'csh', 'd', 'e', 'fsh']},
    {key: 'D', scaleArray: ['a', 'b', 'd', 'e', 'fsh', 'g']},
    {key: 'E', scaleArray: ['a', 'b', 'csh', 'e', 'fsh', 'gsh']},
    {key: 'G', scaleArray: ['a', 'b', 'c', 'd', 'e', 'g']},
]


/*----- app's state (variables) -----*/

// 12 chord buttons that can be disabled
// 4 scale buttons that can be disabled
// 5 or 10 buttons on music player that scaleArray can be assigned to (one index per button)

var availableChords = []
var availableKeys = []
var selectedChords = []
var selectedScale = ''

/*----- cached element references -----*/

// empty selectionArray to be filled with chord buttons pushed in order max_idx of 3 (4 button events)
// 12 sound fx for chords (assigned to chord button, hosted online)
// string elements to populate selectionArray, one for each chord button

var chordListEl = document.getElementById('chord-list')
var selectedChordEl = document.getElementById('selected-chords')
var scaleButtonListEl = document.getElementById('scale-btn-list')



/*----- event listeners -----*/

// mouse clicks for chord buttons
// mouse clicks for scale buttons
// hover over scales with text/image with more information about it
// mouse clicks for music player buttons
// key down strokes for music player buttons

chordListEl.addEventListener('click', chordSelect)
scaleButtonListEl.addEventListener('click', scaleSelector)



/*----- functions -----*/

// >populate selectionArray based on button clicks from chord buttons
// >play sound effect assigned to chord button in background
// >show on page the previously selected chords
// >iterate over 4 arrays of notes
// 	> see if any of the 4 chordArrays include the same elements of selectionArray
// 	> reduce user's scale button choices to those chordArrays that include all of the elements of the selectionArray
// >populate the music player buttons with elements from scaleArray that corresponds to the user-selected scale button
// >sound function that plays elements of scaleArray using music player buttons
// >sound function that plays sound fx corresponding to elements of selectionArray, in order, with 
// >set timer in between calling sound fx (for set tempo)
// 	>must repeat
// >reset function
// >pause/play function


window.onload = function firstListPopulation() {
    allChords.forEach(function(item) {
        let newEl = document.createElement('li')
        newEl.innerText = item
        newEl.classList.add('list-item')
        chordListEl.appendChild(newEl)
    })
    allKeys.forEach(function(item) {
        let newEl = document.createElement('button')
        newEl.innerText = item + ' Major'
        newEl.classList.add('scale-btn')
        newEl.classList.add('inactive')
        newEl.id = item
        scaleButtonListEl.appendChild(newEl)
    })
}


// Meat and potatoes
function chordSelect(evt) {    
    var clickedChord = evt.target
    console.log(clickedChord)
    addChord(clickedChord.innerText)
    iterationTest() 
    rePopulateChordList()
    scaleBtnActivator()
}

// adds selected chord to second ul on display
// caches selected chord into selection array
function addChord(item) {
    let newEl = document.createElement('li')
    newEl.innerText = item
    newEl.classList.add('list-item')
    selectedChordEl.appendChild(newEl)
    selectedChords.push(item)
    console.log(selectedChords)
}

// iteration/comparison test: iterate over each chord progression array, see if they contain ALL values of current selection array, if true -> merge onto available chord array
// creates available key array as well, to be used with scale objects of same key
// arrow functions from newbdev: https://newbedev.com/typescript-check-if-array-is-subset-of-another-array-javascript-code-example
function iterationTest() {
    availableChords = []
    availableKeys = []
    chordObjects.forEach(function(obj) {
        if(selectedChords.every(testItem => obj.chordArray.includes(testItem))) {
            console.log('selected chords: ' + selectedChords)
            console.log('obj.chordArr: ' + obj.chordArray)
            availableChords = availableChords.concat(obj.chordArray)
            availableChords = [...new Set([...availableChords,...obj.chordArray])]
            availableKeys.push(obj.key)
            console.log('available keys: ' + availableKeys)
        } 
        console.log('available chords: ' + availableChords)
        console.log('available keys: ' + availableKeys)
    })    
}

// re-populates the first ul using the updated available chord array
function rePopulateChordList() {
    chordListEl.innerHTML = ''
    availableChords.forEach(function(item) {
        let newEl = document.createElement('li')
        newEl.innerText = item
        newEl.classList.add('list-item')
        chordListEl.appendChild(newEl)
    })
}

// activate (via class) scale button if its btn-id matches any idx of the available key array
// else, inactivate (via class)
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

// user has made chord choices...now it is time to select a single scale array by pushing the button
// button has an id that will match the key of one of the scale arrays
function scaleSelector(evt) {
    var clickedButton = evt.target
    let activeBtnEl = document.querySelectorAll('.in-use')
    activeBtnEl.forEach(function(item) {
        item.classList.remove('in-use')
     
    })      
    console.log(clickedButton)
    if(chordListEl.childElementCount === allChords.length) {
        return
    } else if(clickedButton.classList.contains('inactive')) {
        return
    } else {   
        clickedButton.classList.add('in-use')
        selectedScale = clickedButton.id
        console.log(selectedScale)
    }
}
