// migrations/XXXXXXXXXX-add-booking-id-to-payments.js
'use strict';

import { QueryInterface, DataTypes } from 'sequelize';

export async function up({ queryInterface, Sequelize }) {
  // Add booking_id column
  await queryInterface.addColumn('payments', 'booking_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Bookings',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  });

  // Add indexes
  await queryInterface.addIndex('payments', ['booking_id']);
  await queryInterface.addIndex('payments', ['status']);
  await queryInterface.addIndex('payments', ['payment_method']);
}

export async function down({ queryInterface }) {
  await queryInterface.removeIndex('payments', ['booking_id']);
  await queryInterface.removeIndex('payments', ['status']);
  await queryInterface.removeIndex('payments', ['payment_method']);
  await queryInterface.removeColumn('payments', 'booking_id');
}