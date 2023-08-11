'use strict';

const conditions = [
  {
    displayName: 'lecturer-can-only-view-assigned-student',
    name: 'lecturer-can-only-view-assigned-student',
    async handler(user) {
      const students = await strapi.query('api::student.student').findMany({ 
        where: { "lecturer":  {
          admin_user: user.id
        } },
      });

      // had to use this id check 1 by 1 due to this issue:
      // https://github.com/strapi/strapi/issues/17622
      // it's inefficient but it works 
      // return { "lecturer": { admin_user: { id: { $eq: user.id} } } }
      return { id: { $in: students.map(l => l.id)}}
      
      
    },
  },
  {
    displayName: 'lecturer-can-only-view-themself',
    name: 'lecturer-can-only-view-themself',
    async handler(user) {
      return { "admin_user.id": { $eq: user.id } };
    },
  }
];

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {
    strapi.admin.services.permission.conditionProvider.registerMany(conditions);
  },
};
