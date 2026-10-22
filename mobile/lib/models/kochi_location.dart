class KochiLocation {
  final String id;
  final String name;
  final String pin;
  final double lat;
  final double lng;
  final bool isServiced;

  KochiLocation({
    required this.id,
    required this.name,
    required this.pin,
    required this.lat,
    required this.lng,
    this.isServiced = true,
  });

  factory KochiLocation.fromJson(Map<String, dynamic> json) {
    return KochiLocation(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      pin: json['pin']?.toString() ?? '',
      lat: (json['lat'] as num?)?.toDouble() ?? 9.9816,
      lng: (json['lng'] as num?)?.toDouble() ?? 76.2999,
      isServiced: json['isServiced'] != false,
    );
  }
}
