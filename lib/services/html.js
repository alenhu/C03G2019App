import moment from 'moment';
import send from 'koa-send';
import {
  some,
  endsWith
} from 'lodash';

import config from '../config';


export default async function(ctx) {
  const maxAge = 60 * 60 * 2;
  const cacheControl = `max-age=${maxAge}, must-revalidate`;
  let lastModified;
  if (some(
    '.js .svg .png .jpg .gif .woff .woff2 .eot .ttf'.split(' '),
    extension => endsWith(ctx.path, extension)
  )) {
    ctx.status = 404;
    return;
  }

  if (ctx.header['if-modified-since']
    && lastModified
    && +moment(ctx.header['if-modified-since']) >= lastModified) {
    ctx.status = 304;
    ctx.set({
      'Cache-Control': cacheControl
    });
    return;
  }
  await send(ctx, '/index.html', {
    root: config.dir.frontend,
    maxage: maxAge,
    setHeaders(res, filePath, stats) {
      lastModified = (new Date(stats.mtime.toUTCString())).getTime();
      res.setHeader('Cache-Control', cacheControl);
    }
  });
}
