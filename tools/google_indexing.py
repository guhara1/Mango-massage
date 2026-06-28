#!/usr/bin/env python3
"""(선택) Google Indexing API 통보.

⚠️ 중요: Google Indexing API 는 공식적으로 JobPosting / BroadcastEvent 페이지
전용입니다. 일반 웹페이지 색인 통보는 공식 지원 대상이 아닙니다.
일반 페이지의 가장 빠른 구글 색인 경로는 (1) Search Console 사이트맵 제출,
(2) 탄탄한 내부링크, (3) 페이지 단위 'URL 검사 → 색인 요청' 입니다.

이 스크립트는 서비스 계정으로 Indexing API 를 호출하는 예시이며,
JobPosting 류 페이지가 있을 때만 정책에 맞게 사용하세요.

준비:
    pip install google-auth requests
    GOOGLE_APPLICATION_CREDENTIALS=서비스계정.json 환경변수 설정
    (서비스 계정을 Search Console 속성의 '소유자'로 추가)

사용:
    python tools/google_indexing.py https://mango-massage.pages.dev/some/url/
"""
import sys

try:
    from google.oauth2 import service_account
    from google.auth.transport.requests import AuthorizedSession
except ImportError:
    print("먼저 설치하세요: pip install google-auth requests")
    sys.exit(1)

SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"


def main():
    urls = sys.argv[1:]
    if not urls:
        print("사용법: python tools/google_indexing.py <URL> [URL ...]")
        return
    creds = service_account.Credentials.from_service_account_file(
        __import__("os").environ["GOOGLE_APPLICATION_CREDENTIALS"], scopes=SCOPES
    )
    session = AuthorizedSession(creds)
    for url in urls:
        body = {"url": url, "type": "URL_UPDATED"}
        r = session.post(ENDPOINT, json=body)
        print(f"[{r.status_code}] {url}")
        if r.status_code != 200:
            print("   ", r.text)


if __name__ == "__main__":
    main()
