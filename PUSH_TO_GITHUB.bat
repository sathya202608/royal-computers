@echo off
title Push Royal Computers to GitHub
echo ====================================================================
echo   ROYAL COMPUTERS - PUSH TO GITHUB
echo   Repository: https://github.com/sathya202608/royal-computers.git
echo ====================================================================
echo.

set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"

cd /d "%~dp0"

echo Pushing 'main' branch to GitHub...
echo (A browser window may open to sign into GitHub - please click Approve)
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ====================================================================
    echo   SUCCESS! Your project is now live on GitHub:
    echo   https://github.com/sathya202608/royal-computers
    echo ====================================================================
) else (
    echo.
    echo Push could not complete.
)
echo.
pause

