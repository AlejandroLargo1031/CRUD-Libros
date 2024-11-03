const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();

// Midelware
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;

try {
  mongoose.connect(mongoUri);
  console.log("Conectado a MongoDB");
} catch (error) {
  console.error("Error al conectar a MongoDB", error);
  process.exit(1);
}

const librosSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
});

const Libro = mongoose.model("Libro", librosSchema);

// Rutas de la API

// Crear libro
app.post("/Libros", async (req, res) => {
  const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor,
  });
  try {
    await libro.save();
    res.json(libro);
  } catch (error) {
    res.status(error.status).send("Error saving");
  }
});

//Traer Libros

app.get("/Libros", async (req, res) => {
  try {
    const libros = await Libro.find({});
    res.json(libros);
  } catch (error) {
    res.status(error.status).send("Error fetching");
  }
});

//midelware
const miTokenSecreto123 = "miTokenSecreto123"
app.use((req, res, next) => {
  const authToken = req.headers["authorization"];;

  if ((authToken === miTokenSecreto123)) {
    next();
  } else {
    res.status(401).send("Acceso denegado");
  }
});

// Crear libro
app.post("/Libros", async (req, res) => {
  const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor,
  });
  try {
    await libro.save();
    res.json(libro);
  } catch (error) {
    res.status(error.status).send("Error saving");
  }
});

// Eliminar libro 

app.delete("/Libros/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const libro = await Libro.findByIdAndDelete(id);
    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  }catch (error){
    res.status(error.status).send("Error deleting");
  }
})

// traer un Libro por id

app.get("/Libros/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const libro = await Libro.findById(id);

    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("libro no encontrado");
    }
  } catch (err) {
    res.status(err.status).send("Error fetching");
  }
});

// actualizar datos de un libro

app.put("/Libros/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const libro = await Libro.findByIdAndUpdate(
      id,
      {
        titulo: req.body.titulo,
        autor: req.body.autor,
      },
      { new: true }
    );

    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("libro no encontrado");
    }
  } catch (err) {
    res.status(err.status).send("server error: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto http://localhost:3000");
});
