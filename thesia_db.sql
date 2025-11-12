-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: thesia_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comentario`
--

DROP TABLE IF EXISTS `comentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentario` (
  `id_comentario` int(11) NOT NULL AUTO_INCREMENT,
  `id_documento` int(11) NOT NULL,
  `id_asesor` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_comentario` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo_comentario` enum('revision','aprobacion','observacion','sugerencia','rechazo') DEFAULT 'revision',
  `pagina_referencia` int(11) DEFAULT NULL COMMENT 'Página del documento comentada',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_comentario`),
  KEY `idx_comentario_documento` (`id_documento`),
  KEY `idx_comentario_asesor` (`id_asesor`),
  CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`id_documento`) REFERENCES `documento` (`id_documento`) ON DELETE CASCADE,
  CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`id_asesor`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentario`
--

LOCK TABLES `comentario` WRITE;
/*!40000 ALTER TABLE `comentario` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracionauth`
--

DROP TABLE IF EXISTS `configuracionauth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracionauth` (
  `id_config` int(11) NOT NULL AUTO_INCREMENT,
  `dominio` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_config`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracionauth`
--

LOCK TABLES `configuracionauth` WRITE;
/*!40000 ALTER TABLE `configuracionauth` DISABLE KEYS */;
INSERT INTO `configuracionauth` VALUES (1,'@tecsup.edu.pe','Dominio institucional de TECSUP',1,'2025-09-28 03:32:31','2025-09-28 03:32:31');
/*!40000 ALTER TABLE `configuracionauth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracionsistema`
--

DROP TABLE IF EXISTS `configuracionsistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracionsistema` (
  `id_config` int(11) NOT NULL AUTO_INCREMENT,
  `clave` varchar(100) NOT NULL,
  `valor` text NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(50) DEFAULT 'general',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_config`),
  UNIQUE KEY `clave` (`clave`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracionsistema`
--

LOCK TABLES `configuracionsistema` WRITE;
/*!40000 ALTER TABLE `configuracionsistema` DISABLE KEYS */;
INSERT INTO `configuracionsistema` VALUES (1,'max_file_size','20971520','Tamaño máximo de archivo en bytes (20MB)','archivos','2025-09-28 03:32:34','2025-09-28 03:32:34'),(2,'formatos_permitidos','pdf,docx','Formatos de archivo permitidos','archivos','2025-09-28 03:32:34','2025-09-28 03:32:34'),(3,'duracion_reunion_default','60','Duración por defecto de reuniones en minutos','reuniones','2025-09-28 03:32:34','2025-09-28 03:32:34'),(4,'notificaciones_email','true','Enviar notificaciones por email','notificaciones','2025-09-28 03:32:34','2025-09-28 03:32:34'),(5,'fase_tesis','propuesta,desarrollo,revision,sustentacion','Fases del proceso de tesis','proceso','2025-09-28 03:32:34','2025-09-28 03:32:34'),(6,'tipos_entrega','avance1,avance2,entrega_final','Tipos de entrega permitidos','proceso','2025-09-28 03:32:34','2025-09-28 03:32:34');
/*!40000 ALTER TABLE `configuracionsistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disponibilidadasesor`
--

DROP TABLE IF EXISTS `disponibilidadasesor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disponibilidadasesor` (
  `id_disponibilidad` int(11) NOT NULL AUTO_INCREMENT,
  `id_asesor` int(11) NOT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `modalidad` enum('presencial','virtual','mixto') DEFAULT 'mixto' COMMENT 'Modalidad de atención',
  `ubicacion` varchar(100) DEFAULT NULL COMMENT 'Ubicación para reuniones presenciales',
  `enlace_virtual` varchar(500) DEFAULT NULL COMMENT 'Enlace por defecto para reuniones virtuales',
  `notas` text DEFAULT NULL COMMENT 'Notas adicionales del asesor',
  `max_reuniones_por_dia` int(11) DEFAULT 3 COMMENT 'Máximo de reuniones por día',
  PRIMARY KEY (`id_disponibilidad`),
  UNIQUE KEY `unique_asesor_dia_horario` (`id_asesor`,`dia_semana`,`hora_inicio`),
  KEY `idx_disponibilidad_asesor` (`id_asesor`),
  KEY `idx_disponibilidad_activo` (`activo`),
  KEY `idx_disponibilidad_dia` (`dia_semana`),
  KEY `idx_disponibilidad_modalidad` (`modalidad`),
  CONSTRAINT `disponibilidadasesor_ibfk_1` FOREIGN KEY (`id_asesor`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disponibilidadasesor`
--

LOCK TABLES `disponibilidadasesor` WRITE;
/*!40000 ALTER TABLE `disponibilidadasesor` DISABLE KEYS */;
INSERT INTO `disponibilidadasesor` VALUES (5,25,'lunes','08:00:00','12:00:00',1,'2025-10-12 03:41:43','2025-10-12 03:41:43','mixto','Laboratorio de Diseño A-201',NULL,NULL,3),(6,25,'lunes','14:00:00','18:00:00',1,'2025-10-12 03:41:43','2025-10-12 03:41:43','virtual',NULL,NULL,NULL,3),(7,25,'miercoles','08:00:00','12:00:00',1,'2025-10-12 03:41:43','2025-10-12 03:41:43','presencial','Oficina A-205',NULL,NULL,2),(8,25,'viernes','10:00:00','14:00:00',1,'2025-10-12 03:41:43','2025-10-12 03:41:43','mixto','Laboratorio de Diseño A-201',NULL,NULL,2),(9,21,'martes','08:00:00','12:00:00',1,'2025-10-12 03:41:43','2025-10-12 03:41:43','presencial','Taller de Producción B-101',NULL,NULL,3),(10,21,'martes','14:00:00','17:00:00',1,'2025-10-12 03:41:43','2025-10-12 03:41:43','virtual',NULL,NULL,NULL,2),(11,21,'jueves','09:00:00','13:00:00',1,'2025-10-12 03:41:43','2025-10-12 03:41:43','mixto','Oficina B-105',NULL,NULL,3),(12,21,'viernes','08:00:00','11:00:00',1,'2025-10-12 03:41:43','2025-10-12 03:41:43','presencial','Taller de Producción B-101',NULL,NULL,2);
/*!40000 ALTER TABLE `disponibilidadasesor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documento`
--

DROP TABLE IF EXISTS `documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documento` (
  `id_documento` int(11) NOT NULL AUTO_INCREMENT,
  `id_tesis` int(11) NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `url_archivo` varchar(500) NOT NULL,
  `fecha_subida` timestamp NOT NULL DEFAULT current_timestamp(),
  `version` int(11) DEFAULT 1,
  `tipo_entrega` varchar(100) NOT NULL,
  `formato_archivo` enum('pdf','docx') DEFAULT 'pdf',
  `fase` enum('fase_1_plan_proyecto','fase_2_diagnostico','fase_3_marco_teorico','fase_4_desarrollo','fase_5_resultados') NOT NULL,
  `validado_por_asesor` tinyint(1) DEFAULT 0,
  `estado` enum('pendiente','en_revision','aprobado','rechazado') DEFAULT 'pendiente',
  `comentarios` text DEFAULT NULL,
  `tamaño_archivo` bigint(20) DEFAULT NULL COMMENT 'Tamaño en bytes (máx 20MB)',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_documento`),
  KEY `idx_documento_tesis` (`id_tesis`),
  KEY `idx_documento_fase` (`fase`),
  KEY `idx_documento_validado` (`validado_por_asesor`),
  CONSTRAINT `documento_ibfk_1` FOREIGN KEY (`id_tesis`) REFERENCES `tesispretesis` (`id_tesis`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documento`
--

LOCK TABLES `documento` WRITE;
/*!40000 ALTER TABLE `documento` DISABLE KEYS */;
INSERT INTO `documento` VALUES (11,12,'emiirr.pdf','D:\\TECSUP\\Tesis\\Thesia-Proyecto\\thesia-backend\\uploads\\documents\\emiirr.pdf','2025-10-11 04:21:28',1,'asdsadsadasd','pdf','fase_1_plan_proyecto',0,'rechazado',NULL,101307,'2025-10-11 04:21:28','2025-10-31 05:46:05'),(12,12,'emiirr_1760160909536.pdf','D:\\TECSUP\\Tesis\\Thesia-Proyecto\\thesia-backend\\uploads\\documents\\emiirr_1760160909536.pdf','2025-10-11 05:35:09',1,'asdadadsad','pdf','fase_1_plan_proyecto',0,'aprobado',NULL,101307,'2025-10-11 05:35:09','2025-10-31 05:46:05'),(13,12,'NOMBRE_PLIN.pdf','D:\\TECSUP\\Tesis\\Thesia-Proyecto\\thesia-backend\\uploads\\documents\\NOMBRE_PLIN.pdf','2025-10-11 05:40:15',1,'asdadadas prueba','pdf','fase_2_diagnostico',0,'aprobado',NULL,186920,'2025-10-11 05:40:15','2025-10-31 05:46:05'),(16,12,'TrabajoIndividual_Belgica.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\TrabajoIndividual_Belgica.pdf','2025-10-29 07:39:06',1,'prueba','pdf','',1,'aprobado',NULL,252895,'2025-10-29 07:39:06','2025-11-05 04:31:54'),(17,12,'19362.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\19362.pdf','2025-10-31 05:51:53',1,'Entrega regular','pdf','fase_3_marco_teorico',1,'aprobado',NULL,69403,'2025-10-31 05:51:53','2025-10-31 05:53:02'),(18,15,'19362_1762118391832.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\19362_1762118391832.pdf','2025-11-02 21:19:51',1,'Entrega regular','pdf','fase_1_plan_proyecto',0,'pendiente',NULL,69403,'2025-11-02 21:19:51','2025-11-02 21:19:51'),(19,15,'va.docx','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\va.docx','2025-11-02 22:04:36',1,'Entrega regular','docx','fase_1_plan_proyecto',0,'pendiente',NULL,395436,'2025-11-02 22:04:36','2025-11-02 22:04:36'),(20,12,'pruebaparatesis.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\pruebaparatesis.pdf','2025-11-05 04:34:13',1,'PRUEBA','pdf','fase_4_desarrollo',0,'rechazado','Tienen que mejorar el formato etc etc',14751,'2025-11-05 04:34:13','2025-11-05 05:18:31'),(21,12,'pruebaparatesis_1762319994302.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\pruebaparatesis_1762319994302.pdf','2025-11-05 05:19:54',1,'pueba2','pdf','fase_4_desarrollo',0,'pendiente','Esta bien tu tesis, chevere.sadad',14751,'2025-11-05 05:19:54','2025-11-05 05:43:09'),(22,16,'19362_1762543950158.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\19362_1762543950158.pdf','2025-11-07 19:32:30',1,'kajdajkdakdja','pdf','fase_1_plan_proyecto',0,'rechazado',NULL,69403,'2025-11-07 19:32:30','2025-11-07 19:33:31'),(23,16,'19362_1762544032083.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\19362_1762544032083.pdf','2025-11-07 19:33:52',1,'Entrega regular','pdf','fase_1_plan_proyecto',1,'aprobado',NULL,69403,'2025-11-07 19:33:52','2025-11-07 19:34:03'),(26,16,'PA03_TALL_ART_VISUALES.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\PA03_TALL_ART_VISUALES.pdf','2025-11-07 20:39:11',2,'Entrega regular','pdf','fase_2_diagnostico',0,'rechazado','Falta mejorar algunas cosas',77848,'2025-11-07 20:39:11','2025-11-07 21:43:24'),(27,12,'Proceso_Escala_tonal.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\Proceso_Escala_tonal.pdf','2025-11-07 21:11:35',1,'Prueba ver detalles asesor\r\n','pdf','fase_4_desarrollo',0,'rechazado',NULL,3962379,'2025-11-07 21:11:35','2025-11-10 18:41:25'),(28,12,'PA03_NICOLAS_BULLON_SUPANTA__1_.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\PA03_NICOLAS_BULLON_SUPANTA__1_.pdf','2025-11-07 21:26:41',1,'Descripcion','pdf','fase_1_plan_proyecto',1,'aprobado',NULL,147758,'2025-11-07 21:26:41','2025-11-07 22:36:21'),(29,16,'marilynbuendia__100-425-1-CE.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\marilynbuendia__100-425-1-CE.pdf','2025-11-07 21:44:31',1,'prubeaaaaaaaaaaaaaaaa','pdf','fase_2_diagnostico',0,'pendiente',NULL,293297,'2025-11-07 21:44:31','2025-11-07 21:44:31'),(30,17,'3220_pa02.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\documents\\3220_pa02.pdf','2025-11-07 22:35:29',1,'dsadasdsadasda','pdf','fase_1_plan_proyecto',1,'aprobado',NULL,82745,'2025-11-07 22:35:29','2025-11-07 22:36:40');
/*!40000 ALTER TABLE `documento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guias`
--

DROP TABLE IF EXISTS `guias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guias` (
  `id_guia` int(11) NOT NULL AUTO_INCREMENT,
  `id_asesor` int(11) NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `url_archivo` varchar(500) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fase_aplicable` enum('fase_1_plan_proyecto','fase_2_diagnostico','fase_3_marco_teorico','fase_4_desarrollo','fase_5_resultados') DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_guia`),
  KEY `id_asesor` (`id_asesor`),
  CONSTRAINT `guias_ibfk_1` FOREIGN KEY (`id_asesor`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guias`
--

LOCK TABLES `guias` WRITE;
/*!40000 ALTER TABLE `guias` DISABLE KEYS */;
INSERT INTO `guias` VALUES (2,25,'Proceso_Escala_tonal.pdf','C:\\Users\\USUARIO\\Documents\\Archivos Tesis\\Thesia-Front-Back\\Thesia-front-back\\thesia-backend\\uploads\\guides\\Proceso_Escala_tonal.pdf','SEGUNDA PRUEBA','fase_2_diagnostico',1,'2025-11-10 18:40:49');
/*!40000 ALTER TABLE `guias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialestados`
--

DROP TABLE IF EXISTS `historialestados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historialestados` (
  `id_historial` int(11) NOT NULL AUTO_INCREMENT,
  `id_tesis` int(11) NOT NULL,
  `estado_anterior` varchar(50) DEFAULT NULL,
  `estado_nuevo` varchar(50) NOT NULL,
  `id_usuario_cambio` int(11) NOT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT current_timestamp(),
  `comentario` text DEFAULT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_tesis` (`id_tesis`),
  KEY `id_usuario_cambio` (`id_usuario_cambio`),
  CONSTRAINT `historialestados_ibfk_1` FOREIGN KEY (`id_tesis`) REFERENCES `tesispretesis` (`id_tesis`) ON DELETE CASCADE,
  CONSTRAINT `historialestados_ibfk_2` FOREIGN KEY (`id_usuario_cambio`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialestados`
--

LOCK TABLES `historialestados` WRITE;
/*!40000 ALTER TABLE `historialestados` DISABLE KEYS */;
/*!40000 ALTER TABLE `historialestados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logactividad`
--

DROP TABLE IF EXISTS `logactividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logactividad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `accion` varchar(50) NOT NULL,
  `entidad` varchar(50) NOT NULL,
  `detalle` text DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `logactividad_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logactividad`
--

LOCK TABLES `logactividad` WRITE;
/*!40000 ALTER TABLE `logactividad` DISABLE KEYS */;
INSERT INTO `logactividad` VALUES (1,25,'LOGIN','Usuario','Login exitoso para usuario dvega@tecsup.edu.pe','2025-10-29 06:02:58'),(2,43,'SUBIR_DOCUMENTO','Documento','Documento subido: TrabajoIndividual_Belgica.pdf (ID: 16)','2025-10-29 07:39:06'),(3,25,'LOGIN','Usuario','Login exitoso para usuario dvega@tecsup.edu.pe','2025-10-31 04:31:14'),(4,43,'SUBIR_DOCUMENTO','Documento','Documento subido: 19362.pdf (ID: 17)','2025-10-31 05:51:53'),(5,47,'SUBIR_DOCUMENTO','Documento','Documento subido: 19362_1762118391832.pdf (ID: 18)','2025-11-02 21:19:51'),(6,47,'SUBIR_DOCUMENTO','Documento','Documento subido: va.docx (ID: 19)','2025-11-02 22:04:36'),(7,25,'LOGIN','Usuario','Login exitoso para usuario dvega@tecsup.edu.pe','2025-11-02 22:16:39'),(8,25,'LOGIN','Usuario','Login exitoso para usuario dvega@tecsup.edu.pe','2025-11-05 03:27:56'),(9,43,'SUBIR_DOCUMENTO','Documento','Documento subido: pruebaparatesis.pdf (ID: 20)','2025-11-05 04:34:13'),(10,43,'SUBIR_DOCUMENTO','Documento','Documento subido: pruebaparatesis_1762319994302.pdf (ID: 21)','2025-11-05 05:19:54'),(11,25,'LOGIN','Usuario','Login exitoso para usuario dvega@tecsup.edu.pe','2025-11-07 18:57:39'),(12,49,'SUBIR_DOCUMENTO','Documento','Documento subido: 19362_1762543950158.pdf (ID: 22)','2025-11-07 19:32:30'),(13,49,'SUBIR_DOCUMENTO','Documento','Documento subido: 19362_1762544032083.pdf (ID: 23)','2025-11-07 19:33:52'),(14,49,'SUBIR_DOCUMENTO','Documento','Documento subido: pruebaparatesis_1762544093528.pdf (ID: 24)','2025-11-07 19:34:53'),(15,49,'SUBIR_DOCUMENTO','Documento','Documento subido: pruebaparatesis_1762547086182.pdf (ID: 25)','2025-11-07 20:24:46'),(16,49,'SUBIR_DOCUMENTO','Documento','Documento subido: 19362_1762547951526.pdf (ID: 26)','2025-11-07 20:39:11'),(17,43,'SUBIR_DOCUMENTO','Documento','Documento subido: Proceso_Escala_tonal.pdf (ID: 27)','2025-11-07 21:11:35'),(18,43,'SUBIR_DOCUMENTO','Documento','Documento subido: PA03_NICOLAS_BULLON_SUPANTA__1_.pdf (ID: 28)','2025-11-07 21:26:41'),(19,49,'SUBIR_DOCUMENTO','Documento','Documento subido: marilynbuendia__100-425-1-CE.pdf (ID: 29)','2025-11-07 21:44:31'),(20,50,'SUBIR_DOCUMENTO','Documento','Documento subido: 3220_pa02.pdf (ID: 30)','2025-11-07 22:35:29'),(21,25,'LOGIN','Usuario','Login exitoso para usuario dvega@tecsup.edu.pe','2025-11-10 17:45:53'),(22,25,'LOGIN','Usuario','Login exitoso para usuario dvega@tecsup.edu.pe','2025-11-11 05:48:01');
/*!40000 ALTER TABLE `logactividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajes`
--

DROP TABLE IF EXISTS `mensajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes` (
  `id_mensaje` int(11) NOT NULL AUTO_INCREMENT,
  `contenido` text NOT NULL,
  `id_remitente` int(11) NOT NULL,
  `id_destinatario` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL DEFAULT 'texto',
  `fecha_envio` datetime NOT NULL DEFAULT current_timestamp(),
  `leido` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_mensaje`),
  KEY `idx_mensajes_remitente` (`id_remitente`),
  KEY `idx_mensajes_destinatario` (`id_destinatario`),
  KEY `idx_mensajes_conversacion` (`id_remitente`,`id_destinatario`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`id_remitente`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`id_destinatario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes`
--

LOCK TABLES `mensajes` WRITE;
/*!40000 ALTER TABLE `mensajes` DISABLE KEYS */;
INSERT INTO `mensajes` VALUES (1,'hola asesor',43,25,'texto','2025-11-10 21:20:22',0),(2,'asdad',43,25,'texto','2025-11-10 21:20:30',0),(3,'hola soy arturo estudiante',43,25,'texto','2025-11-10 21:21:58',0),(4,'hola soy el asesor',25,43,'texto','2025-11-10 21:22:09',0),(5,'hola',25,43,'texto','2025-11-10 21:29:27',0),(6,'a',43,25,'texto','2025-11-10 21:29:33',0),(7,'a',25,43,'texto','2025-11-10 21:29:40',0),(8,'asda',43,25,'texto','2025-11-10 21:39:09',0),(9,'hola',43,25,'texto','2025-11-10 21:39:15',0),(10,'a',25,43,'texto','2025-11-10 21:39:20',0),(11,'como estas',43,25,'texto','2025-11-10 21:39:29',0),(12,'bien',25,43,'texto','2025-11-10 21:41:44',0),(13,'y tu',43,25,'texto','2025-11-10 21:41:47',0),(14,'Tengo una duda específica sobre la metodología.',25,43,'texto','2025-11-10 21:41:50',0);
/*!40000 ALTER TABLE `mensajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id_message` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL COMMENT 'ID del usuario que envía',
  `receiver_id` int(11) NOT NULL COMMENT 'ID del usuario que recibe',
  `message_text` text NOT NULL COMMENT 'Contenido del mensaje',
  `message_type` enum('text','file','system') DEFAULT 'text',
  `file_url` varchar(500) DEFAULT NULL COMMENT 'URL del archivo adjunto',
  `file_name` varchar(255) DEFAULT NULL COMMENT 'Nombre original del archivo',
  `is_read` tinyint(1) DEFAULT 0 COMMENT '0=no leído, 1=leído',
  `conversation_id` varchar(50) NOT NULL COMMENT 'ID de la conversación (ej: 43-25)',
  `reply_to_id` int(11) DEFAULT NULL COMMENT 'ID del mensaje al que responde',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_message`),
  KEY `messages_reply_fk` (`reply_to_id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_receiver` (`receiver_id`),
  KEY `idx_conversation` (`conversation_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_is_read` (`is_read`),
  CONSTRAINT `messages_receiver_fk` FOREIGN KEY (`receiver_id`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `messages_reply_fk` FOREIGN KEY (`reply_to_id`) REFERENCES `messages` (`id_message`) ON DELETE SET NULL,
  CONSTRAINT `messages_sender_fk` FOREIGN KEY (`sender_id`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metricasreportes`
--

DROP TABLE IF EXISTS `metricasreportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metricasreportes` (
  `id_metrica` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_metrica` varchar(50) NOT NULL,
  `id_referencia` int(11) DEFAULT NULL COMMENT 'ID del asesor, estudiante, etc.',
  `nombre_referencia` varchar(100) DEFAULT NULL,
  `valor_numerico` decimal(10,2) DEFAULT NULL,
  `valor_texto` varchar(255) DEFAULT NULL,
  `periodo` varchar(20) DEFAULT NULL COMMENT 'mensual, anual, etc.',
  `fecha_calculo` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_metrica`),
  KEY `idx_tipo_metrica` (`tipo_metrica`),
  KEY `idx_fecha_calculo` (`fecha_calculo`),
  KEY `idx_periodo` (`periodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metricasreportes`
--

LOCK TABLES `metricasreportes` WRITE;
/*!40000 ALTER TABLE `metricasreportes` DISABLE KEYS */;
/*!40000 ALTER TABLE `metricasreportes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('plazo','comentario','reunion','estado','general','documento') NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `leido` tinyint(1) DEFAULT 0,
  `id_referencia` int(11) DEFAULT NULL COMMENT 'ID del objeto relacionado',
  `tipo_referencia` enum('documento','reunion','tesis','comentario') DEFAULT NULL,
  `prioridad` enum('baja','media','alta') DEFAULT 'media',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_notificacion`),
  KEY `idx_notificacion_usuario` (`id_usuario`),
  KEY `idx_notificacion_leido` (`leido`),
  KEY `idx_notificacion_tipo` (`tipo`),
  CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (1,25,'? Nueva solicitud de reunión de Carlos Arturo Bullon Supanta para el 2025-10-16 de 08:00 a 08:30. Tema: Reunión de seguimiento de tesis','reunion','2025-10-12 04:48:19',0,5,'reunion','alta','2025-10-12 04:48:19','2025-10-12 04:48:19'),(2,25,'? Nueva solicitud de reunión de Carlos Arturo Bullon Supanta para el 2025-10-16 de 08:30 a 09:00. Tema: Reunión de seguimiento de tesis','reunion','2025-10-12 04:48:29',0,6,'reunion','alta','2025-10-12 04:48:29','2025-10-12 04:48:29'),(3,25,'? Nueva solicitud de reunión de Carlos Arturo Bullon Supanta para el 2025-10-16 de 09:00 a 09:30. Tema: Reunión de seguimiento de tesis','reunion','2025-10-12 04:48:56',0,7,'reunion','alta','2025-10-12 04:48:56','2025-10-12 04:48:56'),(4,43,'✅ Tu reunión del 2025-10-16 a las 09:00 fue APROBADA por Diego Pizarro. Ubicación: Oficina A-205 Enlace: https://meet.google.com/abc-xyz','reunion','2025-10-12 04:53:21',0,7,'reunion','alta','2025-10-12 04:53:21','2025-10-12 04:53:21'),(5,25,'? Nueva solicitud de reunión de Carlos Arturo Bullon Supanta para el 2025-10-16 de 11:00 a 11:30. Tema: Reunión de seguimiento de tesis','reunion','2025-10-12 19:51:35',0,8,'reunion','alta','2025-10-12 19:51:35','2025-10-12 19:51:35'),(6,25,'Un estudiante actualizó su información de tesis: aaaaaaaaaaaaaaaa','estado','2025-10-13 02:47:43',0,12,'tesis','baja','2025-10-13 02:47:43','2025-10-13 02:47:43'),(7,25,'Un estudiante actualizó su información de tesis: aaaaaaaaaaaaaaaaewqeqe','estado','2025-10-13 04:29:57',0,12,'tesis','baja','2025-10-13 04:29:57','2025-10-13 04:29:57'),(8,25,'Un estudiante actualizó su información de tesis: eeeeeeeeeeeeeeeeeeeeeeeeeeeev','estado','2025-10-22 19:51:37',0,12,'tesis','baja','2025-10-22 19:51:37','2025-10-22 19:51:37'),(9,25,'Un estudiante actualizó su información de tesis: TESIS PRUEBA ARTURO','estado','2025-10-29 05:52:52',0,12,'tesis','baja','2025-10-29 05:52:52','2025-10-29 05:52:52'),(10,25,'Un estudiante subió un nuevo documento en Fase 3: Marco Teórico: TrabajoIndividual Belgica.pdf','documento','2025-10-29 07:39:06',0,NULL,'documento','media','2025-10-29 07:39:06','2025-10-29 07:39:06'),(11,43,'✅ Documento \"TrabajoIndividual Belgica.pdf\" subido exitosamente en Fase 3: Marco Teórico. Tu asesor será notificado.','documento','2025-10-29 07:39:06',0,NULL,'documento','baja','2025-10-29 07:39:06','2025-10-29 07:39:06'),(12,25,'Un estudiante subió un nuevo documento en Fase 3: Marco Teórico: 19362.pdf','documento','2025-10-31 05:51:54',0,NULL,'documento','media','2025-10-31 05:51:54','2025-10-31 05:51:54'),(13,43,'✅ Documento \"19362.pdf\" subido exitosamente en Fase 3: Marco Teórico. Tu asesor será notificado.','documento','2025-10-31 05:51:54',0,NULL,'documento','baja','2025-10-31 05:51:54','2025-10-31 05:51:54'),(14,25,'Un estudiante actualizó su información de tesis: TESIS PRUEBA ARTUROaaa','estado','2025-11-02 05:24:26',0,12,'tesis','baja','2025-11-02 05:24:26','2025-11-02 05:24:26'),(15,25,'Un estudiante actualizó su información de tesis: TESIS PRUEBA ARTUROaaa','estado','2025-11-02 05:24:46',0,12,'tesis','baja','2025-11-02 05:24:46','2025-11-02 05:24:46'),(16,48,'Un estudiante se registró como tu estudiante con la tesis: sadadasdsadasds','estado','2025-11-02 18:52:18',0,NULL,'tesis','media','2025-11-02 18:52:18','2025-11-02 18:52:18'),(17,48,'Un estudiante subió un nuevo documento en Fase 1: Plan de Proyecto: 19362.pdf','documento','2025-11-02 21:19:51',0,NULL,'documento','media','2025-11-02 21:19:51','2025-11-02 21:19:51'),(19,48,'Un estudiante subió un nuevo documento en Fase 1: Plan de Proyecto: va.docx','documento','2025-11-02 22:04:36',0,NULL,'documento','media','2025-11-02 22:04:36','2025-11-02 22:04:36'),(20,47,'✅ Documento \"va.docx\" subido exitosamente en Fase 1: Plan de Proyecto. Tu asesor será notificado.','documento','2025-11-02 22:04:36',0,NULL,'documento','baja','2025-11-02 22:04:36','2025-11-02 22:04:36'),(21,25,'Un estudiante subió un nuevo documento en Fase 4: Desarrollo: pruebaparatesis.pdf','documento','2025-11-05 04:34:13',0,NULL,'documento','media','2025-11-05 04:34:13','2025-11-05 04:34:13'),(22,43,'✅ Documento \"pruebaparatesis.pdf\" subido exitosamente en Fase 4: Desarrollo. Tu asesor será notificado.','documento','2025-11-05 04:34:13',0,NULL,'documento','baja','2025-11-05 04:34:13','2025-11-05 04:34:13'),(23,25,'Un estudiante subió un nuevo documento en Fase 4: Desarrollo: pruebaparatesis.pdf','documento','2025-11-05 05:19:54',0,NULL,'documento','media','2025-11-05 05:19:54','2025-11-05 05:19:54'),(24,43,'✅ Documento \"pruebaparatesis.pdf\" subido exitosamente en Fase 4: Desarrollo. Tu asesor será notificado.','documento','2025-11-05 05:19:54',0,NULL,'documento','baja','2025-11-05 05:19:54','2025-11-05 05:19:54'),(25,25,'Un estudiante se registró como tu estudiante con la tesis: Geolocalizacion de Aulas','estado','2025-11-07 19:19:01',0,NULL,'tesis','media','2025-11-07 19:19:01','2025-11-07 19:19:01'),(26,25,'Un estudiante subió un nuevo documento en Fase 1: Plan de Proyecto: 19362.pdf','documento','2025-11-07 19:32:30',0,NULL,'documento','media','2025-11-07 19:32:30','2025-11-07 19:32:30'),(28,25,'Un estudiante subió un nuevo documento en Fase 1: Plan de Proyecto: 19362.pdf','documento','2025-11-07 19:33:52',0,NULL,'documento','media','2025-11-07 19:33:52','2025-11-07 19:33:52'),(29,49,'✅ Documento \"19362.pdf\" subido exitosamente en Fase 1: Plan de Proyecto. Tu asesor será notificado.','documento','2025-11-07 19:33:52',1,NULL,'documento','baja','2025-11-07 19:33:52','2025-11-07 20:59:59'),(30,25,'Un estudiante subió un nuevo documento en Fase 2: Diagnóstico: pruebaparatesis.pdf','documento','2025-11-07 19:34:53',0,NULL,'documento','media','2025-11-07 19:34:53','2025-11-07 19:34:53'),(31,49,'✅ Documento \"pruebaparatesis.pdf\" subido exitosamente en Fase 2: Diagnóstico. Tu asesor será notificado.','documento','2025-11-07 19:34:53',1,NULL,'documento','baja','2025-11-07 19:34:53','2025-11-07 21:00:15'),(32,25,'Un estudiante subió un nuevo documento en Fase 2: Diagnóstico: pruebaparatesis.pdf','documento','2025-11-07 20:24:46',0,NULL,'documento','media','2025-11-07 20:24:46','2025-11-07 20:24:46'),(33,49,'✅ Documento \"pruebaparatesis.pdf\" subido exitosamente en Fase 2: Diagnóstico. Tu asesor será notificado.','documento','2025-11-07 20:24:46',1,NULL,'documento','baja','2025-11-07 20:24:46','2025-11-07 21:00:25'),(34,25,'Un estudiante subió un nuevo documento en Fase 2: Diagnóstico: 19362.pdf','documento','2025-11-07 20:39:11',0,NULL,'documento','media','2025-11-07 20:39:11','2025-11-07 20:39:11'),(36,25,'Un estudiante subió un nuevo documento en Fase 2: Diagnóstico: PA03 TALL ART VISUALES.pdf','documento','2025-11-07 20:45:00',0,26,'documento','media','2025-11-07 20:45:00','2025-11-07 20:45:00'),(38,25,'Un estudiante subió un nuevo documento en Fase 4: Desarrollo: Proceso Escala tonal.pdf','documento','2025-11-07 21:11:35',0,NULL,'documento','media','2025-11-07 21:11:35','2025-11-07 21:11:35'),(39,43,'✅ Documento \"Proceso Escala tonal.pdf\" subido exitosamente en Fase 4: Desarrollo. Tu asesor será notificado.','documento','2025-11-07 21:11:35',0,NULL,'documento','baja','2025-11-07 21:11:35','2025-11-07 21:11:35'),(40,25,'Un estudiante actualizó su información de tesis: TESIS PRUEBAAAA','estado','2025-11-07 21:25:55',0,12,'tesis','baja','2025-11-07 21:25:55','2025-11-07 21:25:55'),(41,25,'Un estudiante subió un nuevo documento en Fase 1: Plan de Proyecto: PA03 NICOLAS BULLON SUPANTA (1).pdf','documento','2025-11-07 21:26:41',0,NULL,'documento','media','2025-11-07 21:26:41','2025-11-07 21:26:41'),(42,43,'✅ Documento \"PA03 NICOLAS BULLON SUPANTA (1).pdf\" subido exitosamente en Fase 1: Plan de Proyecto. Tu asesor será notificado.','documento','2025-11-07 21:26:41',0,NULL,'documento','baja','2025-11-07 21:26:41','2025-11-07 21:26:41'),(43,25,'Un estudiante subió un nuevo documento en Fase 2: Diagnóstico: marilynbuendia,+100-425-1-CE.pdf','documento','2025-11-07 21:44:31',0,NULL,'documento','media','2025-11-07 21:44:31','2025-11-07 21:44:31'),(44,49,'✅ Documento \"marilynbuendia,+100-425-1-CE.pdf\" subido exitosamente en Fase 2: Diagnóstico. Tu asesor será notificado.','documento','2025-11-07 21:44:31',0,NULL,'documento','baja','2025-11-07 21:44:31','2025-11-07 21:44:31'),(45,25,'Un estudiante se registró como tu estudiante con la tesis: TESIS PARA TECSUP','estado','2025-11-07 22:34:42',0,NULL,'tesis','media','2025-11-07 22:34:42','2025-11-07 22:34:42'),(46,25,'Un estudiante actualizó su información de tesis: TESIS PARA TECSUP','estado','2025-11-07 22:35:04',0,17,'tesis','baja','2025-11-07 22:35:04','2025-11-07 22:35:04'),(47,25,'Un estudiante subió un nuevo documento en Fase 1: Plan de Proyecto: 3220 pa02.pdf','documento','2025-11-07 22:35:29',0,NULL,'documento','media','2025-11-07 22:35:29','2025-11-07 22:35:29'),(48,50,'✅ Documento \"3220 pa02.pdf\" subido exitosamente en Fase 1: Plan de Proyecto. Tu asesor será notificado.','documento','2025-11-07 22:35:29',0,NULL,'documento','baja','2025-11-07 22:35:29','2025-11-07 22:35:29');
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reunion`
--

DROP TABLE IF EXISTS `reunion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reunion` (
  `id_reunion` int(11) NOT NULL AUTO_INCREMENT,
  `id_tesis` int(11) NOT NULL,
  `fecha_reunion` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time DEFAULT NULL,
  `enlace` varchar(500) DEFAULT NULL COMMENT 'URL de videollamada',
  `ubicacion` varchar(255) DEFAULT NULL COMMENT 'Ubicación física',
  `estado` enum('pendiente','aceptada','rechazada','completada','cancelada') DEFAULT 'pendiente',
  `id_asesor` int(11) NOT NULL,
  `id_estudiante` int(11) NOT NULL,
  `agenda` text DEFAULT NULL,
  `comentarios` text DEFAULT NULL,
  `duracion_minutos` int(11) DEFAULT 60,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_reunion`),
  KEY `id_tesis` (`id_tesis`),
  KEY `idx_reunion_fecha` (`fecha_reunion`),
  KEY `idx_reunion_asesor` (`id_asesor`),
  KEY `idx_reunion_estudiante` (`id_estudiante`),
  KEY `idx_reunion_estado` (`estado`),
  CONSTRAINT `reunion_ibfk_1` FOREIGN KEY (`id_tesis`) REFERENCES `tesispretesis` (`id_tesis`) ON DELETE CASCADE,
  CONSTRAINT `reunion_ibfk_2` FOREIGN KEY (`id_asesor`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `reunion_ibfk_3` FOREIGN KEY (`id_estudiante`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reunion`
--

LOCK TABLES `reunion` WRITE;
/*!40000 ALTER TABLE `reunion` DISABLE KEYS */;
INSERT INTO `reunion` VALUES (1,12,'2025-10-28','14:00:00','14:30:00',NULL,NULL,'pendiente',25,43,'Reunión de seguimiento de tesis',NULL,60,'2025-10-12 04:16:47','2025-10-12 04:16:47'),(2,12,'2025-10-16','08:00:00','08:30:00',NULL,NULL,'pendiente',25,43,'Reunión de seguimiento de tesis',NULL,60,'2025-10-12 04:33:49','2025-10-12 04:33:49'),(3,12,'2025-10-16','08:00:00','08:30:00',NULL,NULL,'pendiente',25,43,'Reunión de seguimiento de tesis',NULL,60,'2025-10-12 04:38:02','2025-10-12 04:38:02'),(4,12,'2025-10-16','08:00:00','08:30:00',NULL,NULL,'pendiente',25,43,'Reunión de seguimiento de tesis',NULL,60,'2025-10-12 04:45:18','2025-10-12 04:45:18'),(5,12,'2025-10-16','08:00:00','08:30:00',NULL,NULL,'pendiente',25,43,'Reunión de seguimiento de tesis',NULL,60,'2025-10-12 04:48:19','2025-10-12 04:48:19'),(6,12,'2025-10-16','08:30:00','09:00:00',NULL,NULL,'pendiente',25,43,'Reunión de seguimiento de tesis',NULL,60,'2025-10-12 04:48:29','2025-10-12 04:48:29'),(7,12,'2025-10-16','09:00:00','09:30:00','https://meet.google.com/abc-xyz','Oficina A-205','aceptada',25,43,'Reunión de seguimiento de tesis','Reunión aprobada - Nos vemos el miércoles',60,'2025-10-12 04:48:56','2025-10-12 04:52:34'),(8,12,'2025-10-16','11:00:00','11:30:00',NULL,NULL,'pendiente',25,43,'Reunión de seguimiento de tesis',NULL,60,'2025-10-12 19:51:35','2025-10-12 19:51:35');
/*!40000 ALTER TABLE `reunion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slots_ocupados`
--

DROP TABLE IF EXISTS `slots_ocupados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slots_ocupados` (
  `id_slot` int(11) NOT NULL AUTO_INCREMENT,
  `id_disponibilidad` int(11) NOT NULL,
  `id_reunion` int(11) DEFAULT NULL,
  `fecha_especifica` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` enum('reservado','ocupado','cancelado') DEFAULT 'reservado',
  `id_estudiante` int(11) DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_slot`),
  KEY `id_reunion` (`id_reunion`),
  KEY `id_estudiante` (`id_estudiante`),
  KEY `idx_slots_fecha` (`fecha_especifica`),
  KEY `idx_slots_estado` (`estado`),
  KEY `idx_slots_disponibilidad` (`id_disponibilidad`),
  CONSTRAINT `slots_ocupados_ibfk_1` FOREIGN KEY (`id_disponibilidad`) REFERENCES `disponibilidadasesor` (`id_disponibilidad`) ON DELETE CASCADE,
  CONSTRAINT `slots_ocupados_ibfk_2` FOREIGN KEY (`id_reunion`) REFERENCES `reunion` (`id_reunion`) ON DELETE SET NULL,
  CONSTRAINT `slots_ocupados_ibfk_3` FOREIGN KEY (`id_estudiante`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slots_ocupados`
--

LOCK TABLES `slots_ocupados` WRITE;
/*!40000 ALTER TABLE `slots_ocupados` DISABLE KEYS */;
INSERT INTO `slots_ocupados` VALUES (1,5,NULL,'2025-10-28','14:00:00','14:30:00','reservado',43,'Reunión agendada','2025-10-12 04:16:47','2025-10-12 04:16:47'),(2,7,5,'2025-10-16','08:00:00','08:30:00','reservado',43,'Reunión pendiente de aprobación','2025-10-12 04:48:19','2025-10-12 04:48:19'),(3,7,6,'2025-10-16','08:30:00','09:00:00','reservado',43,'Reunión pendiente de aprobación','2025-10-12 04:48:29','2025-10-12 04:48:29'),(4,7,7,'2025-10-16','09:00:00','09:30:00','ocupado',43,'Reunión confirmada','2025-10-12 04:48:56','2025-10-12 04:53:15'),(5,7,8,'2025-10-16','11:00:00','11:30:00','reservado',43,'Reunión pendiente de aprobación','2025-10-12 19:51:35','2025-10-12 19:51:35');
/*!40000 ALTER TABLE `slots_ocupados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tesispretesis`
--

DROP TABLE IF EXISTS `tesispretesis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tesispretesis` (
  `id_tesis` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario_estudiante` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('pendiente','en_proceso','entregado','revisado','aprobado','rechazado') DEFAULT 'pendiente',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_aprobacion` timestamp NULL DEFAULT NULL,
  `fecha_limite` date DEFAULT NULL COMMENT 'Fecha límite de entrega',
  `id_asesor` int(11) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `tipo` enum('tesis','pretesis') NOT NULL,
  `fase_actual` enum('propuesta','desarrollo','revision','sustentacion') DEFAULT 'propuesta',
  `progreso_porcentaje` decimal(5,2) DEFAULT 0.00,
  `calificacion` decimal(4,2) DEFAULT NULL COMMENT 'Nota final',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_tesis`),
  KEY `idx_tesis_estudiante` (`id_usuario_estudiante`),
  KEY `idx_tesis_asesor` (`id_asesor`),
  KEY `idx_tesis_estado` (`estado`),
  KEY `idx_tesis_fase` (`fase_actual`),
  KEY `idx_tesis_fecha_limite` (`fecha_limite`),
  CONSTRAINT `tesispretesis_ibfk_1` FOREIGN KEY (`id_usuario_estudiante`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `tesispretesis_ibfk_2` FOREIGN KEY (`id_asesor`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tesispretesis`
--

LOCK TABLES `tesispretesis` WRITE;
/*!40000 ALTER TABLE `tesispretesis` DISABLE KEYS */;
INSERT INTO `tesispretesis` VALUES (12,43,'TESIS PRUEBAAAA','PRUEBA1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111','pendiente','2025-10-09 00:20:33',NULL,'2026-04-09',25,NULL,'pretesis','propuesta',5.00,NULL,'2025-10-09 00:20:33','2025-11-07 21:25:54'),(15,47,'sadadasdsadasds','sadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdassadasdasdas','pendiente','2025-11-02 18:52:18',NULL,'2026-05-02',48,NULL,'pretesis','propuesta',5.00,NULL,'2025-11-02 18:52:18','2025-11-02 18:52:18'),(16,49,'Geolocalizacion de Aulas','asdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasda','pendiente','2025-11-07 19:19:01',NULL,'2026-05-07',25,NULL,'pretesis','propuesta',5.00,NULL,'2025-11-07 19:19:01','2025-11-07 19:19:01'),(17,50,'TESIS PARA TECSUP','ASDADASDASDADASDASDADASDASDADASDASDADASDASDADASDASDADASDASDADASDASDADASDASDADASDASDADASDASDADASDASDADASDASDADASDASDADASDASDADASDsdada','pendiente','2025-11-07 22:34:42',NULL,'2026-05-07',25,NULL,'pretesis','propuesta',5.00,NULL,'2025-11-07 22:34:42','2025-11-07 22:35:04');
/*!40000 ALTER TABLE `tesispretesis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo_institucional` varchar(150) NOT NULL,
  `contraseña` varchar(255) DEFAULT NULL COMMENT 'Opcional para OAuth2',
  `google_id` varchar(100) DEFAULT NULL COMMENT 'ID de Google OAuth2',
  `avatar_url` varchar(500) DEFAULT NULL COMMENT 'URL de foto de perfil',
  `provider` enum('google','manual') DEFAULT 'google',
  `telefono` varchar(20) DEFAULT NULL,
  `codigo_estudiante` varchar(20) DEFAULT NULL COMMENT 'Código único del estudiante',
  `especialidad` varchar(100) DEFAULT NULL COMMENT 'Para asesores',
  `rol` enum('estudiante','asesor','coordinador') NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `primer_acceso` tinyint(1) DEFAULT 1 COMMENT 'Para redirigir a completar perfil',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_ultimo_acceso` timestamp NULL DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ciclo_actual` int(11) DEFAULT 1 COMMENT 'Ciclo académico actual del estudiante',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo_institucional` (`correo_institucional`),
  UNIQUE KEY `google_id` (`google_id`),
  KEY `idx_usuario_correo` (`correo_institucional`),
  KEY `idx_usuario_google_id` (`google_id`),
  KEY `idx_usuario_rol` (`rol`),
  KEY `idx_usuario_estado` (`estado`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (15,'Dr. Miguel Angel','Herrera Vásquez','miguel.herrera@tecsup.edu.pe',NULL,'google_miguel_001','https://ui-avatars.com/api/?name=Miguel+Herrera&background=1976d2&color=fff','google',NULL,NULL,'Desarrollo de Software','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(16,'Ing. Patricia Elena','Sánchez Morales','patricia.sanchez@tecsup.edu.pe',NULL,'google_patricia_002','https://ui-avatars.com/api/?name=Patricia+Sanchez&background=e91e63&color=fff','google',NULL,NULL,'Inteligencia Artificial','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(17,'Dr. Fernando José','Castillo Ruiz','fernando.castillo@tecsup.edu.pe',NULL,'google_fernando_003','https://ui-avatars.com/api/?name=Fernando+Castillo&background=4caf50&color=fff','google',NULL,NULL,'Ciberseguridad','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(18,'Mg. Sofia Alejandra','Ramírez Torres','sofia.ramirez@tecsup.edu.pe',NULL,'google_sofia_004','https://ui-avatars.com/api/?name=Sofia+Ramirez&background=ff9800&color=fff','google',NULL,NULL,'Big Data y Analytics','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(19,'Ing. Ricardo Manuel','Flores Quispe','ricardo.flores@tecsup.edu.pe',NULL,'google_ricardo_005','https://ui-avatars.com/api/?name=Ricardo+Flores&background=795548&color=fff','google',NULL,NULL,'Automatización Industrial','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(20,'Dr. Carmen Rosa','Delgado Huamán','carmen.delgado@tecsup.edu.pe',NULL,'google_carmen_006','https://ui-avatars.com/api/?name=Carmen+Delgado&background=9c27b0&color=fff','google',NULL,NULL,'Gestión de Calidad','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(21,'Ing. Luis Eduardo','Vargas Silva','luis.vargas@tecsup.edu.pe',NULL,'google_luis_007','https://ui-avatars.com/api/?name=Luis+Vargas&background=3f51b5&color=fff','google',NULL,NULL,'Producción y Manufactura','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(22,'Mg. Andrea Beatriz','Jiménez Cruz','andrea.jimenez@tecsup.edu.pe',NULL,'google_andrea_008','https://ui-avatars.com/api/?name=Andrea+Jimenez&background=f44336&color=fff','google',NULL,NULL,'Mecatrónica Industrial','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(23,'Dr. Javier Alejandro','Paredes Mamani','javier.paredes@tecsup.edu.pe',NULL,'google_javier_009','https://ui-avatars.com/api/?name=Javier+Paredes&background=009688&color=fff','google',NULL,NULL,'Sistemas Embebidos','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(24,'Ing. Claudia Esperanza','Moreno Gonzales','claudia.moreno@tecsup.edu.pe',NULL,'google_claudia_010','https://ui-avatars.com/api/?name=Claudia+Moreno&background=607d8b&color=fff','google',NULL,NULL,'Robótica Aplicada','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(25,'Mg. Diego Armando','Vega Medina','dvega@tecsup.edu.pe','asesor2025','google_diego_011','https://ui-avatars.com/api/?name=Diego+Vega&background=cddc39&color=000','manual',NULL,NULL,'Diseño Industrial','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-22 20:07:02',NULL),(26,'Lic. Gabriela Isabel','Chávez Rojas','gabriela.chavez@tecsup.edu.pe',NULL,'google_gabriela_012','https://ui-avatars.com/api/?name=Gabriela+Chavez&background=ff5722&color=fff','google',NULL,NULL,'Videojuegos y Simuladores','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(27,'MBA. Rodrigo Antonio','Campos Villanueva','rodrigo.campos@tecsup.edu.pe',NULL,'google_rodrigo_013','https://ui-avatars.com/api/?name=Rodrigo+Campos&background=2196f3&color=fff','google',NULL,NULL,'Negocios Internacionales','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(28,'Dra. Valentina Lucia','Espinoza Ñahui','valentina.espinoza@tecsup.edu.pe',NULL,'google_valentina_014','https://ui-avatars.com/api/?name=Valentina+Espinoza&background=673ab7&color=fff','google',NULL,NULL,'Marketing Digital','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(29,'Ing. Héctor Raúl','Ticona Apaza','hector.ticona@tecsup.edu.pe',NULL,'google_hector_015','https://ui-avatars.com/api/?name=Hector+Ticona&background=8bc34a&color=fff','google',NULL,NULL,'Maquinaria Pesada','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(30,'Mg. Elena Victoria','Bustamante Cáceres','elena.bustamante@tecsup.edu.pe',NULL,'google_elena_016','https://ui-avatars.com/api/?name=Elena+Bustamante&background=ff9900&color=fff','google',NULL,NULL,'Mantenimiento Industrial','asesor','activo',0,'2025-09-29 01:55:44',NULL,'2025-09-29 01:55:44','2025-10-13 04:30:41',NULL),(43,'Carlos','Arturo Bullon Supanta','carlos.bullon@tecsup.edu.pe',NULL,'111358151882324309644','https://lh3.googleusercontent.com/a/ACg8ocJnveMiiS2vNwjzzvKXUwMfKNLVDqZuK69wnnUxo7xv97lkSg=s96-c','google',NULL,'113123','Diseño Industrial','estudiante','activo',0,'2025-10-09 00:12:20','2025-11-11 05:28:35','2025-10-09 00:12:20','2025-11-11 05:28:35',5),(46,'Juan','Pérez','juan.perez@tecsup.edu.pe','123456',NULL,NULL,'manual','999999999',NULL,'Ingeniería de Software','asesor','activo',1,'2025-10-13 03:16:15',NULL,'2025-10-13 03:16:15','2025-10-13 04:30:41',NULL),(47,'Kenny','Gerrard Palacin Cristobal','kenny.palacin@tecsup.edu.pe',NULL,'116608737803605797635','https://lh3.googleusercontent.com/a/ACg8ocISQLrmYCM0VmbABqSeWymoDXvz62S2PnwBpV7VDa5Z30aClLM=s96-c','google',NULL,'111222','Arquitectura de Plataformas y Servicios de TI','estudiante','activo',0,'2025-11-02 06:20:52','2025-11-10 18:30:25','2025-11-02 06:20:52','2025-11-10 18:30:25',6),(48,'Dr. JuanPrueba','Pérez','j.perez@tecsup.edu.pe',NULL,NULL,NULL,'google',NULL,NULL,'Arquitectura de Plataformas y Servicios de TI','asesor','activo',1,'2025-11-02 06:24:36',NULL,'2025-11-02 06:24:36','2025-11-02 06:24:36',1),(49,'Fabrizio','Valdez Zevallos','fabrizio.valdez@tecsup.edu.pe',NULL,'108435548742619770664','https://lh3.googleusercontent.com/a/ACg8ocI8s-tt9raX32UC1Nlwi0sE7-LpJ8UIFfaZrIfJC5lAieYMiw=s96-c','google',NULL,'111222','Diseño Industrial','estudiante','activo',0,'2025-11-07 19:01:01','2025-11-07 19:11:17','2025-11-07 19:01:01','2025-11-07 19:11:17',6),(50,'Melanie','Nieves Chavez','melanie.nieves@tecsup.edu.pe',NULL,'105103803321071535344','https://lh3.googleusercontent.com/a/ACg8ocKCc29caEubTRMnA-6Ov6UGucaeQA86v6X-tHI6dk5qDKb5GA=s96-c','google',NULL,'123451','Diseño Industrial','estudiante','activo',0,'2025-11-07 19:08:21','2025-11-07 22:34:01','2025-11-07 19:08:21','2025-11-07 22:34:01',6);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-11  2:17:41
