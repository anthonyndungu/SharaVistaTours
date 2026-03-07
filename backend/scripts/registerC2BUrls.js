// scripts/registerC2BUrls.js
import mpesaService from '../services/MpesaService.js';
import logger from '../utils/logger.js';

const registerC2B = async () => {
  try {
    logger.info('🚀 Registering C2B URLs with M-Pesa...');
    
    const result = await mpesaService.registerC2BUrls();
    
    if (result.success) {
      logger.info('✅ C2B URLs registered successfully!', result.data);
      console.log('\n📋 Registration Details:');
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      logger.error('❌ Failed to register C2B URLs', result.error);
      process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    logger.error('❌ Registration script error', error);
    process.exit(1);
  }
};

registerC2B();