class Partner {
  final String id;
  final String name;
  final double rating;
  final int jobsCompleted;
  final String specialty;
  final double hourlyRate;
  final String avatarUrl;
  final bool isVerified;
  final String locationArea;
  final String phone;

  Partner({
    required this.id,
    required this.name,
    required this.rating,
    required this.jobsCompleted,
    required this.specialty,
    required this.hourlyRate,
    required this.avatarUrl,
    required this.isVerified,
    required this.locationArea,
    required this.phone,
  });

  /// Matching score algorithm: (rating * 100) + (jobsCompleted * 0.8)
  double get rankingScore => (rating * 100) + (jobsCompleted * 0.8);

  factory Partner.fromJson(Map<String, dynamic> json) {
    return Partner(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 5.0,
      jobsCompleted: (json['jobsCompleted'] as num?)?.toInt() ?? 0,
      specialty: json['specialty']?.toString() ?? '',
      hourlyRate: (json['hourlyRate'] as num?)?.toDouble() ?? 399.0,
      avatarUrl: json['avatarUrl']?.toString() ?? '',
      isVerified: json['isVerified'] == true,
      locationArea: json['locationArea']?.toString() ?? 'Kochi',
      phone: json['phone']?.toString() ?? '+919876543210',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'rating': rating,
      'jobsCompleted': jobsCompleted,
      'specialty': specialty,
      'hourlyRate': hourlyRate,
      'avatarUrl': avatarUrl,
      'isVerified': isVerified,
      'locationArea': locationArea,
      'phone': phone,
    };
  }
}
