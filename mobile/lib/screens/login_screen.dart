import 'package:flutter/material.dart';
import 'dashboard_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  String _accountType = 'Organisation'; // 'Organisation' or 'Individual Person'
  bool _isSignUp = false;

  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  void _authenticate() {
    if (_formKey.currentState!.validate()) {
      // Simulate successful login / sign up
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => DashboardScreen(
            username: _usernameController.text.isNotEmpty ? _usernameController.text : 'QualityInspector',
            email: _emailController.text,
            accountType: _accountType,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Icon(
                    Icons.eco,
                    size: 48,
                    color: Color(0xFF16A34A),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'AI-Based Universal Fruit & Vegetable Quality Grading System',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    _isSignUp ? 'Create a grading inspection account' : 'Sign in to access your inspection dashboard',
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Colors.grey, fontSize: 13),
                  ),
                  const SizedBox(height: 28),

                  // Account Type Selection
                  const Text(
                    'Select Account Type:',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: ChoiceChip(
                          label: const Text('Organisation'),
                          selected: _accountType == 'Organisation',
                          selectedColor: const Color(0xFFDCFCE7),
                          onSelected: (val) {
                            if (val) setState(() => _accountType = 'Organisation');
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ChoiceChip(
                          label: const Text('Individual Person'),
                          selected: _accountType == 'Individual Person',
                          selectedColor: const Color(0xFFDCFCE7),
                          onSelected: (val) {
                            if (val) setState(() => _accountType = 'Individual Person');
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Input 1: Username
                  if (_isSignUp) ...[
                    TextFormField(
                      controller: _usernameController,
                      decoration: const InputDecoration(
                        labelText: 'Username',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.person_outline),
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Please enter a username' : null,
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Input 2: Email ID
                  TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: 'Email ID',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.email_outlined),
                    ),
                    validator: (val) {
                      if (val == null || val.isEmpty) return 'Please enter your email';
                      if (!val.contains('@')) return 'Enter a valid email address';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Input 3: Password
                  TextFormField(
                    controller: _passwordController,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: 'Password',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.lock_outline),
                    ),
                    validator: (val) => val == null || val.length < 6 ? 'Password must be >= 6 characters' : null,
                  ),
                  const SizedBox(height: 24),

                  // Submit Button
                  ElevatedButton(
                    onPressed: _authenticate,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF16A34A),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: Text(_isSignUp ? 'Sign Up' : 'Login'),
                  ),
                  const SizedBox(height: 16),

                  // Switch between Login and Sign Up
                  TextButton(
                    onPressed: () => setState(() => _isSignUp = !_isSignUp),
                    child: Text(
                      _isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up",
                      style: const TextStyle(color: Color(0xFF16A34A)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
