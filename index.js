const { Client } = require("@notionhq/client")
const axios = require('axios');
const dotenv = require("dotenv")

dotenv.config()

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const notepm = axios.create({
  baseURL: process.env.NOTEPM_ENDPOINT,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NOTEPM_TOKEN}`
  }
})
const notepmParams = JSON.stringify({
  "q": "A-",
  "only_title": true,
  "include_archived": false,
  "page": 1,
  "per_page": 3
});

const notionParams = (obj) => {
  let contents
  // 2000文字以上を一つのブロックに格納できないので分割する
  if(obj.body.length > 1999) {
    contents = []

    splitByChunk(obj.body, 1500).map((body) => {
      contents.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: body,
              },
            },
          ],
        },
      })
    })
  } else {
    contents = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: obj.body,
              },
            },
          ],
        },
      },
    ]
  }
  return {
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    // プロパティの設定
    properties: {
      '案件名': {
        title: [
          {
            text: {
              content: obj.title,
            },
          },
        ],
      },
      'ステータス': {
        'select': {
          name: obj.status
        }
      },
      'タグ': {
        'multi_select': obj.tags
      },
      '業種': {
        'multi_select': obj.industry
      },
      'アーカイブ': {
        'checkbox': true
      }
    },
    children: contents
  }
}


;(async () => {
  // NotePM
  const pages = await notepm.get('/pages', {
    data: notepmParams
  } ).then( response => response.data.pages)
  // const page = pages[0]

  // Notion
  await pages.map((page) => {
    const params = {
      title: page.title,
      status: '辞退',
      tags: page.tags,
      industry: [],
      body: page.body
    }
    console.log(params.title);
   return notion.pages.create(notionParams(params))
  })


  // console.log(params);
  // console.log(createdPage) 
})()



function splitByChunk(str, size) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)
  for (let i=0, x=0; i < numChunks; ++i, x += size) {
    chunks[i] = str.substr(x, size)
  }
  return chunks
}