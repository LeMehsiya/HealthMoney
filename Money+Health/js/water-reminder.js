const smallCups = document.querySelectorAll('.cup-small')

const remainded = document.getElementById('remainded')

const liters = document.getElementById('liters')

const percentage = document.getElementById('percentage')

updateBigCup()

smallCups.forEach((cup,idx) => {
    cup.addEventListener('click', () => {highlightCups(idx)})
})

function highlightCups(index) {

    if (smallCups[index].classList.contains('full') && !smallCups[index].nextElementSibling.classList.contains('full')) {
        index--
    }

    smallCups.forEach((cup,idx) => {
        if (idx <= index) {
            cup.classList.add('full')
        }else{
            cup.classList.remove('full')
        }
    })  

    updateBigCup()
}

function updateBigCup() {

    const fullCups = document.querySelectorAll('.cup-small.full').length
    const totalCups = smallCups.length
    
    if (fullCups === 0) {
        percentage.style.visibility = 'hidden'
        percentage.style.height = 0
    }else{
        percentage.style.visibility = 'visible'
        percentage.style.height = `${(fullCups / totalCups) * 330}px`
        percentage.innerText = `${fullCups / totalCups * 100}%`
    }

    if (fullCups === totalCups) {
        remainded.style.visibility = 'hidden'
        remainded.style.height = 0
    }else{
        remainded.style.visibility = 'visible'
        liters.innerText = `${2-(250 * fullCups / 1000)}L`
    }

}