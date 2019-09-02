import * as exampleCtrl from './example';

export default {
  '/example/:id': {
    get: exampleCtrl.example
  },
  '/example/:id/error': {
    get: exampleCtrl.exampleError
  }
};
