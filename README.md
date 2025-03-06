# 📱 Face Recognition & Authentication App

## 🔍 Overview

This mobile application provides secure biometric authentication through facial recognition, combined with Twilio OTP verification for enhanced security. Built with React Native and powered by a Python-based AI facial recognition system, this app offers a seamless interface for user verification against an Oracle database.

## ✨ Features

- 📸 Capture photos directly through device camera
- 🖼️ Upload existing photos from device storage
- 👤 Advanced facial recognition using Python AI model
- 🔐 Two-factor authentication with Twilio SMS OTP
- 💾 Secure Oracle database integration
- 🆔 Unique digital ID proof generation
- 📱 Cross-platform support (iOS & Android)

## 🛠️ Tech Stack

### Frontend
- React Native (with Expo)
- React Navigation
- Expo Camera & Image Picker
- Axios for API communication

### Backend
- Flask Python server
- Face Recognition API
- Node.js server for authentication
- Twilio API integration
- Oracle Database

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- Python (v3.8 or higher)
- Expo CLI
- Oracle Database instance

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/face-recognition-app.git
cd face-recognition-app
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
pip install -r requirements.txt
```

4. Configure environment variables
```bash
# Create .env file in root directory
touch .env

# Add the following variables:
ORACLE_CONNECTION_STRING=your_connection_string
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

5. Start the servers
```bash
# Start Flask server
cd server
python app.py

# Start Node.js server
cd ../auth-server
npm start

# Start React Native app
cd ..
expo start
```

## 📱 App Flow

1. **Registration**
   - User enters phone number
   - OTP verification via Twilio
   - Face capture/upload
   - Creation of facial recognition profile
   - Unique ID generated

2. **Login**
   - Phone number input
   - OTP verification
   - Face verification
   - Access to dashboard upon successful verification

3. **Dashboard**
   - Display unique ID proof
   - Access to app features
   - Profile management

## 🔒 Security Features

- Face recognition model trained to prevent spoofing
- End-to-end encryption for data transfer
- Secure storage of biometric data
- Two-factor authentication (face + OTP)

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server
pytest
```

## 📚 API Documentation

### Face Recognition Endpoints
- `POST /api/recognize`: Compare uploaded face with database
- `POST /api/register`: Register new face in database

### Authentication Endpoints
- `POST /auth/send-otp`: Send OTP to phone number
- `POST /auth/verify-otp`: Verify received OTP
- `POST /auth/generate-id`: Generate unique ID

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [Your Name](https://github.com/yourusername)

## 🙏 Acknowledgments

- Face Recognition library
- Twilio API
- Oracle Database
- React Native community
