import databaseService from '../database/DatabaseService';

export const initDatabase = async () => {
  try {
    const initialized = await databaseService.init();
    if (initialized) {
      console.log('Base de datos inicializada correctamente');
      return true;
    } else {
      console.error('Error al inicializar la base de datos');
      return false;
    }
  } catch (error) {
    console.error('Error en initDatabase:', error);
    return false;
  }
};

export default databaseService;
