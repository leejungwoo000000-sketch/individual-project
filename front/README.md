# 프리랜서 포트폴리오 프로젝트

React + Vite + TypeScript + Tailwind CSS로 구축된 프리랜서 포트폴리오 웹 애플리케이션입니다.

## 기술 스택

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.17
- **Routing**: React Router DOM 7.10.1

## 주요 기능

### 관리자 페이지
- **로그인**: 관리자 전용 로그인 페이지
- **대시보드**: 통계 및 주요 정보 확인
- **재고 관리**: 상품 CRUD (생성, 조회, 수정, 삭제)
- **파일 업로드**: 파일 업로드 및 관리
- **로그 관리**: 채팅 로그 및 다운로드 로그 추적

### 유저 페이지
- **메인 페이지**: 랜딩 페이지
- **회원가입/로그인**: 사용자 인증
- **블로그**: 블로그 글 작성, 수정, 삭제, 조회 (CRUD)
- **재고**: 한국 전통주 재고 조회 (소주, 맥주, 막걸리 등)
- **구매**: 재고 구매 기능

## 프로젝트 구조

```
front/
├── src/
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── admin/       # 관리자 전용 컴포넌트
│   │   └── user/        # 유저 전용 컴포넌트
│   ├── layouts/         # 레이아웃 컴포넌트
│   │   ├── AdminLayout.tsx
│   │   └── UserLayout.tsx
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── admin/       # 관리자 페이지
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminInventory.tsx
│   │   │   ├── AdminFileUpload.tsx
│   │   │   └── AdminLogs.tsx
│   │   └── user/        # 유저 페이지
│   │       ├── UserHome.tsx
│   │       ├── UserAuth.tsx
│   │       ├── UserBlog.tsx
│   │       ├── UserBlogPost.tsx
│   │       ├── UserInventory.tsx
│   │       └── UserCheckout.tsx
│   ├── services/        # API 서비스
│   │   ├── api.ts       # API 클라이언트
│   │   └── auth.ts      # 인증 서비스
│   ├── types/           # TypeScript 타입 정의
│   │   └── index.ts
│   ├── utils/           # 유틸리티 함수
│   ├── App.tsx          # 메인 앱 컴포넌트 (라우팅)
│   ├── main.tsx         # 앱 진입점
│   └── index.css        # 전역 스타일 (Tailwind)
├── public/              # 정적 파일
├── index.html           # HTML 템플릿
├── package.json         # 의존성 관리
├── tsconfig.json        # TypeScript 설정
├── vite.config.js       # Vite 설정
└── tailwind.config.js   # Tailwind CSS 설정
```

## 라우팅 구조

### 유저 페이지
- `/` - 메인 홈페이지
- `/auth` - 회원가입/로그인
- `/blog` - 블로그 목록
- `/blog/:id` - 블로그 상세/작성/수정
- `/inventory` - 재고 목록
- `/checkout` - 구매 페이지 (로그인 필요)

### 관리자 페이지
- `/admin/login` - 관리자 로그인
- `/admin/dashboard` - 대시보드 (관리자 권한 필요)
- `/admin/inventory` - 재고 관리 (관리자 권한 필요)
- `/admin/files` - 파일 업로드 (관리자 권한 필요)
- `/admin/logs` - 로그 관리 (관리자 권한 필요)

## 환경 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_API_URL=http://localhost:8080/api
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 프리뷰
npm run preview
```

## Backend 연동

이 프로젝트는 백엔드 API와의 연동을 위해 설계되었습니다.

### API 엔드포인트 예시

**인증**
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입

**블로그**
- `GET /api/blog/posts` - 블로그 글 목록
- `GET /api/blog/posts/:id` - 블로그 글 상세
- `POST /api/blog/posts` - 블로그 글 작성
- `PUT /api/blog/posts/:id` - 블로그 글 수정
- `DELETE /api/blog/posts/:id` - 블로그 글 삭제

**상품**
- `GET /api/products` - 상품 목록
- `GET /api/admin/products` - 관리자 상품 목록
- `POST /api/admin/products` - 상품 생성
- `PUT /api/admin/products/:id` - 상품 수정
- `DELETE /api/admin/products/:id` - 상품 삭제

**주문**
- `POST /api/orders` - 주문 생성

**파일**
- `GET /api/admin/files` - 파일 목록
- `POST /api/admin/files/upload` - 파일 업로드
- `DELETE /api/admin/files/:id` - 파일 삭제

**로그**
- `GET /api/admin/logs/chat` - 채팅 로그
- `GET /api/admin/logs/download` - 다운로드 로그

**대시보드**
- `GET /api/admin/dashboard/stats` - 대시보드 통계

## 인증

- JWT 토큰 기반 인증
- 토큰은 `localStorage`에 저장
- 관리자 페이지는 `role: 'admin'` 필요
- Protected Route로 인증되지 않은 접근 차단
