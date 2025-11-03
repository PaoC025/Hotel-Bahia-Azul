import express from "express";
import Blog from "../models/Blog.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";
import { uploadSingle, getImageUrl } from "../middleware/uploadMiddleware.js";
import fs from "fs"; // 🔽 IMPORTAR para limpiar archivos

const router = express.Router();

// GET PÚBLICO - Cualquiera puede ver los posts del blog
router.get("/", async (req, res) => {
  try {
    const posts = await Blog.find({ publicado: true })
                          .populate('autorId', 'nombre email')
                          .sort({ fecha: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error obteniendo los posts:", error);
    res.status(500).json({ message: "Error al obtener los posts." });
  }
});

// 🔽 GET por ID - Obtener un post específico
router.get("/:id", async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate('autorId', 'nombre email');
    
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado." });
    }
    
    // Si no es público y el usuario no es admin, denegar acceso
    if (!post.publicado && (!req.user || req.user.rol !== 'admin')) {
      return res.status(403).json({ message: "Acceso denegado." });
    }
    
    res.json(post);
  } catch (error) {
    console.error("Error obteniendo el post:", error);
    res.status(500).json({ message: "Error al obtener el post." });
  }
});

// 🔽 POST PROTEGIDO - Solo admin puede crear posts CON IMAGEN
router.post("/", authenticateToken, requireAdmin, uploadSingle, async (req, res) => {
  try {
    const { titulo, contenido, autor, resumen, etiquetas, publicado } = req.body;
    
    // Validaciones
    if (!titulo || !contenido) {
      // Limpiar archivo si hay error de validación
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Error limpiando archivo:", unlinkError);
        }
      }
      return res.status(400).json({ message: "Título y contenido son obligatorios." });
    }

    // Procesar imagen subida
    let imagenUrl = '';
    if (req.file) {
      imagenUrl = getImageUrl(req.file.filename);
      console.log(`Imagen subida para post: ${titulo}`);
    }

    // Procesar etiquetas
    let etiquetasArray = [];
    if (etiquetas) {
      etiquetasArray = Array.isArray(etiquetas) 
        ? etiquetas 
        : etiquetas.split(',').map(item => item.trim()).filter(item => item !== '');
    }

    // Procesar booleano
    const estaPublicado = publicado === undefined ? true : (publicado === 'true' || publicado === true);

    const nuevoPost = new Blog({ 
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      imagen: imagenUrl,
      autor: autor || req.user.nombre,
      autorId: req.user._id,
      resumen: resumen ? resumen.trim() : contenido.substring(0, 200) + '...',
      etiquetas: etiquetasArray,
      publicado: estaPublicado
    });
    
    await nuevoPost.save();

    
    res.status(201).json({ 
      message: "Post creado correctamente.", 
      post: nuevoPost 
    });
    
  } catch (error) {
    console.error("Error creando post:", error);
    
    // Limpiar archivo si hay error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error limpiando archivo después del error:", unlinkError);
      }
    }
    
    res.status(500).json({ 
      message: "Error al crear el post.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 🔽 PUT PROTEGIDO - Actualizar post CON IMAGEN
router.put("/:id", authenticateToken, requireAdmin, uploadSingle, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, autor, resumen, etiquetas, publicado, mantenerImagen } = req.body;

    // Buscar post existente
    const postExistente = await Blog.findById(id);
    if (!postExistente) {
      // Limpiar archivo nuevo si el post no existe
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Error limpiando archivo:", unlinkError);
        }
      }
      return res.status(404).json({ message: "Post no encontrado." });
    }

    // Procesar nueva imagen subida
    let imagenUrl = postExistente.imagen;
    if (req.file) {
      imagenUrl = getImageUrl(req.file.filename);
      
      // 🔽 OPCIONAL: Eliminar imagen anterior si se sube una nueva
      // if (postExistente.imagen) {
      //   const oldFilename = postExistente.imagen.split('/').pop();
      //   const oldFilePath = path.join(__dirname, '../uploads', oldFilename);
      //   try {
      //     if (fs.existsSync(oldFilePath)) {
      //       fs.unlinkSync(oldFilePath);
      //     }
      //   } catch (unlinkError) {
      //     console.error("Error eliminando imagen anterior:", unlinkError);
      //   }
      // }
    } else if (mantenerImagen === 'false') {
      // Si se solicita eliminar la imagen
      imagenUrl = '';
    }

    // Procesar etiquetas
    let etiquetasArray = postExistente.etiquetas;
    if (etiquetas) {
      etiquetasArray = Array.isArray(etiquetas) 
        ? etiquetas 
        : etiquetas.split(',').map(item => item.trim()).filter(item => item !== '');
    }

    // Procesar booleano
    const estaPublicado = publicado !== undefined ? (publicado === 'true' || publicado === true) : postExistente.publicado;

    const postActualizado = await Blog.findByIdAndUpdate(
      id,
      {
        titulo: titulo ? titulo.trim() : postExistente.titulo,
        contenido: contenido ? contenido.trim() : postExistente.contenido,
        imagen: imagenUrl,
        autor: autor ? autor.trim() : postExistente.autor,
        resumen: resumen ? resumen.trim() : postExistente.resumen,
        etiquetas: etiquetasArray,
        publicado: estaPublicado
      },
      { new: true, runValidators: true }
    ).populate('autorId', 'nombre email');

    
    res.json({ 
      message: "Post actualizado correctamente.", 
      post: postActualizado 
    });
    
  } catch (error) {
    console.error("Error actualizando post:", error);
    
    // Limpiar archivo nuevo si hay error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error limpiando archivo después del error:", unlinkError);
      }
    }
    
    res.status(500).json({ 
      message: "Error al actualizar el post.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 🔽 DELETE PROTEGIDO - Eliminar post (y su imagen)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const postEliminado = await Blog.findByIdAndDelete(id);
    
    if (!postEliminado) {
      return res.status(404).json({ message: "Post no encontrado." });
    }

    // OPCIONAL: Eliminar archivo de imagen del servidor
    // if (postEliminado.imagen) {
    //   const filename = postEliminado.imagen.split('/').pop();
    //   const filePath = path.join(__dirname, '../uploads', filename);
    //   try {
    //     if (fs.existsSync(filePath)) {
    //       fs.unlinkSync(filePath);
    //     }
    //   } catch (unlinkError) {
    //     console.error("Error eliminando archivo de imagen:", unlinkError);
    //   }
    // }

    
    res.json({ 
      message: "Post eliminado correctamente." 
    });
    
  } catch (error) {
    console.error("Error eliminando post:", error);
    res.status(500).json({ message: "Error al eliminar el post." });
  }
});

// 🔽 GET PROTEGIDO - Obtener todos los posts (incluidos no publicados) - Solo admin
router.get("/admin/todos", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const posts = await Blog.find().populate('autorId', 'nombre email').sort({ fecha: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error obteniendo todos los posts:", error);
    res.status(500).json({ message: "Error al obtener los posts." });
  }
});

export default router;