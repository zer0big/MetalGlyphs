# ZEORBIG Metal Analysis Engine

AI 기반 메탈 음악 분석 도구 - 가사 검색, 번역, 아티스트 정보 및 심층 분석 제공

## 🎸 주요 기능

- **자동 가사 검색**: AI를 통한 원본 가사 자동 검색
- **한국어 번역**: 감성적이고 자연스러운 한국어 번역 제공
- **아티스트 정보**: 디스코그래피 및 경력 정보
- **곡 해석**: 곡의 의미, 테마, 맥락 분석
- **외부 링크**: Metal Archives, Wikipedia, YouTube 등 연결
- **AI 생성 이미지**: 곡의 분위기를 담은 헤더 이미지 자동 생성

## 🚀 Azure Static Web Apps 배포

### 사전 준비
- Azure 계정
- GitHub 계정
- Gemini API 키

### 배포 단계

#### 1. GitHub 리포지토리 생성
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

#### 2. Azure Static Web App 생성
1. [Azure Portal](https://portal.azure.com) 접속
2. **리소스 만들기** → **Static Web App** 검색
3. 기본 정보 입력:
   - **구독**: 사용 중인 구독 선택
   - **리소스 그룹**: 신규 생성 (예: `rg-zeorbig-metal`)
   - **이름**: `zeorbig-metal-engine`
   - **요금제**: `Free`
   - **지역**: `East Asia`

4. 배포 세부 정보:
   - **원본**: `GitHub` 선택
   - GitHub 계정 연동 및 인증
   - **리포지토리**: 생성한 리포지토리 선택
   - **분기**: `main`

5. 빌드 세부 정보:
   - **빌드 사전 설정**: `Custom`
   - **앱 위치**: `/`
   - **API 위치**: (비워둠)
   - **출력 위치**: `/`

6. **검토 + 만들기** → **만들기**

#### 3. 환경 변수 설정 (Gemini API 키)

**Azure Portal에서 설정:**
1. Azure Portal → Static Web App → **구성**
2. **애플리케이션 설정** 탭 선택
3. **+ 추가** 클릭
4. 설정 추가:
   - **이름**: `GEMINI_API_KEY`
   - **값**: `your-gemini-api-key`
5. **저장** 클릭

**또는 Azure CLI로 설정:**
```bash
az staticwebapp appsettings set \
  --name zeorbig-metal-engine \
  --resource-group rg-zeorbig-metal \
  --setting-names GEMINI_API_KEY=your-api-key
```

#### 4. staticwebapp.config.json 생성 (선택사항)

프로젝트 루트에 다음 파일 생성:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "routes": [
    {
      "route": "/*",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ],
  "globalHeaders": {
    "content-security-policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;"
  }
}
```

### 로컬 테스트

```bash
# Python 간단 웹 서버
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

## 📝 개발 워크플로우

### 코드 수정 및 배포
```bash
# 1. 최신 코드 받기
git pull origin main

# 2. 코드 수정
# (index.html 편집)

# 3. 로컬 테스트
python -m http.server 8000

# 4. 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 5. 푸시 (자동 배포 트리거)
git push origin main
```

### 배포 확인
- GitHub Actions: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`
- 배포된 사이트는 Azure Portal의 Static Web App에서 URL 확인

## 🔧 환경 변수

### 필수 환경 변수
- `GEMINI_API_KEY`: Google Gemini API 키

### API 키 가져오기
1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. API 키 생성
3. Azure Static Web Apps의 Application Settings에 추가

## 🛠️ 기술 스택

- **Frontend**: React 18 (CDN)
- **Styling**: Tailwind CSS (CDN)
- **AI**: Google Gemini 2.0 Flash
- **Image Generation**: Google Imagen 3.0
- **Hosting**: Azure Static Web Apps
- **CI/CD**: GitHub Actions

## 📦 프로젝트 구조

```
Project-MetalGlyphs/
├── index.html              # 메인 애플리케이션 파일
├── ZEROBIG_LOGO-20251225-003.png  # 로고 이미지 (선택사항)
├── staticwebapp.config.json       # Azure SWA 설정 (선택사항)
└── README.md               # 문서
```

## 🔒 보안 고려사항

- API 키는 절대 코드에 하드코딩하지 마세요
- Azure Application Settings를 통해 환경 변수로 관리
- 프로덕션 환경에서는 백엔드 프록시 사용 권장

## 🎯 사용 방법

1. 아티스트 이름 입력 (예: Metallica)
2. 곡 제목 입력 (예: Master of Puppets)
3. "GENERATE ANALYSIS" 클릭
4. AI가 자동으로 분석 결과 생성

## 📄 라이선스

MIT License

## 🤝 기여

이슈 및 풀 리퀘스트 환영합니다!

## 📞 문의

프로젝트 관련 문의는 GitHub Issues를 이용해주세요.
