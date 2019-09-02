import {
  getLogger,
  getErrorHandler
} from '../../utils';

const logger = getLogger(__filename);
const handleError = getErrorHandler(logger);

export async function example(ctx) {
  try {
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(`example ${ctx.params.id}`);
      }, 5000);
    });
    ctx.body = result;
  } catch (e) {
    handleError('example1 error', e, ctx);
  }
}

export async function exampleError(ctx) {
  try {
    const result = await Promise.all([
      new Promise((resolve) => {
        resolve(`example ${ctx.params.id}`);
      }),
      new Promise(() => {
        throw new Error('Oops');
      })
    ]);
    [ctx.body] = result;
  } catch (e) {
    handleError('Example Error', e, ctx);
  }
}
