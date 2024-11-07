/** 根据 .env 文件中的 MODE 环境变量，更新 .env 文件 */
/** 更新对应client文件夹中的 .env 文件 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
// 读取根目录 .env 文件
// const envPath = path.resolve(__dirname, '.env');
// const rootEnv = dotenv.parse(fs.readFileSync(envPath));

// 获取命令行参数
let mode = process.env.npm_config_mode || null
// 无mode参数 默认取用build文件配置
if (!mode) {
  mode = "build"
}

// 读取对应 client 文件夹中的 .env 文件
const clientEnvPath = path.resolve(__dirname, 'client', `${mode}`);
if (!fs.existsSync(clientEnvPath)) {
  console.log(`❌ 找不到 ${clientEnvPath} 文件，请检查！`);
  process.exit(1);
}

const clientEnv = dotenv.parse(fs.readFileSync(clientEnvPath));

// 合并根目录 .env 文件和 client .env 文件
const updatedEnv = { ...clientEnv };
// 生成新的 .env 文件内容
const updatedEnvContent = Object.entries(updatedEnv).map(([key, value]) => `${key}=${value}`).join('\n');
// 写回根目录 .env 文件
const productionPath = path.resolve(__dirname, '.env.production');
fs.writeFileSync(productionPath, updatedEnvContent);
console.log(`🚀 ~【${updatedEnv.VITE_MAP_CITY || mode}】客户端配置已替换！`)


