# todocheck

현재 PR에서 닫는 이슈번호를 지닌, 제거되지 않은 TODO 주석이 남아있는지 검사하는 CI tool입니다.

TODO 주석 예시: `// TODO 3841: remove todo`

## 동작 방식
1. 현재 PR에서 닫는 Issue 목록을 얻습니다.
2. 현재 branch codebase에서 해당 이슈번호가 붙어있는 TODO 주석을 찾습니다.
3. TODO 주석이 발견된다면 에러를 띄웁니다.


## 참고사항
- 이 PR CI tool은 본문의 내용, branch 커밋이 변경될 때마다 호출됩니다.
