import 'package:supabase_flutter/supabase_flutter.dart';
import '../core/constants.dart';
import '../models/partner.dart';
import '../models/job_order.dart';

class SupabaseService {
  static final SupabaseService _instance = SupabaseService._internal();
  factory SupabaseService() => _instance;
  SupabaseService._internal();

  bool _isInitialized = false;

  Future<void> initialize() async {
    try {
      await Supabase.initialize(
        url: FykziConstants.supabaseUrl,
        anonKey: FykziConstants.supabaseAnonKey,
      );
      _isInitialized = true;
    } catch (e) {
      // Graceful fallback to offline/mock database
      _isInitialized = false;
    }
  }

  SupabaseClient? get client => _isInitialized ? Supabase.instance.client : null;

  /// Fetch technicians from Supabase PostgreSQL
  Future<List<Partner>> getPartners({String? category}) async {
    if (client == null) return [];
    try {
      var query = client!.from('partners').select();
      if (category != null && category.isNotEmpty && category != 'All') {
        query = query.ilike('specialty', '%$category%');
      }
      final response = await query.order('rating', ascending: false);
      return (response as List).map((json) => Partner.fromJson(json)).toList();
    } catch (e) {
      return [];
    }
  }

  /// Create a new booking
  Future<bool> createBooking({
    required String serviceTitle,
    required String partnerId,
    required String address,
    required double amount,
  }) async {
    if (client == null) return true; // Handled locally in mock mode
    try {
      await client!.from('jobs').insert({
        'service_title': serviceTitle,
        'partner_id': partnerId,
        'address': address,
        'amount': amount,
        'status': 'pending',
        'created_at': DateTime.now().toIso8601String(),
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Send Phone OTP for Indian numbers (+91)
  Future<bool> sendPhoneOtp(String phoneNumber) async {
    if (client == null) return false;
    try {
      await client!.auth.signInWithOtp(
        phone: '+91$phoneNumber',
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}
