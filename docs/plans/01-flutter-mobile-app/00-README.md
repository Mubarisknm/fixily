# Fykzi Flutter Mobile App — Architecture & Execution Contract

## 🎯 Goal
Build a dedicated native Flutter mobile application (`mobile/`) for Android and iOS that replicates the full Fykzi on-demand doorstep service experience: Kochi micro-market location selector, curated service categories, top-rated specialist rankings (with jobs completed), order tracking, and Supabase integration.

---

## 📋 Architectural Decisions (ADRs)

| ID | Decision | Rationale |
|:---|:---|:---|
| **D1** | Co-exist in `mobile/` subfolder | Preserves existing web app, Cloudflare deployment, and Supabase SQL schema in a single monorepo. |
| **D2** | Flutter Material 3 with Fykzi Dark/Light palette | Brand consistency: Navy `#0F172A`, Electric Blue `#2563EB`, Emerald `#10B981`, and Light Slate `#F8FAFC`. |
| **D3** | Provider / ValueNotifier State Management | Lightweight, fast startup, zero boilerplate for tab switching, location selection, and worker filtering. |
| **D4** | `supabase_flutter` for Backend & Auth | Directly binds to the existing Supabase project (`qajmpbbubdtrpjyhnhlg.supabase.co`). |
| **D5** | Dual-Target CI/CD via GitHub Actions | Generates release/debug APKs automatically on GitHub Actions so tests run immediately on real devices. |

---

## 📦 Execution Slices Checklist

- [x] **01-flutter-scaffold.md**: Scaffold `mobile/` directory, `pubspec.yaml`, Android & iOS manifest configurations, icons, and theme tokens.
- [x] **02-dart-models.md**: Core Dart data models (`Partner`, `Service`, `Location`, `Order`, `Review`) and Kochi seed data.
- [x] **03-flutter-screens.md**: Bottom navigation bar, Home Dashboard, Service Category filter, Specialist Technicians ranking list with job counts, and Active Order status screen.
- [x] **04-supabase-integration.md**: Supabase Flutter client configuration and repository service.
- [x] **05-apk-build.md**: Automated GitHub Actions workflow to compile `fykzi-flutter.apk`.

---

## 🛡️ Global Verification Command
```powershell
flutter analyze # Or automated CI build on GitHub Actions
```
