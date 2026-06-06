const Add_expense = document.getElementById("Add_expense");
const reset_btn = document.getElementById("reset_btn");
const pdf_btn = document.getElementById("pdf_btn");
const apiUrl = 'https://api.frankfurter.dev/v1/latest?base=INR';
let current_curr = "INR";
let rates = { "INR": 1.0 };

let expense_chart = null;
let saved_salary = localStorage.getItem("cf_salary") || "";
let expense_list = JSON.parse(localStorage.getItem("cf_expense")) || [];

let sum_expense = expense_list.reduce((total, expense) => total + expense.amount, 0);

if (saved_salary !== "") {
  document.getElementById("salary").value = saved_salary;
}

UIupdate();



// reset button

reset_btn.addEventListener("click", function () {

  localStorage.clear();

  saved_salary = "";
  expense_list = [];
  sum_expense = 0;

  document.getElementById("salary").value = "";
  document.getElementById("expense_name").value = "";
  document.getElementById("expense_amount").value = "";

  document.getElementById("table_body").innerHTML = "";
  document.getElementById("total_expense_footer").innerHTML = `0`;

  document.getElementById("spending_alert_banner").classList.add("hidden");

  const formnote = document.getElementById("form_note");
  document.getElementById("note_bg").className = "bg-[#EFF6FF] border border-[#BFDBFE] px-2 rounded-xl flex items-center space-x-2.5";
  document.getElementById("form_note").className = "text-[#334155] font-semibold leading-relaxed";
  formnote.innerHTML = "&#x2a;Note: Enter Your Salary First.";




  UIupdate();

  if (expense_chart) {
    expense_chart.destroy();
    expense_chart = null;
  }
  piechart();

});

// save function for saving data in local storage


function save() {
  localStorage.setItem("cf_salary", saved_salary);
  localStorage.setItem("cf_expense", JSON.stringify(expense_list));
}



// main logic for add expense


Add_expense.addEventListener("click", function () {


  const salary = document.getElementById("salary").value.trim();
  const expence_name = document.getElementById("expense_name").value.trim();
  const expense_amount = document.getElementById("expense_amount").value.trim();
  const formnote = document.getElementById("form_note");

  console.log(salary, expence_name, expense_amount);

  if (salary === "" || expence_name === "" || expense_amount === "") {
    document.getElementById("note_bg").className = "bg-[#FFF1F2] border border-[#EF4444] px-2 rounded-xl flex items-center space-x-2.5";
    document.getElementById("form_note").className = "text-[#EF4444] font-semibold leading-relaxed";
    formnote.innerHTML = "&#x2a; Please Fill All The Fields";
    return;
  } else if (Number(salary) <= 0 || Number(expense_amount) <= 0) {
    document.getElementById("note_bg").className = "bg-[#FFF1F2] border border-[#EF4444] px-2 rounded-xl flex items-center space-x-2.5";
    document.getElementById("form_note").className = "text-[#EF4444] font-semibold leading-relaxed";
    formnote.innerHTML = "&#x2a; Please Provide Valid Salary and Expense Amount";
    return;
  }

  // clearing the note and hiding

  document.getElementById("note_bg").className = "hidden";
  document.getElementById("form_note").className = "hidden";
  formnote.innerHTML = "";


  saved_salary = salary;
  sum_expense += Number(expense_amount);


  // date & time formatting

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




// delete function for expense


function deleteRow(button, targetId, amount) {

  sum_expense -= amount;

  expense_list = expense_list.filter((expense) => expense.id !== targetId);
  save();
  UIupdate();

  window.location.reload();

};


// pie chart render



function piechart() {
  const ctx = document.getElementById("expense_chart");
  if (!ctx) return;

  const salary = Number(saved_salary) || 0;
  const balance = salary - sum_expense;

  // if salary and expense is 0

  const disBalance = salary === 0 && sum_expense === 0 ? 0 : (balance < 0 ? 0 : balance);
  const disExpense = salary === 0 && sum_expense === 0 ? 0 : sum_expense;

  // chart update

  if (expense_chart) {
    expense_chart.data.datasets[0].data = [disBalance, disExpense]
    expense_chart.update();
    return;
  }


  // create pie chart


  expense_chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Balance', 'Total Expense'],
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
              family: 'Inter', size: 12
            },
            boxwidth: 12,
            padding: 16,
          }
        }
      }
    }
  });
}


// download report


pdf_btn.addEventListener("click", function () {


  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const currentrate = rates[current_curr] || 1.0;
  const salary = (Number(saved_salary) || 0) * currentrate;
  const expenses = sum_expense * currentrate;

  const formater = new Intl.NumberFormat('en-IN', { style: 'currency', currency: current_curr, currencyDisplay: 'code' });


  doc.setFont("Helvetica", "bold");
  doc.text('Cash Flow', 15, 20);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Total Salary: ${formater.format(salary)}`, 15, 32);
  doc.text(`Total Expense: ${formater.format(expenses)}`, 15, 38);
  doc.text(`Balance: ${formater.format((salary - expenses))}`, 15, 44);

  doc.autoTable({
    html: '#table', useCss: true, startY: 52,
    columns: [
      { header: 'Sn.', dataKey: '0' },
      { header: 'Expense Name', dataKey: '1' },
      { header: 'Amount', dataKey: '2' },
      { header: 'Date', dataKey: '3' }
    ]
  })

  doc.save('table.pdf')
})


// currency conversion




async function fetchFrankfurterData() {
  try {
    const response = await fetch(apiUrl);

    const data = await response.json();

    rates = { "INR": 1.0, ...data.rates };

    let menuHTML = "";


    Object.keys(rates).forEach(name => {
      menuHTML += `<button type="button" data-currency= "${name}" " class="w-full text-left px-4 py-2 text-sm text-[#334155] font-medium block hover:bg-slate-50" > ${name}</button>`;
    });

    document.getElementById("currency_opt").innerHTML = menuHTML;

  } catch (error) {
    console.error('Error calling API:', error);
  }
}





// Funtion that run when user click any currency

document.getElementById("currency_opt").addEventListener("click", function (e) {
  const btn = e.target.closest("button[data-currency]");
  if (!btn) return;
  current_curr = btn.dataset.currency;

  document.getElementById("current_currency_label").innerHTML = current_curr;
  document.getElementById("currency_menu").classList.add("hidden");

  UIupdate();
});

fetchFrankfurterData();

document.getElementById("currency_api").addEventListener("click", function (event) {
  event.stopPropagation();
  document.getElementById("currency_menu").classList.toggle("hidden");
});

document.addEventListener("click", function () {
  document.getElementById("currency_menu").classList.add("hidden");
});









// UI update function

function UIupdate() {

  const salary = Number(saved_salary) || 0;
  const balance = salary - sum_expense;
  const currentrate = rates[current_curr] || 1.0;
  const formater = new Intl.NumberFormat('en-IN', { style: 'currency', currency: current_curr, currencyDisplay: 'symbol' });

  const convertedsalary = salary * currentrate;
  const convertedexpense = sum_expense * currentrate;
  const convertedbalance = convertedsalary - convertedexpense;

  const alertbanner = document.getElementById("spending_alert_banner");
  const balancetext = document.getElementById("balance_text");
  const lowbalancebadge = document.getElementById("low_balance_badge");
  const remainbalance = document.getElementById("remain_balance");
  const safetythreshold = convertedsalary * 0.10;

  const h3 = document.querySelectorAll("h3");

  h3[0].textContent = formater.format(convertedsalary);
  h3[1].textContent = formater.format(convertedexpense);
  h3[2].textContent = formater.format(convertedbalance);


  if (convertedsalary > 0 && convertedbalance < safetythreshold) {

    alertbanner.classList.remove("hidden");
    alertbanner.classList.add("flex");
    lowbalancebadge.classList.remove("hidden");
    remainbalance.classList.add("hidden");

    balancetext.classList.remove("text-[#22C55E]");
    balancetext.classList.add("text-[#EF4444]");

    document.getElementById("alert_curr_bal").innerText = formater.format(convertedbalance);
    document.getElementById("safe_threshold").innerText = formater.format(safetythreshold);

  }
  else {
    alertbanner.classList.add("hiddden");
    lowbalancebadge.classList.add("hidden");
    remainbalance.classList.remove("hidden");

    balancetext.classList.remove("text-[#EF4444]");
    balancetext.classList.add("text-[#22C55E]");
  }


  document.getElementById("total_expense_footer").innerHTML = formater.format(convertedexpense);

  const table = document.getElementById("table_body");
  table.innerHTML = "";

  expense_list.forEach((expense, index) => {
    const table_items = document.createElement("tr");
    table_items.setAttribute("id", expense.id);


    table_items.innerHTML = `
      <td class="p-4 text-center">${index + 1}</td>
      <td class="p-4 font-medium flex items-center space-x-3">${expense.name}</td>
      <td class="p-4 font-semibold">${(expense.amount * currentrate)}</td>
      <td class="p-4 text-xs">${expense.date}</td>
      <td class="p-4 text-center">
        <button onclick="deleteRow(this, ${expense.id}, ${expense.amount})" class=" hover:bg-red-50 cursor-pointer "><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="20" height="20" 
        viewBox="0 0 24 24" style="color: rgb(239, 68, 68);"><g fill="currentColor">
        <path fill-rule="evenodd" d="M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2zm-2-1H9v1h6zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z" clip-rule="evenodd"></path><path d="M9 9h2v8H9zm4 0h2v8h-2z">
        </path></g></svg></button>
      </td>
      `;
    table.appendChild(table_items);
  });
  piechart();
}