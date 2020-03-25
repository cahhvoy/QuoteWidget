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


var url = "https://quotesondesign.com/wp-json/wp/v2/";
request(url,(err,response,body)=>{
  if(err){
      console.log("err"+ err)
  }
 let bodyJson = JSON.parse(body);
//   let quoteId = bodyJson[0]['id'];
//   let quoteGuid = bodyJson[0]['guid'];
//   let quotesLug = bodyJson[0]['slug'];
//   let quoteLink = bodyJson[0]['link'];
//   let quoteTitle = bodyJson[0]["title"];
//   let quoteContent = bodyJson[0]["content"];

//   document.getElementById("quoteTitle").innerHTML = quoteTitle['rendered'];
//   document.getElementById("quoteText").innerHTML = quoteContent['rendered'];

  console.log(bodyJson)
})