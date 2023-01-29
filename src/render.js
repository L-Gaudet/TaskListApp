const addItemBtn = document.getElementById('addItem')
const tasks = document.getElementById('tasks')
let list = document.getElementById('list')
const pgb = document.getElementById('pgb')
let listItems = list.getElementsByTagName('li');

// addItemBtn.onclick = addItem
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
    label.setAttribute('id', 'item')
    label.innerHTML = 'task ' + numOfItems
    checkbox.classList.add('checkbox')

    checkbox.append(label)
    container.appendChild(checkbox)
    container.appendChild(label)
    li.appendChild(container)
    list.appendChild(li)
    numOfItems++
    
    pgb.setAttribute('max', numOfItems)
}

// const { remote } = require('electron')
// const { Menu, Tray } = remote

async function getListItems() {
    await addItem()
    taskNames = []
    for (let i = 0; i < listItems.length; i++) {
        taskNames.push(listItems[i].firstChild.lastChild.innerHTML)
    }
    // let tray
    // const icon = nativeImage.createFromPath('src/media/list.clipboard.fill@2x.png')
    // tray = new Tray(icon)  

    // contextMenu = Menu()
    // for (let i=0; i < foo.length; i++) {
    // contextMenu.append(new MenuItem({label: taskNames[i]}))
    // console.log(taskNames[i])
    // }
    // tray.setContextMenu(contextMenu)
}

function checkAddress(checkbox)
{
    if (checkbox.checked)
    {
        pgb.setAttribute('value', ++numItemsComplete);

    }
    else {
        pgb.setAttribute('value', --numItemsComplete);
    }
}

// function writeToFile(data) {
//     const fs = require('fs')
//     fs.writeile('./list.txt', data, (err) => {
//         // In case of a error throw err.
//         if (err) throw err;
//     })
// }