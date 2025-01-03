import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json()); // Para poder recibir datos JSON

// Simulando una base de datos de usuarios
let users = []; // En un caso real, aquí iría una base de datos

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario ya existe
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Usuario ya existe' });
  }

  // Hash del password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guardar el nuevo usuario
  const newUser = { email, password: hashedPassword };
  users.push(newUser);

  // Crear el token JWT
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({ token });
});

// Ruta para login (iniciar sesión)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Buscar al usuario
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Usuario no encontrado' });
  }

  // Verificar el password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Contraseña incorrecta' });
  }

  // Crear el token JWT
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// Ruta protegida que requiere autenticación
app.get('/profile', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    res.json({ message: 'Acceso concedido', email: decoded.email });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
