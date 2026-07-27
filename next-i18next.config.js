const path = require('path');

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  // Absolute path so Next's output file tracing bundles the locale JSONs
  // into Vercel's serverless functions. With the relative default,
  // serverSideTranslations finds no files at runtime on Vercel and pages
  // render raw keys (works locally, breaks only when deployed).
  localePath: path.resolve('./public/locales'),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
