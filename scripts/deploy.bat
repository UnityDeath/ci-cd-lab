@echo off
REM Очень простой деплой: копируем backend+frontend в C:\deploy\ci-cd-lab и стартуем backend

if not exist "C:\deploy\ci-cd-lab" mkdir "C:\deploy\ci-cd-lab"
if not exist "C:\deploy\ci-cd-lab\backend" mkdir "C:\deploy\ci-cd-lab\backend"
if not exist "C:\deploy\ci-cd-lab\frontend" mkdir "C:\deploy\ci-cd-lab\frontend"

REM простая перезапись
xcopy /E /I /Y "%~dp0..\backend\*" "C:\deploy\ci-cd-lab\backend\"
xcopy /E /I /Y "%~dp0..\frontend\*" "C:\deploy\ci-cd-lab\frontend\"

REM установить прод-зависимости, если есть package.json
cd /d C:\deploy\ci-cd-lab\backend
if exist package.json (
  if exist package-lock.json (
    npm.cmd ci --production
  ) else (
    npm.cmd install --production
  )
) else (
  echo No package.json — skipping install
)

REM попытка остановить старый процесс на 3000
for /F "tokens=5" %%p in ('netstat -ano ^| findstr :3000') do (
  echo Killing PID %%p
  taskkill /PID %%p /F >NUL 2>&1
)

REM стартуем в отдельном окне (чтобы Jenkins не убивал процесс)
start "" cmd /c "cd /d C:\deploy\ci-cd-lab\backend && npm.cmd start > C:\deploy\ci-cd-lab\backend\app.log 2>&1"

echo Deploy script finished. Logs: C:\deploy\ci-cd-lab\backend\app.log
exit /b 0
