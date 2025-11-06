import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../api/axios";

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [notificacion, setNotificacion] = useState({
    open: false,
    mensaje: "",
    tipo: "success",
  });

  const token = localStorage.getItem("token");

  //  Cargar lista de usuarios
  const fetchUsuarios = async () => {
    try {
      const res = await axios.get("api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // El backend devuelve { message, users, total }
      setUsuarios(res.data.users || []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setNotificacion({
        open: true,
        mensaje: "Error cargando usuarios",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  //  Editar un usuario (toggle edición)
  const handleEditar = (id) => {
    setEditando((prev) => (prev === id ? null : id));
  };

  //  Cambiar rol o estado
  const handleChange = async (id, campo, valor) => {
    try {
      // Reflejar cambio en UI antes de llamar al backend
      const actualizado = usuarios.map((u) =>
        u._id === id ? { ...u, [campo]: valor } : u
      );
      setUsuarios(actualizado);

      // Llamar al endpoint correcto
      if (campo === "rol") {
        await axios.put(
          `/auth/users/${id}/role`,
          { rol: valor },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (campo === "activo") {
        await axios.put(
          `/auth/users/${id}/status`,
          { activo: valor === "activo" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setNotificacion({
        open: true,
        mensaje: "Usuario actualizado correctamente",
        tipo: "success",
      });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setNotificacion({
        open: true,
        mensaje: "Error al actualizar usuario",
        tipo: "error",
      });
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  //  Columnas del DataGrid
  const columnas = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "email", headerName: "Correo", flex: 1.5 },
    {
      field: "rol",
      headerName: "Rol",
      flex: 1,
      renderCell: (params) =>
        editando === params.row._id ? (
          <FormControl size="small" fullWidth>
            <Select
              value={params.row.rol}
              onChange={(e) =>
                handleChange(params.row._id, "rol", e.target.value)
              }
            >
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <Typography>{params.row.rol}</Typography>
        ),
    },
    {
      field: "activo",
      headerName: "Estado",
      flex: 1,
      renderCell: (params) =>
        editando === params.row._id ? (
          <FormControl size="small" fullWidth>
            <Select
              value={params.row.activo ? "activo" : "inactivo"}
              onChange={(e) =>
                handleChange(params.row._id, "activo", e.target.value)
              }
            >
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="inactivo">Inactivo</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <Typography
            color={params.row.activo ? "green" : "gray"}
            fontWeight={500}
          >
            {params.row.activo ? "Activo" : "Inactivo"}
          </Typography>
        ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditar(params.row._id)} color="primary">
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" mb={2}>
        👥 Gestión de Usuarios
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ height: 520, width: "100%" }}>
          <DataGrid
            rows={usuarios}
            getRowId={(row) => row._id}
            columns={columnas}
            pageSize={8}
            disableSelectionOnClick
          />
        </Box>
      )}

      <Snackbar
        open={notificacion.open}
        autoHideDuration={3000}
        onClose={() => setNotificacion({ ...notificacion, open: false })}
      >
        <Alert severity={notificacion.tipo}>{notificacion.mensaje}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UsuariosAdmin;

