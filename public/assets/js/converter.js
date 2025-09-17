// # 使用 Node.js 实现 PNG/JPG 到 WebP 的批量转换工具

// 在现代 Web 开发中，图片优化是提升用户体验的重要手段。WebP 格式凭借更高的压缩率和优秀的画质成为图片优化的热门选择。本文将指导你如何用 Node.js 开发一个工具，将指定目录及其子目录下的 PNG 和 JPG 图片批量转换为 WebP 格式。

// ---

// ## 目标功能

// 我们希望工具能够实现以下目标：
// 1. 扫描指定目录，包括所有子目录。
// 2. 检测 `.png` 和 `.jpg` 文件并将其转换为 `.webp` 格式。
// 3. 如果目标文件已经存在，跳过转换。
// 4. 提供清晰的日志输出，便于监控任务执行状态。
// 5. 添加错误处理机制，确保工具运行稳定。

// ---

// ## 技术实现

// 工具的开发将使用以下技术和工具：
// - **Node.js**：提供文件操作和异步处理能力。
// - **`webp-converter`**：一个封装 WebP 转换工具的库。
// - **文件系统模块（`fs` 和 `path`）**：读取文件、目录及路径处理。
// - **异步编程（`async/await`）**：提高效率，避免阻塞。

// ---

// ## 完整代码

// 以下是实现工具的完整代码：


const fs = require('fs').promises;
const path = require('path');
const webp = require('webp-converter');

// 授予 webp-converter 权限
webp.grant_permission();

async function generateWebp(dir, file) {
  const filePrefix = file.substring(0, file.lastIndexOf('.'));
  const sourceFile = path.join(dir, file);
  const webpFile = path.join(dir, `${filePrefix}.webp`);

  try {
    // 检查目标 WebP 文件是否已存在
    const webpExists = await fs.stat(webpFile).then(() => true).catch(() => false);
    if (webpExists) {
      console.log(`WebP file already exists: ${webpFile}`);
      return;
    }

    // 调用 webp 转换工具
    const result = await webp.cwebp(sourceFile, webpFile, '-q 80'); // 设置质量为 80
    console.log(`Converted: ${sourceFile} -> ${webpFile}`);
    console.log(result);
  } catch (error) {
    console.error(`Error converting file ${sourceFile}:`, error.message);
  }
}

async function scanDirectory(directoryPath) {
  try {
    // 读取目录内容
    const files = await fs.readdir(directoryPath, { withFileTypes: true });

    // 遍历文件和子目录
    for (const file of files) {
      const filePath = path.join(directoryPath, file.name);

      if (file.isFile()) {
        // 检查文件类型是否为 PNG 或 JPG
        if (file.name.endsWith('.png') || file.name.endsWith('.jpg')) {
          await generateWebp(directoryPath, file.name);
        }
      } else if (file.isDirectory()) {
        // 递归处理子目录
        await scanDirectory(filePath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${directoryPath}:`, error.message);
  }
}

// 主函数
(async function main() {
  const directoryPath = path.resolve(__dirname, './assets');
  console.log(`Starting scan in directory: ${directoryPath}`);
  await scanDirectory(directoryPath);
  console.log('Scan completed.');
})();
