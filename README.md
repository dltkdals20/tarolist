# MYSTIC TAROT

신비로운 타로 카드 웹 애플리케이션입니다. 과거, 현재, 미래를 읽는 일반 타로, 신년 운세, 그리고 심리 탐구 기능을 제공합니다.

## 기능

- **일반 타로**: 과거, 현재, 미래, 조언 (4장)
- **신년 운세**: Grand 13 Houses (13장)
- **심리 탐구**: Inner Psychology (5장)

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 확인하세요.

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 미리보기

```bash
npm run preview
```

## 기술 스택

- React 18
- Vite
- Tailwind CSS
- Lucide React (아이콘)

## 사용 방법

1. 시작 화면에서 "START READING" 버튼을 클릭합니다.
2. 원하는 타로 읽기 유형을 선택합니다:
   - **일반 타로**: 기본적인 과거/현재/미래 읽기
   - **신년 운세**: 2025년 운세 (13장)
   - **심리 탐구**: 내면의 심리 상태 탐구
3. 카드를 섞은 후, 안내에 따라 카드를 선택합니다.
4. 선택한 카드를 클릭하여 뒤집고 해석을 확인합니다.

## 프로젝트 구조

```
tarolist/
├── src/
│   ├── App.jsx          # 메인 컴포넌트
│   ├── main.jsx         # React 진입점
│   └── index.css        # 전역 스타일
├── index.html           # HTML 템플릿
├── package.json         # 의존성 관리
├── vite.config.js       # Vite 설정
├── tailwind.config.js   # Tailwind 설정
└── postcss.config.js    # PostCSS 설정
```

## 라이선스

MIT

