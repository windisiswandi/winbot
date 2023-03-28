const axios = require('axios')
const fs = require('fs')
const API_KEY_OPENAI = "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"
const transaltor = require('google-translate-api')

transaltor('Ik spreek Engels', {to: 'en'}).then(res => {
    console.log(res.text);
    //=> I speak English
    console.log(res.from.language.iso);
    //=> nl
}).catch(err => {
    console.error(err);
});