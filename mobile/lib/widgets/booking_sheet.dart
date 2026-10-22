import 'package:flutter/material.dart';
import '../models/partner.dart';
import '../core/theme.dart';

class BookingSheet extends StatefulWidget {
  final Partner partner;
  final VoidCallback onBookingConfirmed;

  const BookingSheet({
    Key? key,
    required this.partner,
    required this.onBookingConfirmed,
  }) : super(key: key);

  @override
  State<BookingSheet> createState() => _BookingSheetState();
}

class _BookingSheetState extends State<BookingSheet> {
  final TextEditingController _addressController =
      TextEditingController(text: 'Flat 4B, Skyline Ivy League, Kakkanad');
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        top: 20,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
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
          Text(
            'Confirm Booking with ${widget.partner.name}',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: FykziTheme.darkNavy,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            widget.partner.specialty,
            style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 16),

          // Price Summary Box
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.blue.shade100),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Standard Inspection & Visit',
                  style: TextStyle(fontWeight: FontWeight.w600, color: FykziTheme.darkNavy),
                ),
                Text(
                  '₹${widget.partner.hourlyRate.toInt()}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: FykziTheme.primaryBlue,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          const Text(
            'Doorstep Service Address',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: FykziTheme.darkNavy),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: _addressController,
            decoration: InputDecoration(
              hintText: 'Enter house/building & street',
              prefixIcon: const Icon(Icons.home_outlined),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
          ),
          const SizedBox(height: 20),

          // Confirm Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: _isLoading
                  ? null
                  : () {
                      setState(() => _isLoading = true);
                      Future.delayed(const Duration(milliseconds: 600), () {
                        widget.onBookingConfirmed();
                        Navigator.pop(context);
                      });
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: FykziTheme.emeraldGreen,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text(
                      'Confirm Doorstep Booking',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
