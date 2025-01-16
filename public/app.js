let finalsubmit=document.querySelector("#finalsubmit")
finalsubmit.addEventListener("click",()=>{
    let email=document.querySelector(".data7");
    let edesc=document.querySelector(".des1");
    edesc.innerText=email.value;

    let phone=document.querySelector(".data2");
    let phdesc=document.querySelector(".des2");
    phdesc.innerText=phone.value;

    let location=document.querySelector(".data3");
    let locdesc=document.querySelector(".des3");
    locdesc.innerText=location.value;

    let jobdescription=document.querySelector("#jobdescription");
    let description=document.querySelector(".description");
    description.innerText=jobdescription.value;

    let personaldescription=document.querySelector("#personaldescription");
    let perdesc=document.querySelector(".perpara");
    perdesc.innerText=personaldescription.value;

    let designation=document.querySelector(".desig").value;
    let designation1=document.querySelector(".designation");
    designation1.innerText=designation;

    let name=document.querySelector(".name1");
    let data1=document.querySelector(".data1").value;
    name.innerText=data1;
});

let skillbtn=document.querySelector("#skillbtn");
skillbtn.addEventListener("click",()=>{
    let skill=document.createElement("li");
    let data4=document.querySelector(".data4");
    let skillset=document.querySelector(".skillset");
    skill.innerText=data4.value;
    skillset.append(skill);
    data4.value="";
    
});

let softwarebtn=document.querySelector("#softwarebtn");
softwarebtn.addEventListener("click",()=>{
    let software=document.createElement("li");
    let data5=document.querySelector(".data5");
    let softwareset=document.querySelector(".softwareset");
    software.innerText=data5.value;
    softwareset.append(software);
    data5.value="";
    
});

let edubtn=document.querySelector("#qualificationbtn");
edubtn.addEventListener("click",()=>{
    let edu=document.createElement("li");
    let data6=document.querySelector(".data6");
    let eduset=document.querySelector(".qualificationset");
    edu.innerText=data6.value;
    eduset.append(edu);
    data6.value="";


});
    
let expbtn=document.querySelector("#expbtn");
expbtn.addEventListener("click",()=>{
    let exp=document.createElement("li");
    let data8=document.querySelector(".data8");
    let expset=document.querySelector(".experienceset");
    exp.innerText=data8.value;
    expset.append(exp);
    data8.value="";
    
});



