
const setAlert = (message) => {
    let alertDiv = document.getElementById('alert-div')
    alertDiv.children[0].innerHTML = message
    alertDiv.style.display = 'flex'
    window.scroll(0,0)
    setTimeout(() => {
        alertDiv.style.display = 'none'
    }, 5000)
}

const convertDateToTwoDigit = (num) => {
    if (num.toString().length === 1) {
        num = '0' + num
    }
    return num
}

const setDateToToday = () => {
    let date = new Date()
    let year = date.getFullYear()
    let month = convertDateToTwoDigit(date.getMonth() + 1)
    let day = convertDateToTwoDigit(date.getDate())
    let dateString = `${year}-${month}-${day}`
    document.getElementById('date-picker').value = dateString
}

const hideEditInputDiv = () => {
    let editInputDiv = document.getElementById('edit-input-div')
    editInputDiv.style.display = 'none'
}

const editHabit = async (event) => {
    editedHabitText = document.getElementById('edit-input').value
    if (editedHabitText == '') {
        setAlert("You can't edit a blank habit")
        return
    }
    hideEditInputDiv()
    const id = localStorage.getItem('editHabitId')
    localStorage.removeItem('editHabitId')
    let habitP = document.getElementById(id).parentElement.lastChild
    habitP.innerHTML = editedHabitText

    const res = await fetch(`https://habit-tracker-backend-api.herokuapp.com/users/me/habits/${id}/`, 
    {
        method: 'PUT',
        headers: {
        'Authorization': 'JWT '+ localStorage.getItem('jwtAccess'), 
        'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "habit": editedHabitText
        })
    })
    if (!res.ok) {
        setAlert('There was an error editing your habit :(')
    }

}

const hideDeleteConfirmationDiv = () => {
    let deleteConfirmationDiv = document.getElementById('delete-confirmation-div')
    deleteConfirmationDiv.style.display = 'none'
}

const deleteAndRemoveHabit = async (event) => {
    hideDeleteConfirmationDiv()
    const id = localStorage.getItem('deleteHabitId')
    localStorage.removeItem('deleteHabitId')
    let habit = document.getElementById(id).parentElement.parentElement.parentElement
    habit.remove()
    checkForHabits()
    const res = await fetch(`https://habit-tracker-backend-api.herokuapp.com/users/me/habits/${id}/`, 
    {
        method: 'DELETE',
        headers: {
        'Authorization': 'JWT '+ localStorage.getItem('jwtAccess'), 
        'Content-type': 'application/json'
        }
    })
    if (res.status !== 204) {
        setAlert('There was an error deleting your habit :(')
    }

}

const showDeleteConfirmationDiv = (event) => {
    let deleteConfirmationDiv = document.getElementById('delete-confirmation-div')
    deleteConfirmationDiv.style.display = 'block'
    let deleteHabitId = event.target.parentElement.parentElement.firstChild.firstChild.firstChild.getAttribute('data-id')
    localStorage.setItem('deleteHabitId', deleteHabitId)
}

const showEditInputDiv = (event) => {
    let editInputDiv = document.getElementById('edit-input-div')
    editInputDiv.style.display = 'block'
    let habitText = event.target.parentElement.parentElement.firstChild.firstChild.lastChild.innerHTML
    let input = document.getElementById('edit-input')
    input.value = habitText
    let editHabitId = event.target.parentElement.parentElement.firstChild.firstChild.firstChild.getAttribute('data-id')
    localStorage.setItem('editHabitId', editHabitId)
}

const removeAllHabitOptions = () => {
    let editDiv = document.getElementsByClassName('edit-div').item(0)
    if (editDiv !== null) {
        editDiv.parentElement.style.backgroundColor = 'white'
        let img = editDiv.parentElement.firstChild.lastChild
        img.src = 'images/chevron-down.svg'
        img.removeEventListener('click', removeHabitOptions)
        img.addEventListener('click', buildHabitOptions)

        let optionDivs = document.getElementsByClassName('option-div')
        for (let i = optionDivs.length - 1; i >= 0 ; i--) {
            optionDivs[i].remove()
        }
    }
}

const removeHabitOptions = (event) => {
    let parent = event.target.parentElement.parentElement
    parent.removeChild(parent.children[2])
    parent.removeChild(parent.children[1])

    parent.style.backgroundColor = 'white'
    event.target.src = 'images/chevron-down.svg'

    event.target.removeEventListener('click', removeHabitOptions)
    event.target.addEventListener('click', buildHabitOptions)
}

const buildHabitOptions = (event) => {

    removeAllHabitOptions()

    let parentDiv = event.target.parentElement.parentElement

    event.target.src = 'images/chevron-up.svg'
    event.target.removeEventListener('click', buildHabitOptions)
    event.target.addEventListener('click', removeHabitOptions)

    let editImg = document.createElement('img')
    editImg.src = 'images/edit-2.svg'
    editImg.alt = 'Edit icon'

    let editP = document.createElement('p')
    editP.innerHTML = 'Edit habit'

    let editDiv = document.createElement('div')
    editDiv.classList.add('option-div')
    editDiv.classList.add('edit-div')
    editDiv.appendChild(editImg)
    editDiv.appendChild(editP)
    editDiv.addEventListener('click', showEditInputDiv)

    let deleteImg = document.createElement('img')
    deleteImg.src = 'images/trash-2.svg'
    deleteImg.alt = 'Delete icon'

    let deleteP = document.createElement('p')
    deleteP.innerHTML = 'Delete permanently'

    let deleteDiv = document.createElement('div')
    deleteDiv.classList.add('option-div')
    deleteDiv.classList.add('delete-div')
    deleteDiv.appendChild(deleteImg)
    deleteDiv.appendChild(deleteP)
    deleteDiv.addEventListener('click', showDeleteConfirmationDiv)

    parentDiv.appendChild(editDiv)
    parentDiv.appendChild(deleteDiv)
    parentDiv.style.backgroundColor = '#F2F9F8'
}

const buildDropDown = () => {
    let dropDown = document.createElement('img')
    dropDown.src = 'images/chevron-down.svg'
    dropDown.alt = 'Drop down icon'
    dropDown.addEventListener('click', buildHabitOptions)
    dropDown.classList = 'habit-drop-down-button'
    return dropDown
}

const checkForHabits = () => {
    let incompleteHabitsDiv = document.getElementById('incomplete-habits')
    let completeHabitsDiv = document.getElementById('complete-habits')

    let incompleteHabits = document.getElementsByClassName('incomplete-habit')
    let completeHabits = document.getElementsByClassName('complete-habit')

    if (incompleteHabits.length > 0) {
        incompleteHabitsDiv.style.display = 'block'
    }
    else {
        incompleteHabitsDiv.style.display = 'none'
    }
    if (completeHabits.length > 0) {
        completeHabitsDiv.style.display = 'block'
    }
    else {
        completeHabitsDiv.style.display = 'none'
    }

    if (incompleteHabits.length <= 0 && completeHabits.length <= 0) {
        document.getElementById('no-habits-div').style.display = 'block'
    }
    else {
        document.getElementById('no-habits-div').style.display = 'none'
    }
}

const updateHabitIncomplete = async (id) => {
    const date =  document.getElementById('date-picker').value

    const res = await fetch(`https://habit-tracker-backend-api.herokuapp.com/users/me/habits/${id}/dates/?date=${date}`, 
    {
        method: 'GET',
        headers: {
        'Authorization': 'JWT '+ localStorage.getItem('jwtAccess'), 
        'Content-type': 'application/json'
        }
    })
    if (!res.ok) {
        setAlert('There was an error marking your habit as incomplete :(')
    }
    else {
        const data = await res.json()
        const dateId = data[0].id

        const res2 = await fetch(`https://habit-tracker-backend-api.herokuapp.com/users/me/habits/${id}/dates/${dateId}/`, 
        {
            method: 'DELETE',
            headers: {
            'Authorization': 'JWT '+ localStorage.getItem('jwtAccess'), 
            'Content-type': 'application/json'
            }
        })
        if (!res2.ok) {
            setAlert('There was an error marking your habit as incomplete :(')
        }
    }

}

const markHabitIncomplete = (event) => {
    let incompleteHabitsDiv = document.getElementById('incomplete-habits')
    event.target.src = 'images/square.svg'
    event.target.removeEventListener('click', markHabitIncomplete)
    event.target.addEventListener('click', markHabitComplete)
    let incompleteHabit = event.target.parentElement.parentElement.parentElement
    incompleteHabit.classList.remove('complete-habit')
    incompleteHabit.classList.add('incomplete-habit')
    incompleteHabitsDiv.appendChild(incompleteHabit)
    checkForHabits()
    updateHabitIncomplete(event.target.getAttribute('data-id'))
}

const updateHabitComplete = async (id) => {

    const res = await fetch(`https://habit-tracker-backend-api.herokuapp.com/users/me/habits/${id}/dates/`, 
    {
        method: 'POST',
        headers: {
        'Authorization': 'JWT '+ localStorage.getItem('jwtAccess'), 
        'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "complete_date": document.getElementById('date-picker').value
        })
    })
    if (!res.ok) {
        setAlert('There was an error marking your habit as complete :(')
    }
}

const markHabitComplete = (event) => {
    let completeHabitsDiv = document.getElementById('complete-habits')
    event.target.src = 'images/check-square.svg'
    event.target.removeEventListener('click', markHabitComplete)
    event.target.addEventListener('click', markHabitIncomplete)
    let completeHabit = event.target.parentElement.parentElement.parentElement
    completeHabit.classList.remove('incomplete-habit')
    completeHabit.classList.add('complete-habit')
    completeHabitsDiv.appendChild(completeHabit)
    checkForHabits()
    updateHabitComplete(event.target.getAttribute('data-id'))
}

const postHabit = async (habitText) => {

    const res = await fetch('https://habit-tracker-backend-api.herokuapp.com/users/me/habits/', 
    {
        method: 'POST',
        headers: {
        'Authorization': 'JWT '+ localStorage.getItem('jwtAccess'), 
        'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "habit": habitText
        })
    })
    if (!res.ok) {
        setAlert('There was an error adding your new habit :(')
    }
    else {
        const data = await res.json()
        return data.id
    }
}

const buildHabitDiv = (habitText, id, complete) => {
    let img = document.createElement('img')
    img.setAttribute('data-id', id)
    img.id = id

    if (complete) {
        img.src = 'images/check-square.svg'
        img.addEventListener('click', markHabitIncomplete)
    }
    else {
        img.src = 'images/square.svg'
        img.addEventListener('click', markHabitComplete)
    }

    let p = document.createElement('p')
    p.innerHTML = habitText

    let div = document.createElement('div')
    div.classList.add('habit-div')

    let div2 = document.createElement('div')
    div2.classList.add('check-box-and-p-div')

    let div3 = document.createElement('div')
    div3.classList.add('habit-and-options-div')
    if (complete) {
        div3.classList.add('complete-habit')
    }
    else {
        div3.classList.add('incomplete-habit')
    }

    let dropDown = buildDropDown()

    div2.appendChild(img)
    div2.appendChild(p)
    div.appendChild(div2)
    div.appendChild(dropDown)
    div3.appendChild(div)

    let incompleteHabitsDiv = document.getElementById('incomplete-habits')
    let completeHabitsDiv = document.getElementById('complete-habits')

    if (complete) {
        completeHabitsDiv.appendChild(div3)
    }
    else {
        incompleteHabitsDiv.appendChild(div3)
    }

    return div3
}

const buildHabitDivs = (habits, habitStatus) => {
    for (let i = 0; i < habits.length; i++) {    
        buildHabitDiv(habits[i].habit, habits[i].id, habitStatus)
    } 

    checkForHabits()
}


const addHabit = async () => {

    let habitText = document.getElementById('new-habit-input').value
    if (habitText == '') {
        setAlert("You can't add an empty habit")
        return
    }
    document.getElementById('new-habit-input').value = ''

    const id = await postHabit(habitText)
    if (id !== null && id !== undefined) {
        let habit = buildHabitDiv(habitText, id, false)
        habit.style.scrollMarginBottom = '100px'
        habit.scrollIntoView(false);
        checkForHabits()
    }
    else {
        setAlert('There was an error adding your habit')
    }
}

const fetchHabits = async (habitStatus) => {

    let loadingDiv = document.getElementById('loading-div')
    loadingDiv.classList = ('show-loading-div')

    const res = await fetch(`https://habit-tracker-backend-api.herokuapp.com/users/me/habits/?date=${document.getElementById('date-picker').value}&status=${habitStatus}`, 
    {
        method: 'GET',
        headers: {
        'Authorization': 'JWT '+ localStorage.getItem('jwtAccess'), 
        'Content-type': 'application/json'
        }
    })
    if (!res.ok) {
        setAlert('There was an error getting your habits :(')
        loadingDiv.classList = ('display-none')
    }
    else {
        const data = await res.json()
        loadingDiv.classList = ('display-none')
        return data
    }
}

const getHabits = async () => {
    let incompleteHabits = await fetchHabits('incomplete')
    buildHabitDivs(incompleteHabits, false)
    let completeHabits = await fetchHabits('complete')
    buildHabitDivs(completeHabits, true)
}

const getHabitsForNewDate = () => {
    let incompleteHabitsDiv = document.getElementById('incomplete-habits')
    let completeHabitsDiv = document.getElementById('complete-habits')

    completeHabitsDiv.style.display = 'none'
    incompleteHabitsDiv.style.display = 'none'

    const habits = document.getElementsByClassName('habit-and-options-div')
    Array.from(habits)
    for (let i = habits.length - 1; i >= 0; i--) {
        habits[i].remove()
    }

    getHabits()
}

const checkForEnterKey = (event) => {
    if (event.key === "Enter") {
        addHabit()
    }
}

const start = async () => {
    let addHabitButton = document.getElementById('add-habit-button')
    addHabitButton.addEventListener('click', () => {addHabit(); })
    let input = document.getElementById('new-habit-input')
    input.addEventListener('keypress', checkForEnterKey)
    setDateToToday()
    getHabits()
    let dateInput = document.getElementById('date-picker')
    dateInput.addEventListener('change', getHabitsForNewDate)
    let deleteButton = document.getElementById('delete-button')
    deleteButton.addEventListener('click', deleteAndRemoveHabit)
    let cancelDeleteButton = document.getElementById('cancel-delete-button')
    cancelDeleteButton.addEventListener('click', hideDeleteConfirmationDiv)
    let cancelEditButton = document.getElementById('cancel-edit-button')
    cancelEditButton.addEventListener('click', hideEditInputDiv)
    let editButton = document.getElementById('edit-button')
    editButton.addEventListener('click', editHabit)
}

start()
