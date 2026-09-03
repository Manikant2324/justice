const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'zh5vbr6r',
  api_key: process.env.CLOUDINARY_API_KEY || '983286537284141',
  api_secret: process.env.CLOUDINARY_API_SECRET || '7Ub2dBFYLelLRtngTDTqcpnFcDY'
});

// Create local uploads directory as fallback
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Check if Cloudinary is configured
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let storage;

if (isCloudinaryConfigured) {
  // Production Dynamic Cloudinary Storage Engine per Client Folder
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      let clientFolder = 'General_Client_Vault';
      if (req.user && req.user.name) {
        clientFolder = req.user.name.trim().replace(/[^a-zA-Z0-9]/g, '_');
      } else if (req.body && req.body.name) {
        clientFolder = req.body.name.trim().replace(/[^a-zA-Z0-9]/g, '_');
      }

      return {
        folder: `justicehub_clients/${clientFolder}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'txt', 'json'],
        resource_type: 'auto',
        public_id: `${file.fieldname}_${Date.now()}`
      };
    }
  });
  console.log('[JusticeHub Storage] Systematic Per-Client Cloudinary Storage Engine Initialized.');
} else {
  // Local Multer Disk Storage Fallback
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  console.log('[JusticeHub Storage] Local Disk Storage Engine initialized.');
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB file size limit
});

// Helper function to sync client details JSON into their dedicated Cloudinary folder
upload.syncClientDetailsToCloudinary = async (user, cases = []) => {
  if (!isCloudinaryConfigured || !user) return;

  try {
    const clientFolderName = user.name.trim().replace(/[^a-zA-Z0-9]/g, '_');
    const folderPath = `justicehub_clients/${clientFolderName}`;

    const clientMetaData = {
      client_id: user._id,
      full_name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || 'Not Provided',
      specialization: user.specialization || 'N/A',
      profile_photo_url: user.avatar || '',
      account_created: user.createdAt || new Date().toISOString(),
      last_updated: new Date().toISOString(),
      total_cases_filed: cases.length,
      cases_summary: cases.map(c => ({
        case_id: c._id,
        title: c.title,
        category: c.category,
        status: c.status,
        priority: c.priority,
        filed_date: c.createdAt
      }))
    };

    // Upload structured client_details.json to Cloudinary folder
    const base64Data = Buffer.from(JSON.stringify(clientMetaData, null, 2)).toString('base64');
    const dataURI = `data:application/json;base64,${base64Data}`;

    const res = await cloudinary.uploader.upload(dataURI, {
      folder: folderPath,
      public_id: 'client_details',
      resource_type: 'raw',
      overwrite: true
    });

    console.log(`[Cloudinary Client Sync] Synced client details for ${user.name} to ${res.secure_url}`);
    return res.secure_url;
  } catch (err) {
    console.error(`[Cloudinary Client Sync Error] Failed to sync ${user.name}:`, err.message);
  }
};

upload.cloudinary = cloudinary;

module.exports = upload;
