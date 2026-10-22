import 'package:flutter/material.dart';
import '../models/kochi_location.dart';
import '../data/mock_database.dart';
import '../core/theme.dart';

class LocationSelectorSheet extends StatelessWidget {
  final KochiLocation selectedLocation;
  final ValueChanged<KochiLocation> onLocationSelected;

  const LocationSelectorSheet({
    Key? key,
    required this.selectedLocation,
    required this.onLocationSelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Select Kochi Micro-Market',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: FykziTheme.darkNavy,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Serving instant doorstep technicians across Ernakulam & Kochi',
            style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 16),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: MockDatabase.locations.length,
            separatorBuilder: (_, __) => Divider(height: 1, color: Colors.grey.shade100),
            itemBuilder: (context, index) {
              final loc = MockDatabase.locations[index];
              final isSelected = loc.id == selectedLocation.id;
              return ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isSelected ? FykziTheme.primaryBlue.withOpacity(0.1) : Colors.grey.shade100,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.location_on,
                    size: 20,
                    color: isSelected ? FykziTheme.primaryBlue : Colors.grey.shade700,
                  ),
                ),
                title: Text(
                  loc.name,
                  style: TextStyle(
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    color: isSelected ? FykziTheme.primaryBlue : FykziTheme.darkNavy,
                  ),
                ),
                subtitle: Text('PIN: ${loc.pin} • Express 15-min Dispatch'),
                trailing: isSelected
                    ? const Icon(Icons.check_circle, color: FykziTheme.primaryBlue)
                    : null,
                onTap: () {
                  onLocationSelected(loc);
                  Navigator.pop(context);
                },
              );
            },
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
