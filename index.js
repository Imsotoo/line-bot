const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  res.sendStatus(200); // ตอบกลับ LINE ทันที

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;

      const flexMessage = {
        replyToken,
        messages: [{
          type: 'flex',
          altText: 'ขั้นตอนการกู้ยืม',
          contents: {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://www.studentloan.or.th/sites/default/files/user/images/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A%E0%B8%84%E0%B8%B3%E0%B8%82%E0%B8%AD%E0%B8%81%E0%B8%B9%E0%B9%89-QQ-01.jpg',
              size: 'full',
              aspectRatio: '20:13',
              aspectMode: 'cover'
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [{
                type: 'text',
                text: 'ขั้นตอนการกู้ยืม',
                weight: 'bold',
                size: 'md',
                align: 'center'
              }]
            }
          }
        }]
      };

      await axios.post('https://api.line.me/v2/bot/message/reply', flexMessage, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
      }).catch(error => {
        console.error('LINE API Error:', error.response?.data || error.message);
      });
    }
  }
});

app.get('/', (req, res) => {
  res.send('LINE Flex Message Bot is running!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});