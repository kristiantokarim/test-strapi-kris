'use strict';

const conditions = [
  {
    displayName: 'lecturer-can-only-view-assigned-student',
    name: 'lecturer-can-only-view-assigned-student',
    async handler(user) {
      const lecturers = await strapi.query('api::lecturer.lecturer').findMany({ where: { admin_user: user.id } });
      const students = await strapi.query('api::student.student').findMany({ 
        where: { "lecturer":  {
          admin_user: user.id
        } },
      });
      // return {$or: [ { "lecturer.admin_user": user.id } ]}
      // return { id: { $in: students.map(l => l.id)}}
      return { "lecturer": { admin_user: { id: { $eq: user.id} } } }
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
