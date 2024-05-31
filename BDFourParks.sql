--
-- PostgreSQL database dump
--

-- Dumped from database version 13.9 (Ubuntu 13.9-1.pgdg20.04+1)
-- Dumped by pg_dump version 13.9 (Ubuntu 13.9-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: btree_gin; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA public;


--
-- Name: EXTENSION btree_gin; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gin IS 'support for indexing common datatypes in GIN';


--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: cube; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS cube WITH SCHEMA public;


--
-- Name: EXTENSION cube; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION cube IS 'data type for multidimensional cubes';


--
-- Name: dblink; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dblink WITH SCHEMA public;


--
-- Name: EXTENSION dblink; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dblink IS 'connect to other PostgreSQL databases from within a database';


--
-- Name: dict_int; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dict_int WITH SCHEMA public;


--
-- Name: EXTENSION dict_int; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dict_int IS 'text search dictionary template for integers';


--
-- Name: dict_xsyn; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dict_xsyn WITH SCHEMA public;


--
-- Name: EXTENSION dict_xsyn; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dict_xsyn IS 'text search dictionary template for extended synonym processing';


--
-- Name: earthdistance; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS earthdistance WITH SCHEMA public;


--
-- Name: EXTENSION earthdistance; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION earthdistance IS 'calculate great-circle distances on the surface of the Earth';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


--
-- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


--
-- Name: ltree; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;


--
-- Name: EXTENSION ltree; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION ltree IS 'data type for hierarchical tree-like structures';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgrowlocks; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgrowlocks WITH SCHEMA public;


--
-- Name: EXTENSION pgrowlocks; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgrowlocks IS 'show row-level locking information';


--
-- Name: pgstattuple; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgstattuple WITH SCHEMA public;


--
-- Name: EXTENSION pgstattuple; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgstattuple IS 'show tuple-level statistics';


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: xml2; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS xml2 WITH SCHEMA public;


--
-- Name: EXTENSION xml2; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION xml2 IS 'XPath querying and XSLT';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: marcavehiculo; Type: TABLE; Schema: public; Owner: mmfbdemz
--

CREATE TABLE public.marcavehiculo (
    idmarca integer NOT NULL,
    nommarca character varying(30) NOT NULL
);


ALTER TABLE public.marcavehiculo OWNER TO mmfbdemz;

--
-- Name: metodo_pago; Type: TABLE; Schema: public; Owner: mmfbdemz
--

CREATE TABLE public.metodo_pago (
    idmetodopago integer NOT NULL,
    metodopago character varying(25) NOT NULL
);


ALTER TABLE public.metodo_pago OWNER TO mmfbdemz;

--
-- Name: parqueadero; Type: TABLE; Schema: public; Owner: mmfbdemz
--

CREATE TABLE public.parqueadero (
    idparqueadero character varying(5) NOT NULL,
    idtipoparqueadero integer NOT NULL,
    nombreparqueadero character varying(40) NOT NULL,
    direccion character varying(40) NOT NULL,
    capacidadtotal integer NOT NULL,
    capacidadactual integer NOT NULL,
    numerocontacto character varying(15) NOT NULL,
    latitud double precision,
    altitud double precision,
    tarifacarro integer,
    tarifamoto integer,
    tarifabici integer,
    tarifamulta integer
);


ALTER TABLE public.parqueadero OWNER TO mmfbdemz;

--
-- Name: reserva; Type: TABLE; Schema: public; Owner: mmfbdemz
--

CREATE TABLE public.reserva (
    numreserva character varying(25) NOT NULL,
    idparqueadero character varying(5) NOT NULL,
    montototal bigint NOT NULL,
    fechareservaentrada timestamp without time zone NOT NULL,
    fechareservasalida timestamp without time zone NOT NULL,
    fecharegistrada timestamp without time zone,
    procesada_entrada boolean DEFAULT false,
    procesada_salida boolean DEFAULT false,
    idusuario uuid
);


ALTER TABLE public.reserva OWNER TO mmfbdemz;

--
-- Name: tarjetacredito; Type: TABLE; Schema: public; Owner: mmfbdemz
--

CREATE TABLE public.tarjetacredito (
    idtarjeta character varying(5) NOT NULL,
    numtarjeta character varying(20) NOT NULL,
    fechavencimiento character varying(5) NOT NULL,
    codigoseguridad character varying(5) NOT NULL,
    nombrepropietario character varying(45),
    idusuario uuid
);


ALTER TABLE public.tarjetacredito OWNER TO mmfbdemz;

--
-- Name: tarjetacredito_idtarjeta_seq; Type: SEQUENCE; Schema: public; Owner: mmfbdemz
--

CREATE SEQUENCE public.tarjetacredito_idtarjeta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tarjetacredito_idtarjeta_seq OWNER TO mmfbdemz;

--
-- Name: tarjetacredito_idtarjeta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mmfbdemz
--

ALTER SEQUENCE public.tarjetacredito_idtarjeta_seq OWNED BY public.tarjetacredito.idtarjeta;


--
-- Name: tipo_documento; Type: TABLE; Schema: public; Owner: mmfbdemz
--

CREATE TABLE public.tipo_documento (
    idtipodocumento character varying(3) NOT NULL,
    nombretipodocumento character varying(35) NOT NULL
);


ALTER TABLE public.tipo_documento OWNER TO mmfbdemz;

--
-- Name: tipo_parqueadero; Type: TABLE; Schema: public; Owner: mmfbdemz
--

CREATE TABLE public.tipo_parqueadero (
    idtipoparqueadero integer NOT NULL,
    tipoparqueadero character varying(20) NOT NULL
);


ALTER TABLE public.tipo_parqueadero OWNER TO mmfbdemz;

--
-- Name: tipo_usuario; Type: TABLE; Schema: public; Owner: mmfbdemz
--

CREATE TABLE public.tipo_usuario (
    idtipousuario integer NOT NULL,
    nomtipousuario character varying(25) NOT NULL
);


ALTER TABLE public.tipo_usuario OWNER TO mmfbdemz;

--
-- Name: tipo_vehiculo; Type: TABLE; Schema: public; Owner: mmfbdemz
--

CREATE TABLE public.tipo_vehiculo (
    idtipovehiculo integer NOT NULL,
    tipovehiculo character varying(20) NOT NULL
);


ALTER TABLE public.tipo_vehiculo OWNER TO mmfbdemz;

--
-- Name: tipodescuento; Type: TABLE; Schema: public; Owner: mmfbdemz
--

CREATE TABLE public.tipodescuento (
    idtipodescuento integer NOT NULL,
    tipodescuento character varying(30) NOT NULL,
    valordescuento integer NOT NULL
);


ALTER TABLE public.tipodescuento OWNER TO mmfbdemz;

--
-- Name: usuario; Type: TABLE; Schema: public; Owner: mmfbdemz
--

CREATE TABLE public.usuario (
    idtipousuario integer NOT NULL,
    idtipodocumento character varying(3) NOT NULL,
    nombreusuario character varying(35) NOT NULL,
    numdocumento character varying(20) NOT NULL,
    contrasenia character varying(40) NOT NULL,
    puntosacumulados integer NOT NULL,
    correoelectronico character varying(35),
    codigo character varying(6),
    estado character varying(25),
    first_login boolean,
    idparkingmanejado character varying(5),
    idusuario uuid DEFAULT public.uuid_generate_v4()
);


ALTER TABLE public.usuario OWNER TO mmfbdemz;

--
-- Name: tarjetacredito idtarjeta; Type: DEFAULT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.tarjetacredito ALTER COLUMN idtarjeta SET DEFAULT nextval('public.tarjetacredito_idtarjeta_seq'::regclass);


--
-- Data for Name: marcavehiculo; Type: TABLE DATA; Schema: public; Owner: mmfbdemz
--

COPY public.marcavehiculo (idmarca, nommarca) FROM stdin;
1	Chevrolet
2	Renault
3	Mazda
\.


--
-- Data for Name: metodo_pago; Type: TABLE DATA; Schema: public; Owner: mmfbdemz
--

COPY public.metodo_pago (idmetodopago, metodopago) FROM stdin;
1	Tarjeta
2	PSE
\.


--
-- Data for Name: parqueadero; Type: TABLE DATA; Schema: public; Owner: mmfbdemz
--

COPY public.parqueadero (idparqueadero, idtipoparqueadero, nombreparqueadero, direccion, capacidadtotal, capacidadactual, numerocontacto, latitud, altitud, tarifacarro, tarifamoto, tarifabici, tarifamulta) FROM stdin;
STM1	3	PARQUEADERO EL RODADERO	CLL 12 #2 - 178	20	19	3139905516	-74.22755721473528	11.199646776529146	7000	2000	1000	5000
BOG2	1	PARQUEADERO PARQUE DE LA MARIPOSA	CRA 13 #12 - 07	20	19	3134768967	-74.07930625561139	4.6021448287362166	4000	2000	1000	5000
BOG4	2	PARQUEADERO CLÍNICA REINA SOFIA	CLL 127 Bis #21-5	20	18	3134852164	-74.0515939976776	4.707234012206489	4000	2000	1000	5000
TJA1	3	PARQUEADERO TERMINAL DE TRANSPORTE	AV. CIRCUNVALAR #18 - 221	50	50	3139614489	-73.34502263519695	5.530334965002895	8000	4000	2000	4000
BOG1	3	PARQUEADERO AEROPUERTO EL DORADO	CLL 26 # 106 - 66	100	98	3131668044	-74.1348896154789	4.693187758201357	4000	2000	1000	5000
BOG6	1	PARQUEADERO PARQUE LA COLINA	CRA 58D #146 - 51	200	199	3133793476	-74.0661758842118	4.732864313044911	4000	2000	1000	5000
BOG3	1	PARQUEADERO UNIVERSIDAD JAVERIANA	CLL 40 #6-23	60	59	3130453245	-74.06472100491534	4.62672965021939	4000	2000	1000	4000
BOG5	3	PARQUEADERO PORTAL 80	CRA 102 #80 - 41	30	30	3133113651	-74.11336810357136	4.712087277498989	4000	2000	1000	5000
MED1	2	PARQUEADERO PARQUE LLERAS	CLL 10 #38 - 24	20	20	3133735488	-75.56764505829483	6.209627852114728	4000	2000	1000	5000
CTG1	2	PARQUEADERO BOCAGRANDE	CRA 2 #7 - 15	25	25	3132294641	-75.55621413183526	10.402367846730979	1500	2000	1000	5000
\.


--
-- Data for Name: reserva; Type: TABLE DATA; Schema: public; Owner: mmfbdemz
--

COPY public.reserva (numreserva, idparqueadero, montototal, fechareservaentrada, fechareservasalida, fecharegistrada, procesada_entrada, procesada_salida, idusuario) FROM stdin;
R008	BOG1	7000	2024-05-28 08:46:44	2024-05-28 17:46:44	2024-05-20 17:48:29.950348	t	t	48b28936-6caf-49fe-a9db-22fcbe0d6aa0
R010	BOG1	8000	2024-05-28 17:32:11	2024-05-28 19:32:11	2024-05-22 03:32:30.741063	t	t	ba334060-9892-4015-9cae-2815e86294a6
R011	BOG2	4000	2024-05-28 20:04:21	2024-05-28 22:04:21	2024-05-26 23:05:06.378193	t	t	3a42abe2-0fe3-4a46-8079-c1705913e08d
R012	BOG6	8000	2024-05-29 18:48:57	2024-05-29 20:48:57	2024-05-26 23:50:02.593202	t	t	6dcf5a72-fd99-40fb-9990-697cd30a0d81
R015	BOG4	4000	2024-05-29 17:43:07	2024-05-29 19:43:07	2024-05-28 09:43:35.770999	t	t	ba334060-9892-4015-9cae-2815e86294a6
R019	BOG5	16000	2024-06-03 13:47:27	2024-06-03 17:47:27	2024-05-29 23:47:56.83069	f	f	5400f02c-594b-43d3-9b65-064ed744661b
R020	BOG4	20000	2024-06-05 15:54:28	2024-06-05 20:54:28	2024-05-29 23:55:01.739272	f	f	ba334060-9892-4015-9cae-2815e86294a6
R021	STM1	4000	2024-06-02 17:55:17	2024-06-02 20:55:17	2024-05-29 23:56:47.880823	f	f	ba334060-9892-4015-9cae-2815e86294a6
R018	BOG1	10000	2024-05-30 17:36:02	2024-05-30 22:36:02	2024-05-29 23:36:48.327662	t	t	5400f02c-594b-43d3-9b65-064ed744661b
R009	BOG6	12000	2024-05-30 19:53:53	2024-05-30 22:53:53	2024-05-20 17:54:21.572352	t	t	48b28936-6caf-49fe-a9db-22fcbe0d6aa0
R022	BOG6	4000	2024-05-31 22:05:51	2024-05-31 23:05:51	2024-05-31 03:07:33.351501	f	f	6dcf5a72-fd99-40fb-9990-697cd30a0d81
R023	BOG5	4000	2024-05-30 23:35:08	2024-05-31 00:35:08	2024-05-31 04:36:44.291301	t	t	b12558d8-88ff-46ee-9b88-9c751521d50a
R024	BOG5	4000	2024-05-31 01:51:42	2024-05-31 02:51:42	2024-05-31 04:52:51.719511	t	t	4cf8183d-a606-44ac-9915-bfe18008056e
R026	CTG1	0	2024-05-31 07:41:48	2024-05-31 08:41:48	2024-05-31 05:42:59.618454	f	f	62cbf7ec-397c-4911-a5fc-f7d820594902
R027	TJA1	2000	2024-06-02 07:47:32	2024-06-02 08:47:32	2024-05-31 05:49:28.486138	f	f	62cbf7ec-397c-4911-a5fc-f7d820594902
R028	BOG1	96000	2024-06-05 15:57:52	2024-06-06 15:57:52	2024-05-31 05:58:31.124212	f	f	62cbf7ec-397c-4911-a5fc-f7d820594902
R1	BOG2	12000	2024-05-21 13:00:42	2024-05-21 16:00:42	2024-05-24 07:24:58.735917	t	t	ba334060-9892-4015-9cae-2815e86294a6
R2	BOG6	4000	2024-05-22 14:00:49	2024-05-22 16:00:49	2024-05-24 07:24:58.735917	t	t	ba334060-9892-4015-9cae-2815e86294a6
R3	BOG3	24000	2024-05-22 14:00:35	2024-05-22 20:00:35	2024-05-24 07:24:58.735917	t	t	6dcf5a72-fd99-40fb-9990-697cd30a0d81
R4	MED1	4000	2024-05-23 21:00:13	2024-05-23 22:00:13	2024-05-24 07:24:58.735917	t	t	6dcf5a72-fd99-40fb-9990-697cd30a0d81
R006	BOG5	12000	2024-05-24 18:31:43	2024-05-24 22:31:43	2024-05-23 17:33:06.095744	t	t	3a42abe2-0fe3-4a46-8079-c1705913e08d
R013	BOG3	18000	2024-06-03 11:38:12	2024-06-03 14:38:12	2024-05-27 11:51:16.123597	f	f	ba334060-9892-4015-9cae-2815e86294a6
R014	BOG4	6000	2024-06-03 17:41:28	2024-06-03 20:41:28	2024-05-28 09:42:00.164445	f	f	ba334060-9892-4015-9cae-2815e86294a6
R016	STM1	28000	2024-06-03 08:50:12	2024-06-03 12:50:12	2024-05-28 09:51:32.559335	f	f	3a42abe2-0fe3-4a46-8079-c1705913e08d
R005	BOG3	16000	2024-05-27 16:27:26	2024-05-27 20:27:26	2024-05-24 02:28:59.719882	t	t	6dcf5a72-fd99-40fb-9990-697cd30a0d81
\.


--
-- Data for Name: tarjetacredito; Type: TABLE DATA; Schema: public; Owner: mmfbdemz
--

COPY public.tarjetacredito (idtarjeta, numtarjeta, fechavencimiento, codigoseguridad, nombrepropietario, idusuario) FROM stdin;
T1	401354068274626	11/25	123	Juan Saavedra	ba334060-9892-4015-9cae-2815e86294a6
T002	5105105105105100	12/26	123	Santiago Andrade	48b28936-6caf-49fe-a9db-22fcbe0d6aa0
T003	5200828282828210	04/28	123	Camila Benitez	5400f02c-594b-43d3-9b65-064ed744661b
T004	5555555555554444	07/28	123	Anakin Skywalker	6dcf5a72-fd99-40fb-9990-697cd30a0d81
T005	401354068274626	11/25	456	Johan Fontecha	b12558d8-88ff-46ee-9b88-9c751521d50a
T006	401354068274626	11/25	456	Johan Fontecha	4cf8183d-a606-44ac-9915-bfe18008056e
T007	401354068274626	11/25	456	Johan Fontecha	62cbf7ec-397c-4911-a5fc-f7d820594902
\.


--
-- Data for Name: tipo_documento; Type: TABLE DATA; Schema: public; Owner: mmfbdemz
--

COPY public.tipo_documento (idtipodocumento, nombretipodocumento) FROM stdin;
CC	Cedula
TI	Tarjeta de identidad
TE	Tarjeta de Extranjería
CE	Cédula de extranjería
NIT	Nit
PAS	Pasaporte
\.


--
-- Data for Name: tipo_parqueadero; Type: TABLE DATA; Schema: public; Owner: mmfbdemz
--

COPY public.tipo_parqueadero (idtipoparqueadero, tipoparqueadero) FROM stdin;
1	Cubierto
2	Semi-Cubierto
3	Descubierto
\.


--
-- Data for Name: tipo_usuario; Type: TABLE DATA; Schema: public; Owner: mmfbdemz
--

COPY public.tipo_usuario (idtipousuario, nomtipousuario) FROM stdin;
1	Administrador General
2	Administrador de Punto
3	Cliente
\.


--
-- Data for Name: tipo_vehiculo; Type: TABLE DATA; Schema: public; Owner: mmfbdemz
--

COPY public.tipo_vehiculo (idtipovehiculo, tipovehiculo) FROM stdin;
1	Carro
2	Moto
3	Bicicleta
\.


--
-- Data for Name: tipodescuento; Type: TABLE DATA; Schema: public; Owner: mmfbdemz
--

COPY public.tipodescuento (idtipodescuento, tipodescuento, valordescuento) FROM stdin;
1	Comun	0
2	Fidelizacion	1000
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: mmfbdemz
--

COPY public.usuario (idtipousuario, idtipodocumento, nombreusuario, numdocumento, contrasenia, puntosacumulados, correoelectronico, codigo, estado, first_login, idparkingmanejado, idusuario) FROM stdin;
1	CC	Juanito	1011001000	holo123	0	juan@ito.com	\N	unlocked	f	\N	80f8f247-a2e0-450e-8117-98bb3a0a0d51
3	CC	Camila_Andrade	1000064298	9cab5038398867154c29696441a75cc2c407dda8	0	camilauriza17@gmail.com	\N	unlocked	f	\N	fc0d7e54-d3ec-4832-9701-468494dfac48
2	CC	Daniel_Peña	1000831818	d4e079dba4c7cf347ef95c292f628b90bddacd75	0	josed0189@gmail.com	951660	unlocked	f	BOG5	ccf439b5-c848-4982-bc9c-cce51d7d59a7
3	CC	Jefferson_Escobar	1	0d6d1d7a47a607715890712a8286dea4203f2003	0	jescobarr@udistrital.edu.co	\N	unlocked	t	\N	188d5693-b743-49fb-9487-4740f1d778ff
3	CC	Camilo_Perez	1001167985	22033d684e76314f4fe034f2089f7464da3e8eb4	0	jdpenap@udistrital.edu.co	114791	unlocked	f	\N	eeae2ee3-0360-49d0-9b02-3021c53bf24f
3	CC	Raul_Jimenez	1000834814	admin	0	test@gmail.com	\N	unlocked	f	\N	72c84996-382b-4592-ae7d-f9568ca64399
3	CC	Jefferson _Escobar Rivas 	1000709031	b22a6aa2e2d447e8651b7bd86fd77ed854104e22	0	jeffersonescobar149@gmail.com	\N	unlocked	t	\N	3b14109d-c3ad-48b8-b731-af78448a55a2
3	CC	Andres_Pulido	1004567894	fccc63afc00f229f8cbf7afc0db97b6a9de175d2	0	crackstoday@gmail.com	673542	unlocked	f	\N	2fa447e7-a296-464f-850f-d4c0af595ab0
2	CC	Santiago_Andrade	1320831812	9cab5038398867154c29696441a75cc2c407dda8	4	satavilag@udistrital.edu.co	032376	unlocked	f	BOG3	48b28936-6caf-49fe-a9db-22fcbe0d6aa0
3	CC	Johan Sebastian_Fontecha Soler	1000516759	c2a4b48561ae0ac11e4373b073df72e9d2e589e1	25	johansebas202@gmail.com	933209	unlocked	f	\N	62cbf7ec-397c-4911-a5fc-f7d820594902
3	CC	Juan_Saavedra	1204831818	952ae21888ca5b79408196eacc8dd628e492fddb	81	backupavila21@gmail.com	683924	unlocked	f	\N	ba334060-9892-4015-9cae-2815e86294a6
2	CC	Santiago_Avila	1000835814	b5a0a46442a34a244f6ad69dcaa7353c99623eee	11	santiavilag2015@gmail.com	135386	unlocked	f	BOG3	3a42abe2-0fe3-4a46-8079-c1705913e08d
3	TI	Maria_Benitez	1000069812	9cab5038398867154c29696441a75cc2c407dda8	7	camilagato143@gmail.com	924083	unlocked	f	\N	5400f02c-594b-43d3-9b65-064ed744661b
3	CC	Helio_ Ramirez 	1000785432	fb0a066ff3446925ee99ebf46b5b503676c4eaec	0	aestudiarud1@gmail.com	244808	unlocked	f	\N	0721e725-45cd-49ae-b078-4c62e561767b
3	CC	Johan Sebastian_Fontecha Soler	1000516759	a2c2dd65e258ece3322e694f8426d821aa4c0928	1	johansebas202f1@gmail.com	573475	unlocked	f	\N	b12558d8-88ff-46ee-9b88-9c751521d50a
3	CC	Johan Sebastian_Fontecha Soler	1000516759	c2a4b48561ae0ac11e4373b073df72e9d2e589e1	1	johansebas202f2@gmail.com	401704	unlocked	f	\N	4cf8183d-a606-44ac-9915-bfe18008056e
1	CC	Admin_General	1111111111	e0a246875df769d83e4fc26098b1b31af30ac441	14	grupobfourparks@gmail.com	366377	unlocked	f	\N	6dcf5a72-fd99-40fb-9990-697cd30a0d81
\.


--
-- Name: tarjetacredito_idtarjeta_seq; Type: SEQUENCE SET; Schema: public; Owner: mmfbdemz
--

SELECT pg_catalog.setval('public.tarjetacredito_idtarjeta_seq', 1, false);


--
-- Name: marcavehiculo pk_marcavehiculo; Type: CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.marcavehiculo
    ADD CONSTRAINT pk_marcavehiculo PRIMARY KEY (idmarca);


--
-- Name: metodo_pago pk_metodo_pago; Type: CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.metodo_pago
    ADD CONSTRAINT pk_metodo_pago PRIMARY KEY (idmetodopago);


--
-- Name: parqueadero pk_parqueadero; Type: CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.parqueadero
    ADD CONSTRAINT pk_parqueadero PRIMARY KEY (idparqueadero);


--
-- Name: reserva pk_reserva; Type: CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT pk_reserva PRIMARY KEY (numreserva);


--
-- Name: tarjetacredito pk_tarjetacredito; Type: CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.tarjetacredito
    ADD CONSTRAINT pk_tarjetacredito PRIMARY KEY (idtarjeta);


--
-- Name: tipo_documento pk_tipo_documento; Type: CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.tipo_documento
    ADD CONSTRAINT pk_tipo_documento PRIMARY KEY (idtipodocumento);


--
-- Name: tipo_parqueadero pk_tipo_parqueadero; Type: CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.tipo_parqueadero
    ADD CONSTRAINT pk_tipo_parqueadero PRIMARY KEY (idtipoparqueadero);


--
-- Name: tipo_usuario pk_tipo_usuario; Type: CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.tipo_usuario
    ADD CONSTRAINT pk_tipo_usuario PRIMARY KEY (idtipousuario);


--
-- Name: tipo_vehiculo pk_tipo_vehiculo; Type: CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.tipo_vehiculo
    ADD CONSTRAINT pk_tipo_vehiculo PRIMARY KEY (idtipovehiculo);


--
-- Name: tipodescuento pk_tipodescuento; Type: CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.tipodescuento
    ADD CONSTRAINT pk_tipodescuento PRIMARY KEY (idtipodescuento);


--
-- Name: usuario usuario_uuid_usuario_key; Type: CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_uuid_usuario_key UNIQUE (idusuario);


--
-- Name: idx_idparqueadero; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE INDEX idx_idparqueadero ON public.parqueadero USING btree (idparqueadero);


--
-- Name: marcavehiculo_pk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE UNIQUE INDEX marcavehiculo_pk ON public.marcavehiculo USING btree (idmarca);


--
-- Name: metodo_pago_pk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE UNIQUE INDEX metodo_pago_pk ON public.metodo_pago USING btree (idmetodopago);


--
-- Name: parqueadero_pk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE UNIQUE INDEX parqueadero_pk ON public.parqueadero USING btree (idparqueadero);


--
-- Name: parqueaderotipo_fk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE INDEX parqueaderotipo_fk ON public.parqueadero USING btree (idtipoparqueadero);


--
-- Name: reserva_pk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE UNIQUE INDEX reserva_pk ON public.reserva USING btree (numreserva);


--
-- Name: reservaparqueadero_fk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE INDEX reservaparqueadero_fk ON public.reserva USING btree (idparqueadero);


--
-- Name: tipo_documento_pk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE UNIQUE INDEX tipo_documento_pk ON public.tipo_documento USING btree (idtipodocumento);


--
-- Name: tipo_parqueadero_pk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE UNIQUE INDEX tipo_parqueadero_pk ON public.tipo_parqueadero USING btree (idtipoparqueadero);


--
-- Name: tipo_usuario_pk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE UNIQUE INDEX tipo_usuario_pk ON public.tipo_usuario USING btree (idtipousuario);


--
-- Name: tipo_vehiculo_pk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE UNIQUE INDEX tipo_vehiculo_pk ON public.tipo_vehiculo USING btree (idtipovehiculo);


--
-- Name: tipodescuento_pk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE UNIQUE INDEX tipodescuento_pk ON public.tipodescuento USING btree (idtipodescuento);


--
-- Name: usuariodoc_fk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE INDEX usuariodoc_fk ON public.usuario USING btree (idtipodocumento);


--
-- Name: usuariotipousuario_fk; Type: INDEX; Schema: public; Owner: mmfbdemz
--

CREATE INDEX usuariotipousuario_fk ON public.usuario USING btree (idtipousuario);


--
-- Name: parqueadero fk_parquead_parqueade_tipo_par; Type: FK CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.parqueadero
    ADD CONSTRAINT fk_parquead_parqueade_tipo_par FOREIGN KEY (idtipoparqueadero) REFERENCES public.tipo_parqueadero(idtipoparqueadero) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: reserva fk_reserva_reservapa_parquead; Type: FK CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT fk_reserva_reservapa_parquead FOREIGN KEY (idparqueadero) REFERENCES public.parqueadero(idparqueadero) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: reserva fk_reserva_reservaus_uuid; Type: FK CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.reserva
    ADD CONSTRAINT fk_reserva_reservaus_uuid FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario);


--
-- Name: tarjetacredito fk_reserva_reservaus_uuid; Type: FK CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.tarjetacredito
    ADD CONSTRAINT fk_reserva_reservaus_uuid FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario);


--
-- Name: usuario fk_usuario_usuariodo_tipo_doc; Type: FK CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT fk_usuario_usuariodo_tipo_doc FOREIGN KEY (idtipodocumento) REFERENCES public.tipo_documento(idtipodocumento) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: usuario fk_usuario_usuarioti_tipo_usu; Type: FK CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT fk_usuario_usuarioti_tipo_usu FOREIGN KEY (idtipousuario) REFERENCES public.tipo_usuario(idtipousuario) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: usuario usuario_idparkingmanejado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mmfbdemz
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_idparkingmanejado_fkey FOREIGN KEY (idparkingmanejado) REFERENCES public.parqueadero(idparqueadero);


--
-- PostgreSQL database dump complete
--

