window.process = window.process || { env: {} };
(window.process.env as any)['NODE_ENV'] = process.env.NODE_ENV

export {}
