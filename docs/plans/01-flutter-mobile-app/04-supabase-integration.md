# Slice 04: Supabase Integration & Authentication

## 🔗 Contract References
- Follows Decision **D4** (`supabase_flutter` backend integration)

## 📁 Files to Touch
- `[NEW]` `mobile/lib/services/supabase_service.dart`
- `[NEW]` `mobile/lib/screens/phone_auth_screen.dart`

## ⚙️ Changes
- Initialize Supabase client in Flutter `main.dart`:
  - URL: `https://qajmpbbubdtrpjyhnhlg.supabase.co`
- Implement query methods:
  - `fetchPartners(category)`
  - `fetchLocations()`
  - `createBooking(job)`
  - `listenToActiveOrders(customerId)` (Realtime stream)
- Implement Phone OTP authentication flow (Indian mobile `+91` format).

## 🧪 Verification Gate
Verify Supabase service handles both live connection and mock data fallback gracefully.

## ✅ Definition of Done
- Supabase client connected.
- Real-time stream updates active orders upon status changes.
