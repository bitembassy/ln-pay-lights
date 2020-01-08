#!/usr/bin/env node
const fs = require('fs');
const Plugin = require('clightningjs');
const request = require('superagent')

const listenPlugin = new Plugin();

const apiKey = process.env.LIFX_KEY
const apiUrl = `https://api.lifx.com/v1/lights`

const lifx = (selector, method, action, params) => request[method](`${apiUrl}/${selector}/${action}`).set('Authorization', `Bearer ${apiKey}`).send(params).then(console.log).catch(console.error)

listenPlugin.subscribe('forward_event');
listenPlugin.notifications.forward_event.on('forward_event', (params) => {
  fs.writeFile('log', params.forward_event, () => {});

  if ( params.forward_event.status == "settled" ) {
    lifx('all', 'post', 'effects/breathe', { color: `blue brightness:0.8`, cycles: 1, period: 10, peak: 0.1 })
  }
});

listenPlugin.start();
