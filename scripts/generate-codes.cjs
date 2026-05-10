const fs = require('fs');
const path = require('path');

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉容易混淆的字符
  let code = 'MBTI-';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  code += '-';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function generateCodes(count) {
  const codes = new Set();
  while (codes.size < count) {
    codes.add(generateCode());
  }
  return Array.from(codes);
}

const codes = generateCodes(1000);

// 输出为 TypeScript 常量（用于前端代码）
const tsContent = `// Auto-generated verification codes
// Total: ${codes.length}
// Generated: ${new Date().toISOString()}

export const VALID_CODES = [
${codes.map(c => `  '${c}',`).join('\n')}
];
`;

// 输出为纯文本（用于阿奇索导入）
const txtContent = codes.join('\n');

// 输出为 CSV（用于阿奇索批量导入）
const csvContent = '卡密\n' + codes.join('\n');

const outputDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'codes.ts'), tsContent);
fs.writeFileSync(path.join(__dirname, '..', 'codes.txt'), txtContent);
fs.writeFileSync(path.join(__dirname, '..', 'codes.csv'), csvContent);

console.log(`✅ Generated ${codes.length} unique codes`);
console.log(`📁 src/data/codes.ts     → 前端代码用`);
console.log(`📁 codes.txt             → 阿奇索纯文本导入`);
console.log(`📁 codes.csv             → 阿奇索CSV导入`);
console.log(`\n示例码：`);
codes.slice(0, 5).forEach(c => console.log(`  ${c}`));
