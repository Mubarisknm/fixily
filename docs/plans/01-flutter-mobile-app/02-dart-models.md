# Slice 02: Dart Data Models & Kochi Seed Data

## 🔗 Contract References
- Follows Decision **D2** (Brand data consistency)
- Aligns with existing web schema (`src/data/db.ts` and `supabase/schema.sql`)

## 📁 Files to Touch
- `[NEW]` `mobile/lib/models/partner.dart`
- `[NEW]` `mobile/lib/models/service_item.dart`
- `[NEW]` `mobile/lib/models/kochi_location.dart`
- `[NEW]` `mobile/lib/models/job_order.dart`
- `[NEW]` `mobile/lib/data/mock_database.dart`

## ⚙️ Changes
- Implement `Partner` model with `id`, `name`, `rating`, `jobsCompleted`, `specialty`, `hourlyRate`, `avatarUrl`, `isVerified`, and `rankingScore`.
- Implement `KochiLocation` model with Ernakulam/Kochi micro-markets:
  - Kakkanad (Infopark), Kaloor, Fort Kochi, MG Road, Edappally (Lulu Mall), Aluva.
- Implement `ServiceItem` categories:
  - AC Repair & Service, Electrician, Plumber, Bike Doctor, Carpenter, House Cleaning.
- Implement `JobOrder` model with status ('pending', 'in_progress', 'completed') and tracking timestamps.

## 🧪 Verification Gate
Ensure all model constructors and `fromJson` / `toJson` serializations compile cleanly.

## ✅ Definition of Done
- Complete parity with web partner and service catalogs.
- Sorting algorithm: `(rating * 100) + (jobsCompleted * 0.8)` for accurate specialist rankings.
