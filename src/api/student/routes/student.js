'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = app => {
  const coreRouter = createCoreRouter('api::student.student', app);

  coreRouter.post('/create-entities', 'custom.insert');

  app.use(coreRouter.routes());
};
