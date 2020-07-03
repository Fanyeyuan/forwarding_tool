import {BrowserWindow, Menu, app, Tray} from 'electron'
import {checkUpdate} from './checkUpdater'
import path from 'path'

// const isMac = process.platform === 'darwin'

const template = [{
    label: '文件',
    submenu: [{
        label: '首页',
        click: (itme, window) =>{
            // window.webContents.on('did-finish-load', function() {
              window.webContents.send('router', '/home');
            // });
        }
    },{
        label: '设置',
        click: (itme, window) =>{
            // window.webContents.on('did-finish-load', function() {
              window.webContents.send('router', '/setting');
            // });
        }
    },{
      type: 'separator',
    },{
        label: '退出',
        role: 'quit'
    }]
    },{
    label: '编辑',
    submenu: [{
      label: '撤销',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    }, {
      label: '重做',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      label: '剪切',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    }, {
      label: '复制',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: '粘贴',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }, {
      label: '全选',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }]
  }, {
    label: '查看',
    submenu: [{
      label: '重载',
      accelerator: 'CmdOrCtrl+R',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          // 重载之后, 刷新并关闭所有之前打开的次要窗体
          if (focusedWindow.id === 1) {
            BrowserWindow.getAllWindows().forEach(win => {
              if (win.id > 1) win.close()
            })
          }
          focusedWindow.reload()
        }
      }
    }, {
      label: '切换全屏',
      accelerator: (() => {
        if (process.platform === 'darwin') {
          return 'Ctrl+Command+F'
        } else {
          return 'F11'
        }
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        }
      }
    }, {
      label: '切换开发者工具',
      accelerator: (() => {
        if (process.platform === 'darwin') {
          return 'Alt+Command+I'
        } else {
          return 'Ctrl+Shift+I'
        }
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    }]
  }, {
    label: '窗口',
    role: 'window',
    submenu: [{
      label: '最小化',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },{
      label: '关闭',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    }, {
      type: 'separator'
    }, {
        label: '隐藏到托盘',
        accelerator: 'CmdOrCtrl+H',
        click: (item,browserWindow) => {
            browserWindow.hide()
        }
    }, {
      label: '重新打开窗口',
      accelerator: 'CmdOrCtrl+Shift+T',
      enabled: false,
      key: 'reopenMenuItem',
      click: () => {
        app.emit('activate')
      }
    }]
  }, {
    label: '帮助',
    role: 'help',
    submenu: [{
      label: '关于',
        click: (item, window) =>{
            // window.webContents.on('did-finish-load', function() {
              window.webContents.send('router', '/about');
            // });
        }
    },{
      label: '检查更新',
      click:(item, window) =>{
        checkUpdate(window)
      }
    }]
  }]

export function addDefaultMenu(){
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

export function initTrayIcon(win) {
         
    // const tray = new Tray(`${__static}/assets/icon/hide.ico`);
    // console.log(__static)
    // eslint-disable-next-line
    const tray = new Tray(path.join(__static, 'app.ico'));
   
    const trayContextMenu = Menu.buildFromTemplate([
        {
            label: '打开',
            click: () => {
              win && win.show();
            }
        }, {
            label: '退出',
            click: () => {
              win && win.close();
            }
        }
    ]);
    tray.setToolTip('IM云通信');
    tray.setContextMenu(trayContextMenu);

    tray.on('click', () => {
      win && win.show();
    });
    tray.on('right-click', () => {
      tray.popUpContextMenu(trayContextMenu);
    });

}