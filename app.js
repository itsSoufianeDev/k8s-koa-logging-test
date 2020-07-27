'use strict'

const koa = require('koa')
const koaRouter = require('koa-router')

const app = new koa()
const router = new koaRouter()



/// A middleware to catch any thrown errors
/// append them to the context (ctx) and 
/// emit an 'error' event
app.use(async (ctx, next) => {
	try {
		await next()
	} catch (err) {
		ctx.status = 500
		ctx.body = err.message
		ctx.app.emit('error', err, ctx)
	}
})


/// This will be triggered by any error thrown
app.on('error', (err, ctx) => {
  console.error(`Error thrown with status code ${err.status} and message: ${err.message}`)
});


/// Throw an HTTP error randomly, unless specified
router.all('/error/:specific*', (ctx) => {
	if( typeof ctx.params.specific !== "undefined" &&
		typeof httpCodes[parseInt(ctx.params.specific)] !== "undefined"){

		ctx.throw(parseInt(ctx.params.specific), httpCodes[parseInt(ctx.params.specific)])

	}else{ /// throw random error
		const httpCodesLength = Object.keys(httpCodes).length  /// httpCodes length
		const randomIndex	  = Math.floor(Math.random() * Math.floor(httpCodesLength - 1))

		const randomErrorCode = parseInt(Object.keys(httpCodes)[randomIndex] || 500)

		ctx.throw(randomErrorCode, httpCodes[randomErrorCode])
	}
})


/// Successfuly repond to any undefined route
router.all(/(|^$)/, (ctx) => {
	ctx.status = 200
	ctx.body = `['${ctx.url}'] requested with [${ctx.method}] action - STATUS: 200`
	console.info(`['${ctx.url}'] requested with [${ctx.method}] action - STATUS: 200`)
})

/// Use routing middleware
app.use(router.routes()).use(router.allowedMethods())

/// Start listening on port 1337
app.listen(1337, () => console.log('running on port 1337'))


/// A list of HTTP Codes
const httpCodes = {
    100: 'Continue',
    101: 'Switching Protocols',
    102: 'Processing',
    103: 'Checkpoint',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    207: 'Multi-Status',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    306: 'Switch Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    418: 'I\'m a teapot',
    422: 'Unprocessable Entity',
    423: 'Locked',
    424: 'Failed Dependency',
    425: 'Unordered Collection',
    426: 'Upgrade Required',
    449: 'Retry With',
    450: 'Blocked by Windows Parental Controls',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates',
    507: 'Insufficient Storage',
    509: 'Bandwidth Limit Exceeded',
    510: 'Not Extended'
}