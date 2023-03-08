// select items
const alert = document.querySelector(".alert")
const form = document.querySelector(".grocery-form")
const grocery= document.getElementById('grocery')
const submitBtn =document.querySelector('.submit-btn')
const container =document.querySelector('.grocery-container')
const list =document.querySelector('.grocery-list')
const clearBtn =document.querySelector('.clear-btn')

// 
let editElement;
let editFlag= false;
let editId = "";
// listeners
form.addEventListener('submit',addItem);
clearBtn.addEventListener('click',clearItems) 
window.addEventListener("DOMContentLoaded",setupitems);
// functions

// caearButton

function clearItems(){
    const items = document.querySelectorAll(".grocery-item")
    if(items.length>0)
    {
        items.forEach(function(item){
            list.removeChild(item);
        })
        container.classList.remove("show-container")
        displayAlert("List is Empty now",'danger')
        localStorage.removeItem('list')
        setbacktodefault();
    }
}


// add items
function addItem(e){
    e.preventDefault()
    const value = grocery.value   
    let id = new Date().getTime().toString()
    if(value && !editFlag)
    {
        createlistItem(id,value)
        // display alert
        displayAlert("item is added","success")
        // show container
        container.classList.add("show-container")
        // add to local storage
        addToLocalStorage(id,value);
        setbacktodefault();
    }
    else if(value && editFlag){
        editElement.innerHTML = value
        displayAlert("value changed", "sucess");
        // local storage
        editlocalstorage(editId,value);
        setbacktodefault();
    }
    else{
        displayAlert("Please enter data ", "danger")
    }
}
// display alert
function displayAlert(text,action){
    alert.textContent=text;
    alert.classList.add(`alert-${action}`) 
    setTimeout(function(){
        alert.textContent="";
        alert.classList.remove(`alert-${action}`) 
    },1000)
}
// setbackto default

function setbacktodefault()
{
    // console.log("set back default")
    grocery.value="";
    editId=""
    editFlag=""
    submitBtn.textContent="submit"
}


// editItem
function edititem(e){
    console.log("edit - items")
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement= e.currentTarget.parentElement.previousElementSibling;
    grocery.value=editElement.innerHTML
    editFlag= true;
    editId= element.dataset.id;
    submitBtn.textContent= "Edit"

}
// deleteItem
function deleteitem(e){
    console.log("item-deleted")
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length===0)
    {
        container.classLists.remove("show-container")
    }
    displayAlert("Item is removed","danger")
    setbacktodefault();
    // remove from local storage
    removefromlocalstorage(id);
}

// **********local storage
function addToLocalStorage(id,value){
    const grocery={id:id,value:value};
    let items= getlocalstorage();
    items.push(grocery);
    localStorage.setItem('list',JSON.stringify(items))
}


function removefromlocalstorage(id){
    let items=getlocalstorage();
    items=items.filter(function(item){
        if(item.id !== id) {
            return item
        }
    })

localStorage.setItem("list",JSON.stringify("items"))
}
function editlocalstorage(id,value){
    let items = localStorage();
    items=items.map(function(item){
        if(item.id=id){
            item.value=value
        }
        return item;
    });
    localStorage.setItem("list",JSON.stringify("items"))

}
function getlocalstorage(){
    return localStorage.getItem('list')?JSON.parse( localStorage.getItem("list")):[];
}


// setupitems
function setupitems(){
    let items=getlocalstorage();
    if(items.length>0){
        items.forEach(function(item){
            createlistItem(item.id,item.value)
        })
        container.classList.add("show-container")
    }
}



function createlistItem(id,value){
    const element= document.createElement('article')
        element.classList.add('grocery-item')
        const attr= document.createAttribute('data-id')
        attr.value=id
        element.setAttributeNode(attr)
        element.innerHTML=`<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`
        const editBtn= element.querySelector(".edit-btn")
        const deleteBtn= element.querySelector(".delete-btn")
        editBtn.addEventListener("click",edititem);
        deleteBtn.addEventListener("click",deleteitem);
        // append child
        list.appendChild(element)
}