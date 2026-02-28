/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    // 1. Add a NEW temporary column of type JSONB
    await queryInterface.addColumn('tour_packages', 'location_new', {
      type: Sequelize.JSONB,
      allowNull: true,
      comment: 'Temporary column for location migration'
    }, { transaction });

    // 2. Migrate data from old 'location' (TEXT) to 'location_new' (JSONB)
    // We wrap existing text into a JSON object: { "address": "Old Text", "lat": null, "lng": null }
    await queryInterface.sequelize.query(`
      UPDATE tour_packages 
      SET location_new = jsonb_build_object('address', location, 'lat', NULL, 'lng', NULL)
      WHERE location IS NOT NULL AND location != ''
    `, { transaction });

    // 3. Drop the OLD 'location' column
    await queryInterface.removeColumn('tour_packages', 'location', { transaction });

    // 4. Rename 'location_new' to 'location'
    await queryInterface.renameColumn('tour_packages', 'location_new', 'location', { transaction });

    await transaction.commit();
    console.log('✅ Location column successfully migrated to JSONB');

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

/** @type {import('sequelize-cli').Migration} */
export const down = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    // 1. Add a temporary TEXT column
    await queryInterface.addColumn('tour_packages', 'location_old', {
      type: Sequelize.STRING,
      allowNull: true
    }, { transaction });

    // 2. Extract the 'address' field from JSONB back to TEXT
    await queryInterface.sequelize.query(`
      UPDATE tour_packages 
      SET location_old = location->>'address'
      WHERE jsonb_typeof(location) = 'object'
    `, { transaction });

    // 3. Drop the JSONB column
    await queryInterface.removeColumn('tour_packages', 'location', { transaction });

    // 4. Rename temp column back to 'location'
    await queryInterface.renameColumn('tour_packages', 'location_old', 'location', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};