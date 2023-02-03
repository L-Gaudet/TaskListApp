const addItemBtn = document.getElementById('addItem')
const tasks = document.getElementById('tasks')
let list = document.getElementById('list')
const pgb = document.getElementById('pgb')

addItemBtn.onclick = getListItems

let numOfItems = 0
let numItemsComplete = 0
let taskNames 

function addItem() {
    console.log('clicked')
    let li = document.createElement('li')
    let container = document.createElement('div')
    let checkbox = document.createElement('input')
    let label = document.createElement('label')

    // container.classList.add('grid')
    checkbox.setAttribute('type', 'checkbox')
    checkbox.setAttribute('data-myid', 'item'+numOfItems)
    checkbox.setAttribute('onclick', 'checkAddress(this)')
    // name="checkAddress" onclick="checkAddress(this)"
    label.setAttribute('contenteditable', 'true')
    label.setAttribute('data-myid', checkbox.id)
    label.setAttribute('name', 'item')
    label.setAttribute('style', 'outline: 0; width: 100%; max-width: 365px;')
    label.setAttribute('placeholder', "Enter task here…")
    label.setAttribute('data-content-editable-leaf', 'true')
    label.innerHTML = 'task ' + numOfItems
    checkbox.classList.add('checkbox')

    checkbox.append(label)
    container.appendChild(checkbox)
    container.appendChild(label)
    li.appendChild(container)
    list.appendChild(li)
    numOfItems++
    
    pgb.setAttribute('max', numOfItems)

    // eventEmitter.emit('itemAdded') //#########
}

// const { remote } = require('electron')
// const { Menu, Tray } = remote


async function getListItems() {
    await addItem()
    taskNames = []
    listItems = document.getElementsByName('item')
    console.log(taskNames)
    for (let i = 0; i < listItems.length; i++) {
        taskNames.push(listItems[i].innerHTML)
    }
    window.electronAPI.setMenu(taskNames)
}

function checkAddress(checkbox) {
    if (checkbox.checked) {
        pgb.setAttribute('value', ++numItemsComplete);
    }
    else {
        pgb.setAttribute('value', --numItemsComplete);
    }
}

function updateTask(label) {
    // on enter press exit selection and call context bridge to send updates task names to main js
}