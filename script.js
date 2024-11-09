//access sidebar elements 
let sideNavigation = document.querySelector(".sideNavigation");
let sidebarToggle = document.querySelector(".fa-bars");
let chatHistory = document.querySelector(".chatHistory ul");

//access chat-window element
let startContent = document.querySelector(".startContent");
let startContentUl = document.querySelector(".startContent ul");
let chatContent = document.querySelector(".chatContent");
let result = document.querySelector(".results");
let inputArea = document.querySelector(".inputArea input");
let sendRequest = document.querySelector(".fa-paper-plane");
let mode = document.querySelector(".mode");



//toggle button functionality
sidebarToggle.addEventListener('click',()=>{
    sideNavigation.classList.toggle("expandClose");//styling in style.css    
});


//when we enter the prompt then paper-plane is enabled functionality
inputArea.addEventListener('keyup',(e)=>{
    if(e.target.value.length > 0){
        sendRequest.style.display = "inline";
    }else{
        sendRequest.style.display = "none";
    }
});
sendRequest.addEventListener('click',()=>{
    getGeminiResponse(inputArea.value,true);// onclick the question will be appear in the recent list
});


//recent list functionality
function getGeminiResponse(question, appendhistory){

    if (appendhistory){
        let historyLi = document.createElement("li");

        historyLi.addEventListener('click',()=>{ // when click the recent questions quection will be apeear one by one
            getGeminiResponse(question,false);
        });

        historyLi.innerHTML = `<i class = "fa-regular fa-message"></i>${question}`;
        chatHistory.append(historyLi);

    }
    result.innerHTML = " ";
    inputArea.value = " ";

    startContent.style.display="none";
    chatContent.style.display="block";
    
    //question will bb appear at the top
    let resultTitle = 
    `<div class = "resultTitle">
        <p>${question}</p> 
    </div>`;

    //response will be appear
    let resultData = 
    `<div class = "resultData">
        <img src = "google-gemini-icon.png"/>

        <div class = "loader">
            <div class = "animateBG"></div>
            <div class = "animateBG"></div>
            <div class = "animateBG"></div>
        </div>
    </div>`;

    result.innerHTML+=resultTitle;
    result.innerHTML+=resultData;

    //fetch the gemini url
    let AIURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDBrxmYMtvTxUQefq2NE0Im6F5XKhrMymg";

    fetch(AIURL,{
        method:"POST",
        body:JSON.stringify({
        contents: [{"parts":[{"text": question}]}]
        }),
    }).then((response)=>response.json()).then((data)=>{
        
        //functionality of question and response will be appear in chat window
        let responseData = jsonEscape(data.candidates[0].content.parts[0].text);
        let responseArray = responseData.split("**");
        let newResponse = "";

        for(let i = 0 ; i < responseArray.length ; i++){
          if(i==0 || i%2==1){
            newResponse+=responseArray[i];
          }else{
            newResponse +=  
            "<strong>" + 
                responseArray[i].split(" ").join("&nbsp") + 
            "</strong>";
          }
        }
        let newResponse2 = newResponse.split("*").join(" ");

        let textArea = document.createElement("textarea");
        textArea.innerHTML = newResponse2;

        result.innerHTML = 
        `<div class = "resultResponse"> 
            <img src = "google-gemini-icon.png"/>
            <p id = "typeEffect"></p>
        </div>`;

        let newResponseData = newResponse2.split(" ");
        for (let j = 0 ; j<= newResponseData.length; j++){
            timeOut(j, newResponseData[j]+" ");
        }
    }); 
}

let timeOut = (index,nextWord)=>{
    setTimeout(function(){
        document.getElementById("typeEffect").innerHTML += nextWord;
    },75 * index);
}



//adding aynamic questions...//here we create the array of the question
let promptQuestions = [
{
    question : "write a thank you note to my subscribers",
    icon : "fa-solid fa-wand-magic-sparkles",
},
{
    question : "write a sample code to learn javascript",
    icon : "fa-solid fa-code",
},
{
    question : "how to become a full stack developer ?",
    icon : "fa-solid fa-laptop-code",
},
{
    question : "how to become a back-end developer ?",
    icon : "fa-solid fa-database"
},
];

//append this question on chat window
window.addEventListener("load",()=>{
    promptQuestions.forEach((data)=>{
       let item = document.createElement("li");

       item.addEventListener("click",()=>{
            getGeminiResponse(data.question,true); // onclick the question will be appear in the recent list
       });

       item.innerHTML = `<div class = "promptSuggestion">
       <p>${data.question}</p>
       <div class = "icon"><i class = "${data.icon}"></i></div>
       </div>`;
       //append
       startContentUl.append(item);
    });
});

//when click on new chat button current chat will be disappear and new chat window will be open.
function newChat(){
    startContent.style.display="block";
    chatContent.style.display="none";
}

function jsonEscape(str){
    return str
    .replace(new RegExp("\r?\n\n","g"),"<br>")
    .replace(new RegExp("\r?\n","g"),"<br>");
}



