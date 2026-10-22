import 'package:flutter/material.dart';
import '../data/mock_database.dart';
import '../core/theme.dart';
import '../widgets/booking_sheet.dart';

class ServicesScreen extends StatelessWidget {
  final VoidCallback onNavigateToOrders;

  const ServicesScreen({Key? key, required this.onNavigateToOrders}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: FykziTheme.backgroundLight,
      appBar: AppBar(
        title: const Text('All Kerala Services'),
        backgroundColor: Colors.white,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        itemCount: MockDatabase.services.length,
        itemBuilder: (context, index) {
          final service = MockDatabase.services[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: FykziTheme.primaryBlue.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.build_circle, color: FykziTheme.primaryBlue, size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              service.title,
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: FykziTheme.darkNavy,
                              ),
                            ),
                          ),
                          Text(
                            '₹${service.basePrice.toInt()}',
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: FykziTheme.primaryBlue,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        service.description,
                        style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(Icons.schedule, size: 14, color: Colors.grey.shade500),
                          const SizedBox(width: 4),
                          Text(
                            service.estimatedTime,
                            style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                          ),
                          const Spacer(),
                          TextButton(
                            onPressed: () {
                              final partner = MockDatabase.partners.firstWhere(
                                (p) => p.specialty.toLowerCase().contains(service.category.toLowerCase()),
                                orElse: () => MockDatabase.partners[0],
                              );
                              showModalBottomSheet(
                                context: context,
                                isScrollControlled: true,
                                backgroundColor: Colors.transparent,
                                builder: (context) => BookingSheet(
                                  partner: partner,
                                  onBookingConfirmed: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('✅ Doorstep service booked successfully!'),
                                        backgroundColor: FykziTheme.emeraldGreen,
                                      ),
                                    );
                                    onNavigateToOrders();
                                  },
                                ),
                              );
                            },
                            child: const Text('Book Service', style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
