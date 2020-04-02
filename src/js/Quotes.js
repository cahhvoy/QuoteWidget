const remote = require('electron').remote;
let request = require('request');
var internetAvailable = require("internet-available");

const path = require('path');

var knexConn = require("knex")({
	client: "sqlite3",
	connection: {
		filename: path.join( __dirname,"../Db/QuotesDB.db")
    },
    useNullAsDefault: true
});


saveQuote = (author,Quote)=>{
  //insert quote into db 
  let Qdate = new Date();
  
  //"quoteAuthor", "quoteBody", "quoteDate", "onlineLink", "quoteSource", "quoteSourceId"
knexConn.insert({'quoteAuthor':author,'quoteBody':Quote,'quoteDate':Qdate}).into('Quotes')
// .then( function (result) {
//     res.json({ success: true, message: 'ok' });
//  })
.then((id)=>{
   //console.log(id[0])
      console.log("ok "+id)
   return true;
 })
 .catch((err)=>{
     console.log("err "+err)
   return false;
 })
}


isQuoteSaved = async(Quote)=>{
    Quote= Quote.trim();
    let saved=true;
     await knexConn('Quotes').where('quoteBody', 'like', '%'+Quote+'%')
    .then((resp)=>{
         saved = resp.length==0?false:true
    })
    .catch((err)=>{
        console.log(err)
    })
    return saved;
}

readQuote = ()=>{
// get only one random quote
//knexConn.select('quoteAuthor','quoteBody').from('Quotes')
}

readAllQuote = ()=>{
//retun all rowns // limit included
}

totalSavedQuotes = async ()=>{
    tot=0;
        await knexConn('Quotes').count('quoteBody', {as: 'rows'})
        .then((res)=>{
            tot = JSON.stringify(res[0]['rows']);
        })
        .catch((err)=>{
            tot = 0;
        })
  return tot
}

let isInternetAvailable = false;
let totalSaved = 0;
var MainSetInt="";
var ReloadSetInt="";
var reloadInterval= 300000;

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
    window.close(); // Quits the app completely 
    //window.hide();// goes to tray app runs in the bg
})

document.getElementById("minBtn").addEventListener('click',()=>{
    var window = remote.getCurrentWindow();
    window.hide();// to tray
    // remote.getCurrentWindow().minimize();
})

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "Escape":
            remote.getCurrentWindow().hide();
            break;
         }
});

document.querySelector("button.newQuotebtn").addEventListener('click',()=>{
            document.getElementById("newQuotebtn").style.display="none";          
            document.getElementById("quoteTitle").innerHTML = "<span id=\"errorT\">Loading Quote</span>";
            let dataH  = document.getElementById("quoteText").innerHTML;
            document.getElementById("quoteText").innerHTM="";
            document.getElementById("quoteText").innerHTML="<span class=\"blur\">"+dataH+"</span><div class=\"holder\"><span class=\"dot1\"></span><span class=\"dot2\"></span><span class=\"dot3\"></span><span class=\"dot4\"></span></div>";  
            
            if(MainSetInt!=""){                
               clearInterval(MainSetInt);
               MainSetInt="";
            }
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

    if(ReloadSetInt==""){
        clearInterval(ReloadSetInt);
        ReloadSetInt="";
    }
    isInternetAvailable = await  checkConnectivity();   
    
    if(isInternetAvailable){

            let perPage = 1;
            let page  = Math.floor(Math.random() * 1000)+1;
            
            var url = "https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand&page="+page+"&per_page="+perPage+"";
            
            var url2="https://quotes.rest/quote/random?language=en&limit=1"
            request(url2,(err,response,body)=>{
                console.log(JSON.stringify(err))
                console.log(JSON.stringify(response))
                console.log(JSON.stringify(body))

            })
            request(url,async(err,response,body)=>{
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
                    //check if saved
                    let _PTrimed = quoteContent['rendered'].replace(/<[^>]+>/gm, '').trim()
                    var isSaved = await isQuoteSaved(_PTrimed);
            
                    if(!isSaved){
                        //save to Db
                        saveQuote(quoteTitle['rendered'],quoteContent['rendered']);
                    }
                    //get total saved
                    totalSaved = await totalSavedQuotes();

                    document.getElementById("quoteTitle").innerHTML = quoteTitle['rendered'];
                    document.getElementById("quoteText").innerHTML="";   
                    document.getElementById("quoteText").innerHTML = _PTrimed;
                    document.getElementById("totSavedA").innerHTML = totalSaved
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
       document.getElementById("newQuotebtn").style.display="";
       if(MainSetInt==""){
            MainSetInt = setInterval(
                loadQuote
            ,reloadInterval);
         }
     }else{
        document.getElementById("quoteTitle").innerHTML = "<span id=\"errorT\">No Internet</span>";
        document.getElementById("quoteText").innerHTML="<span id=\"error\"> <span class=\"blur\">Connection Error <br><br> Retrying Every 15 Minutes</span> </span> <div class=\"holder\"><span class=\"dot1\"></span><span class=\"dot2\"></span><span class=\"dot3\"></span><span class=\"dot4\"></span></div>";  
        //reloads every 15 minutes seconds to check for internet
        ReloadSetInt =  setInterval(
            loadQuote
         ,900000);
    }  
}

loadQuote();
