// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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
    // apiUrl: 'http://localhost:80/apicrmmidas/public/v1/', // Ruta de la API
    apiUrl: 'http://localhost:8000/api/v1/', // Ruta de la API
    urlFiles: 'http://localhost:8000/files/', // Ruta archivos
    apiKey: 'CRM_MIDAS_2023', // Clave permitida 
    apiUrlSocket: '',
    configFile: {
      nroCharactersNameFile: 30,
      sizeMaxImg: 10490000, // 10.49 MB
      sizeMaxFile: 10490000, // 10.49 MB
      audioExtensions: ['mp3', 'wav', 'ogg', 'aac'],
      videoExtensions: ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv']
    }
  }
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
