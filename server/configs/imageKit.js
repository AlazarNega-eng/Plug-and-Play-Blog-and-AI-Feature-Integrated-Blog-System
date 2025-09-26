import ImageKit from "imagekit";

let imagekit = null;

// Initialize ImageKit only if all credentials are available
if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
  try {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
    console.log('ImageKit initialized successfully');
  } catch (error) {
    console.log('ImageKit initialization failed:', error.message);
  }
} else {
  console.log('ImageKit credentials not configured - using fallback images');
}

export default imagekit;
