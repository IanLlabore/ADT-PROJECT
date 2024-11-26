const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/movieproject-api/**',
    createProxyMiddleware({
      target: 'http://localhost:5000', // Point to backend server
      changeOrigin: true,
      secure: false,
    })
  );
};