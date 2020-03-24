const { app,Menu,BrowserWindow } = require('electron')
const path = require('path');
const url = require('url');

let win;

function createWindow () {
  // Create the browser window.
   win = new BrowserWindow({
        width: 500,
        height: 200,
        maxWidth:500,
        maxHeight:200,
        minHeight:200,
        minWidth:500,
        backgroundColor:"#e3e1e0",
        frame:false,
        //alwaysOnTop:true,
        webPreferences: {
         nodeIntegration: true
        }
  })

  win.loadURL(url.format({
      pathname:path.join(__dirname,'src/html/Quotes.html'),
      protocol: "file", //http
      slashes:true
  }))
  
  
  win.on('closed', () => {
    win = null
  })
    

  //win.removeMenu();
}

//app.whenReady().then(createWindow)
app.whenReady().then(()=>{
  createWindow()
});

// app.on('ready',function(){
//     createWindow()  
// });
  

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit()
  }
})

app.on('activate', () => {
  if (win === 0) {
     createWindow()
  }
})


