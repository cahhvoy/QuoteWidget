const remote = require('electron').remote;
let request = require('request');
var internetAvailable = require("internet-available");

let isInternetAvailable = false;

checkConnectivity = async ()=>{
    let net= false;
    await internetAvailable({
       timeout: 5000,
       retries: 2
     }).then(() => {
        net=true;
    }).catch(() => {        
        net=false;
  });    
  return net;
}


document.getElementById("closeBtn").addEventListener('click',()=>{
    var window = remote.getCurrentWindow();
    window.close();
})

document.getElementById("minBtn").addEventListener('click',()=>{
    var window = remote.getCurrentWindow();
    window.minimize();
    // remote.getCurrentWindow().minimize();
})

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "Escape":
            remote.getCurrentWindow().minimize();
            break;
         }
});

document.querySelector("button.newQuotebtn").addEventListener('click',()=>{
            document.getElementById("newQuotebtn").style.display="none";          
            document.getElementById("quoteTitle").innerHTML = "<span id=\"errorT\">Loading Quote</span>";
            let dataH  = document.getElementById("quoteText").innerHTML;
            document.getElementById("quoteText").innerHTM="";
            document.getElementById("quoteText").innerHTML="<span class=\"blur\">"+dataH+"</span><div class=\"holder\"><span class=\"dot1\"></span><span class=\"dot2\"></span><span class=\"dot3\"></span><span class=\"dot4\"></span></div>";  
        loadQuote();         
        
})


// document.getElementById("max-btn").addEventListener("click", function (e) {
//     var window = remote.getCurrentWindow();
//     if (!window.isMaximized()) {
//         window.maximize();          
//     } else {
//         window.unmaximize();
//     }
// });


loadQuote = async ()=>{
  
    isInternetAvailable = await  checkConnectivity();   
    
    if(isInternetAvailable){

            let perPage = 1;
            let page  = Math.floor(Math.random() * 1000)+1;
            
            var url = "https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand&page="+page+"&per_page="+perPage+"";

            request(url,(err,response,body)=>{
            if(err){
                document.getElementById("quoteTitle").innerHTML ="<span id=\"errorT\">Error Occured</span>";
                document.getElementById("quoteText").innerHTML="";
                document.getElementById("quoteText").innerHTML="<span id=\"error\">"+ err+"</span> <div class=\"holder\"><span class=\"dot1\"></span><span class=\"dot2\"></span><span class=\"dot3\"></span><span class=\"dot4\"></span></div>";
            }
            
            let bodyJson = JSON.parse(body);
            if(response["statusCode"]==200){
                    //   let quoteId = bodyJson[0]['id'];
                    //   let quoteGuid = bodyJson[0]['guid'];
                    //   let quotesLug = bodyJson[0]['slug'];
                    //   let quoteLink = bodyJson[0]['link'];
                    let quoteTitle = bodyJson[0]["title"];
                    let quoteContent = bodyJson[0]["content"];
                    
                    document.getElementById("quoteTitle").innerHTML = quoteTitle['rendered'];
                    document.getElementById("quoteText").innerHTML="";
                    document.getElementById("quoteText").innerHTML = quoteContent['rendered'];
            }else if(response["statusCode"]==400){
                    document.getElementById("quoteTitle").innerHTML = "<span id=\"errorT\">Error Occurred</span>";
                    let dataH  = document.getElementById("quoteText").innerHTML;
                    document.getElementById("quoteText").innerHTML="";
                    document.getElementById("quoteText").innerHTML="<span id=\"error\">"+bodyJson["message"] +"</span>"+dataH;        
            }else{
                //standard Error here
                document.getElementById("quoteTitle").innerHTML ="<span id=\"errorT\">Error</span>";
                document.getElementById("quoteText").innerHTML="";
                document.getElementById("quoteText").innerHTML="<span id=\"error\"> an unknown Error Occured </span>";
            } 

       })
     }else{
        document.getElementById("quoteTitle").innerHTML = "<span id=\"errorT\">No Internet</span>";
        document.getElementById("quoteText").innerHTML="<span id=\"error\"> <span class=\"blur\">Connection Error</span> </span> <div class=\"holder\"><span class=\"dot1\"></span><span class=\"dot2\"></span><span class=\"dot3\"></span><span class=\"dot4\"></span></div>";  
    }
  document.getElementById("newQuotebtn").style.display="";
}

loadQuote();