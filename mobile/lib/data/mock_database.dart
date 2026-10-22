import '../models/partner.dart';
import '../models/service_item.dart';
import '../models/kochi_location.dart';
import '../models/job_order.dart';

class MockDatabase {
  static final List<KochiLocation> locations = [
    KochiLocation(id: 'loc-1', name: 'Kakkanad (Infopark)', pin: '682030', lat: 10.0159, lng: 76.3419),
    KochiLocation(id: 'loc-2', name: 'Kaloor (JLN Stadium)', pin: '682017', lat: 9.9984, lng: 76.2999),
    KochiLocation(id: 'loc-3', name: 'Fort Kochi', pin: '682001', lat: 9.9658, lng: 76.2421),
    KochiLocation(id: 'loc-4', name: 'MG Road / Ravipuram', pin: '682016', lat: 9.9678, lng: 76.2862),
    KochiLocation(id: 'loc-5', name: 'Edappally (Lulu Mall)', pin: '682024', lat: 10.0261, lng: 76.3082),
    KochiLocation(id: 'loc-6', name: 'Aluva Metro Station', pin: '683101', lat: 10.1076, lng: 76.3516),
  ];

  static final List<ServiceItem> services = [
    ServiceItem(
      id: 'srv-ac',
      title: 'AC Repair & Deep Cleaning',
      category: 'AC',
      iconName: 'ac_unit',
      basePrice: 599.0,
      description: 'Filter wash, gas pressure check, cooling coil sanitization.',
      estimatedTime: '45-60 mins',
    ),
    ServiceItem(
      id: 'srv-elec',
      title: 'Electrical Short Circuit & Wiring',
      category: 'Electrician',
      iconName: 'bolt',
      basePrice: 349.0,
      description: 'MCB tripping, switchboard replacement, fan regulator fix.',
      estimatedTime: '30 mins',
    ),
    ServiceItem(
      id: 'srv-plumb',
      title: 'Emergency Plumbing & Leak Fix',
      category: 'Plumber',
      iconName: 'water_drop',
      basePrice: 299.0,
      description: 'Pipe leakage, tap replacement, wash basin blockage.',
      estimatedTime: '30-45 mins',
    ),
    ServiceItem(
      id: 'srv-bike',
      title: 'Doorstep Bike Service & Oil Change',
      category: 'Bike Doctor',
      iconName: 'two_wheeler',
      basePrice: 499.0,
      description: 'Engine oil top-up, brake check, chain lubrication & wash.',
      estimatedTime: '60 mins',
    ),
    ServiceItem(
      id: 'srv-carp',
      title: 'Carpentry & Furniture Assembly',
      category: 'Carpenter',
      iconName: 'handyman',
      basePrice: 449.0,
      description: 'Hinge repair, lock installation, modular shelf assembly.',
      estimatedTime: '45 mins',
    ),
  ];

  static final List<Partner> partners = [
    // AC Specialists
    Partner(
      id: 'p-103',
      name: 'Rajesh K. Nair',
      rating: 4.96,
      jobsCompleted: 98,
      specialty: 'AC Repair, Gas Refill & Jet Cleaning',
      hourlyRate: 599.0,
      avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
      isVerified: true,
      locationArea: 'Kaloor, Kochi',
      phone: '+919447123456',
    ),
    Partner(
      id: 'p-104',
      name: 'Harikrishnan K.',
      rating: 4.88,
      jobsCompleted: 64,
      specialty: 'Inverter AC Specialist & Coil Service',
      hourlyRate: 549.0,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      isVerified: true,
      locationArea: 'Kakkanad, Kochi',
      phone: '+919447234567',
    ),
    Partner(
      id: 'p-105',
      name: 'Faizal Rahman',
      rating: 4.79,
      jobsCompleted: 41,
      specialty: 'AC Installation, Uninstallation & Diagnostics',
      hourlyRate: 499.0,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isVerified: true,
      locationArea: 'Edappally, Kochi',
      phone: '+919447345678',
    ),

    // Electricians
    Partner(
      id: 'p-101',
      name: 'Rajesh Kumar',
      rating: 4.94,
      jobsCompleted: 87,
      specialty: 'Certified Master Electrician & Smart Meters',
      hourlyRate: 399.0,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      isVerified: true,
      locationArea: 'Kaloor, Kochi',
      phone: '+919447456789',
    ),
    Partner(
      id: 'p-106',
      name: 'Biju Varghese',
      rating: 4.85,
      jobsCompleted: 58,
      specialty: 'Wiring, Inverter Setup & Fuse Board Specialist',
      hourlyRate: 349.0,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      isVerified: true,
      locationArea: 'MG Road, Kochi',
      phone: '+919447567890',
    ),

    // Plumbers
    Partner(
      id: 'p-102',
      name: 'Suresh Babu',
      rating: 4.91,
      jobsCompleted: 76,
      specialty: 'Sanitary Fittings & Underground Leak Detection',
      hourlyRate: 349.0,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      isVerified: true,
      locationArea: 'Fort Kochi',
      phone: '+919447678901',
    ),

    // Bike Doctor
    Partner(
      id: 'p-107',
      name: 'Akhil Mohan',
      rating: 4.93,
      jobsCompleted: 72,
      specialty: 'Two-Wheeler Roadside Repair & Engine Tuning',
      hourlyRate: 449.0,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isVerified: true,
      locationArea: 'Kakkanad, Kochi',
      phone: '+919447789012',
    ),
  ];

  static final List<JobOrder> orders = [
    JobOrder(
      id: 'ORD-7291',
      serviceTitle: 'Split AC Deep Cleaning (1.5 Ton)',
      category: 'AC',
      partnerName: 'Rajesh K. Nair',
      partnerPhone: '+919447123456',
      amount: 599.0,
      status: 'in_progress',
      address: 'Skyline Ivy League, Kakkanad, Kochi',
      scheduledTime: 'Today, 2:30 PM',
      eta: '12 mins away',
    ),
  ];

  /// Get specialist partners sorted by composite score: (rating * 100) + (jobs * 0.8)
  static List<Partner> getSpecialistsForQuery(String query) {
    if (query.isEmpty) {
      final list = List<Partner>.from(partners);
      list.sort((a, b) => b.rankingScore.compareTo(a.rankingScore));
      return list;
    }

    final lower = query.toLowerCase();
    String targetCategory = '';
    if (lower.contains('ac') || lower.contains('air') || lower.contains('cool')) {
      targetCategory = 'AC';
    } else if (lower.contains('elect') || lower.contains('wire') || lower.contains('light')) {
      targetCategory = 'Electrician';
    } else if (lower.contains('plumb') || lower.contains('water') || lower.contains('pipe')) {
      targetCategory = 'Plumber';
    } else if (lower.contains('bike') || lower.contains('motor') || lower.contains('scoot')) {
      targetCategory = 'Bike';
    }

    final matched = partners.where((p) {
      if (targetCategory.isNotEmpty) {
        return p.specialty.toLowerCase().contains(targetCategory.toLowerCase());
      }
      return p.name.toLowerCase().contains(lower) || p.specialty.toLowerCase().contains(lower);
    }).toList();

    matched.sort((a, b) => b.rankingScore.compareTo(a.rankingScore));
    return matched;
  }
}
