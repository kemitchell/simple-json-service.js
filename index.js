module.exports = simpleJSONService

var concat = require('concat-stream')
var uuid = require('uuid')

function simpleJSONService(log, level, implementation) {
  return function (request, response) {
    request.log = log(uuid.v4())
    request.log.info(request)

    function callback(error, output) {
      output = ( error ? { error: error } : { output: output } )
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify(output))
      request.log.info({ output: output }) }

    request.pipe(concat(function(buffer) {
      parseJSON(buffer, function(error, input) {
        if (error) { callback('Invalid request') }
        else {
          request.log.info({ input: input })
          implementation(log, level, input, callback) } }) })) } }

function parseJSON(input, callback) {
  try {
    var result = JSON.parse(input)
    callback(null, result) }
  catch (error) {
    callback(error) } }
