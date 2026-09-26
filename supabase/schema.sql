-- ==========================================================
-- Fixily On-Demand Platform - Supabase PostgreSQL Schema
-- Run this script in your Supabase SQL Editor ($0 Free Tier)
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. LOCATIONS TABLE (Kochi Micro-Markets)
CREATE TABLE IF NOT EXISTS locations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  district VARCHAR(100) DEFAULT 'Ernakulam',
  lat NUMERIC(9,6) NOT NULL,
  lng NUMERIC(9,6) NOT NULL,
  active_partners INTEGER DEFAULT 0,
  demand_surge VARCHAR(20) DEFAULT 'NORMAL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SERVICES TABLE (16+ Service Categories & Tiers)
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  tagline TEXT,
  base_price NUMERIC(10,2) NOT NULL,
  eta VARCHAR(50) NOT NULL,
  rating NUMERIC(3,2) DEFAULT 4.9,
  reviews_count INTEGER DEFAULT 120,
  image_url TEXT,
  is_instant BOOLEAN DEFAULT TRUE,
  thuna_required BOOLEAN DEFAULT FALSE,
  tiers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. GIG PARTNERS TABLE (PCC Thuna Status & Wallet)
CREATE TABLE IF NOT EXISTS partners (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  photo_url TEXT,
  service_category VARCHAR(100) NOT NULL,
  micro_market VARCHAR(100) NOT NULL,
  rating NUMERIC(3,2) DEFAULT 4.95,
  jobs_completed INTEGER DEFAULT 0,
  wallet_balance NUMERIC(10,2) DEFAULT 0.00,
  todays_earnings NUMERIC(10,2) DEFAULT 0.00,
  is_online BOOLEAN DEFAULT TRUE,
  kyc JSONB DEFAULT '{
    "aadhaarVerified": true,
    "pccStatus": "VERIFIED",
    "pccRefNo": "KPB/CC/2026/89412",
    "bankVerified": true,
    "badgeUrl": "https://img.shields.io/badge/Kerala_Police_Thuna-PCC_VERIFIED-success"
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BOOKING JOBS TABLE (Customer Orders & 4-Angle Pre-Checklist)
CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(50) PRIMARY KEY,
  service_id VARCHAR(50) REFERENCES services(id),
  service_title VARCHAR(150) NOT NULL,
  tier_name VARCHAR(150),
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  location JSONB NOT NULL,
  scheduled_time VARCHAR(100) DEFAULT 'Immediate Dispatch',
  status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
  assigned_partner_id VARCHAR(50),
  assigned_partner_name VARCHAR(150),
  assigned_partner_phone VARCHAR(30),
  pricing JSONB NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'PAID_UPI',
  vehicle_details VARCHAR(255),
  pre_service_checklist JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- INITIAL SEED DATA
-- ==========================================================

INSERT INTO locations (id, name, district, lat, lng, active_partners, demand_surge) VALUES
('kakkanad', 'Kakkanad (InfoPark Phase 1 & 2)', 'Ernakulam', 10.0159, 76.3419, 14, 'NORMAL'),
('edapally', 'Edapally & Lulu Mall Zone', 'Ernakulam', 10.0261, 76.3125, 18, 'HIGH'),
('mg-road', 'MG Road & Ernakulam South', 'Ernakulam', 9.9723, 76.2781, 12, 'NORMAL'),
('vytilla', 'Vytilla Mobility Hub', 'Ernakulam', 9.9658, 76.3197, 22, 'HIGH'),
('fort-kochi', 'Fort Kochi & Mattancherry', 'Ernakulam', 9.9639, 76.2434, 8, 'NORMAL'),
('aluva', 'Aluva & Metro Corridor', 'Ernakulam', 10.1076, 76.3516, 11, 'NORMAL')
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, category, tagline, base_price, eta, rating, reviews_count, image_url, is_instant, thuna_required, tiers) VALUES
('mechanic-doorstep', 'Doorstep Mechanic & Breakdown Rescue', 'Vehicle Care', 'Emergency jumpstart, flat tire replacement, oil change & computer diagnostics at home or roadside', 399.00, '15-20 mins', 4.96, 430, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80', true, false, '[{"name":"Flat Tire / Battery Jumpstart","price":399,"duration":"20 mins"},{"name":"Full Engine Oil & Filter Change","price":1299,"duration":"45 mins"},{"name":"Comprehensive Roadside Rescue","price":899,"duration":"30 mins"}]'::jsonb),
('freelance-driver', 'Acting Driver (Thuna PCC Verified)', 'Transport', 'Verified daily & hourly drivers for manual/automatic cars with Kerala Police verification', 299.00, '25-30 mins', 4.98, 512, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80', true, true, '[{"name":"Local City Drive (4 Hours)","price":499,"duration":"4 Hours"},{"name":"Outstation / Night Drive","price":999,"duration":"Full Day"},{"name":"Hourly Quick Drop","price":299,"duration":"1 Hour"}]'::jsonb),
('ac-servicing', 'AC Servicing & Appliance Care', 'Appliance Care', 'Deep jet pump wash, gas top-up, washing machine & kitchen chimney repairs', 499.00, '30-40 mins', 4.92, 380, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80', true, false, '[{"name":"Foam Jet AC Servicing","price":499,"duration":"45 mins"},{"name":"Gas Leak Repair & Refill","price":1499,"duration":"60 mins"}]'::jsonb),
('electrical-repair', 'Electrical Repair & Installation', 'Electrical', 'Short circuit fix, MCB replacement, inverter wiring & light fitting', 299.00, '20-30 mins', 4.89, 290, 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80', true, false, '[{"name":"Minor Repair / Fitting","price":299,"duration":"30 mins"},{"name":"Complete DB / Inverter Setup","price":1199,"duration":"90 mins"}]'::jsonb),
('plumbing-water', 'Plumbing & Water Management', 'Plumbing', 'Pipe leak repair, tap replacement, drainage unblocking & motor pump repair', 349.00, '20-35 mins', 4.91, 310, 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80', true, false, '[{"name":"Tap / Leak Repair","price":349,"duration":"30 mins"},{"name":"Drainage Jetting & Unblock","price":799,"duration":"60 mins"}]'::jsonb),
('doorstep-carwash', 'Doorstep Waterless Car Wash', 'Vehicle Care', 'Eco foam exterior wash, interior vacuuming & dashboard polishing at your doorstep', 449.00, '25-35 mins', 4.94, 260, 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&auto=format&fit=crop&q=80', true, false, '[{"name":"Hatchback Foam Wash","price":449,"duration":"35 mins"},{"name":"SUV Deep Interior Detailing","price":899,"duration":"60 mins"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO partners (id, name, phone, photo_url, service_category, micro_market, rating, jobs_completed, wallet_balance, todays_earnings, is_online, kyc) VALUES
('P-101', 'Rajesh Kumar', '+91 98470 12345', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', 'Doorstep Mechanic & Breakdown Rescue', 'Kakkanad', 4.95, 142, 3420.00, 1250.00, true, '{"aadhaarVerified": true, "pccStatus": "VERIFIED", "pccRefNo": "KPB/CC/2026/89412", "bankVerified": true}'::jsonb),
('P-102', 'Suresh Babu', '+91 94471 98765', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', 'Acting Driver (Thuna PCC Verified)', 'Edapally', 4.98, 210, 5100.00, 1800.00, true, '{"aadhaarVerified": true, "pccStatus": "VERIFIED", "pccRefNo": "KPB/DRIVER/2026/001", "bankVerified": true}'::jsonb),
('P-103', 'Anil Varghese', '+91 97452 33445', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', 'AC Servicing & Appliance Care', 'Vytilla', 4.91, 98, 2890.00, 950.00, true, '{"aadhaarVerified": true, "pccStatus": "VERIFIED", "pccRefNo": "KPB/AC/2026/4432", "bankVerified": true}'::jsonb)
ON CONFLICT (id) DO NOTHING;
