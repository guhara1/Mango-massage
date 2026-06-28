# 색인(인덱싱) 도구

빠른 색인을 위한 파일과 스크립트입니다.

## 자동 생성물 (build 시 docs/ 에 출력)

| 파일 | 용도 |
|---|---|
| `sitemap.xml` | 색인 대상 전체 URL + 이미지. 구글/네이버 서치 도구에 제출 |
| `rss.xml` | RSS 2.0 피드. 네이버 서치어드바이저 'RSS 제출'에 사용 |
| `robots.txt` | 전체 허용 + Yeti(네이버)·Googlebot·bingbot 명시 + 사이트맵 |
| `<key>.txt` | IndexNow 키 검증 파일 (도메인 루트) |
| 메인 `<head>` | 네이버 사이트 소유확인 메타 태그 |

## 즉시 색인 통보 (IndexNow → 빙·네이버·얀덱스)

**배포가 끝난 뒤** 실행하세요. (키 파일이 실서버에서 열려야 검증됩니다.)

```bash
# 전체 URL 일괄 통보 (sitemap.xml 기준)
python tools/indexnow.py

# 특정 페이지만 통보 (글 올릴 때마다)
python tools/indexnow.py /seoul/gangnam-gu/ /gyeonggi/suwon/
```

- 표준 라이브러리만 사용(설치 불필요).
- 키/호스트 변경 시: `INDEXNOW_KEY`, `INDEXNOW_HOST` 환경변수로 덮어쓰기.
- 키는 `src/site.mjs` 의 `indexNowKey` 와 `docs/<key>.txt` 가 일치해야 합니다.

### 글 올릴 때마다 자동 통보
배포(빌드) 직후 `python tools/indexnow.py`(또는 바뀐 URL만 인자로) 한 줄을
배포 스크립트/CI 끝에 추가하면 발행 즉시 빙·네이버에 통보됩니다.

## 구글은 IndexNow 미참여

구글은 IndexNow에 참여하지 않습니다. 또한 **구글·빙의 sitemap ping 엔드포인트는
2023년 폐지**되어 더 이상 동작하지 않습니다. 따라서 일반 페이지의 빠른 구글 색인은:

1. **Search Console** 에 `sitemap.xml` 제출 (가장 중요)
2. 신규/수정 페이지는 **URL 검사 → 색인 요청**
3. 탄탄한 **내부링크**(이미 사이트 전반에 적용됨)

`tools/google_indexing.py` 는 Indexing API 예시지만, 구글 정책상
**JobPosting/BroadcastEvent 전용**입니다. 일반 페이지엔 사용하지 마세요.

## 제출 체크리스트 (배포 후 1회)

- [ ] 네이버 서치어드바이저: 사이트 등록 → (메타 이미 적용) 소유확인 → `sitemap.xml`·`rss.xml` 제출
- [ ] 구글 서치콘솔: 속성 등록 → `sitemap.xml` 제출
- [ ] 빙 웹마스터: 사이트 추가(또는 GSC 가져오기) → IndexNow 키 확인
- [ ] `python tools/indexnow.py` 1회 실행 (빙·네이버 일괄 통보)
