const addItemBtn = document.getElementById('addItem')
const tasks = document.getElementById('tasks')
let list = document.getElementById('list')
const pgb = document.getElementById('pgb')

let numOfItems = 0
let numItemsComplete = 0
let taskIDs = []
let taskNames 

function addItem() {
    console.log('clicked')
    let li = document.createElement('li')
    li.setAttribute('id', 'item'+numOfItems)
    console.log('item'+numOfItems)
    taskIDs.push('item'+numOfItems)
    let container = document.createElement('div')
    let checkbox = document.createElement('input')
    let label = document.createElement('label')

    checkbox.setAttribute('type', 'checkbox')
    checkbox.setAttribute('data-myid', 'item'+numOfItems)
    checkbox.setAttribute('onclick', 'checkAddress(this)')

    label.setAttribute('contenteditable', 'true')
    label.setAttribute('data-myid', checkbox.id)
    label.setAttribute('name', 'item')
    label.setAttribute('style', 'outline: 0; min-width: 25%; max-width: 100%;')
    label.setAttribute('placeholder', 'Enter task here…')
    label.setAttribute('data-content-editable-leaf', 'true')
    label.setAttribute('onkeydown', 'keyDown(event, this)')
    // label.innerHTML = 'task ' + numOfItems

    checkbox.classList.add('checkbox')
    checkbox.append(label)
    container.appendChild(checkbox)
    container.appendChild(label)
    li.appendChild(container)
    list.appendChild(li)
    numOfItems++
    
    pgb.setAttribute('max', numOfItems)
    return label
}


function updateTaskNames() {
    taskNames = []
    listItems = document.getElementsByName('item')
    for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].innerHTML !== '')
            taskNames.push(listItems[i].innerHTML)
    }
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
}

function keyDown(event, label) {
    console.log(event.keyCode)
    if (event.keyCode === 13) {
        console.log(label)
        updateTaskNames()
        event.preventDefault()
        label.blur()

        for (let i = 0; i < taskIDs.length; i++) {
            if (label.parentNode.parentNode.id === taskIDs[i]) {
                if (i < taskIDs.length-1) {
                    label.parentNode.parentNode.nextSibling.firstChild.lastChild.focus()
                } else {
                    addItem().focus()
                }
            }
        }
    }
    else if (event.keyCode === 8 && label.innerHTML === '') {
        label.parentNode.parentNode.remove()
        updateTaskNames()
    }
}

addItemBtn.onclick = addItem