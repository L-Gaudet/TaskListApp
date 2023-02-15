const addItemBtn = document.getElementById('addItem')
let list = document.getElementById('list')
const pgb = document.getElementById('pgb')

let numItemsComplete = 0
let taskNames  // -> holds names of tasks
let taskIndices = new Map() // key: uniqueID, value: index in task names array
let numOfActualTasks = 0

let currentElement

function selectCurrentElement(label) {
    currentElement = label.parentNode.id
}

function createUniqueID() {
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
    label.setAttribute('onkeyup', 'keyUp(event, this)')
    label.setAttribute('onfocusout', 'updateTaskNames()')
    label.setAttribute('onfocus', 'selectCurrentElement(this);')

    container.setAttribute('name', 'item')
    container.setAttribute('id', uniqueID)

    checkbox.classList.add('checkbox')
    checkbox.append(label)
    container.appendChild(checkbox)
    container.appendChild(label)
    li.appendChild(container)

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
            taskNames.push(listItems[i].lastChild.innerHTML.replace('nbsp;', '')) 
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

function setCursor(nextElement, pos) {
    var tag = nextElement;

    if (nextElement.innerHTML === '') {
        nextElement.focus()
        return
    }
    var setpos = document.createRange();
    var set = window.getSelection();
    setpos.setStart(tag.childNodes[0], pos);
    setpos.collapse(true);
    set.removeAllRanges();
    set.addRange(setpos);
    tag.focus();
}

function keyDown(event, label) {
    // var set = window.getSelection();
    // console.log(label.selectionStart)
    // let _range = document.getSelection().getRangeAt(0)
    // let range = _range.cloneRange()
    // range.selectNodeContents(label.target)
    // range.setEnd(_rang.endContainer, _range.endOffset)
    // console.log(range.toString().length)
    range = window.getSelection()
    console.log(range.startOffset)

    if (event.keyCode === 13) { // add new task below current 
        updateTaskNames() 
        event.preventDefault()
        label.blur()
        // console.log(event.code)
        // if next node is empty, go to it
        // else create new item
        try {
            if (label.parentNode.parentNode.nextSibling.firstChild.lastChild.innerHTML === '') {
                label.parentNode.parentNode.nextSibling.firstChild.lastChild.focus()
            } else {
                let newItem = createItem()
                label.parentNode.parentNode.insertAdjacentElement('afterend', newItem)
                newItem.firstChild.lastChild.focus()
            }
        } catch {
            let newItem = createItem()
            label.parentNode.parentNode.insertAdjacentElement('afterend', newItem)
            newItem.firstChild.lastChild.focus()
        }
    }
    else if (event.keyCode === 8 && label.innerHTML === '') { 
        if (label.previousSibling.checked)
            // label.innerHTML.caretPosition()
            pgb.setAttribute('value', --numItemsComplete)

        taskIndices.delete(label.parentNode.id) 
        event.preventDefault()

        try {
            var nextElement = label.parentNode.parentNode.previousSibling.firstChild.lastChild
            var endOfText = nextElement.innerHTML.length
            setCursor(nextElement, endOfText)
        } catch {
            try { // if top element is deleted, will focus next item. if none left, blurs label
                label.parentNode.parentNode.nextSibling.firstChild.lastChild.focus() 
            } catch {
                label.blur()
            }
        }

        label.parentNode.parentNode.remove()

        updateTaskNames()
    }
    // for this branch going to try and change it so that it decrements numOfActualTasks when
    // the cursor is on the left most spot (regardless of whats to the right of it) and move 
    // whatever is to the right of it to the previous task.
    else if (event.keyCode === 8 && label.innerHTML.length === 1) { // down to empty element
        numOfActualTasks--
    }
    // 
    else if (label.innerHTML === '' && event.keyCode ) { // down to empty element
        // console.log(event.compositionupdate)
        // if (event.isComposing)
            numOfActualTasks++
    }
    // console.log(numOfActualTasks)
    pgb.setAttribute('max', numOfActualTasks)
}

function keyUp(event, label) {
    // console.log(event.isComposing)
}

addItemBtn.onclick = appendItem