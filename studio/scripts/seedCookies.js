
// Seed script to create all Cookie documents from the local list.
// It will also upload local images from the repo `public/` folder if they exist.
// Usage:
//   export SANITY_PROJECT_ID=... 
//   export SANITY_DATASET=... 
//   export SANITY_TOKEN=...   (must be a write token)
//   node studio/scripts/seedCookies.js

const sanityClientLib = require('@sanity/client')
const fs = require('fs')
const path = require('path')

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Please set SANITY_PROJECT_ID, SANITY_DATASET and SANITY_TOKEN environment variables')
  process.exit(1)
}

const client = (sanityClientLib.createClient || sanityClientLib).call
  ? sanityClientLib.createClient({ projectId, dataset, token, useCdn: false })
  : sanityClientLib({ projectId, dataset, token, useCdn: false })

// Full cookie list (keeps in sync with src/app/data/cookiesData.ts)
const cookies = [
  { id: 1, name: 'Le Fleur Noir', description: 'Dark chocolate cookie with fleur de sel', image: '/cookie1.png', price: 3.5 },
  { id: 2, name: 'Le Savane', description: 'Marbled cookie with vanilla and cocoa base, milk chocolate', image: '/cookie2.png', price: 3.5 },
  { id: 3, name: 'Le Trois Choc', description: 'Triple chocolate cookie: dark, milk, and white chocolate', image: '/cookie3.png', price: 3.5 },
  { id: 4, name: 'Le Choco noisette', description: 'Milk chocolate and hazelnut cookie with praline', image: '/cookie4.png', price: 3.5 },
  { id: 5, name: 'Le Snowreo', description: 'Oreo cookie with white chocolate', image: '/cookie5.png', price: 3.5 },
  { id: 6, name: "Le Spécul'love", description: 'Speculoos cookie with speculoos spread', image: '/cookie6.png', price: 3.5 },
  { id: 7, name: 'Le Cookella', description: 'Nutella-filled cookie with praline pieces', image: '/cookie7.png', price: 3.5 },
  { id: 8, name: 'Le Oh Bueno', description: 'Cookie with Kinder Bueno pieces and Bueno spread', image: '/cookie8.png', price: 3.5 },
  { id: 9, name: 'Le Cacahuète Caramel', description: 'Peanut cookie with peanut butter and salted caramel', image: '/cookie9.png', price: 3.5 },
  { id: 10, name: 'Le Blanc Macadamia', description: 'White chocolate cookie with macadamia nuts', image: '/cookie10.png', price: 3.5 },
  { id: 11, name: 'Le Pistachie', description: 'Cocoa base cookie with whole pistachios and pistachio spread', image: '/cookie11.png', price: 3.5 },
  { id: 12, name: 'Le Framboisie', description: 'White chocolate cookie with raspberries', image: '/cookie12.png', price: 3.5 },
]

function contentTypeFromFilename(filename) {
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  return 'application/octet-stream'
}

async function ensureCookie(c) {
  const docId = `cookie-${c.id}`
  const doc = {
    _id: docId,
    _type: 'cookie',
    name: c.name,
    description: c.description,
    price: c.price,
  }

  try {
    await client.createIfNotExists(doc)
    console.log('Ensured', docId)

    // If there's an image path and the file exists locally under ../public, upload it and attach
    if (c.image && typeof c.image === 'string' && c.image.startsWith('/')) {
      const publicPath = path.join(__dirname, '..', '..', 'public', c.image.replace(/^\//, ''))
      if (fs.existsSync(publicPath)) {
        // check if doc already has image
        const existing = await client.fetch(`*[_id == $id]{image}[0]`, { id: docId })
        if (!existing || !existing.image) {
          const stream = fs.createReadStream(publicPath)
          const filename = path.basename(publicPath)
          const asset = await client.assets.upload('image', stream, { filename, contentType: contentTypeFromFilename(filename) })
          // attach image reference to the document
          await client.patch(docId).set({ image: { _type: 'image', asset: { _ref: asset._id } } }).commit({ autoGenerateArrayKeys: true })
          console.log('Uploaded image for', docId, '->', filename)
        }
      }
    }
  } catch (err) {
    console.error('Error ensuring', docId, err)
  }
}

async function seed() {
  for (const c of cookies) {
    // create or update
    // createIfNotExists ensures idempotency
    await ensureCookie(c)
  }
  console.log('Seeding finished')
}

seed().catch(err => { console.error(err); process.exit(1) })
