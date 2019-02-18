const charge = require('lightning-charge-client')(process.env.CHARGE_URL, process.env.CHARGE_TOKEN)
    , request = require('superagent')

const apiKey = process.env.LIFX_KEY
const apiUrl = `https://api.lifx.com/v1/lights`

const lifx = (selector, method, action, params) =>
    request[method](`${apiUrl}/${selector}/${action}`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send(params)
      .then(console.log)
      .catch(console.error)

charge.stream().on('payment', async inv => {
  console.log('inv', inv)
  if (inv.metadata && inv.metadata.lightColor) {
    lifx('all', 'post', 'effects/breathe', { color: `${inv.metadata.lightColor} brightness:0.8`, cycles: 1, period: 10, peak: 0.05 })
  } else {
    lifx('id:d073d5247913', 'post', 'effects/pulse', { color: 'blue brightness:1', cycles: 3, period: 0.1 })
    setTimeout(_ => lifx('id:d073d524e344', 'post', 'effects/pulse', { color: 'blue brightness:1', cycles: 3, period: 0.1 }), 500)
  }
})
