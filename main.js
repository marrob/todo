'use strict'
const showDay = document.querySelector('.main__day');
const showDate = document.querySelector('.main__date');
const pendingList = document.querySelector('.pending__container');
const completedList = document.querySelector('.completed__container');
const newTodoInput = document.querySelector('.new__input');
const manager = document.querySelector('.manager__container');
const pendingCounter = document.querySelector('.pending__counter');
const completedPercent = document.querySelector('.completed__percent');
const completedButton = document.querySelector('.btn__completed');

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
    div.classList.add('todo__item','todo--new');
    div.addEventListener('mouseover', showTrashBtn);
    div.addEventListener('mouseout', hideTrashBtn);
    div.setAttribute('key', todoItem.key);
    box.id = todoItem.key;
    box.type="checkbox";
    box.checked = todoItem.isCompleted;
    box.classList.add('todo__checkbox');
    box.addEventListener('click', itemClickEventHandler);
    div.appendChild(box);
    const label = document.createElement('label');
    label.textContent = todoItem.message;
    if(todoItem.isCompleted)
        label.classList.add('text--crossed');
    label.for = todoItem.key;
    div.appendChild(label);
    const btn = document.createElement('div');
    btn.addEventListener('click', itemDeleteEventHandler);
    btn.classList.add('btn__trash', 'btn__trash--hide', 'fa','fa-trash', 'fa-2x');
    div.appendChild(btn);
    container.insertAdjacentElement('afterbegin', div);
}

const showTrashBtn = (ev) =>{
    const trashBtn = ev.currentTarget.querySelector('.btn__trash');
    trashBtn.classList.add('btn__trash--show');
    trashBtn.classList.remove('btn__trash--hide');
}
const hideTrashBtn = (ev) =>{
    const trashBtn = ev.currentTarget.querySelector('.btn__trash');
    trashBtn.classList.add('btn__trash--hide');
    trashBtn.classList.remove('btn__trash--show');
}

const itemDeleteEventHandler = (ev) =>{
    const key = ev.target.parentNode.getAttribute('key');
    localStorage.removeItem(key);
    manager.querySelector(`[key="${key}"]`).remove();
    statisticsUpdate();
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
    chillModeUpdate();
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
        statisticsUpdate();
        chillModeUpdate();
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
        completedList.classList.toggle('hide');
        if(completedList.classList.contains('hide')){
            completedButton.textContent = "Show Complete";
        }
        else{
            completedButton.textContent = "Hide Complete";
        }
    });
}

const openClearAllEventListener=()=>{
    document.querySelector('.btn__clear')
    .addEventListener('click',()=>{
        const boxes = document.querySelectorAll('.todo__item input[type=checkbox]');
        [...boxes].filter(item=>!item.checked).forEach(item=>{
            const key = item.parentNode.getAttribute('key');
            localStorage.removeItem(key);
            item.parentNode.remove();
        }) 
        statisticsUpdate();
        chillModeUpdate();
    });
}

const chillModeUpdate=()=>{
    const boxes = document.querySelectorAll('.todo__item input[type=checkbox]');
    const manager = document.querySelector('.manager__container');
    const chill = document.querySelector('.chill__container');
    if([...boxes].every(item=>item.checked)) {
        manager.classList.add('hide');
        chill.classList.remove('hide');
    }
    else{
        manager.classList.remove('hide');
        chill.classList.add('hide');
    }
}

const getDayName = (dateStr, locale) =>{
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

const getDate = (date)=>{
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    return day.padStart(2,'0') +'-'+ month.padStart(2,'0') + '-' + year;

}
const main=()=>{
    const now = new Date();
    showDay.textContent = getDayName(now, "en-US");
    showDate.textContent = getDate(now);

    const items = readItemsFromStorage();
    items.filter(item=>!item.isCompleted)
    .forEach(item=>addItemToFrontend(pendingList,item));

    items.filter(item=>item.isCompleted)
    .forEach(item=>addItemToFrontend(completedList,item));
}

main();
openResetTodoEventListener();
openNewTodoEventListener();
openShowCompletedTodoEventListener();
openClearAllEventListener();
statisticsUpdate();
chillModeUpdate();



