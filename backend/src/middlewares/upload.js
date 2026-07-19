const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

/**
 * Cloudinary storage engine for Multer.
 * Each field gets its own folder in Cloudinary for easy organisation.
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'allride/misc';
    let resourceType = 'image';

    switch (file.fieldname) {
      case 'customerPhoto':
        folder = 'allride/customer_photos';
        break;
      case 'drivingLicensePhoto':
        folder = 'allride/driving_licenses';
        break;
      case 'idProofPhoto':
        folder = 'allride/id_proofs';
        break;
      case 'signatureImage':
        folder = 'allride/signatures';
        break;
      default:
        folder = 'allride/misc';
    }

    return {
      folder,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    };
  },
});

/**
 * File filter — accept only image MIME types.
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /^image\/(jpeg|jpg|png|webp)$/i;
  if (allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Only JPG, PNG, WEBP allowed.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

/**
 * Multi-field upload middleware.
 * Fields:
 *   - customerPhoto       (1 file)
 *   - drivingLicensePhoto (1 file)
 *   - idProofPhoto        (1 file)
 *   - signatureImage      (1 file)
 */
const uploadAgreementFiles = upload.fields([
  { name: 'customerPhoto',        maxCount: 1 },
  { name: 'drivingLicensePhoto',  maxCount: 1 },
  { name: 'idProofPhoto',         maxCount: 1 },
  { name: 'signatureImage',       maxCount: 1 },
]);

module.exports = uploadAgreementFiles;
