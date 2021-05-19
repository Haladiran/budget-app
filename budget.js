const budgetIn = document.querySelector("#budget-form"),
    budgetBtn = document.querySelector("#budget-button"),
    expenseIn = document.querySelector("#expense-form"),
    expenseAIn = document.querySelector("#expense-a-form"),
    expenseBtn = document.querySelector("#expense-button"),
    
    budgetD = document.querySelector("#budget-value"),
    expensesD = document.querySelector('#expenses-value'),
    eItemsArea = document.querySelector('#e-items-area'),
    balanceD = document.querySelector('#balance-value');
    
let budget = 0,
    expenses = 0,
    balance = 0;
//local saving
function saveStatus(){
    localStorage.setItem('budget', budget)
    localStorage.setItem('expenses', expenses)
    localStorage.setItem('items', eItemsArea.innerHTML)
}
//local load
function loadStatus(){
    budget = localStorage.getItem('budget');
    expenses = localStorage.getItem('expenses');

    if (budget == null){
        budget = 0
    }
    if(expenses == null){
        expenses = 0 
    }
    balance = budget - expenses;

    eItemsArea.innerHTML = localStorage.getItem('items');
    let removeBtn = document.querySelectorAll('.fa-trash-alt');
    removeBtn.forEach(item =>{
        item.addEventListener('click', removeExpenseEl)
    })
    let editBtn = document.querySelectorAll('.fa-edit');
    editBtn.forEach(item =>{
        item.addEventListener('click', editExpenseEl)
    })

    budgetD.textContent = budget;
    expensesD.textContent = expenses;
    balanceD.textContent = balance;
}
loadStatus();    

//budget input
budgetBtn.onclick = ()=>{
    let budgetV = Number(budgetIn.value)
    if(budgetIn.value ==='' || budgetV == NaN || budgetIn.value < 0){
        if(!document.getElementById('error1')){
            let bgi = document.querySelector('#budget-input');
            let budError = document.createElement('div');
            budError.setAttribute('id', 'error1')
            budError.classList.add("error");
            budError.innerHTML = '<i class="fas fa-exclamation-circle"></i> <p>Buget value can not be empty or negative<p>';
            bgi.insertBefore(budError, budgetIn)
            setTimeout(()=> budError.remove(), 2000)
        }    
    }
    else{
        budget = budgetV
        budgetD.textContent = budget
        balance = budget - expenses;
        balanceD.textContent = balance;
        saveStatus()
    }
    budgetIn.value = ''
}

//remove expense element
function removeExpenseEl(e){
    let element = e.target.parentNode.parentNode;
    let amount = Number(element.getAttribute('data-amount'));

    expenses -= amount;
    balance = budget - expenses;
    balanceD.textContent = balance;
    expensesD.textContent = expenses;

    eItemsArea.removeChild(element);
    saveStatus()
}
//edit expense element
function editExpenseEl(e){
    let element = e.target.parentNode.parentNode;
    let amount = Number(element.getAttribute('data-amount'));
    let name = element.getAttribute('data-name');
    let newName;
    let newAmount;

    element.innerHTML = `<div class='el-name'><input type='text' class='el-name-edit' placeholder='${name}'></input></div>
                        <div class='el-amount'>$ <input type='number' class='el-amount-edit' placeholder='${amount}'></input></div>
                        <div class='icons'>
                            <i class="far fa-check-square"></i>
                            <i class="fas fa-trash-alt"></i>
                        </div>`
    element.querySelector('.fa-trash-alt').addEventListener('click', removeExpenseEl)

    let enter = element.querySelector('.fa-check-square');
    enter.onclick = ()=>{
        let newNameInput = element.querySelector('.el-name-edit').value;
        let newAmountInput = element.querySelector('.el-amount-edit').value;
        
        if(newNameInput == ''){
            newName = name; 
        }else{
            newName = newNameInput
        }
        if(newAmountInput == ''){
            newAmount = amount;
        }else{
            newAmount = Number(newAmountInput);
            expenses -= amount;
            expenses += newAmount;
            balance = budget - expenses;
            balanceD.textContent = balance;
            expensesD.textContent = expenses;
        }
        element.innerHTML = `<div class='el-name'>${newName}</div>
                            <div class='el-amount'>$ ${newAmount}</div>
                            <div class='icons'>
                                <i class="fas fa-edit"></i>
                                <i class="fas fa-trash-alt"></i>
                            </div>`
        element.querySelector('.fa-trash-alt').addEventListener('click', removeExpenseEl)                    
        element.setAttribute('data-amount', newAmount);
        element.setAttribute('data-name', newName);
        let editBtn = element.querySelector('.fa-edit');
        editBtn.addEventListener('click', editExpenseEl);
        saveStatus();
    }
}

//create expense element
function createExpenseEl(name, amount){
    let newEl = document.createElement('div')
    newEl.innerHTML = `<div class='el-name'>${name}</div>
                        <div class='el-amount'>$ ${amount}</div>
                        <div class='icons'>
                            <i class="fas fa-edit"></i>
                            <i class="fas fa-trash-alt"></i>
                        </div>`
    newEl.classList.add('expense-el');
    newEl.setAttribute('data-amount', amount);
    newEl.setAttribute('data-name', name);
    eItemsArea.appendChild(newEl);

    let removeBtn = document.querySelectorAll('.fa-trash-alt');
    removeBtn.forEach(item =>{
        item.addEventListener('click', removeExpenseEl)
    })
    let editBtn = document.querySelectorAll('.fa-edit');
    editBtn.forEach(item =>{
        item.addEventListener('click', editExpenseEl)
    })
    saveStatus()        
} 
//expense input
expenseBtn.onclick = ()=>{
    let expenseNv =  expenseIn.value
    let expenseAv = Number(expenseAIn.value)
    if(expenseAIn.value === '' ||expenseNv == NaN ||expenseNv === ''){
        if(!document.getElementById('error2')){
            let exi = document.querySelector('#expense-input');
            let budError = document.createElement('div');
            budError.setAttribute('id', 'error2')
            budError.classList.add("error");
            budError.innerHTML = '<i class="fas fa-exclamation-circle"></i> <p>Values can not be empty or negative<p>';
            exi.insertBefore(budError, expenseIn)
            setTimeout(()=> budError.remove(), 2000)
        }
    }
    else{
        expenses += expenseAv;
        expensesD.textContent = expenses;
        balance = budget - expenses;
        balanceD.textContent = balance;
        createExpenseEl(expenseNv, expenseAv);
        saveStatus()
    }
    expenseIn.value = ''
    expenseAIn.value = ''
}