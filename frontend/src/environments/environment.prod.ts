export const environment = {
  production: true,
  // Replace with your Render backend URL after deployment
  apiUrl: 'https://your-backend-name.onrender.com/api',
  wsUrl: 'https://your-backend-name.onrender.com',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain']
};
