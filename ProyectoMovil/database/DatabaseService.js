import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

class DatabaseService {
  constructor() {
    this.db = null;
    this.isWeb = Platform.OS === 'web';
    this.dbName = 'app_database';
    this.dbVersion = 1;
  }


   //inicia la base
   
  async init() {
    if (this.isWeb) {
      return await this.initIndexedDB();
    } else {
      return await this.initSQLite();
    }
  }

  // Método openDB para acceso directo a la BD (utilizado por TransaccionModel)
  async openDB() {
    if (!this.db) {
      await this.init();
    }
    return this.db;
  }

//mobil

  async initSQLite() {
    try {
      this.db = await SQLite.openDatabaseAsync(this.dbName);
      
      // Crear tabla de usuarios
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          correo TEXT UNIQUE NOT NULL,
          telefono TEXT NOT NULL,
          contrasena TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Crear tabla de transacciones
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS transacciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          monto REAL NOT NULL,
          categoria TEXT NOT NULL,
          fecha TEXT NOT NULL,
          descripcion TEXT NOT NULL,
          es_gasto INTEGER DEFAULT 1,
          fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log('SQLite database initialized');
      return true;
    } catch (error) {
      console.error('Error initializing SQLite:', error);
      return false;
    }
  }

//para web

  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized');
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // se crea object store de usuarios si no existe
        if (!db.objectStoreNames.contains('usuarios')) {
          const objectStore = db.createObjectStore('usuarios', {
            keyPath: 'id',
            autoIncrement: true
          });
          objectStore.createIndex('correo', 'correo', { unique: true });
          objectStore.createIndex('nombre', 'nombre', { unique: false });
        }
      };
    });
  }


  async insert(table, data) {
    if (this.isWeb) {
      return await this.insertIndexedDB(table, data);
    } else {
      return await this.insertSQLite(table, data);
    }
  }

  async insertSQLite(table, data) {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const result = await this.db.runAsync(
        `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
        values
      );

      return { success: true, insertId: result.lastInsertRowId };
    } catch (error) {
      console.error('Error inserting into SQLite:', error);
      return { success: false, error: error.message };
    }
  }

  async insertIndexedDB(table, data) {
    return new Promise((resolve) => {
      const transaction = this.db.transaction([table], 'readwrite');
      const objectStore = transaction.objectStore(table);
      const request = objectStore.add({
        ...data,
        created_at: new Date().toISOString()
      });

      request.onsuccess = () => {
        resolve({ success: true, insertId: request.result });
      };

      request.onerror = () => {
        console.error('Error inserting into IndexedDB:', request.error);
        resolve({ success: false, error: request.error.message });
      };
    });
  }

 
  async select(table, where = null, params = []) {
    if (this.isWeb) {
      return await this.selectIndexedDB(table, where, params);
    } else {
      return await this.selectSQLite(table, where, params);
    }
  }

  async selectSQLite(table, where, params) {
    try {
      let query = `SELECT * FROM ${table}`;
      if (where) {
        query += ` WHERE ${where}`;
      }

      const result = await this.db.getAllAsync(query, params);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error selecting from SQLite:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async selectIndexedDB(table, where, params) {
    return new Promise((resolve) => {
      const transaction = this.db.transaction([table], 'readonly');
      const objectStore = transaction.objectStore(table);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        let results = request.result;

        // Aplicar filtros básicos si se proporcionan
        if (where && params.length > 0) {
          // Parsear condiciones simples como "correo = ?" o "correo = ? AND contrasena = ?"
          if (where.includes(' AND ')) {
            
            const conditions = where.split(' AND ');
            results = results.filter(item => {
              return conditions.every((condition, index) => {
                const field = condition.split(' = ?')[0].trim();
                const value = params[index];
                return item[field] === value;
              });
            });
          } else {
            // Condición simple
            const condition = where.split(' = ?')[0].trim();
            const value = params[0];
            results = results.filter(item => item[condition] === value);
          }
        }

        resolve({ success: true, data: results });
      };

      request.onerror = () => {
        console.error('Error selecting from IndexedDB:', request.error);
        resolve({ success: false, error: request.error.message, data: [] });
      };
    });
  }

  //actualiza (consulta)
  async update(table, data, where, params) {
    if (this.isWeb) {
      return await this.updateIndexedDB(table, data, where, params);
    } else {
      return await this.updateSQLite(table, data, where, params);
    }
  }

  async updateSQLite(table, data, where, params) {
    try {
      const setClause = Object.keys(data)
        .map(key => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(data), ...params];

      const result = await this.db.runAsync(
        `UPDATE ${table} SET ${setClause} WHERE ${where}`,
        values
      );

      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error updating SQLite:', error);
      return { success: false, error: error.message };
    }
  }

  async updateIndexedDB(table, data, where, params) {
    return new Promise((resolve) => {
      const transaction = this.db.transaction([table], 'readwrite');
      const objectStore = transaction.objectStore(table);
      
 
      const condition = where.split(' = ?')[0].trim();
      const value = params[0];
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const results = request.result;
        const record = results.find(item => item[condition] === value);
        
        if (record) {
          Object.assign(record, data);
          const updateRequest = objectStore.put(record);
          
          updateRequest.onsuccess = () => {
            resolve({ success: true, changes: 1 });
          };

          updateRequest.onerror = () => {
            resolve({ success: false, error: updateRequest.error.message });
          };
        } else {
          resolve({ success: false, error: 'Record not found' });
        }
      };

      request.onerror = () => {
        resolve({ success: false, error: request.error.message });
      };
    });
  }

  //eliminar (consulta)
  async delete(table, where, params) {
    if (this.isWeb) {
      return await this.deleteIndexedDB(table, where, params);
    } else {
      return await this.deleteSQLite(table, where, params);
    }
  }

  async deleteSQLite(table, where, params) {
    try {
      const result = await this.db.runAsync(
        `DELETE FROM ${table} WHERE ${where}`,
        params
      );

      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error deleting from SQLite:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteIndexedDB(table, where, params) {
    return new Promise((resolve) => {
      const transaction = this.db.transaction([table], 'readwrite');
      const objectStore = transaction.objectStore(table);
      
      const condition = where.split(' = ?')[0];
      const value = params[0];
      const index = objectStore.index(condition);
      const request = index.getKey(value);

      request.onsuccess = () => {
        const key = request.result;
        if (key) {
          const deleteRequest = objectStore.delete(key);
          deleteRequest.onsuccess = () => {
            resolve({ success: true, changes: 1 });
          };
          deleteRequest.onerror = () => {
            resolve({ success: false, error: deleteRequest.error.message });
          };
        } else {
          resolve({ success: false, error: 'Record not found' });
        }
      };

      request.onerror = () => {
        resolve({ success: false, error: request.error.message });
      };
    });
  }
}


const databaseService = new DatabaseService();
//inicia la base de datos al iniciar la app
export const initDatabase = async () => {
  try {
    const initialized = await databaseService.init();
    if (initialized) {
      console.log('Database initialized successfully');
      return true;
    } else {
      console.error('Failed to initialize database');
      return false;
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

export default databaseService;

