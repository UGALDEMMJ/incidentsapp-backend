import { prisma } from "../config/db";
import { hashearPassword, verifyPassword } from "../helpers/hashearPassword";
import { Usuarios, usuarioEmpty, usuarioDTO } from "../types/Usuarios";
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

const crearUsuarioService = async (data: usuarioDTO)=> {

    const { correo, username, password_hash } = data;

    const usuarioExiste = await getUsuarioByEmailService(data.correo || "");

    if (usuarioExiste) {
        throw new Error("El usuario ya existe");
    }

    const hashContrasenna = password_hash ? await hashearPassword(password_hash) : "";

    if (correo === "" || username === "") {
        throw new Error("Correo y username son obligatorios");
    }
    const usuario = await prisma.usuarios.create({
        data: {
            correo : correo || "",
            username : username || "",
            password_hash: hashContrasenna || "",
            nombrecompleto: data.nombrecompleto || "",
        }
    });

    const tokenVerificacion = await generarJWTSignUp({ id: usuario.id_usuario });
    const urlVerificacion = `${process.env.FRONTEND_URL}/verificar/${tokenVerificacion}`;
    console.log(`Enlace de verificación: ${urlVerificacion}`);
}

const actualizarUsuarioService = async (data: usuarioDTO) => {
    const { correo, nombrecompleto, username, password_hash, id_usuario } = data;
    const usuarioExistente = await getUsuarioService(data.id_usuario || "");

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

    const userUsername = await prisma.usuarios.findUnique({
        where: { username }
    });

    if (userUsername && userUsername.id_usuario !== id_usuario) {
        throw new Error("El nombre de usuario ya está en uso");
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

const eliminarUsuarioService = async (data: usuarioDTO): Promise<void> => {

    const { id_usuario } = data;
    await prisma.usuarios.delete({
        where: { id_usuario }
    });
};

const verificarUsuarioService = async (token:string): Promise<void> => {

    const verificar = await verificarJWT(token);
    const id_usuario = verificar?.id;

    await prisma.usuarios.update({
        where: { id_usuario },
        data: { enable: true }
    });
    console.log(`Usuario con ID ${id_usuario} verificado correctamente`);
};

const manejoLoginService = async (data: usuarioDTO) => {
    const { correo, password_hash } = data;

    try {
        const usuario = await getUsuarioByEmailService(data.correo || "");
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        if (!usuario.enable) {
            throw new Error("Usuario no ha sido verificado");
        }

        if (usuario.password_hash) {
            const contrasennaValida = await verifyPassword(password_hash || "", usuario.password_hash || "");
            if (!contrasennaValida) {
                throw new Error("Credenciales incorrectas");
            }
        }

        const tokenLogin = generarJWT({ id: usuario.id_usuario });
        return {
            message: "Token de login generado correctamente",
            token: tokenLogin
        };
    } catch (error: any) {
        throw new Error(`Error en el manejo de login: ${error.message}`);
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