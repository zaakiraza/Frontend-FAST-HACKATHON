const db = require('../../db');

/**
 * UID Helper Utilities
 * Handles conversion between internal IDs and external UIDs
 */

const UidHelper = {
  /**
   * Get internal ID from UID
   */
  async getIdFromUid(table, uid) {
    const query = `SELECT id FROM ${table} WHERE uid = ?`;
    const [rows] = await db.query(query, [uid]);
    return rows.length > 0 ? rows[0].id : null;
  },

  /**
   * Get UID from internal ID
   */
  async getUidFromId(table, id) {
    const query = `SELECT uid FROM ${table} WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows.length > 0 ? rows[0].uid : null;
  },

  /**
   * Get building ID from UID
   */
  async getBuildingId(uid) {
    return await this.getIdFromUid('buildings', uid);
  },

  /**
   * Get building UID from ID
   */
  async getBuildingUid(id) {
    return await this.getUidFromId('buildings', id);
  },

  /**
   * Get room ID from UID
   */
  async getRoomId(uid) {
    return await this.getIdFromUid('rooms', uid);
  },

  /**
   * Get room UID from ID
   */
  async getRoomUid(id) {
    return await this.getUidFromId('rooms', id);
  },

  /**
   * Get campus ID from UID
   */
  async getCampusId(uid) {
    return await this.getIdFromUid('campuses', uid);
  },

  /**
   * Get campus UID from ID
   */
  async getCampusUid(id) {
    return await this.getUidFromId('campuses', id);
  },

  /**
   * Validate UID format (UUID v4)
   */
  isValidUid(uid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uid);
  }
};

module.exports = UidHelper;
