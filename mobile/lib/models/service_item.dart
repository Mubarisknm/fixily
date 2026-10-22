class ServiceItem {
  final String id;
  final String title;
  final String category;
  final String iconName;
  final double basePrice;
  final String description;
  final String estimatedTime;

  ServiceItem({
    required this.id,
    required this.title,
    required this.category,
    required this.iconName,
    required this.basePrice,
    required this.description,
    required this.estimatedTime,
  });

  factory ServiceItem.fromJson(Map<String, dynamic> json) {
    return ServiceItem(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      iconName: json['iconName']?.toString() ?? 'build',
      basePrice: (json['basePrice'] as num?)?.toDouble() ?? 299.0,
      description: json['description']?.toString() ?? '',
      estimatedTime: json['estimatedTime']?.toString() ?? '45 mins',
    );
  }
}
