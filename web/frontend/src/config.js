const config = {
  appName: 'Petective',
  apiUrl: 'http://0.0.0.0:7001',
  imageUrl: 'http://0.0.0.0',
  debug: true,
  production: false
};
if (config.production) {
  config.appName = 'Petective';
  config.apiUrl = '';
  config.imageUrl = '';
  config.debug = false
}
export { config }
