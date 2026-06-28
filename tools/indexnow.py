#!/usr/bin/env python3
"""IndexNow 일괄 색인 통보 (빙·네이버·얀덱스·Seznam).

사용법:
    python tools/indexnow.py                 # docs/sitemap.xml 의 모든 URL 통보
    python tools/indexnow.py /seoul/ /가양동/ # 특정 경로만 통보(여러 개 가능)

전제: 배포가 끝나 https://<host>/<key>.txt 가 실제로 열려야 검증됩니다.
표준 라이브러리만 사용합니다(pip 설치 불필요).
"""
import json
import os
import re
import sys
import urllib.request
import urllib.error

HOST = os.environ.get("INDEXNOW_HOST", "mango-massage.pages.dev")
KEY = os.environ.get("INDEXNOW_KEY", "7d3f9a2c6e1b4805af93c7e2d6105b8e")
ENDPOINT = "https://api.indexnow.org/indexnow"  # 참여 검색엔진에 공유 전달
SITEMAP = os.path.join(os.path.dirname(__file__), "..", "docs", "sitemap.xml")


def urls_from_sitemap():
    with open(SITEMAP, encoding="utf-8") as f:
        xml = f.read()
    return re.findall(r"<loc>([^<]+)</loc>", xml)


def main():
    base = f"https://{HOST}"
    args = sys.argv[1:]
    if args:
        url_list = [u if u.startswith("http") else base + u for u in args]
    else:
        url_list = urls_from_sitemap()

    if not url_list:
        print("통보할 URL이 없습니다.")
        return

    # IndexNow 1회 요청 최대 10,000개
    sent = 0
    for i in range(0, len(url_list), 10000):
        batch = url_list[i:i + 10000]
        payload = {
            "host": HOST,
            "key": KEY,
            "keyLocation": f"{base}/{KEY}.txt",
            "urlList": batch,
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            ENDPOINT, data=data,
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                print(f"[{resp.status}] {len(batch)}개 통보 완료")
                sent += len(batch)
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "ignore")
            print(f"[{e.code}] 오류: {body}")
            print("→ 200/202 가 아니면 키 파일(/{}.txt) 접근 가능 여부, host 일치를 확인하세요.".format(KEY))
        except Exception as e:  # noqa
            print(f"요청 실패: {e}")

    print(f"총 {sent}/{len(url_list)} URL 통보.")


if __name__ == "__main__":
    main()
