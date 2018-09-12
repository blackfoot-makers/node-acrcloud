var config = require('./config');
var sign = require('./sign');
var fetch = require('node-fetch');
var helper = require('./helper');

var endpoint = '/v1/identify';
var baseurl = `https://${config.host}${endpoint}`;

// Possible options:
// - audio_format: The format of your audio data, like "mp3, wav, ma4, pcm, amr" etc, If your audio file does not have audio header, this parameter should be included
// - sample_rate: If your audio file does not have audio header, this parameter should be included
// - audio_channels: If your audio file does not have audio header, this parameter should be included. Allowed values: 1,2
module.exports = (fileArray, options = {}) => {
    let file = Buffer.from(fileArray);
    let timestamp = new Date().getTime();
    let signature = sign('POST', endpoint, "audio", timestamp);
    let formOBJ = {
        'access_key' : config.access_key,
        'data_type' : "audio",
        'sample' : fileArray,
        'sample_bytes' : file.length,
        'signature_version' : config.signature_version,
        'signature' : signature,
        'timestamp' : timestamp,
    };
    if (options.audio_format)
        formOBJ.audio_format = options.audio_format;
    else if (options.sample_rate)
        formOBJ.sample_rate = options.sample_rate;
    else if (options.audio_channels)
        formOBJ.audio_channels = options.audio_channels;
    let form = helper.makeForm(formOBJ);
    return fetch(baseurl, {
        'method': "POST",
        'body' : form,
    }).then(response => response.json());
}