# 🎸 ZEORBIG Metal Analysis Engine

AI 기반 메탈 음악 분석 플랫폼 - Azure OpenAI로 구동되는 가사 검색, 번역, 아티스트 정보 및 심층 분석 서비스

[![Azure Static Web Apps](https://img.shields.io/badge/Azure-Static%20Web%20Apps-blue)](https://thankful-forest-005598a00.4.azurestaticapps.net)
[![Azure OpenAI](https://img.shields.io/badge/Azure-OpenAI-green)](https://azure.microsoft.com/products/ai-services/openai-service)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🔗 **라이브 데모**: https://thankful-forest-005598a00.4.azurestaticapps.net

---

## 🌟 주요 기능

| 기능 | 설명 |
|-----|------|
| 🎵 **자동 가사 검색** | Azure OpenAI GPT-4o를 통한 원본 가사 자동 검색 |
| 🌏 **한국어 번역** | 감성적이고 자연스러운 한국어 번역 제공 |
| 👤 **아티스트 정보** | 디스코그래피, 경력, 음악 스타일 분석 |
| 📖 **곡 해석** | 곡의 의미, 테마, 역사적 맥락 분석 |
| 🔗 **외부 링크** | Metal Archives, Wikipedia, YouTube 자동 연결 |
| 💾 **스마트 캐싱** | 2시간 TTL 캐싱으로 빠른 재검색 |
| 🛡️ **안정성 보장** | Circuit Breaker, Token Bucket, Exponential Backoff |

---

## 🏗️ 아키텍처

### Azure Well-Architected Framework 기반 설계

```
┌─────────────────────────────────────────────────────────┐
│            Azure Static Web Apps (Frontend)             │
│  • React 18 (CDN)                                       │
│  • Tailwind CSS                                         │
│  • Circuit Breaker Pattern                              │
│  • Token Bucket Rate Limiter                            │
│  • Local Storage Caching (2h TTL)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Azure Functions (Serverless API Proxy)          │
│  • POST /api/analyze                                    │
│  • 환경변수로 API 키 관리 (App Settings)                 │
│  • Request Validation                                   │
│  • Error Handling                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Azure OpenAI Service                       │
│  • Endpoint: aoai-knowledge-base-demo                   │
│  • Model: GPT-4o                                        │
│  • max_tokens: 3000 (최적화)                            │
│  • API Version: 2024-12-01-preview                      │
└─────────────────────────────────────────────────────────┘
```

### 보안 아키텍처

- ✅ **API 키 보호**: 서버측 환경변수로 관리 (클라이언트 노출 방지)
- ✅ **CORS 설정**: Azure Static Web Apps 자동 처리
- ✅ **CSP Headers**: Content Security Policy 적용
- ✅ **Rate Limiting**: 클라이언트/서버 이중 제한

---

## 🚀 배포 가이드

### 사전 준비

- Azure 구독 ([무료 계정 생성](https://azure.microsoft.com/free/))
- GitHub 계정
- Azure OpenAI 리소스 및 API 키

### 1단계: GitHub 리포지토리 포크/클론

```bash
git clone https://github.com/zer0big/MetalGlyphs.git
cd MetalGlyphs
```

### 2단계: Azure Static Web App 생성

```bash
# Azure CLI로 생성
az staticwebapp create \
  --name your-app-name \
  --resource-group your-rg-name \
  --source https://github.com/YOUR_USERNAME/MetalGlyphs \
  --location "East Asia" \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location "/" \
  --sku Free
```

또는 [Azure Portal](https://portal.azure.com)에서 GUI로 생성

### 3단계: 환경 변수 설정

**필수 환경 변수:**

```bash
az staticwebapp appsettings set \
  --name your-app-name \
  --resource-group your-rg-name \
  --setting-names \
    AZURE_OPENAI_ENDPOINT="https://your-endpoint.openai.azure.com" \
    AZURE_OPENAI_API_KEY="your-api-key" \
    AZURE_OPENAI_DEPLOYMENT="gpt-4o" \
    AZURE_OPENAI_API_VERSION="2024-12-01-preview"
```

### 4단계: 배포 확인

- GitHub Actions: `https://github.com/YOUR_USERNAME/MetalGlyphs/actions`
- 배포 완료 후 제공된 URL로 접속

---

## 💻 로컬 개발

### 사전 준비

```bash
npm install -g azure-functions-core-tools@4
```

### API 설정 (api/local.settings.json)

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_OPENAI_ENDPOINT": "https://your-endpoint.openai.azure.com",
    "AZURE_OPENAI_API_KEY": "your-api-key",
    "AZURE_OPENAI_DEPLOYMENT": "gpt-4o",
    "AZURE_OPENAI_API_VERSION": "2024-12-01-preview"
  }
}
```

### 로컬 실행

```bash
# 터미널 1: Azure Functions 실행
cd api
npm install
func start

# 터미널 2: 프론트엔드 서빙
python -m http.server 8000

# 브라우저: http://localhost:8000
```

---

## 🛠️ 기술 스택

### Frontend
- **React 18**: UI 프레임워크 (CDN)
- **Tailwind CSS**: 유틸리티 CSS 프레임워크
- **Babel Standalone**: JSX 런타임 변환

### Backend
- **Azure Functions**: 서버리스 API (Node.js 18)
- **Azure OpenAI**: GPT-4o 모델
- **Azure Static Web Apps**: 호스팅 및 CI/CD

### DevOps
- **GitHub Actions**: 자동 배포 파이프라인
- **Azure CLI**: 인프라 관리

### Reliability Patterns (Azure WAF)
- **Circuit Breaker**: 장애 전파 방지 (CLOSED → OPEN → HALF_OPEN)
- **Token Bucket**: 클라이언트 Rate Limiting (3 tokens, 60s refill)
- **Exponential Backoff + Jitter**: 재시도 최적화
- **Graceful Degradation**: 이미지 API 비활성화 (Unsplash fallback)

---

## 📊 비용 분석

### Azure OpenAI GPT-4o 비용 (max_tokens: 3000)

| 항목 | 단가 | 1회당 비용 |
|-----|------|-----------|
| Input Tokens (~450) | $2.50/1M | $0.001125 |
| Output Tokens (~2,500) | $10.00/1M | $0.025 |
| **합계** | - | **~$0.026** (₩35) |

### 월간 예상 비용 (하루 5회 사용)

```
일일: 5회 × $0.026 = $0.13 (₩173)
월간: $0.13 × 30일 = $3.90 (₩5,200)
```

**캐싱 효과**: 같은 곡 재검색 시 비용 $0 (2시간 TTL)

### Azure Static Web Apps
- **Free Tier**: 100GB 대역폭/월, 무료 SSL 인증서

---

## 📦 프로젝트 구조

```
MetalGlyphs/
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml  # CI/CD 파이프라인
├── api/
│   ├── analyze/
│   │   ├── function.json              # Azure Functions 설정
│   │   └── index.js                   # API 프록시 로직
│   ├── host.json                      # Functions 호스트 설정
│   ├── local.settings.json            # 로컬 환경 변수 (gitignore)
│   └── package.json                   # 의존성
├── index.html                         # 메인 SPA
├── staticwebapp.config.json           # Azure SWA 라우팅 설정
├── .gitignore
└── README.md
```

---

## 🔐 보안 모범 사례

### ✅ 적용된 보안 조치

1. **API 키 보호**
   - Azure App Settings에서 환경변수로 관리
   - `local.settings.json`은 `.gitignore`에 포함

2. **Rate Limiting**
   - 클라이언트: Token Bucket (3 tokens, 60s refill)
   - 서버: Circuit Breaker (1회 실패 시 5분 보호)

3. **Content Security Policy**
   - CSP Headers로 XSS 방지

4. **HTTPS Only**
   - Azure Static Web Apps 기본 제공

### ⚠️ 주의사항

- **절대 API 키를 Git에 커밋하지 마세요**
- 프로덕션 환경에서는 Azure Key Vault 사용 권장
- Azure RBAC로 접근 제어 설정

---

## 🎯 사용 방법

1. **아티스트 이름 입력** (예: `Metallica`)
2. **곡 제목 입력** (예: `Master of Puppets`)
3. **"GENERATE ANALYSIS" 클릭**
4. 20-30초 후 분석 결과 확인
5. 같은 곡 재검색 시 캐시에서 즉시 로드

### Circuit Breaker 상태

| 표시 | 의미 |
|-----|------|
| 🟢 CLOSED | 정상 작동 |
| 🟡 HALF_OPEN | 연결 테스트 중 |
| 🔴 OPEN | 보호 모드 (5분 후 자동 재시도) |

---

## 📈 성능 최적화

### 적용된 최적화

- ✅ **max_tokens 최적화**: 4000 → 3000 (25% 속도 향상)
- ✅ **스마트 캐싱**: 2시간 TTL (같은 곡 재검색 0초)
- ✅ **이미지 API 비활성화**: Unsplash fallback 사용
- ✅ **CDN 활용**: React, Tailwind CSS

### 향후 개선 계획

- [ ] Vite 빌드 시스템 도입 (런타임 Babel 제거)
- [ ] Streaming 응답 (점진적 로딩)
- [ ] Redis 캐싱 (서버측)
- [ ] Application Insights 연동

---

## 📝 개발 워크플로우

### 코드 수정 및 배포

```bash
# 1. 브랜치 생성
git checkout -b feature/new-feature

# 2. 코드 수정 및 테스트
npm run dev  # 또는 로컬 서버 실행

# 3. 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 4. 푸시 (PR 생성)
git push origin feature/new-feature

# 5. main 브랜치 병합 시 자동 배포
```

### 배포 모니터링

- GitHub Actions: 빌드/배포 로그 확인
- Azure Portal: Static Web App 메트릭 모니터링

---

## 🐛 트러블슈팅

### 405 Method Not Allowed

**원인**: Azure Functions가 배포되지 않음

**해결**:
```yaml
# .github/workflows/azure-static-web-apps.yml
api_location: "api"  # 확인 필요
```

### 429 Rate Limit Error

**원인**: Token Bucket 또는 Azure OpenAI 한도 초과

**해결**:
- Circuit Breaker가 자동으로 5분 보호 모드 전환
- 또는 "수동 해제" 버튼 클릭

### API 응답 느림

**원인**: max_tokens가 너무 큼

**해결**:
```javascript
// api/analyze/index.js
max_tokens: 3000  // 2000-3000 권장
```

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 🤝 기여

이슈 및 풀 리퀘스트 환영합니다!

### 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 문의

프로젝트 관련 문의: [GitHub Issues](https://github.com/zer0big/MetalGlyphs/issues)

---

## 🙏 Acknowledgments

- [Azure OpenAI Service](https://azure.microsoft.com/products/ai-services/openai-service)
- [Azure Static Web Apps](https://azure.microsoft.com/services/app-service/static/)
- [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ by ZEROBIG** | Powered by Azure OpenAI
