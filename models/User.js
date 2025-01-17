const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'insurance', 'admin'], required: true },
  fullName: { type: String, required: true },
  phone: { type: String },
  dob: { type: Date, required: true },
  address: { type: String },
  medicalHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' }],
  permissions: [{ type: String }],
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  const payload = { id: this._id, role: this.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Update timestamp before saving
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
