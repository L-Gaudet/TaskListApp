const addItemBtn = document.getElementById('addItem')
const tasks = document.getElementById('tasks')
const list = document.getElementById('list')
const pgb = document.getElementById('pgb')
addItemBtn.onclick = addItem

let numOfItems = 0

function addItem() {
    console.log('clicked')
    let li = document.createElement('li')
    let container = document.createElement('div')
    let checkbox = document.createElement('input')
    let text = document.createElement('input')

    container.classList.add('columns', 'is-mobile')
    checkbox.setAttribute('type', 'checkbox')
    checkbox.classList.add('column', 'is-1', 'checkbox')
    text.setAttribute('type', 'text')
    text.classList.add('item', 'column')
    container.appendChild(checkbox)
    container.appendChild(text)
    li.appendChild(container)
    list.appendChild(li)
    numOfItems += 1
    
    pgb.setAttribute('max', numOfItems)

    
}
