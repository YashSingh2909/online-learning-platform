import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

const hasConfig = !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);

if (hasConfig) {
  cloudinary.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export const cloudinaryConfigured = hasConfig;

export const uploader = cloudinaryConfigured ? cloudinary.v2.uploader : null;

export const cloudinaryUploadStream = async ({ buffer, mimetype, folder, resourceType = 'auto' }) => {

  if (!cloudinaryConfigured) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const stream = uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // Let Cloudinary auto-generate public_id.
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};


export const cloudinaryDeleteByPublicId = async (publicId, resourceType = 'auto') => {
  if (!cloudinaryConfigured || !publicId) return;
  // Ignore errors on delete to avoid failing replace/remove flows.
  try {
    await uploader.destroy(publicId, { resource_type: resourceType });
  } catch (e) {
    // no-op
  }
};

