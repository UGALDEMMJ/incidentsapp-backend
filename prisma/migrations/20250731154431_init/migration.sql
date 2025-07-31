-- CreateTable
CREATE TABLE "public"."incidencias" (
    "id_incidencias" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_usuario" UUID NOT NULL,
    "nombre" VARCHAR(100),
    "descripcion" VARCHAR(200),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id_status" UUID NOT NULL,
    "id_prioridad" UUID NOT NULL,

    CONSTRAINT "incidencias_pkey" PRIMARY KEY ("id_incidencias")
);

-- CreateTable
CREATE TABLE "public"."prioridad" (
    "id_prioridad" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(50),
    "color" VARCHAR(20),

    CONSTRAINT "prioridad_pkey" PRIMARY KEY ("id_prioridad")
);

-- CreateTable
CREATE TABLE "public"."respondersporincidencia" (
    "id_incidencia" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,

    CONSTRAINT "respondersporincidencia_pkey" PRIMARY KEY ("id_incidencia","id_usuario")
);

-- CreateTable
CREATE TABLE "public"."rol" (
    "id_rol" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(100),
    "descripcion" VARCHAR(100),

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "public"."rolesporusuario" (
    "id_rol" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,

    CONSTRAINT "rolesporusuario_pkey" PRIMARY KEY ("id_rol","id_usuario")
);

-- CreateTable
CREATE TABLE "public"."status" (
    "id_status" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(100),

    CONSTRAINT "status_pkey" PRIMARY KEY ("id_status")
);

-- CreateTable
CREATE TABLE "public"."timeline" (
    "id_timeline" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_incidencia" UUID NOT NULL,
    "descripcion" VARCHAR(200),
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "prevstatus" UUID,
    "newstatus" UUID,
    "id_usuario" UUID NOT NULL,

    CONSTRAINT "timeline_pkey" PRIMARY KEY ("id_timeline")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id_usuario" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombrecompleto" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT false,
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "public"."watchersporincidencia" (
    "id_incidencia" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,

    CONSTRAINT "watchersporincidencia_pkey" PRIMARY KEY ("id_incidencia","id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "prioridad_nombre_key" ON "public"."prioridad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "status_nombre_key" ON "public"."status"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "public"."usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "public"."usuarios"("username");

-- AddForeignKey
ALTER TABLE "public"."incidencias" ADD CONSTRAINT "incidencias_id_prioridad_fkey" FOREIGN KEY ("id_prioridad") REFERENCES "public"."prioridad"("id_prioridad") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."incidencias" ADD CONSTRAINT "incidencias_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "public"."status"("id_status") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."incidencias" ADD CONSTRAINT "incidencias_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."respondersporincidencia" ADD CONSTRAINT "respondersporincidencia_id_incidencia_fkey" FOREIGN KEY ("id_incidencia") REFERENCES "public"."incidencias"("id_incidencias") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."respondersporincidencia" ADD CONSTRAINT "respondersporincidencia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."rolesporusuario" ADD CONSTRAINT "rolesporusuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."rol"("id_rol") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."rolesporusuario" ADD CONSTRAINT "rolesporusuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."timeline" ADD CONSTRAINT "timeline_id_incidencia_fkey" FOREIGN KEY ("id_incidencia") REFERENCES "public"."incidencias"("id_incidencias") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."timeline" ADD CONSTRAINT "timeline_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."timeline" ADD CONSTRAINT "timeline_newstatus_fkey" FOREIGN KEY ("newstatus") REFERENCES "public"."status"("id_status") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."timeline" ADD CONSTRAINT "timeline_prevstatus_fkey" FOREIGN KEY ("prevstatus") REFERENCES "public"."status"("id_status") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."watchersporincidencia" ADD CONSTRAINT "watchersporincidencia_id_incidencia_fkey" FOREIGN KEY ("id_incidencia") REFERENCES "public"."incidencias"("id_incidencias") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."watchersporincidencia" ADD CONSTRAINT "watchersporincidencia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;
