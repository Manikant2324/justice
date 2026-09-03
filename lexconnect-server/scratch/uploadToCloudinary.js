const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const filesToUpload = [
  {
    name: 'lady_justice',
    path: path.join(__dirname, '../../lexconnect-portal/public/lady_justice.jpg')
  },
  {
    name: 'full_hero_cover',
    path: 'C:\\Users\\MANIKANT\\.gemini\\antigravity-ide\\brain\\b6e9e095-08ef-4e4c-bd99-7c46388cae1a\\full_hero_cover_1788298727279.jpg'
  },
  {
    name: 'lady_justice_hero',
    path: 'C:\\Users\\MANIKANT\\.gemini\\antigravity-ide\\brain\\b6e9e095-08ef-4e4c-bd99-7c46388cae1a\\lady_justice_hero_1788298468707.jpg'
  }
];

async function runUpload() {
  console.log(`[Cloudinary Upload] Connecting to cloud: ${process.env.CLOUDINARY_CLOUD_NAME}...`);
  const results = {};

  for (const item of filesToUpload) {
    if (fs.existsSync(item.path)) {
      try {
        console.log(`Uploading ${item.name} from ${item.path}...`);
        const res = await cloudinary.uploader.upload(item.path, {
          folder: 'justicehub_legal_vault',
          public_id: item.name,
          overwrite: true
        });
        console.log(`✅ Uploaded ${item.name}: ${res.secure_url}`);
        results[item.name] = res.secure_url;
      } catch (err) {
        console.error(`❌ Upload failed for ${item.name}:`, err.message || err);
      }
    } else {
      console.warn(`⚠️ File not found: ${item.path}`);
    }
  }

  console.log('\n--- UPLOAD RESULT SUMMARY ---');
  console.log(JSON.stringify(results, null, 2));
}

runUpload();
