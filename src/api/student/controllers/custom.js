'use strict';

module.exports = {
  async insert(ctx) {
    const { email, password, name, university, entryYear, amountToPay } = ctx.request.body;
    console.log(ctx.request.body)
    // Start transaction
    const tx = await strapi.db.connection.transaction();

    try {
      // Create user
      const user = await tx('asacita_users').insert({ email, password, name });

      if (!email || !password) throw new Error("duh")

      // Create student
      const student = await tx('students').insert({ university, name, actual_fee: amountToPay });

      if (!amountToPay || !university) throw new Error("elah")

      // Create scholarship
      const scholarship = await tx('scholarships').insert({requested_fee: amountToPay, university, semester: entryYear });

      await tx('asacita_users_student_links').insert({ asacita_user_id: user.id, student_id : student.id});
      await tx('scholarships_student_links').insert({ student_id: student.id, scholarship_id : scholarship.id, scholarship_order: 1});

      // Commit transaction
      await tx.commit();

      ctx.send({ message: 'Entities created successfully' });
    } catch (error) {
      // Rollback transaction
      await tx.rollback();
      console.error(error);
      ctx.send({ message: 'An error occurred while creating entities' });
    }
  }
};
