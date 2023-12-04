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
    label.setAttribute('data-isCounted', 'false')

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

function updateProgressBar() {
    pgb.setAttribute('value', numItemsComplete)
    pgb.setAttribute('max', numOfActualTasks)
}

function updateTaskNames() {
    taskNames = []
    completedTaskNames = []
    incompleteTaskNames = []
    listItems = document.getElementsByName('item')
    for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].lastChild.innerHTML !== '') {
            if (!listItems[i].firstChild.checked) {
                incompleteTaskNames.push(listItems[i].lastChild.innerHTML.replace('nbsp;', '')) 
                taskNames.push(listItems[i].lastChild.innerHTML.replace('nbsp;', '')) 
                taskIndices.set(listItems[i].id, taskNames.length-1) // unique ID can find the index in the taskNames list now
            } else {
                completedTaskNames.push(listItems[i].lastChild.innerHTML.replace('nbsp;', '')) 
            }
        } else {
            taskIndices.set(listItems[i].id, -1)
        }
    }
    // pgb.setAttribute('value', completedTaskNames.length)
    if (taskNames.length === 0) {
        taskNames.push('No tasks')
        incompleteTaskNames.push('None')
        if (completedTaskNames.length === 0)
            completedTaskNames.push('None')
    }
    window.electronAPI.setMenu(incompleteTaskNames, completedTaskNames)
}

function checkAddress(checkbox) {
    if (checkbox.checked) {
        if (checkbox.nextSibling.innerHTML.length != 0) {
            ++numItemsComplete
            checkbox.nextSibling.setAttribute('style', 'outline: 0; min-width: 25%; max-width: 100%; text-decoration: line-through;')
        }
    }
    else {
        if (checkbox.nextSibling.innerHTML.length != 0) {
            --numItemsComplete
            checkbox.nextSibling.setAttribute('style', 'outline: 0; min-width: 25%; max-width: 100%;')
        }
    }
    updateProgressBar()
    updateTaskNames()
}

function checkIfChecked(checkbox) {
    if (checkbox.checked) {
        if (checkbox.nextSibling.innerHTML.length !== 0) {
            console.log('incrementing numItemsComplete')
            ++numItemsComplete
            checkbox.nextSibling.setAttribute('style', 'outline: 0; min-width: 25%; max-width: 100%; text-decoration: line-through;')
        }
    }
    else {
        if (checkbox.nextSibling.innerHTML.length === 0) {
            console.log('decrimenting numItemsComplete')
            --numItemsComplete
            checkbox.nextSibling.setAttribute('style', 'outline: 0; min-width: 25%; max-width: 100%;')
        }
    }
    updateProgressBar()
    console.log('size of completed bar: ' + String(pgb.value))
    console.log('size of total bar: ' + String(pgb.max))

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

function getCaretPosition(label) {
    var caretPos = 0,
        sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == label) {
                caretPos = range.endOffset;
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == label) {
            var tempEl = document.createElement("span");
            label.insertBefore(tempEl, label.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
}

function keyDown(event, label) {
    console.log(getCaretPosition(label))
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
    else if (event.keyCode === 8 && getCaretPosition(label)  === 0) {  // if delete is pressed and caret is on left side,
        if (label.previousSibling.checked)                     // move text to previous node
            --numItemsComplete
            // pgb.setAttribute('value', --numItemsComplete)
        if (label.innerHTML.length !== 0)
            --numOfActualTasks
            // pgb.setAttribute('max', --numOfActualTasks)

        taskIndices.delete(label.parentNode.id) 
        event.preventDefault()

        try {
            var textToMove = label.innerHTML
            var nextElement = label.parentNode.parentNode.previousSibling.firstChild.lastChild
            nextElement.innerHTML += textToMove
            var newCaretPos = nextElement.innerHTML.length - textToMove.length
            setCursor(nextElement, newCaretPos)
        } catch {
            try { // if top element is deleted, will focus next item. if none left, blurs label
                label.parentNode.parentNode.nextSibling.firstChild.lastChild.focus() 
            } catch {
                label.blur()
            }
        }

        label.parentNode.parentNode.remove()

        // updateProgressBar()
        
    }
    else if (event.keyCode === 8 && label.innerHTML.length === 1) { // down to empty element, empty elem not counted in bar
        numOfActualTasks--
    }
    else if (event.keyCode === 46 && label.innerHTML.length === 1 && getCaretPosition(label) === 0) { // down to empty, 46 is del to the right
        numOfActualTasks--
    }
    
    updateProgressBar()
}

function keyUp(event, label) {
    updateTaskNames()
    // console.log(label.dataset.iscounted)
    if (label.innerHTML.length >= 1 && label.dataset.iscounted === 'false') {
        // console.log('incrememtn numActualTakss')
        ++numOfActualTasks
        label.dataset.iscounted = 'true'
        checkIfChecked(label.previousSibling) // checks checkbox once text is typed in box
    } else if (label.innerHTML.length === 0)
        label.dataset.iscounted = 'false'
    if (event.keyCode == 8 && g)
    // pgb.setAttribute('max', numOfActualTasks)
    updateProgressBar()
    console.log('num of actual tasks: ' + String(numOfActualTasks))
}

addItemBtn.onclick = appendItem