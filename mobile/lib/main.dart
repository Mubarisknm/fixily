import 'package:flutter/material.dart';
import 'core/theme.dart';
import 'screens/main_navigation_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const FykziApp());
}

class FykziApp extends StatelessWidget {
  const FykziApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fykzi Kerala',
      debugShowCheckedModeBanner: false,
      theme: FykziTheme.lightTheme,
      darkTheme: FykziTheme.darkTheme,
      themeMode: ThemeMode.light,
      home: const MainNavigationScreen(),
    );
  }
}
