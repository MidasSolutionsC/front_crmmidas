export const environment = {
  production: true,
  defaultauth: 'fackbackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  appConfig: {
    apiUrl: 'http://localhost:80/apicrm/public/v1/', // Ruta de la API
    urlFiles: 'http://localhost:8000/files/', // Ruta archivos
    apiKey: 'CRM_MIDAS_2023', // Clave de acceso 
    apiKeySocket: 'CRM_MIDAS_WS', // Clave permitida 
    apiUrlSocket: 'http://localhost:5000',
    configFile: {
      nroCharactersNameFile: 30,
      sizeMaxImg: 10490000, // 10.49 MB
      sizeMaxFile: 10490000, // 10.49 MB
      audioExtensions: ['mp3', 'wav', 'ogg', 'aac'],
      videoExtensions: ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv']
    }
  }
};
