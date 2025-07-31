import { prisma } from "../config/db";
import { hashearPassword, verifyPassword } from "../helpers/hashearPassword";
import { Usuarios, usuarioEmpty } from "../types/Usuarios";
import { generarJWT, generarJWTSignUp, verificarJWT } from "../helpers/generarJWT";
import { Request, Response } from "express";

const getUsuarioService = async (id_usuario: string): Promise<Usuarios | null> => {
    const usuario = await prisma.usuarios.findUnique({
        where: { id_usuario }
    });

    return usuario ? usuario : usuarioEmpty;
}


const getUsuariosService = async (): Promise<Usuarios[]> => {
    const usuarios = await prisma.usuarios.findMany();
    return usuarios ? usuarios : [];
}

const getUsuarioByEmailService = async (correo: string): Promise<Usuarios | null> => {
    const usuario = await prisma.usuarios.findUnique({
        where: { correo }
    });

    return usuario ? usuario : null;
}

const crearUsuarioService = async (req: Request, res: Response): Promise<void> => {

    const { correo, username, password_hash } = req.body;

    const usuarioExiste = await getUsuarioByEmailService(correo);

    if (usuarioExiste) {
        throw new Error("El usuario ya existe");
    }

    const hashContrasenna = password_hash ? await hashearPassword(password_hash) : "";

    if (correo === "" || username === "") {
        throw new Error("Correo y username son obligatorios");
    }
    const usuario = await prisma.usuarios.create({
        data: {
            correo,
            username,
            password_hash: hashContrasenna || "",
            nombrecompleto: username, // or set this to the appropriate value from req.body if available
        }
    });

    const tokenVerificacion = await generarJWTSignUp({ id: usuario.id_usuario });
    const urlVerificacion = `${process.env.FRONTEND_URL}/verificar/${tokenVerificacion}`;
    console.log(`Enlace de verificación: ${urlVerificacion}`);
}

const actualizarUsuarioService = async (req: Request, res: Response): Promise<Usuarios> => {
    const { id_usuario } = req.params;
    const { correo, nombrecompleto, username, password_hash } = req.body;
    const usuarioExistente = await getUsuarioService(id_usuario);

    if (!usuarioExistente) {
        throw new Error("Usuario no encontrado");
    }

    let hashContrasenna: string | undefined;
    if (password_hash) {
        hashContrasenna = await hashearPassword(password_hash);
        if (!hashContrasenna) {
            throw new Error("Error al hashear la contraseña");
        }
    }

    const usuario = await prisma.usuarios.update({
        where: { id_usuario },
        data: {
            correo: correo || usuarioExistente.correo,
            nombrecompleto: nombrecompleto || usuarioExistente.nombrecompleto,
            username: username || usuarioExistente.username,
            password_hash: hashContrasenna || usuarioExistente.password_hash,
        }
    });

    return usuario ? usuario : usuarioEmpty;
}

const eliminarUsuarioService = async (req: Request, res: Response): Promise<void> => {

    const { id_usuario } = req.params;
    await prisma.usuarios.delete({
        where: { id_usuario }
    });
};

const verificarUsuarioService = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;

    const verificar = await verificarJWT(token as string);
    const id_usuario = verificar?.id;

    await prisma.usuarios.update({
        where: { id_usuario },
        data: { enable: true }
    });

    res.status(200).json({ message: "Usuario verificado correctamente" });
};

const manejoLoginService = async (req: Request, res: Response): Promise<void> => {
    const { correo, password_hash } = req.body;

    try {
        const usuario = await getUsuarioByEmailService(correo);
        if (!usuario) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }

        if (!usuario.enable) {
            res.status(401).json({ error: "Usuario no ha sido verificado" });
            return;
        }

        if (usuario.password_hash) {
            const contrasennaValida = await verifyPassword(password_hash, usuario.password_hash);
            if (!contrasennaValida) {
                res.status(401).json({ error: "Credenciales incorrectas" });
                return;
            }
        }

        const tokenLogin = generarJWT({ id: usuario.id_usuario });
        res.status(200).json({
            message: "Token de login generado correctamente",
            token: tokenLogin
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// const manejoLogOutService = async (req: Request, res: Response): Promise<void> => {

//     const { id } = req.params;

//     await prisma.usuario.update({
//         where: { id: Number(id) },
//         data: { token: null }
//     });
// }



export {
    getUsuarioService,
    getUsuarioByEmailService,
    getUsuariosService,
    crearUsuarioService,
    actualizarUsuarioService,
    eliminarUsuarioService,
    verificarUsuarioService,
    manejoLoginService,
};