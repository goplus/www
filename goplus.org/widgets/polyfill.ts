/**
 * @file Polyfill for Next.js like env
 * @desc Not for browsers support
 */

window.process = window.process || { env: {} };
(window.process.env as any)['NODE_ENV'] = process.env.NODE_ENV

export {}
