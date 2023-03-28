const axios = require('axios')
const API_KEY_OPENAI = "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"

const chatGPTHandler = async (question, msg) => {
    return await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        data: {
            model: "text-davinci-003",
            prompt: question,
            max_tokens: 1000,
            temperature: 0
        },
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": "in-ID",
            "Authorization": `Bearer ${API_KEY_OPENAI}`,
        }
    }).then(response => {
        if (response.status == 200) {
            const {choices} = response.data
            return msg.reply(choices[0].text)
        }else {
            return msg.reply('Failed Response')
        }
    }).catch(error => {
        return msg.reply(error.message)
    })
}

module.exports = {
    chatGPTHandler
}