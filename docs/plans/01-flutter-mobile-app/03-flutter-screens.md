# Slice 03: Flutter Screens & Navigation

## 🔗 Contract References
- Follows Decision **D2** (Fykzi UI & UX specifications)
- Follows Decision **D3** (Clean state management)

## 📁 Files to Touch
- `[NEW]` `mobile/lib/screens/main_navigation_screen.dart`
- `[NEW]` `mobile/lib/screens/home_dashboard_screen.dart`
- `[NEW]` `mobile/lib/screens/services_screen.dart`
- `[NEW]` `mobile/lib/screens/orders_screen.dart`
- `[NEW]` `mobile/lib/widgets/location_selector_sheet.dart`
- `[NEW]` `mobile/lib/widgets/technician_card.dart`
- `[NEW]` `mobile/lib/widgets/booking_sheet.dart`

## ⚙️ Changes
- **Main Navigation Screen**: 3-tab modern bottom navigation bar (`Home`, `Services`, `Orders`) with smooth animated switching.
- **Home Dashboard**:
  - Top app bar with Kochi location selector chip & active order live pill.
  - Search bar with instant specialist category matching.
  - Quick Category Carousel (AC, Electrical, Plumbing, Bike).
  - "Top Rated Specialists" section displaying specific technicians sorted by ranking score, showing rating stars and jobs completed.
- **Location Selector Bottom Sheet**: Allows selecting between Kakkanad, Kaloor, Fort Kochi, MG Road, Edappally, etc.
- **Orders Screen**: Shows active live bookings with progress indicator, technician details, and direct call action.

## 🧪 Verification Gate
Verify widget tree hierarchy, responsive layout on mobile screens, and safe area handling.

## ✅ Definition of Done
- Flutter UI matches the simplified, modern Fykzi design.
- Search for "AC mechanic" correctly surfaces top AC specialists first with job counts.
