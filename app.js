const { app,Menu,MenuItem,BrowserWindow,screen,remote,Tray } = require('electron')
const path = require('path');
const url = require('url');

const appIcon = path.join(__dirname,'src/images/icon/iconSQ.jpg')


let win;
let trayIcon = null;

function createWindow () {
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        let mainWidth=500;
        let mainHeight= 200;
        let widthPos = width-mainWidth-4;
   win = new BrowserWindow({
        width: mainWidth,
        height: mainHeight,               
        minWidth:mainWidth,
        minHeight:mainHeight,
        maxWidth:500,
        maxHeight:200, 
        backgroundColor:"#e3e1e0",
        x:widthPos,
        y:4,
        //show:false,
        frame:false,
        //alwaysOnTop:true,
        movable:true,
        webPreferences: {
         nodeIntegration: true
        }
  })

  win.loadURL(url.format({
      pathname:path.join(__dirname,'src/html/Quotes.html'),
      protocol: "file", //http
      slashes:true
  }))

//   win.webContents.on('did-finish-load',()=>{
//     win.show();
// });
  
// win.once('ready-to-show', () => {
//     win.show()
//   })
  win.on('closed', () => {
    win = null
  })
    
  //win.webContents.openDevTools();
}

//app.whenReady().then(createWindow)
// app.whenReady().then(()=>{
//   createWindow()
// });

app.on('ready',()=>{
  createWindow();
  
  const contxtMenu = new Menu;
  //contxtMenu.append(new MenuItem({role:''}))
  contxtMenu.append(new MenuItem({role:'selectAll'}))
  contxtMenu.append(new MenuItem({role:'copy'}))
  contxtMenu.append(new MenuItem({type:'separator'}))
  // contxtMenu.append(new MenuItem({
    //has to use ipc 
  //   label:"Next Quote",
  //   click: ()=>{
  //     //click refresh button 
  //     //var window = win.BrowserWindow();
  //     console.log(app)
  //     //window.getElementById('newQuotebtn').click();
  //   }}))
  contxtMenu.append(new MenuItem({type:'separator'}))
  contxtMenu.append(new MenuItem({
    label:"settings",
    click: ()=>{
      //open setting menu 
      console.log("settings")
    }}))


  win.webContents.on("context-menu",(e,params)=>{
  contxtMenu.popup(win,params.x,params.y)
  })
  
  trayIcon = new Tray(appIcon);
  let trayTemplate  = [
    {
      label:'show',
      click:()=>{
        //check if visible before calling this 
        win.show();
      }
    },
    {
      type:'separator'
    },
    {
      label:'Quit',
      click: ()=>{
        app.isQuiting = true;
        app.quit();
      }
    },
  ]
  const TrayCntxtMnu = Menu.buildFromTemplate(trayTemplate);
  trayIcon.setContextMenu(TrayCntxtMnu);
  trayIcon.setToolTip("Quotes Widget");
  trayIcon.on('double-click',()=>{
    win.show();
  })

});
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

