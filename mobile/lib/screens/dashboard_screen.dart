import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  final String username;
  final String email;
  final String accountType;

  const DashboardScreen({
    super.key,
    required this.username,
    required this.email,
    required this.accountType,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AgriGrade AI'),
        actions: [
          // Top-right Dashboard Menu with exact items: Profile, Email, Settings, About, Help, Logout
          PopupMenuButton<String>(
            icon: const Icon(Icons.dashboard_customize_outlined),
            onSelected: (value) {
              if (value == 'logout') {
                Navigator.of(context).pop();
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Selected: $value')),
                );
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'profile',
                child: ListTile(
                  leading: Icon(Icons.person_outline),
                  title: Text('Profile'),
                ),
              ),
              PopupMenuItem<String>(
                value: 'email',
                enabled: false,
                child: ListTile(
                  leading: const Icon(Icons.email_outlined, color: Colors.green),
                  title: Text(email, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  subtitle: const Text('Authenticated Email ID', style: TextStyle(fontSize: 10)),
                ),
              ),
              const PopupMenuItem<String>(
                value: 'settings',
                child: ListTile(
                  leading: Icon(Icons.settings_outlined),
                  title: Text('Settings'),
                ),
              ),
              const PopupMenuItem<String>(
                value: 'about',
                child: ListTile(
                  leading: Icon(Icons.info_outline),
                  title: Text('About'),
                ),
              ),
              const PopupMenuItem<String>(
                value: 'help',
                child: ListTile(
                  leading: Icon(Icons.help_outline),
                  title: Text('Help'),
                ),
              ),
              const PopupMenuDivider(),
              const PopupMenuItem<String>(
                value: 'logout',
                child: ListTile(
                  leading: Icon(Icons.logout, color: Colors.red),
                  title: Text('Logout', style: TextStyle(color: Colors.red)),
                ),
              ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Center Prominent New Grading Card
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF16A34A), Color(0xFF0F766E)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'AI Quality Inspection',
                    style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Ready to Grade Produce?',
                    style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Take a picture or upload conveyor video to detect defects and assign Grade A, B, C, or Rejected.',
                    style: TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Opening Mobile Camera / Image Picker...')),
                      );
                    },
                    icon: const Icon(Icons.add_a_photo, color: Color(0xFF16A34A)),
                    label: const Text('New Grading', style: TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Section: Previous Grading History
            const Text(
              'Previous Grading History',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // History Card Example
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(color: Colors.grey.shade200),
              ),
              child: ListTile(
                leading: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.apple, color: Colors.redAccent),
                ),
                title: const Text('Apple Inspection · Grade A', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                subtitle: const Text('Defects: 0.8% area · Conf: 96%\nToday, 10:45 AM', style: TextStyle(fontSize: 12)),
                isThreeLine: true,
                trailing: IconButton(
                  icon: const Icon(Icons.picture_as_pdf, color: Color(0xFF16A34A)),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Downloading Grading Report PDF...')),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
