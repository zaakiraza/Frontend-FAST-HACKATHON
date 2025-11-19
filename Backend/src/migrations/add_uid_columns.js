const db = require('../../db');
const { v4: uuidv4 } = require('uuid');

/**
 * Migration: Add UID columns to campuses, buildings, and rooms
 * This keeps internal IDs hidden and uses UUIDs for external access
 */

async function addUidColumns() {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    console.log('🔄 Starting UID migration...\n');
    
    // 1. Add UID column to campuses table
    console.log('📋 Adding UID to campuses table...');
    await connection.query(`
      ALTER TABLE campuses 
      ADD COLUMN uid VARCHAR(36) UNIQUE AFTER id
    `);
    
    // Generate UIDs for existing campuses
    const [campuses] = await connection.query('SELECT id FROM campuses');
    for (const campus of campuses) {
      const uid = uuidv4();
      await connection.query('UPDATE campuses SET uid = ? WHERE id = ?', [uid, campus.id]);
    }
    console.log(`✅ Generated UIDs for ${campuses.length} campuses\n`);
    
    // 2. Add UID column to buildings table
    console.log('🏢 Adding UID to buildings table...');
    await connection.query(`
      ALTER TABLE buildings 
      ADD COLUMN uid VARCHAR(36) UNIQUE AFTER id
    `);
    
    // Generate UIDs for existing buildings
    const [buildings] = await connection.query('SELECT id FROM buildings');
    for (const building of buildings) {
      const uid = uuidv4();
      await connection.query('UPDATE buildings SET uid = ? WHERE id = ?', [uid, building.id]);
    }
    console.log(`✅ Generated UIDs for ${buildings.length} buildings\n`);
    
    // 3. Add UID column to rooms table
    console.log('🚪 Adding UID to rooms table...');
    await connection.query(`
      ALTER TABLE rooms 
      ADD COLUMN uid VARCHAR(36) UNIQUE AFTER id
    `);
    
    // Generate UIDs for existing rooms
    const [rooms] = await connection.query('SELECT id FROM rooms');
    for (const room of rooms) {
      const uid = uuidv4();
      await connection.query('UPDATE rooms SET uid = ? WHERE id = ?', [uid, room.id]);
    }
    console.log(`✅ Generated UIDs for ${rooms.length} rooms\n`);
    
    // 4. Add indexes for better performance
    console.log('🔍 Adding indexes...');
    await connection.query('CREATE INDEX idx_campuses_uid ON campuses(uid)');
    await connection.query('CREATE INDEX idx_buildings_uid ON buildings(uid)');
    await connection.query('CREATE INDEX idx_rooms_uid ON rooms(uid)');
    console.log('✅ Indexes created\n');
    
    await connection.commit();
    console.log('✅ UID migration completed successfully!\n');
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function rollbackUidColumns() {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    console.log('🔄 Rolling back UID migration...\n');
    
    await connection.query('DROP INDEX idx_campuses_uid ON campuses');
    await connection.query('DROP INDEX idx_buildings_uid ON buildings');
    await connection.query('DROP INDEX idx_rooms_uid ON rooms');
    
    await connection.query('ALTER TABLE campuses DROP COLUMN uid');
    await connection.query('ALTER TABLE buildings DROP COLUMN uid');
    await connection.query('ALTER TABLE rooms DROP COLUMN uid');
    
    await connection.commit();
    console.log('✅ Rollback completed successfully!\n');
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Rollback failed:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Run migration if called directly
if (require.main === module) {
  const action = process.argv[2];
  
  if (action === 'rollback') {
    rollbackUidColumns()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    addUidColumns()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = { addUidColumns, rollbackUidColumns };
