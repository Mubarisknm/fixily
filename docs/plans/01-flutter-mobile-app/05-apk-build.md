# Slice 05: Flutter APK CI/CD & Build Pipeline

## 🔗 Contract References
- Follows Decision **D5** (Automated GitHub Actions build)

## 📁 Files to Touch
- `[NEW]` `.github/workflows/build-flutter-apk.yml`

## ⚙️ Changes
- Create GitHub Actions workflow to build the Flutter Android APK:
  - Setup Flutter SDK (stable)
  - Setup Java 17
  - Run `flutter pub get` inside `mobile/`
  - Run `flutter build apk --release` (or `--debug`)
  - Upload `app-release.apk` as downloadable artifact

## 🧪 Verification Gate
Trigger workflow on push and verify `.apk` artifact is generated.

## ✅ Definition of Done
- Flutter Android APK is automatically produced in the GitHub repository Actions tab.
