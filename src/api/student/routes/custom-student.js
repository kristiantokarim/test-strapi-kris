module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/bananas/inser',
      config: {
        auth: false,
      },
      handler: 'custom.insert',
    },
  ],
};
