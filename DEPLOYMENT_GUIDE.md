# 🚀 ZEORBIG Metal Analysis Engine - Azure 배포 가이드

## ✅ 완료된 작업

- ✅ Git 리포지토리 초기화
- ✅ GitHub 원격 리포지토리 연결 (https://github.com/zer0big/MetalGlyphs)
- ✅ 초기 커밋 및 푸시 완료
- ✅ 프로젝트 파일 구조 완성

## 📦 현재 프로젝트 구조

```
Project-MetalGlyphs/
├── index.html                  # 메인 애플리케이션 (React CDN 기반)
├── staticwebapp.config.json   # Azure Static Web Apps 설정
├── README.md                  # 프로젝트 문서
├── .gitignore                 # Git 제외 파일
└── DEPLOYMENT_GUIDE.md        # 이 파일
```

## 🔥 다음 단계: Azure Static Web Apps 배포

### 1️⃣ Azure Portal에서 Static Web App 생성

1. **Azure Portal 접속**
   - https://portal.azure.com 로그인

2. **리소스 만들기**
   - 검색: "Static Web App"
   - **만들기** 클릭

3. **기본 정보 입력**
   ```
   구독: [사용 중인 구독 선택]
   리소스 그룹: rg-zeorbig-metal (신규 생성)
   이름: zeorbig-metal-engine
   플랜 유형: Free
   지역: East Asia
   ```

4. **배포 세부 정보**
   ```
   원본: GitHub
   조직: zer0big
   리포지토리: MetalGlyphs
   분기: main
   ```

5. **빌드 세부 정보**
   ```
   빌드 사전 설정: Custom
   앱 위치: /
   API 위치: (비워둠)
   출력 위치: /
   ```

6. **검토 + 만들기** → **만들기**

### 2️⃣ GitHub Actions Workflow 자동 생성

Azure가 자동으로 GitHub Actions workflow를 생성합니다:
- 파일 위치: `.github/workflows/azure-static-web-apps-[unique-id].yml`
- 자동으로 리포지토리에 커밋됨
- `main` 브랜치에 푸시할 때마다 자동 배포

### 3️⃣ Gemini API 키 설정 (필수!)

**Azure Portal에서 설정:**

1. Azure Portal → Static Web Apps → **zeorbig-metal-engine**
2. 왼쪽 메뉴 → **구성**
3. **애플리케이션 설정** 탭
4. **+ 추가** 클릭
5. 다음 설정 추가:
   ```
   이름: GEMINI_API_KEY
   값: [실제 Gemini API 키]
   ```
6. **저장** 클릭

**또는 Azure CLI 사용:**
```bash
az staticwebapp appsettings set \
  --name zerobig-metal-engine \
  --resource-group rg-zeorbig-metal \
  --setting-names GEMINI_API_KEY=your-actual-api-key-here
```

### 4️⃣ Gemini API 키 발급 방법

1. https://aistudio.google.com/app/apikey 접속
2. **Get API key** 클릭
3. **Create API key** 선택
4. 생성된 키를 복사하여 Azure 설정에 붙여넣기

### 5️⃣ 배포 확인

**GitHub Actions 확인:**
- https://github.com/zer0big/MetalGlyphs/actions
- 최신 워크플로우 실행 상태 확인
- 녹색 체크 ✅ = 배포 성공

**Azure Portal 확인:**
1. Static Web App → **개요**
2. **URL** 클릭하여 배포된 사이트 접속
3. URL 예시: `https://[unique-name].azurestaticapps.net`

## 🎯 로컬 테스트

배포 전 로컬에서 테스트:

```bash
# Python 간단 웹 서버
cd "c:\Users\김영대\Desktop\Project-MetalGlyphs"
python -m http.server 8000

# 브라우저에서 접속
# http://localhost:8000
```

## 🔄 향후 업데이트 방법

코드를 수정하고 배포:

```bash
# 1. 코드 수정 (index.html 등)

# 2. 변경사항 확인
git status

# 3. 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 4. 푸시 (자동 배포 트리거)
git push origin main

# 5. GitHub Actions에서 배포 상태 확인
```

## 🐛 트러블슈팅

### API 키가 작동하지 않을 때
- Azure Portal에서 `GEMINI_API_KEY` 설정 확인
- API 키 형식이 올바른지 확인
- Google Cloud Console에서 API 활성화 상태 확인

### 배포가 실패할 때
- GitHub Actions 로그 확인
- workflow 파일 문법 확인
- Azure 리소스 상태 확인

### 변경사항이 반영되지 않을 때
- 브라우저 캐시 삭제 (Ctrl + Shift + R)
- 시크릿 모드로 테스트
- 배포 완료 후 2-3분 대기 (CDN 전파 시간)

## 📚 참고 문서

- [Azure Static Web Apps 공식 문서](https://learn.microsoft.com/azure/static-web-apps/)
- [GitHub Actions 문서](https://docs.github.com/actions)
- [Gemini API 문서](https://ai.google.dev/docs)

## 🎉 배포 완료 후 체크리스트

- [ ] Azure Static Web App 생성 완료
- [ ] GitHub Actions workflow 자동 생성 확인
- [ ] GEMINI_API_KEY 환경 변수 설정
- [ ] 첫 배포 성공 확인
- [ ] 배포된 URL로 접속 테스트
- [ ] 아티스트/곡 입력하여 분석 기능 테스트
- [ ] 이미지 생성 기능 확인

---

**프로젝트 리포지토리**: https://github.com/zer0big/MetalGlyphs
**작성일**: 2025-12-31
