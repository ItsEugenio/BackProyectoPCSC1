import User from "../models/Users";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Algo fallo al solicitar las tareas",
    });
  }
};

export const findOneUser = async (req, res) => {
  const userF = req.params.user;
  try {
    const usuario = await User.findOne({ user: userF });
    if (!usuario)
      return res
        .status(404)
        .json({ massage: `La tarea con este id ${userF} no existe` });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      message:
        error.message || `Algo fallo al solicitar la tarea con el id ${userF}`,
    });
  }
};

export const createUser = async (req, res) => {
  if (!req.body.user && !req.body.password) {
    return res
      .status(400)
      .send({ message: "El contenido no puede estas vacio" });
  }

  try {
    const newUser = new User({
      user: req.body.user,
      password: req.body.password,
    });
    const userSaved = await newUser.save();

    res.json(userSaved);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Algo fallo al crear la tarea",
    });
  }
};


export const loginUser = async (req, res) => {
  if (!req.body.user && !req.body.password) {
    return res
      .status(400)
      .send({ message: "El contenido no puede estas vacio" });
  }

  const { username, password } = req.body;

  try {
    // Busca al usuario en la base de datos
    const user = await User.findOne({ username, password });

    // Verifica si el usuario existe y la contraseña es correcta
    if (user) {
      res.status(200).json({ message: 'Login exitoso' });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({
      message: "Usuario eliminida correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || `Algo fallo al eliminar al usuario con el id ${id}`,
    });
  }
};
