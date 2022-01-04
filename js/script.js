/*----- constants -----*/

// "notes" sound fx assigned a frequency in JS
// 4 scaleArrays of sound objects for 4 major pentatonic scales (5 or 10 elements each)
// 4 chordArrays of chord combinations of 4 major keys (6 elements each)(will be linked to a corresponding scaleArray by class)
// music player made of buttons

var allChords = ['A Major', 'A Minor', 'B Major', 'B minor', 'C Major', 'C# Minor', 'D Major', 'E Major', 'E Minor', 'F# Minor', 'G Major', 'G# Minor']
var aMajorChords = ['A Major', 'B Minor', 'C# Minor', 'D Major', 'E Major', 'F# Minor']
var dMajorChords = ['A Major', 'B Minor', 'D Major', 'E Minor', 'F# Minor', 'G Major']
var eMajorChords = ['A Major', 'B Major', 'C# Minor', 'E Major', 'F# Minor', 'G# Minor']
var gMajorChords = ['A Minor', 'B Minor', 'C Major', 'D Major', 'E Minor', 'G Major']


/*----- app's state (variables) -----*/

// 12 chord buttons that can be disabled
// 4 scale buttons that can be disabled
// 5 or 10 buttons on music player that scaleArray can be assigned to (one index per button)

var availableChords = ['A Major', 'A Minor', 'B Major', 'B minor', 'C Major', 'C# Minor', 'D Major', 'E Major', 'E Minor', 'F# Minor', 'G Major', 'G# Minor']

// use later for when the selected chord list needs to be limited to 4 list items/chords 
var selectedChords = []

/*----- cached element references -----*/

// empty selectionArray to be filled with chord buttons pushed in order max_idx of 3 (4 button events)
// 12 sound fx for chords (assigned to chord button, hosted online)
// string elements to populate selectionArray, one for each chord button

var chordListEl = document.getElementById('chord-list')
var selectedChordEl = document.getElementById('selected-chords')

/*----- event listeners -----*/

// mouse clicks for chord buttons
// mouse clicks for scale buttons
// hover over scales with text/image with more information about it
// mouse clicks for music player buttons
// key down strokes for music player buttons

chordListEl.addEventListener('click', chordSelect)



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





function populateChordList() {
    availableChords.forEach(function(item) {
        let newEl = document.createElement('li')
        newEl.innerText = item
        newEl.classList.add('list-item')
        chordListEl.appendChild(newEl)
    })
}

function addChord(item) {
    let newEl = document.createElement('li')
    newEl.innerText = item
    newEl.classList.add('list-item')
    selectedChordEl.appendChild(newEl)
    selectedChords.push(item)
}

// function concatChordArrays() {
//     if(selectedChords.includes('A Major')) {
//         availableChords = aMajorChords.concat(dMajorChords, eMajorChords)
// }

// Different variables, so pull this out of click event listener function for
populateChordList()
 


function chordSelect(evt) {
    var clickedChord = evt.target
    console.log(clickedChord)
    if(clickedChord.innerText === 'A Major') {
        availableChords = ['A Major', 'B Major', 'B Minor', 'C# Minor', 'D Major', 'E Major', 'E Minor', 'F# Minor', 'G Major', 'G# Minor']
        chordListEl.innerHTML = ''        
        populateChordList()
        addChord(clickedChord.innerText)       
        return
    } else if(clickedChord.innerText === 'A Minor') {
        availableChords = ['A Minor', 'B Minor', 'C Major', 'D Minor', 'E Minor', 'G Major']
        chordListEl.innerHTML = ''
        populateChordList()        
        addChord(clickedChord.innerText)
        return
    } else if(clickedChord.innerText === 'B Major') {
        availableChords = ['B Major', 'C# Minor', 'E Major', 'F# Minor', 'G# Minor', 'A Major']
        chordListEl.innerHTML = ''     
        populateChordList()   
        addChord(clickedChord.innerText)
        return
    } else if(clickedChord.innerText === 'B Minor') {
        availableChords = ['A Major', 'B Minor', 'C Major', 'C# Minor', 'D Major', 'E Major', 'E Minor', 'F# Minor', 'G Major']
        chordListEl.innerHTML = ''    
        populateChordList()    
        addChord(clickedChord.innerText)
        return
    } else if(clickedChord.innerText === 'C Major') {
        availableChords = ['C Major', 'D Major', 'E Minor', 'G Major', 'A Minor', 'B Minor']
        chordListEl.innerHTML = ''  
        populateChordList()      
        addChord(clickedChord.innerText)
        return
    } else if(clickedChord.innerText === 'C# Minor') {
        availableChords = ['A Major', 'B Major', 'B Minor', 'C# Minor', 'D Major', 'E Major', 'F# Minor', 'G# Minor']
        chordListEl.innerHTML = ''
        populateChordList()
        addChord(clickedChord.innerText)
        return
    } else if(clickedChord.innerText === 'D Major') {
        availableChords = ['A Major', 'A Minor', 'B Minor', 'C Major', 'C# Minor', 'D Major', 'E Major', 'E Minor', 'F# Minor', 'G Major']
        chordListEl.innerHTML = ''        
        populateChordList()
        addChord(clickedChord.innerText)
        return
    } else if(clickedChord.innerText === 'E Major') {
        availableChords = ['A Major', 'B Major', 'B Minor', 'C# Minor', 'D Major', 'E Major', 'F# Minor', 'G# Minor']
        chordListEl.innerHTML = ''        
        populateChordList()
        addChord(clickedChord.innerText)
        return
    } else if(clickedChord.innerText === 'E Minor') {
        availableChords = ['A Major', 'A Minor', 'B Minor', 'C Major', 'C# Minor', 'D Major', 'E Minor', 'F# Minor', 'G Major']
        chordListEl.innerHTML = ''     
        populateChordList()   
        addChord(clickedChord.innerText)
        return
    } else if(clickedChord.innerText === 'F# Minor') {
        availableChords = ['A Major', 'B Major', 'B Minor', 'C# Minor', 'D Major', 'E Major', 'E Minor', 'F# Minor', 'G Major', 'G# Minor']
        chordListEl.innerHTML = ''        
        populateChordList()
        addChord(clickedChord.innerText)
        return
    } else if(clickedChord.innerText === 'G Major') {
        availableChords = ['A Major', 'A Minor', 'B Minor', 'C Major', 'D Major', 'E Minor', 'F# Minor', 'G Major']
        chordListEl.innerHTML = ''   
        populateChordList()     
        addChord(clickedChord.innerText)
        return
    } else if(clickedChord.innerText === 'G# Minor') {
        availableChords = ['A Major', 'B Major', 'C# Minor', 'E Major', 'F# Minor', 'G# Minor']
        chordListEl.innerHTML = '' 
        populateChordList()       
        addChord(clickedChord.innerText)
        return
    }
}
