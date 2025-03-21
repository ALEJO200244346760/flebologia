import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Crear token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Registro
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ msg: 'El usuario ya existe' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashedPassword, role });
  await user.save();

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user)
  });
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ msg: 'Contraseña incorrecta' });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user)
  });
};

// Listar todos (admin)
export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Actualizar usuario (admin)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { name, email, role },
    { new: true }
  );
  res.json(updatedUser);
};
