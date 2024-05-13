/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     23/04/2024 11:56:53 p.�m.                    */
/*==============================================================*/


drop index MARCAVEHICULO_PK;

drop table MARCAVEHICULO;

drop index METODO_PAGO_PK;

drop table METODO_PAGO;

drop index PARQUEADEROTIPO_FK;

drop index PARQUEADERO_PK;

drop table PARQUEADERO;

drop index RESERVAUSUARIO_FK;

drop index DESCUENTO_FK;

drop index PAGORESERVA_FK;

drop index RESERVAPARQUEADERO_FK;

drop index VEHICULORESERVA_FK;

drop index RESERVA_PK;

drop table RESERVA;

drop index TIPODESCUENTO_PK;

drop table TIPODESCUENTO;

drop index TIPO_DOCUMENTO_PK;

drop table TIPO_DOCUMENTO;

drop index TIPO_PARQUEADERO_PK;

drop table TIPO_PARQUEADERO;

drop index TIPO_USUARIO_PK;

drop table TIPO_USUARIO;

drop index TIPO_VEHICULO_PK;

drop table TIPO_VEHICULO;

drop index USUARIODOC_FK;

drop index USUARIOTIPOUSUARIO_FK;

drop index USUARIO_PK;

drop table USUARIO;

drop index VEHICULOTIPO_FK;

drop index PARQUEA_A_FK;

drop index VEHICULOMARCA_FK;

drop index USUARIOVEHICULO_FK;

drop index VEHICULO_PK;

drop table VEHICULO;

/*==============================================================*/
/* Table: MARCAVEHICULO                                         */
/*==============================================================*/
create table MARCAVEHICULO (
   IDMARCA              INT4                 not null,
   NOMMARCA             VARCHAR(30)          not null,
   constraint PK_MARCAVEHICULO primary key (IDMARCA)
);

/*==============================================================*/
/* Index: MARCAVEHICULO_PK                                      */
/*==============================================================*/
create unique index MARCAVEHICULO_PK on MARCAVEHICULO (
IDMARCA
);

/*==============================================================*/
/* Table: METODO_PAGO                                           */
/*==============================================================*/
create table METODO_PAGO (
   IDMETODOPAGO         INT4                 not null,
   METODOPAGO           VARCHAR(25)          not null,
   constraint PK_METODO_PAGO primary key (IDMETODOPAGO)
);

/*==============================================================*/
/* Index: METODO_PAGO_PK                                        */
/*==============================================================*/
create unique index METODO_PAGO_PK on METODO_PAGO (
IDMETODOPAGO
);

/*==============================================================*/
/* Table: PARQUEADERO                                           */
/*==============================================================*/
CREATE TABLE PARQUEADERO (
   IDPARQUEADERO        VARCHAR(5)           NOT NULL,
   IDTIPOPARQUEADERO    INT4                 NOT NULL,
   NOMBREPARQUEADERO    VARCHAR(20)          NOT NULL,
   DIRECCION            VARCHAR(40)          NOT NULL,
   CAPACIDADTOTAL       INT4                 NOT NULL,
   CAPACIDADACTUAL      INT4                 NOT NULL,
   NUMEROCONTACTO       INT8                 NOT NULL,
   LATITUD              DOUBLE PRECISION     NOT NULL,  -- Campo para latitud
   ALTITUD              DOUBLE PRECISION     NOT NULL,  -- Campo para altitud
   CONSTRAINT PK_PARQUEADERO PRIMARY KEY (IDPARQUEADERO)
);

/*==============================================================*/
/* Index: PARQUEADERO_PK                                        */
/*==============================================================*/
create unique index PARQUEADERO_PK on PARQUEADERO (
IDPARQUEADERO
);

/*==============================================================*/
/* Index: PARQUEADEROTIPO_FK                                    */
/*==============================================================*/
create  index PARQUEADEROTIPO_FK on PARQUEADERO (
IDTIPOPARQUEADERO
);

/*==============================================================*/
/* Table: RESERVA                                               */
/*==============================================================*/
   create table RESERVA (
      NUMRESERVA           VARCHAR(25)          not null,
      IDVEHICULO           VARCHAR(5)           not null,
      IDMETODOPAGO         INT4                 not null,
      IDUSUARIO            VARCHAR(5)           not null,
      IDPARQUEADERO        VARCHAR(5)           not null,
      IDTIPODESCUENTO      INT4                 not null,
      MONTOTOTAL           INT8                 not null,
      DURACIONESTADIA      INT4                 not null,
      FECHARESERVA         TIMESTAMP            not null,
      constraint PK_RESERVA primary key (NUMRESERVA)
   );

/*==============================================================*/
/* Index: RESERVA_PK                                            */
/*==============================================================*/
create unique index RESERVA_PK on RESERVA (
NUMRESERVA
);

/*==============================================================*/
/* Index: VEHICULORESERVA_FK                                    */
/*==============================================================*/
create  index VEHICULORESERVA_FK on RESERVA (
IDVEHICULO
);

/*==============================================================*/
/* Index: RESERVAPARQUEADERO_FK                                 */
/*==============================================================*/
create  index RESERVAPARQUEADERO_FK on RESERVA (
IDPARQUEADERO
);

/*==============================================================*/
/* Index: PAGORESERVA_FK                                        */
/*==============================================================*/
create  index PAGORESERVA_FK on RESERVA (
IDMETODOPAGO
);

/*==============================================================*/
/* Index: DESCUENTO_FK                                          */
/*==============================================================*/
create  index DESCUENTO_FK on RESERVA (
IDTIPODESCUENTO
);

/*==============================================================*/
/* Index: RESERVAUSUARIO_FK                                     */
/*==============================================================*/
create  index RESERVAUSUARIO_FK on RESERVA (
IDUSUARIO
);

/*==============================================================*/
/* Table: TIPODESCUENTO                                         */
/*==============================================================*/
create table TIPODESCUENTO (
   IDTIPODESCUENTO      INT4                 not null,
   TIPODESCUENTO        VARCHAR(30)          not null,
   VALORDESCUENTO       INT4                 not null,
   constraint PK_TIPODESCUENTO primary key (IDTIPODESCUENTO)
);

/*==============================================================*/
/* Index: TIPODESCUENTO_PK                                      */
/*==============================================================*/
create unique index TIPODESCUENTO_PK on TIPODESCUENTO (
IDTIPODESCUENTO
);

/*==============================================================*/
/* Table: TIPO_DOCUMENTO                                        */
/*==============================================================*/
create table TIPO_DOCUMENTO (
   IDTIPODOCUMENTO      VARCHAR(3)           not null,
   NOMBRETIPODOCUMENTO  VARCHAR(35)          not null,
   constraint PK_TIPO_DOCUMENTO primary key (IDTIPODOCUMENTO)
);

/*==============================================================*/
/* Index: TIPO_DOCUMENTO_PK                                     */
/*==============================================================*/
create unique index TIPO_DOCUMENTO_PK on TIPO_DOCUMENTO (
IDTIPODOCUMENTO
);

/*==============================================================*/
/* Table: TIPO_PARQUEADERO                                      */
/*==============================================================*/
create table TIPO_PARQUEADERO (
   IDTIPOPARQUEADERO    INT4                 not null,
   TIPOPARQUEADERO      VARCHAR(20)          not null,
   constraint PK_TIPO_PARQUEADERO primary key (IDTIPOPARQUEADERO)
);

/*==============================================================*/
/* Index: TIPO_PARQUEADERO_PK                                   */
/*==============================================================*/
create unique index TIPO_PARQUEADERO_PK on TIPO_PARQUEADERO (
IDTIPOPARQUEADERO
);

/*==============================================================*/
/* Table: TIPO_USUARIO                                          */
/*==============================================================*/
create table TIPO_USUARIO (
   IDTIPOUSUARIO        INT4                 not null,
   NOMTIPOUSUARIO       VARCHAR(25)          not null,
   constraint PK_TIPO_USUARIO primary key (IDTIPOUSUARIO)
);

/*==============================================================*/
/* Index: TIPO_USUARIO_PK                                       */
/*==============================================================*/
create unique index TIPO_USUARIO_PK on TIPO_USUARIO (
IDTIPOUSUARIO
);

/*==============================================================*/
/* Table: TIPO_VEHICULO                                         */
/*==============================================================*/
create table TIPO_VEHICULO (
   IDTIPOVEHICULO       INT4                 not null,
   TIPOVEHICULO         VARCHAR(20)          not null,
   constraint PK_TIPO_VEHICULO primary key (IDTIPOVEHICULO)
);

/*==============================================================*/
/* Index: TIPO_VEHICULO_PK                                      */
/*==============================================================*/
create unique index TIPO_VEHICULO_PK on TIPO_VEHICULO (
IDTIPOVEHICULO
);

/*==============================================================*/
/* Table: USUARIO                                               */
/*==============================================================*/
create table USUARIO (
   IDUSUARIO            VARCHAR(5)           not null,
   IDTIPOUSUARIO        INT4                 not null,
   IDTIPODOCUMENTO      VARCHAR(3)           not null,
   NOMBREUSUARIO        VARCHAR(35)          not null,
   NUMDOCUMENTO         VARCHAR(20)          not null,
   CONTRASENIA          VARCHAR(40)          not null,
   PUNTOSACUMULADOS     INT4                 not null,
   CORREOELECTRONICO    VARCHAR(35)          null,
   constraint PK_USUARIO primary key (IDUSUARIO)
);

/*==============================================================*/
/* Index: USUARIO_PK                                            */
/*==============================================================*/
create unique index USUARIO_PK on USUARIO (
IDUSUARIO
);

/*==============================================================*/
/* Index: USUARIOTIPOUSUARIO_FK                                 */
/*==============================================================*/
create  index USUARIOTIPOUSUARIO_FK on USUARIO (
IDTIPOUSUARIO
);

/*==============================================================*/
/* Index: USUARIODOC_FK                                         */
/*==============================================================*/
create  index USUARIODOC_FK on USUARIO (
IDTIPODOCUMENTO
);

/*==============================================================*/
/* Table: VEHICULO                                              */
/*==============================================================*/
create table VEHICULO (
   IDVEHICULO           VARCHAR(5)           not null,
   IDMARCA              INT4                 not null,
   IDTIPOVEHICULO       INT4                 not null,
   IDUSUARIO            VARCHAR(5)           not null,
   PLACASVEHICULO       VARCHAR(8)           not null,
   COLOR                VARCHAR(25)          not null,
   constraint PK_VEHICULO primary key (IDVEHICULO)
);

/*==============================================================*/
/* Index: VEHICULO_PK                                           */
/*==============================================================*/
create unique index VEHICULO_PK on VEHICULO (
IDVEHICULO
);

/*==============================================================*/
/* Index: USUARIOVEHICULO_FK                                    */
/*==============================================================*/
create  index USUARIOVEHICULO_FK on VEHICULO (
IDUSUARIO
);

/*==============================================================*/
/* Index: VEHICULOMARCA_FK                                      */
/*==============================================================*/
create  index VEHICULOMARCA_FK on VEHICULO (
IDMARCA
);

/*==============================================================*/
/* Index: PARQUEA_A_FK                                          */
/*==============================================================*/
create unique index PARQUEA_A_FK on VEHICULO (
IDVEHICULO
);

/*==============================================================*/
/* Index: VEHICULOTIPO_FK                                       */
/*==============================================================*/
create  index VEHICULOTIPO_FK on VEHICULO (
IDTIPOVEHICULO
);

alter table PARQUEADERO
   add constraint FK_PARQUEAD_PARQUEADE_TIPO_PAR foreign key (IDTIPOPARQUEADERO)
      references TIPO_PARQUEADERO (IDTIPOPARQUEADERO)
      on delete restrict on update restrict;

alter table RESERVA
   add constraint FK_RESERVA_DESCUENTO_TIPODESC foreign key (IDTIPODESCUENTO)
      references TIPODESCUENTO (IDTIPODESCUENTO)
      on delete restrict on update restrict;

alter table RESERVA
   add constraint FK_RESERVA_PAGORESER_METODO_P foreign key (IDMETODOPAGO)
      references METODO_PAGO (IDMETODOPAGO)
      on delete restrict on update restrict;

alter table RESERVA
   add constraint FK_RESERVA_RESERVAPA_PARQUEAD foreign key (IDPARQUEADERO)
      references PARQUEADERO (IDPARQUEADERO)
      on delete restrict on update restrict;

alter table RESERVA
   add constraint FK_RESERVA_RESERVAUS_USUARIO foreign key (IDUSUARIO)
      references USUARIO (IDUSUARIO)
      on delete restrict on update restrict;

alter table RESERVA
   add constraint FK_RESERVA_VEHICULOR_VEHICULO foreign key (IDVEHICULO)
      references VEHICULO (IDVEHICULO)
      on delete restrict on update restrict;

alter table USUARIO
   add constraint FK_USUARIO_USUARIODO_TIPO_DOC foreign key (IDTIPODOCUMENTO)
      references TIPO_DOCUMENTO (IDTIPODOCUMENTO)
      on delete restrict on update restrict;

alter table USUARIO
   add constraint FK_USUARIO_USUARIOTI_TIPO_USU foreign key (IDTIPOUSUARIO)
      references TIPO_USUARIO (IDTIPOUSUARIO)
      on delete restrict on update restrict;

alter table VEHICULO
   add constraint FK_VEHICULO_USUARIOVE_USUARIO foreign key (IDUSUARIO)
      references USUARIO (IDUSUARIO)
      on delete restrict on update restrict;

alter table VEHICULO
   add constraint FK_VEHICULO_VEHICULOM_MARCAVEH foreign key (IDMARCA)
      references MARCAVEHICULO (IDMARCA)
      on delete restrict on update restrict;

alter table VEHICULO
   add constraint FK_VEHICULO_VEHICULOT_TIPO_VEH foreign key (IDTIPOVEHICULO)
      references TIPO_VEHICULO (IDTIPOVEHICULO)
      on delete restrict on update restrict;


/* Inserciones Necesarias */
/* TIPO USUARIO */
INSERT INTO tipo_usuario VALUES (1, 'Administrador General');
INSERT INTO tipo_usuario VALUES (2, 'Administrador de Punto');
INSERT INTO tipo_usuario VALUES (3, 'Cliente');

/* TIPO VEHICULO */
INSERT INTO tipo_vehiculo VALUES (1, 'Carro');
INSERT INTO tipo_vehiculo VALUES (2, 'Moto');
INSERT INTO tipo_vehiculo VALUES (3, 'Bicicleta');

/* TIPO DOCUMENTO */
INSERT INTO tipo_documento VALUES ('CC', 'Cedula');
INSERT INTO tipo_documento VALUES ('TI', 'Tarjeta de identidad');
INSERT INTO tipo_documento VALUES ('TE', 'Tarjeta de Extranjer�a');
INSERT INTO tipo_documento VALUES ('CE', 'C�dula de extranjer�a');
INSERT INTO tipo_documento VALUES ('NIT', 'Nit');
INSERT INTO tipo_documento VALUES ('PAS', 'Pasaporte');

INSERT INTO tipo_parqueadero VALUES (1,'Cubierto');
INSERT INTO tipo_parqueadero VALUES (2,'Semi-cubierto');
INSERT INTO tipo_parqueadero VALUES (3,'Descubierto');

INSERT INTO MARCAVEHICULO VALUES (1,'Chevrolet');
INSERT INTO MARCAVEHICULO VALUES (2,'Renault');
INSERT INTO MARCAVEHICULO VALUES (3,'Mazda');

INSERT INTO METODO_PAGO VALUES (1,'Tarjeta');
INSERT INTO METODO_PAGO VALUES (2,'PSE');

INSERT INTO TIPODESCUENTO VALUES (1,'Comun',0);
INSERT INTO TIPODESCUENTO VALUES (2,'Fidelizacion',1000);

/* Insercion usuario de prueba */
INSERT INTO usuario (idusuario, idtipousuario, idtipodocumento, nombreusuario, numdocumento, contrasenia, puntosacumulados, correoelectronico)
            VALUES (1, 3, 1, 'usuarioTest', '1000834814', 'admintest', 0, 'test@gmail.com') 




