import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const distPath = join(__dirname, 'dist');

console.log(`Starting server on port ${port}...`);
console.log(`Serving from: ${distPath}`);

// 정적 파일 제공
app.use(express.static(distPath));

// SPA를 위한 폴백: 모든 요청을 index.html로 라우팅
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
