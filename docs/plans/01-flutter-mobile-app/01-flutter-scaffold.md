# Slice 01: Flutter Project Scaffold & Configuration

## 🔗 Contract References
- Follows Decision **D1** (Root `mobile/` directory)
- Follows Decision **D2** (Material 3 with Fykzi brand palette)

## 📁 Files to Touch
- `[NEW]` `mobile/pubspec.yaml`
- `[NEW]` `mobile/lib/main.dart`
- `[NEW]` `mobile/lib/core/theme.dart`
- `[NEW]` `mobile/lib/core/constants.dart`
- `[NEW]` `mobile/android/app/src/main/AndroidManifest.xml`

## ⚙️ Changes
- Create `pubspec.yaml` with required dependencies:
  - `flutter: sdk: flutter`
  - `google_fonts: ^6.2.1`
  - `lucide_icons: ^0.257.0` (or `material_symbols_icons`)
  - `supabase_flutter: ^2.8.0`
  - `intl: ^0.19.0`
- Define `FykziTheme` with light and dark mode styles, Plus Jakarta Sans font, and custom colors.
- Setup main application entry point `main.dart` with bottom navigation framework.

## 🧪 Verification Gate
Run `flutter analyze` or check file syntax consistency.

## ✅ Definition of Done
- `mobile/pubspec.yaml` configured.
- `FykziTheme` initialized with electric blue `#2563EB` and dark navy `#0F172A`.
- Application boots into root widget without runtime errors.
