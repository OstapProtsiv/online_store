const { createLogger, transports, format } = require('winston');
const winston = require('winston');
const path = require('path');
const ownFormat = format.printf((info) => {
    return `  (${info.timestamp}) [${info.level}]: ${info.message}`;
});
const enumerateErrorFormat = format(info => {
    if (info.message instanceof Error) {
        info.message = Object.assign({
            message: info.message.message,
            stack: info.message.stack,
        }, info.message);
    }
    if (info instanceof Error) {
        return Object.assign({
            message: info.message,
            stack: info.stack,
        }, info);
    }
    return info;
});

let options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: true,
        format: format.combine(
            format.colorize(),
            format.timestamp(({ format: 'YYYY-MM-DD HH:mm:ss' })),
            ownFormat,
        )
    },
    file: {
        level: 'info',
        filename: path.resolve('logs', 'app.log'),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    }
}

const logger = createLogger({
    format: format.combine(
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
        enumerateErrorFormat(),
        format.json()
    ),
    level: 'info',
    transports: [
        new transports.Console(options.console),
        new transports.File(options.file)
    ],
    exitOnError: false
})

module.exports = logger;