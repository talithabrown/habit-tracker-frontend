
const setAlert = (message) => {
    let alertDiv = document.getElementById('alert-div')
    alertDiv.children[0].innerHTML = message
    alertDiv.style.display = 'flex'
    window.scrollTo(0,0)
    setTimeout(() => {
        alertDiv.style.display = 'none'
    }, 5000)
}

const addDays = (month, year) => {

    let numberOfDaysInMonth = new Date(year, month + 1, 0).getDate()

    let parentDiv = document.getElementById('days')
    parentDiv.innerHTML = ''

    let firstDayOfMonth = new Date(year, month, 1)
    let firstWeekDayOfMonth = firstDayOfMonth.getDay() + 1

    for (let i = 0; i < numberOfDaysInMonth; i++) {
        let div = document.createElement('div')
        if (i <= 8) {
            div.setAttribute('data-month-day', '0' + (i + 1))
        }
        else {
            div.setAttribute('data-month-day', i + 1)
        }
        div.classList.add('month-day')
        div.innerHTML = i + 1

        if (i === 0) {
            div.style.gridColumn = firstWeekDayOfMonth
        }
        parentDiv.appendChild(div)
    }

}

const getMonthName = (month) => {

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

    return monthNames[month]
}

const setMonthAndYear = (month, year) => {
    let monthElement = document.getElementById('monthName')
    let yearElement = document.getElementById('year')

    let monthName = getMonthName(month)
    yearElement.innerHTML = year
    monthElement.innerHTML = monthName
}

const nextMonth = () => {
    if (month === 11) {
        month = 0
        year = year + 1
    }
    else {
        month = month + 1
    }
    setMonthAndYear(month, year)
    addDays(month, year)
    getAndShowCompleteDatesForNewMonth()
}

const previousMonth = () => {
    if (month === 0) {
        month = 11
        year = year - 1
    }
    else {
        month = month - 1
    }
    addDays(month, year)
    setMonthAndYear(month, year)
    getAndShowCompleteDatesForNewMonth()
}


const findUnusedColor = () => {
    let unusedColors = []
    let usedColors = []
    let checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');
    for (let i = 0; i < checkedBoxes.length; i++) {
        let customCheckBox = checkedBoxes[i].parentElement.lastChild
        usedColors.push(customCheckBox.style.backgroundColor)
    }
    for (let i = 0; i < colors.length; i++) {
        if (!usedColors.includes(colors[i])) {
            unusedColors.push(colors[i])
        }
    }
    return unusedColors[0]
}

const addOrRemoveHabitFromCalendar = (event) => {
    let checkBox = event.target
    let customCheckBox = event.target.parentElement.lastChild
    let id = event.target.getAttribute('data-id')
    if (checkBox.checked) {
        let checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');
        if (checkedBoxes.length > 4) {
            checkBox.checked = false
            setAlert('You can show a max of 4 habits at a time')
        }
        else {
            customCheckBox.style.backgroundColor = ''
            let color = findUnusedColor()
            customCheckBox.style.backgroundColor = color
            showCompleteDatesForCheckedHabit(id, color)
        }
    } else {
        customCheckBox.style.backgroundColor = '#ddd'
        let calendarHabitDivs = document.getElementsByClassName(`calendar-habit-div-id-${id}`)
        for (let i = calendarHabitDivs.length - 1; i >= 0 ; i--) {
            calendarHabitDivs[i].remove()
        }
    }
}


const buildHabitsDiv = (habits) => {
    let parentDiv = document.getElementById('habits-div-on-calendar-page')
    for (let i = 0; i < habits.length; i++) {
        let label = document.createElement('label')
        label.classList.add('calendar-checkbox-label-container')
        label.innerHTML = habits[i].habit
        let checkBox = document.createElement('input')
        checkBox.setAttribute('type', 'checkbox')
        checkBox.setAttribute('data-id', habits[i].id)
        let span = document.createElement('span')
        span.classList = 'checkmark'
        if (i < 4) {
            checkBox.checked = true
            span.style.backgroundColor = colors[i]
            showCompleteDatesForCheckedHabit(habits[i].id, colors[i])
        }
        checkBox.addEventListener('click', addOrRemoveHabitFromCalendar)

        label.appendChild(checkBox)
        label.appendChild(span)
        parentDiv.appendChild(label)
    }
}

const fetchAllHabits = async () => {
    const res = await fetch(`https://habit-tracker-backend-api.herokuapp.com/users/me/habits/`, 
    {
        method: 'GET',
        headers: {
        'Authorization': 'JWT '+ localStorage.getItem('jwtAccess'), 
        'Content-type': 'application/json'
        }
    })
    if (!res.ok) {
        console.log('there was an error :(')
    }
    else {
        const data = await res.json()
        return data
    }
}

const fetchHabitCompleteDates = async (month, year) => {
    const res = await fetch(`https://habit-tracker-backend-api.herokuapp.com/users/me/completedates/?year=${year}&month=${month + 1}`, 
    {
        method: 'GET',
        headers: {
        'Authorization': 'JWT '+ localStorage.getItem('jwtAccess'), 
        'Content-type': 'application/json'
        }
    })
    if (!res.ok) {
        setAlert('There was an error getting your data from the server, try refreshing this page')
    }
    else {
        const data = await res.json()
        return data
    }
}

const showCompleteDatesForCheckedHabit = (id, color) => {
    let days = document.getElementsByClassName('month-day')
    Array.from(days)
    for (let i = 0; i < sortedDates.length; i++) {
        if (id == sortedDates[i].id) {
            let completeDates = sortedDates[i].dates
            let completeMonthDays = []
            for (let j = 0; j < completeDates.length; j++) {
                completeMonthDays.push(completeDates[j].slice(-2))
            }
            for (let k = 0; k < days.length; k++) {
                let div = document.createElement('div')
                div.classList.add(`calendar-habit-div-id-${id}`)
                div.style.minHeight = '8px'
                if (completeMonthDays.includes(days[k].getAttribute('data-month-day'))) {
                    div.style.backgroundColor = color
                }
                else {
                    div.style.backgroundColor = 'transparent'
                }
                days[k].appendChild(div)
            }
        }
    }
}


const sortCompleteDatesByHabitId = (completeDates) => {
    let completeDatesSorted = []
    let habitIds = []
    for (let i = 0; i < completeDates.length; i++) {
        let habitId = completeDates[i].habit

        if (habitIds.includes(habitId)) {
            for (let j = 0; j < completeDatesSorted.length; j++) {
                if (completeDatesSorted[j].id === habitId) {
                    completeDatesSorted[j].dates.push(completeDates[i].complete_date)
                }
            }
        }
        else {
            habitIds.push(habitId)
            completeDatesSorted.push({id: habitId, 
                                      dates:[completeDates[i].complete_date]})
        }
    }
    return completeDatesSorted
}

const getAndShowCompleteDatesForNewMonth = async () => {
    completeDates = await fetchHabitCompleteDates(month, year)
    sortedDates = sortCompleteDatesByHabitId(completeDates)
    let checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked')
    for (let i = 0; i < checkedBoxes.length; i++) {
        let id = checkedBoxes[i].getAttribute('data-id')
        let color = checkedBoxes[i].parentElement.lastChild.style.backgroundColor
        showCompleteDatesForCheckedHabit(id, color)
    }
}


let colors = ['rgb(42, 157, 143)', 'rgb(231, 111, 81)', 'rgb(35, 64, 75)', 'rgb(244, 162, 97)']

let date = new Date()
let month = date.getMonth()
let year = date.getFullYear()
addDays(month, year)
setMonthAndYear(month, year)

let habits = ''
let completeDates = ''
let sortedDates = ''

const startCalendarPage = async () => {
    habits = await fetchAllHabits()
    completeDates = await fetchHabitCompleteDates(month, year)
    sortedDates = sortCompleteDatesByHabitId(completeDates)
    buildHabitsDiv(habits)

    let nextMonthButton = document.getElementById('next')
    nextMonthButton.addEventListener('click', nextMonth)

    let previousMonthButton = document.getElementById('prev')
    previousMonthButton.addEventListener('click', previousMonth)
}

startCalendarPage()
