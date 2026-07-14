import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✨ [Env Config] Created local .env file from .env.example template.');
  } catch (error) {
    console.error('⚠️ [Env Config] Failed to copy .env.example to .env:', error);
  }
}
