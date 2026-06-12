# Park International 홈페이지

파크인터내셔널(Park International Co., Ltd.) 공식 홈페이지 — 정적 사이트(HTML/CSS/JS), GitHub Pages 배포용.
한국어/영어 이중언어, 반응형. 우측 상단 `KO / EN` 버튼으로 언어 전환.

## 구성

```
parkint-site/
├── index.html        홈
├── about.html        회사소개
├── events.html       행사 목록
├── gallery.html      갤러리(라이트박스)
├── faq.html          자주 묻는 질문
├── contact.html      문의(메일 양식)
├── 404.html
├── robots.txt
├── .nojekyll
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── events.json   행사·사진 데이터(여기만 수정하면 행사/갤러리 자동 갱신)
    ├── img/          로고·배경
    └── events/<행사>/ 행사 사진(01.jpg = 원본, 01_t.jpg = 썸네일)
```

## 로컬 미리보기

`assets/events.json` 을 `fetch` 로 불러오므로 파일을 더블클릭하지 말고 간단한 서버로 띄워야 합니다.

```bash
cd parkint-site
python -m http.server 8000
# 브라우저에서 http://localhost:8000
```

## GitHub Pages 배포 (5분)

1. GitHub에서 새 저장소 생성 (예: `parkint-website`, Public).
2. `parkint-site` 폴더 **안의 파일들**을 저장소 루트로 올립니다.
   ```bash
   cd parkint-site
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<사용자명>/parkint-website.git
   git push -u origin main
   ```
3. 저장소 → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `/ (root)` → Save.
4. 1~2분 뒤 `https://<사용자명>.github.io/parkint-website/` 에서 확인.

## 새 도메인 연결

도메인을 정하면 아래 2가지만 하면 됩니다.

1. **저장소 루트에 `CNAME` 파일 생성** — 내용은 도메인 한 줄 (예: `parkintl.com`).
2. **도메인 등록업체(DNS)에서 레코드 추가**:
   - 루트 도메인(`example.com`)용 A 레코드 4개:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` 서브도메인용 CNAME: `<사용자명>.github.io`
3. Settings → Pages → Custom domain 에 도메인 입력 → **Enforce HTTPS** 체크.

> 참고: 루트 도메인을 쓰면 `index.html` 의 `/assets/...` 경로가 그대로 동작합니다. 만약 `github.io/저장소명/` 형태(하위 경로)로만 운영한다면 절대경로 대신 현재의 상대경로(`assets/...`)가 안전합니다 — 본 사이트는 상대경로로 작성되어 두 방식 모두 호환됩니다.

## 도메인 추천

기존 도메인은 `parkint.net` 입니다. 새 도메인 후보(등록 전 가용성 확인 필요):

| 후보 | 성격 |
|---|---|
| `parkintl.com` | 짧고 글로벌, `.com` 신뢰도 |
| `parkint.com` | 기존 브랜드와 동일, `.com` |
| `parkint.co.kr` | 한국 기업 정체성 |
| `parkinternational.com` | 정식 사명 그대로 |
| `parkglobalfoods.com` | 사업(식품 수출) 직관적 |
| `bravo-korea.com` | 행사 브랜드(Bravo Gyeongnam) 연계 |

가용성은 [whois.namecheaper / 가비아 / 후이즈] 등에서 확인하세요.

## 행사/사진 추가 방법

1. `assets/events/<새-행사-슬러그>/` 폴더에 사진을 `01.jpg`, `01_t.jpg`(썸네일) … 형태로 넣습니다.
2. `assets/events.json` 에 항목을 추가합니다(연도, 한/영 제목, 한/영 위치, cover, photos).
3. 저장 후 push 하면 행사·갤러리 페이지에 자동 반영됩니다.

---
© Park International Co., Ltd. — Busan, Korea
