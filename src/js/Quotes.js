const remote = require('electron').remote;
let request = require('request');


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

// document.getElementById("max-btn").addEventListener("click", function (e) {
//     var window = remote.getCurrentWindow();
//     if (!window.isMaximized()) {
//         window.maximize();          
//     } else {
//         window.unmaximize();
//     }
// });
///tring to solve the problem of the api random not woring

let perPage = 1;
let page  = Math.floor(Math.random() * 1000)+1; // 1 to  1000
//let quoteNum = Math.floor(Math.random() * 11)// 0 to  10

var url = "https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand&page="+0+"&per_page="+perPage+"";

request(url,(err,response,body)=>{
  if(err){
      console.log( err)
      document.getElementById("quoteTitle").innerHTML ="<span id=\"errorT\">Error Occured</span>";
      let dataH  = document.getElementById("quoteText").innerHTML;
      document.getElementById("quoteText").innerHTML="<span id=\"error\">"+ err+"</span>"+dataH;
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
        document.getElementById("quoteText").innerHTML = quoteContent['rendered'];
  }else if(response["statusCode"]==400){
        document.getElementById("quoteTitle").innerHTML = "Error Occurred";
        let dataH  = document.getElementById("quoteText").innerHTML;
        dataH = dataH + bodyJson["message"];         
  }else{
      //standard Error here
  }

  //console.log(bodyJson)
})