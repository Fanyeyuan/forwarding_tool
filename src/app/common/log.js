const log = require('electron-log');

log.transports.console.level = 'silly'
log.transports.console.level = false
log.transports.file.level = 'info'
log.transports.file.maxSize = 500 * 1024 * 1024 // 日志大小最大500m

log.warn('日志开始');

export {
    log
};