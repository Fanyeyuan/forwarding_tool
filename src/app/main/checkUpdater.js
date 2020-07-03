// import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from "electron-updater"
import {log} from '../common/log';

const updateUrl = 'http://updater.flight.com:8000/release/'

const checkUpdate = (win) =>{
	//处理更新操作
	const returnData = {
		error: {
			status: -1,
			msg: '更新时发生意外，无法进行正常更新！'
		},
		checking: {
			status: 0,
			msg: '正在检查更新……'
		},
		updateAva: {
			status: 1,
			msg: '正在升级……'
		},
		updateNotAva: {
			status: 2,
			msg: '开始加载程序……'
		}
    };

	//更新连接
	autoUpdater.setFeedURL(updateUrl);

	//更新错误事件
	autoUpdater.on('error', function (error) {
		sendUpdateMessage(returnData.error)
		log.info(returnData.error, error)
	});

	//检查事件
	autoUpdater.on('checking-for-update', function () {
		sendUpdateMessage(returnData.checking)
		log.info(returnData.checking)
	});

	//发现新版本
	autoUpdater.on('update-available', function () {
		sendUpdateMessage(returnData.updateAva)
		log.info(returnData.updateAva)
	});

	//当前版本为最新版本
	autoUpdater.on('update-not-available', function () {
		setTimeout(function () {
			sendUpdateMessage(returnData.updateNotAva)
			log.info(returnData.updateNotAva)
		}, 1000);
	});

	//更新下载进度事件
	autoUpdater.on('download-progress', function (progressObj) {
		win.webContents.send('downloadProgress', progressObj)
		log.info('正在下载',progressObj)
	});


	//下载完毕
	// autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
	autoUpdater.on('update-downloaded', function () {
		//退出并进行安装（这里可以做成让用户确认后再调用）
		autoUpdater.quitAndInstall();
		log.info("下载完毕")
	});

	//发送消息给窗口
	function sendUpdateMessage(text) {
		win.webContents.send('message', text)
	}

	//发送请求更新
	autoUpdater.checkForUpdates();
}

export {
    checkUpdate
}
