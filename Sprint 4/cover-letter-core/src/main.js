import "./style.css";
import {store} from "./store.js";
import { generatewithgemini } from "./gemniservice.js";
import {extractTextFromPDF} from "./pdf.js";


const form= document.getElementById("cover-letter-form");
const skillsInput= document.getElementById("skills");
const skillscounter= document.getElementById("skills-counter");

const resumeInput= document.getElementById("resume");
const resumestatus= document.getElementById("resume-status");

const generatebtn= document.getElementById("submit");
const regeneratebtn= document.getElementById("regenerate-btn");
const copybtn= document.getElementById("copy");
const loadingstate= document.getElementById("loading-state");
const errormsg= document.getElementById("error-msg");
const emptystate= document.getElementById("empty-state");
const output= document.getElementById("cover-letter-content");


skillsInput.addEventListener("input", ()=>{
  skillscounter.textContent=`${skillsInput.value.length}/500`;
});

form.addEventListener("input", (e)=>{
  const{name, value}= e.target;
  if(!name) return;
  store.formData[name]= value;
});










resumeInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];

    if (!file) {
      resumestatus.textContent = "No resume uploaded";
      store.resumeText = "";
      return;
    }

    resumestatus.textContent = "Reading...";

    const text = await extractTextFromPDF(file);

    if (text) {
      store.resumeText = text;
      console.log(text);
      resumestatus.textContent = `${file.name} uploaded`;
    } else {
      resumestatus.textContent = "Could not read PDF";
      store.resumeText = "";
    }
});






async function generatehandle(){
  errormsg.classList.add("hidden");
  try{
    loadingstate.classList.remove("hidden");
    generatebtn.disabled=true;

    const coverletter= await generatewithgemini({
      ...store.formData,
      resumeText:store.resumeText,
    });

    store.generatedLetter=coverletter;
    emptystate.classList.add("hidden");
    output.classList.remove("hidden");
    output.innerHTML=coverletter.replace(/\n/g, "<br>");
    copybtn.disabled=false;
    regeneratebtn.disabled=false;
  }
  catch (err){
    errormsg.textContent="Failed to Generate Cover Letter.";
    errormsg.classList.remove("hidden");
  }
  finally{
    loadingstate.classList.add("hidden");
    generatebtn.disabled=false;
  }
}

form.addEventListener("submit", (e)=>{
  e.preventDefault();
  generatehandle();
});

regeneratebtn.addEventListener("click", generatehandle);

const copyicon= document.getElementById("copy-icon");
const checkicon= document.getElementById("check-icon");

copybtn.addEventListener("click",
  async()=>{
    if(!store.generatedLetter)return;

    try{
      await navigator.clipboard.writeText(output.innerText);
      copyicon.classList.add("hidden");
      checkicon.classList.remove("hidden");
    
    setTimeout(()=>{
      checkicon.classList.add("hidden");
      copyicon.classList.remove("hidden");
    },2000);
  }
  catch(err){
    errormsg.textContent="Failed to Copy.";
    errormsg.classList.remove("hidden");
    
  }
});
