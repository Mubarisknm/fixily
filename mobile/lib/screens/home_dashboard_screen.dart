import 'package:flutter/material.dart';
import '../models/kochi_location.dart';
import '../models/partner.dart';
import '../data/mock_database.dart';
import '../core/theme.dart';
import '../widgets/technician_card.dart';
import '../widgets/location_selector_sheet.dart';
import '../widgets/booking_sheet.dart';

class HomeDashboardScreen extends StatefulWidget {
  final VoidCallback onNavigateToOrders;

  const HomeDashboardScreen({Key? key, required this.onNavigateToOrders}) : super(key: key);

  @override
  State<HomeDashboardScreen> createState() => _HomeDashboardScreenState();
}

class _HomeDashboardScreenState extends State<HomeDashboardScreen> {
  KochiLocation _selectedLocation = MockDatabase.locations[0]; // Kakkanad default
  String _searchQuery = '';
  String _selectedCategory = 'All';
  final TextEditingController _searchController = TextEditingController();

  final List<String> _categories = [
    'All',
    'AC Repair',
    'Electrician',
    'Plumber',
    'Bike Doctor',
  ];

  @override
  Widget build(BuildContext context) {
    final specialists = MockDatabase.getSpecialistsForQuery(
      _selectedCategory != 'All' ? _selectedCategory : _searchQuery,
    );

    return Scaffold(
      backgroundColor: FykziTheme.backgroundLight,
      appBar: AppBar(
        titleSpacing: 16,
        backgroundColor: Colors.white,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'FYKZI KERALA',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.2,
                color: FykziTheme.primaryBlue,
              ),
            ),
            InkWell(
              onTap: () {
                showModalBottomSheet(
                  context: context,
                  isScrollControlled: true,
                  backgroundColor: Colors.transparent,
                  builder: (context) => LocationSelectorSheet(
                    selectedLocation: _selectedLocation,
                    onLocationSelected: (loc) => setState(() => _selectedLocation = loc),
                  ),
                );
              },
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.location_on, size: 16, color: FykziTheme.primaryBlue),
                  const SizedBox(width: 4),
                  Text(
                    _selectedLocation.name,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: FykziTheme.darkNavy,
                    ),
                  ),
                  const Icon(Icons.keyboard_arrow_down, size: 18, color: Colors.grey),
                ],
              ),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Live Active Orders Banner
            if (MockDatabase.orders.isNotEmpty)
              Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E3A8A), Color(0xFF2563EB)],
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: FykziTheme.primaryBlue.withOpacity(0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    )
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.bolt, color: Colors.amberAccent, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Technician En Route • 12 mins',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            MockDatabase.orders[0].serviceTitle,
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.9),
                              fontSize: 12,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: widget.onNavigateToOrders,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: FykziTheme.primaryBlueDark,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('Track Live', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),

            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: TextField(
                controller: _searchController,
                onChanged: (val) {
                  setState(() {
                    _searchQuery = val;
                    if (val.isNotEmpty) _selectedCategory = 'All';
                  });
                },
                decoration: InputDecoration(
                  hintText: 'Search "AC mechanic", "Electrician", "Plumber"...',
                  hintStyle: TextStyle(fontSize: 14, color: Colors.grey.shade500),
                  prefixIcon: const Icon(Icons.search, color: FykziTheme.primaryBlue),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, size: 18),
                          onPressed: () {
                            _searchController.clear();
                            setState(() => _searchQuery = '');
                          },
                        )
                      : null,
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(color: Colors.grey.shade200),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(color: Colors.grey.shade200),
                  ),
                ),
              ),
            ),

            // Category Filter Pills
            SizedBox(
              height: 48,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: _categories.length,
                itemBuilder: (context, index) {
                  final cat = _categories[index];
                  final isSelected = cat == _selectedCategory && _searchQuery.isEmpty;
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: ChoiceChip(
                      label: Text(cat),
                      selected: isSelected,
                      labelStyle: TextStyle(
                        fontSize: 13,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                        color: isSelected ? Colors.white : FykziTheme.darkNavy,
                      ),
                      selectedColor: FykziTheme.primaryBlue,
                      backgroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                        side: BorderSide(
                          color: isSelected ? FykziTheme.primaryBlue : Colors.grey.shade200,
                        ),
                      ),
                      onSelected: (_) {
                        setState(() {
                          _selectedCategory = cat;
                          _searchQuery = '';
                          _searchController.clear();
                        });
                      },
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 16),

            // Top Rated Specialists Section Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _selectedCategory != 'All'
                            ? 'Top $_selectedCategory Specialists'
                            : (_searchQuery.isNotEmpty
                                ? 'Specialists for "$_searchQuery"'
                                : 'Top Rated Specialists'),
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: FykziTheme.darkNavy,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Ranked by verified rating & jobs completed',
                        style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                      ),
                    ],
                  ),
                  Text(
                    '${specialists.length} available',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: FykziTheme.emeraldGreen,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 8),

            // Specialist Cards List
            if (specialists.isEmpty)
              Padding(
                padding: const EdgeInsets.all(32),
                child: Center(
                  child: Text(
                    'No specialists found. Try another search.',
                    style: TextStyle(color: Colors.grey.shade600),
                  ),
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: specialists.length,
                itemBuilder: (context, index) {
                  final partner = specialists[index];
                  return TechnicianCard(
                    partner: partner,
                    onBook: () {
                      showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        backgroundColor: Colors.transparent,
                        builder: (context) => BookingSheet(
                          partner: partner,
                          onBookingConfirmed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('✅ Booking confirmed with ${partner.name}!'),
                                backgroundColor: FykziTheme.emeraldGreen,
                              ),
                            );
                            widget.onNavigateToOrders();
                          },
                        ),
                      );
                    },
                  );
                },
              ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
