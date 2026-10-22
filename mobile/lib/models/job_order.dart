class JobOrder {
  final String id;
  final String serviceTitle;
  final String category;
  final String partnerName;
  final String partnerPhone;
  final double amount;
  final String status; // 'pending' | 'in_progress' | 'completed' | 'cancelled'
  final String address;
  final String scheduledTime;
  final String eta;

  JobOrder({
    required this.id,
    required this.serviceTitle,
    required this.category,
    required this.partnerName,
    required this.partnerPhone,
    required this.amount,
    required this.status,
    required this.address,
    required this.scheduledTime,
    required this.eta,
  });

  factory JobOrder.fromJson(Map<String, dynamic> json) {
    return JobOrder(
      id: json['id']?.toString() ?? '',
      serviceTitle: json['serviceTitle']?.toString() ?? 'Home Service',
      category: json['category']?.toString() ?? 'General',
      partnerName: json['partnerName']?.toString() ?? 'Assigned Partner',
      partnerPhone: json['partnerPhone']?.toString() ?? '+919876543210',
      amount: (json['amount'] as num?)?.toDouble() ?? 499.0,
      status: json['status']?.toString() ?? 'pending',
      address: json['address']?.toString() ?? 'Kakkanad, Kochi',
      scheduledTime: json['scheduledTime']?.toString() ?? 'Today',
      eta: json['eta']?.toString() ?? '25 mins',
    );
  }
}
