const addItemBtn = document.getElementById('addItem')
// const tasks = document.getElementById('tasks')
let list = document.getElementById('list')
const pgb = document.getElementById('pgb')

let numOfItems = 0
console.log('number of items: ' + (numOfItems))
let numItemsComplete = 0
let taskNames  // -> value
let taskIndices = new Map() // key: uniqueID, value: index in task names array

let currentElement

function selectCurrentElement(label) {
    currentElement = label.parentNode.id
}

function createUniqueID() {
    // create next unique ID
    return Math.floor(Math.random() * Date.now())
}

function createItem() {
    const uniqueID = createUniqueID()

    let li = document.createElement('li')

    // task ID
    li.setAttribute('id', uniqueID)

    let container = document.createElement('div')
    let checkbox = document.createElement('input')
    let label = document.createElement('label')

    checkbox.setAttribute('type', 'checkbox')
    checkbox.setAttribute('data-myid', uniqueID)
    checkbox.setAttribute('onclick', 'checkAddress(this)')

    label.setAttribute('contenteditable', 'true')
    label.setAttribute('data-myid', checkbox.id)
    label.setAttribute('style', 'outline: 0; min-width: 25%; max-width: 100%;')
    label.setAttribute('placeholder', 'Enter task here…')
    label.setAttribute('data-content-editable-leaf', 'true')
    label.setAttribute('onkeydown', 'keyDown(event, this)')
    label.setAttribute('onfocusout', 'updateTaskNames()')
    label.setAttribute('onfocus', 'selectCurrentElement(this)')

    container.setAttribute('name', 'item')
    container.setAttribute('id', uniqueID)

    checkbox.classList.add('checkbox')
    checkbox.append(label)
    container.appendChild(checkbox)
    container.appendChild(label)
    li.appendChild(container)
    
    numOfItems++

    return li
}

function appendItem() {
    let newItem = createItem()
    list.appendChild(newItem)
    return newItem.firstChild.lastChild
}

function updateTaskNames() {
    taskNames = []
    listItems = document.getElementsByName('item')
    for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].lastChild.innerHTML !== '' && !listItems[i].firstChild.checked) {
            taskNames.push(listItems[i].lastChild.innerHTML)
            taskIndices.set(listItems[i].id, taskNames.length-1) // unique ID can find the index in the taskNames list now
        } else {
            taskIndices.set(listItems[i].id, -1)
        }
    }
    if (taskNames.length === 0)
        taskNames.push('No tasks')
    window.electronAPI.setMenu(taskNames)
}

function checkAddress(checkbox) {
    if (checkbox.checked) {
        pgb.setAttribute('value', ++numItemsComplete);
        checkbox.nextSibling.setAttribute('style', 'outline: 0; min-width: 25%; max-width: 100%; text-decoration: line-through;')
    }
    else {
        pgb.setAttribute('value', --numItemsComplete);
        checkbox.nextSibling.setAttribute('style', 'outline: 0; min-width: 25%; max-width: 100%;')
    }
    updateTaskNames()
}

function keyDown(event, label) {
    if (event.keyCode === 13) { // add new task below current 
        updateTaskNames() 
        event.preventDefault()
        label.blur()

        let newItem = createItem()
        label.parentNode.parentNode.insertAdjacentElement('afterend', newItem)
        newItem.firstChild.lastChild.focus()
    }
    else if (event.keyCode === 8 && label.innerHTML === '') { 
        taskIndices.delete(label.parentNode.id) 

        label.parentNode.parentNode.remove()
        numOfItems--
        updateTaskNames()
    }
    pgb.setAttribute('max', numOfItems)
}

addItemBtn.onclick = appendItem