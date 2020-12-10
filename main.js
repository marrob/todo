'use strict'
const showDay = document.querySelector('.main__day');
const showDate = document.querySelector('.main__date');
const pendingList = document.querySelector('.pending__container');
const completedList = document.querySelector('.completed__container');
const newTodoInput = document.querySelector('.new__input');
const manager = document.querySelector('.manager__container');
const pendingCounter = document.querySelector('.pending__counter');
const completedPercent = document.querySelector('.completed__percent');

const readItemsFromStorage=()=>{
    let todoItems = [];
    for(let i=0; i<localStorage.length; i++){
        const key = localStorage.key(i);
        todoItems.push(JSON.parse(localStorage.getItem(key)));
    }
    return todoItems;
}

const updateItemInStorage=(todoItem) => {
    localStorage.setItem(todoItem.key,JSON.stringify({
        key:todoItem.key,
        isCompleted:todoItem.isCompleted,
        message:todoItem.message,
    }));
}

const addItemToStorage = (todoItem)=>{
    localStorage.setItem(todoItem.key, JSON.stringify({
        key:todoItem.key,
        isCompleted:todoItem.isCompleted,
        message:todoItem.message
    }));
}

const statisticsUpdate = () =>{
    const checkboxes = document.querySelectorAll('.todo__item [type="checkbox"]');
    pendingCounter.textContent = [...checkboxes].filter(item=>!item.checked).length;
    const completed = [...checkboxes].filter(item=>item.checked).length;
    const percent = parseInt((completed/checkboxes.length) * 100);
    completedPercent.textContent = (isNaN(percent) ? 0 : percent) + '%';
}

const addItemToFrontend = (container, todoItem)=>{
    const div = document.createElement('div');
    const box = document.createElement('input');
    div.classList.add('todo__item');
    div.setAttribute('key', todoItem.key);
    box.id = todoItem.key;
    box.type="checkbox";
    box.checked = todoItem.isCompleted;
    box.addEventListener('click', itemClickEventHandler);
    div.appendChild(box);
    const label = document.createElement('label');
    label.textContent = todoItem.message;
    label.for = todoItem.key;
    div.appendChild(label);
    const btn = document.createElement('button');
    btn.addEventListener('click', itemDeleteEventHandler);
    btn.textContent='delete';
    div.appendChild(btn);
    container.appendChild(div);
}

const itemDeleteEventHandler = (ev) =>{
    const key = ev.target.parentNode.getAttribute('key');
    localStorage.removeItem(key);
    manager.querySelector(`[key="${key}"]`).remove();
    console.log("item deleted key", key);
    statisticsUpdate();
    completedTaskUpdate();
}

const itemClickEventHandler=(ev)=>{
    const isCompleted = ev.target.checked;
    const key = ev.target.parentNode.getAttribute('key');
    const changedItem = {
        key:key,
        isCompleted:isCompleted,
        message: ev.target.parentNode.querySelector('label').textContent,
    }
    if(ev.target.checked){
        manager.querySelector(`[key="${key}"]`).remove();
        addItemToFrontend(completedList, changedItem);
    }
    else{
        manager.querySelector(`[key="${key}"]`).remove();
        addItemToFrontend(pendingList, changedItem);
    }
    updateItemInStorage(changedItem);
    statisticsUpdate();
}

const getNewTodoText=()=>{
     return document.querySelector('.new__input').value;
}

const openNewTodoEventListener=()=>{
    document.querySelector('.new__button')
    .addEventListener('click',(ev)=>{
        const newTodoItem={
            key:new Date().getTime().toString(),
            isCompleted:false,
            message: newTodoInput.value,
        };
        addItemToStorage(newTodoItem);
        addItemToFrontend(pendingList, newTodoItem);
        newTodoInput.value ="";
    });
} 

const openResetTodoEventListener = () =>{
    document.querySelector('.btn__reset')
    .addEventListener('click',()=>{
        localStorage.clear();
    });
}

const openShowCompletedTodoEventListener =()=>{
    document.querySelector('.btn__completed')
    .addEventListener('click',()=>{
        completedList.classList.toggle('container--show');
    });
}


const openClearAllEventListener=()=>{
    document.querySelector('.btn__clear')
    .addEventListener('click',()=>{
    });
}


const main=()=>{
    const items = readItemsFromStorage();
    items.filter(item=>!item.isCompleted)
    .forEach(item=>addItemToFrontend(pendingList,item));

    items.filter(item=>item.isCompleted)
    .forEach(item=>addItemToFrontend(completedList,item));
    console.log(items);
}

openResetTodoEventListener();
openNewTodoEventListener();
openShowCompletedTodoEventListener();
openClearAllEventListener();
main();
statisticsUpdate();


//readItemsFromStorage();
/*
let fakeItem = { key: 1, isCompleted:false, message:"Hello World"}
addNewToFrontend (fakeItem);
fakeItem = { key: 2, isCompleted:false, message:"Hello World"}
addNewToFrontend (fakeItem);
fakeItem = { key: 3, isCompleted:false, message:"Hello World"}
addNewToFrontend (fakeItem);
*/
//addNewToStorage(fakeItem);