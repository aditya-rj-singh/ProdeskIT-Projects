const Add_expense = document.getElementById("Add_expense");
const reset_btn = document.getElementById("reset_btn");

let expense_chart = null;
let saved_salary = localStorage.getItem("cf_salary") || "";
let expense_list = JSON.parse(localStorage.getItem("cf_expense")) || [];

let sum_expense = expense_list.reduce((total, expense) => total + expense.amount, 0);
let expensecounter = expense_list.length;

if (saved_salary !== "") {
  document.getElementById("salary").value = saved_salary;
}

UIupdate();

// RESET BUTTON

reset_btn.addEventListener("click", function () {

  localStorage.clear();

  saved_salary = "";
  expense_list = [];
  sum_expense = 0;
  expensecounter = 0;

  document.getElementById("salary").value = "";
  document.getElementById("expense_name").value = "";
  document.getElementById("expense_amount").value = "";

  document.getElementById("table_body").innerHTML = "";
  document.getElementById("total_expense_footer").innerHTML = `₹0`;

  const formnote = document.getElementById("form_note");
  document.getElementById("note_bg").className = "bg-[#EFF6FF] border border-[#BFDBFE] px-2 rounded-xl flex items-center space-x-2.5";
  document.getElementById("form_note").className = "text-[#334155] font-semibold leading-relaxed";
  formnote.innerHTML = "&#x2a;Note: Enter Your Salary First.";

  
  const h3 = document.querySelectorAll("h3");
  h3[0].innerHTML = `₹0`;
  h3[1].innerHTML = `₹0`;
  h3[2].innerHTML = `₹0`;
  
  UIupdate();

  if(expense_chart){
    expense_chart.destroy();
    expense_chart = null;
  }
  piechart();

});

// SAVE FUNCTION FOR SAVING THE DATA IN LOCAL STORAGE


function save() {
  localStorage.setItem("cf_salary", saved_salary);
  localStorage.setItem("cf_expense", JSON.stringify(expense_list));
}



// MAIN LOGIC FOR ADDING EXPENSES


Add_expense.addEventListener("click", function () {

  const salary = document.getElementById("salary").value.trim();
  const expence_name = document.getElementById("expense_name").value.trim();
  const expense_amount = document.getElementById("expense_amount").value.trim();
  const formnote = document.getElementById("form_note");
  
  console.log(salary, expence_name, expense_amount);
  
  if(salary==="" || expence_name === "" || expense_amount === ""){
    document.getElementById("note_bg").className = "bg-[#FFF1F2] border border-[#EF4444] px-2 rounded-xl flex items-center space-x-2.5";
    document.getElementById("form_note").className = "text-[#EF4444] font-semibold leading-relaxed";
    formnote.innerHTML = "&#x2a; Please Fill All The Fields";
    return;
  }else if(Number(salary)<=0 || Number(expense_amount)<=0){
    document.getElementById("note_bg").className = "bg-[#FFF1F2] border border-[#EF4444] px-2 rounded-xl flex items-center space-x-2.5";
    document.getElementById("form_note").className = "text-[#EF4444] font-semibold leading-relaxed";
    formnote.innerHTML = "&#x2a; Please Provide Valid Salary and Expense Amount";
    return;
  }

                          // CLEARING THE NOTE AND HIDE IT

  document.getElementById("note_bg").className = "hidden";
  document.getElementById("form_note").className = "hidden";
  formnote.innerHTML = "";


  saved_salary = salary;
  sum_expense += Number(expense_amount);

  
                          // DATE AND TIME FORMATTING
  
  const currentdate = new Date();
  const formattedDate = currentdate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const new_expense = {
    id: Date.now(),
    name: expence_name,
    amount: Number(expense_amount),
    date: formattedDate,
  };
  
  expense_list.push(new_expense);
  save();

  UIupdate();


  
  document.getElementById("expense_name").value = "";
  document.getElementById("expense_amount").value = "";
  
  
});


// UI UPDATE FUNCTION FOR UPDATING THE UI WITH NEW VALUES

function UIupdate(){
  
  const salary = Number(saved_salary) || 0;
  const balance = salary - sum_expense;
  
  
  const h3 = document.querySelectorAll("h3");
  
  h3[0].innerHTML = `₹${Number(salary).toLocaleString("en-IN")}`;
  h3[1].innerHTML = `₹${Number(sum_expense).toLocaleString("en-IN")}`;
  h3[2].innerHTML = `₹${(Number(salary) - sum_expense).toLocaleString("en-IN")}`;
  
  document.getElementById("total_expense_footer").innerHTML = `₹${sum_expense.toLocaleString("en-IN")}`;
  
  const table = document.getElementById("table_body");
  table.innerHTML = "";
  
  expense_list.forEach((expense, index) => {
    const table_items = document.createElement("tr");
    table_items.setAttribute("id", expense.id);
  
  
  table_items.innerHTML = `
  <td class="p-4" text-center>${index + 1}</td>
  <td class="p-4 font-medium flex items-center space-x-3">${expense.name}</td>
  <td class="p-4 font-semibold">₹${Number(expense.amount).toLocaleString("en-IN")}</td>
  <td class="p-4" text-xs>${expense.date}</td>
  <td class="p-4 text-center">
    <button onclick="deleteRow(this, ${expense.id}, ${expense.amount})" class="text-[#EF4444] hover:bg-red-50 cursor-pointer font-medium">Delete</button>
  </td>
  `;
  table.appendChild(table_items);
  });

  piechart();
}


// DELETE FUNCTION FOR DELETING THE EXPENSES


function deleteRow(button, targetId, amount) {

  sum_expense -= amount;
  expensecounter--;

  expense_list = expense_list.filter((expense) => expense.id !== targetId);
  save();
  UIupdate();

};


// PIE CHART RENDER 



function piechart(){
  const ctx = document.getElementById("expense_chart");
  if(!ctx) return;

  const salary = Number(saved_salary) || 0;
  const balance = salary - sum_expense;

                // IF SALARY AND EXPENSE IS 0

  const disBalance = salary === 0 && sum_expense === 0 ? 0 : (balance < 0 ? 0 : balance);
  const disExpense = salary === 0 && sum_expense === 0 ? 0 : sum_expense;

                // CHART UPDATE

  if(expense_chart){
    expense_chart.data.datasets[0].data = [disBalance, disExpense]
    expense_chart.update();
    return;
  }


                // CREATE PIE CHART


  expense_chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Balance' , 'Total Expense'],
      datasets: [{
        data: [disBalance, disExpense],
        backgroundColor: [
          '#22C55E',
          '#EF4444'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: 'Inter', size: 12 },
            boxwidth: 12,
            padding: 16, 
          }
        }
      }
    }
  });
}

