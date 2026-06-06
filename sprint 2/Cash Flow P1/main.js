const Add_expense = document.getElementById("Add_expense");
let sum_expense = 0;
let expensecounter=0;

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
  
  sum_expense += Number(expense_amount);
  expensecounter++;

  document.getElementById("total_expense_footer").innerHTML = `₹${sum_expense.toLocaleString("en-IN")}`;

  const h3 = document.querySelectorAll("h3");

  h3[0].innerHTML = `₹${Number(salary).toLocaleString("en-IN")}`;
  h3[1].innerHTML = `₹${Number(sum_expense).toLocaleString("en-IN")}`;
  h3[2].innerHTML = `₹${(Number(salary) - sum_expense).toLocaleString("en-IN")}`;



  const currentdate = new Date();
  const formattedDate = currentdate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });


  const table = document.getElementById("table_body");
  const table_items = document.createElement("tr");
    table_items.innerHTML = `
    <td class="p-4" text-center>${expensecounter}</td>
    <td class="p-4 font-medium flex items-center space-x-3">${expence_name}</td>
    <td class="p-4 font-semibold">₹${Number(expense_amount).toLocaleString("en-IN")}</td>
    <td class="p-4" text-xs>${formattedDate}</td>
    `;
  table.appendChild(table_items);

});