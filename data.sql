-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: task_flow
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `tbl_attachment`
--

DROP TABLE IF EXISTS `tbl_attachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_attachment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `size` bigint DEFAULT NULL,
  `comment_id` bigint DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9ofj6snjy8a06lt5wj7v1h4l8` (`comment_id`),
  CONSTRAINT `FK9ofj6snjy8a06lt5wj7v1h4l8` FOREIGN KEY (`comment_id`) REFERENCES `tbl_comment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_attachment`
--

LOCK TABLES `tbl_attachment` WRITE;
/*!40000 ALTER TABLE `tbl_attachment` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_attachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_board`
--

DROP TABLE IF EXISTS `tbl_board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_board` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_on` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `last_updated_on` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `project_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtqrfhdctdg89al55w8udcksu1` (`project_id`),
  CONSTRAINT `FKtqrfhdctdg89al55w8udcksu1` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_board`
--

LOCK TABLES `tbl_board` WRITE;
/*!40000 ALTER TABLE `tbl_board` DISABLE KEYS */;
INSERT INTO `tbl_board` VALUES (2,'2026-01-15 05:09:12.156274','2323','2026-01-15 05:09:12.156274','Board 1',6,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(3,'2026-01-17 08:23:15.571620','test 1','2026-01-17 08:23:15.571620','Board 1',7,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(4,'2026-01-21 16:06:49.748922','đá','2026-01-21 16:06:49.748922','board 1',8,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(5,'2026-01-24 16:23:23.274995','','2026-01-25 03:34:50.312306','TaskFlow Sprint 1 Board',9,'2026-01-25 10:34:50.278988','2026-01-24 23:23:23.018815');
/*!40000 ALTER TABLE `tbl_board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_board_column`
--

DROP TABLE IF EXISTS `tbl_board_column`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_board_column` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `column_order` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `board_id` bigint DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKj73nnp7bn08t88lkjyjm4wg68` (`board_id`),
  CONSTRAINT `FKj73nnp7bn08t88lkjyjm4wg68` FOREIGN KEY (`board_id`) REFERENCES `tbl_board` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_board_column`
--

LOCK TABLES `tbl_board_column` WRITE;
/*!40000 ALTER TABLE `tbl_board_column` DISABLE KEYS */;
INSERT INTO `tbl_board_column` VALUES (3,0,'TODO',2,NULL,NULL,NULL),(4,1,'DOING',2,NULL,NULL,NULL),(5,2,'DONE',2,NULL,NULL,NULL),(7,0,'TODO',3,'#dfe1e6',NULL,NULL),(8,1,'DOING',3,'#deebff',NULL,NULL),(9,2,'DONE',3,'#e3fcef',NULL,NULL),(10,0,'TODO',4,'#dfe1e6',NULL,NULL),(11,1,'DOING',4,'#dfe1e6',NULL,NULL),(12,2,'DONE',4,'#e3fcef',NULL,NULL),(13,0,'TODO',5,'#dfe1e6','2026-01-24 23:23:23.310090','2026-01-24 23:23:23.310090'),(14,1,'DOING',5,'#e6fcff','2026-01-24 23:24:11.433723','2026-01-24 23:23:23.329864'),(15,2,'DONE',5,'#e3fcef','2026-01-24 23:23:23.332492','2026-01-24 23:23:23.332492');
/*!40000 ALTER TABLE `tbl_board_column` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_comment`
--

DROP TABLE IF EXISTS `tbl_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_comment` varchar(255) DEFAULT NULL,
  `comment` text,
  `created_on` datetime(6) DEFAULT NULL,
  `updated_on` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `task_id` bigint DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgjlkbaxyvqqrmxeoxh6pb4oj7` (`user_id`),
  KEY `FKd7wxny1cwgtv46xslor783cm0` (`task_id`),
  CONSTRAINT `FKd7wxny1cwgtv46xslor783cm0` FOREIGN KEY (`task_id`) REFERENCES `tbl_task` (`id`),
  CONSTRAINT `FKgjlkbaxyvqqrmxeoxh6pb4oj7` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_comment`
--

LOCK TABLES `tbl_comment` WRITE;
/*!40000 ALTER TABLE `tbl_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_notification`
--

DROP TABLE IF EXISTS `tbl_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `reference_link` varchar(255) DEFAULT NULL,
  `type` tinyint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK17xlvi4d2o1r18carkq5kmd3c` (`user_id`),
  CONSTRAINT `FK17xlvi4d2o1r18carkq5kmd3c` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `tbl_notification_chk_1` CHECK ((`type` between 0 and 2))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_notification`
--

LOCK TABLES `tbl_notification` WRITE;
/*!40000 ALTER TABLE `tbl_notification` DISABLE KEYS */;
INSERT INTO `tbl_notification` VALUES (1,'admin@taskflow.com assigned you to task: Viết API Login/Register','2026-01-25 11:11:07.355767',_binary '\0','/project/task/35',0,3,'2026-01-25 11:11:07.355767'),(2,'admin@taskflow.com assigned you to task: Dựng khung Project React','2026-01-25 11:11:22.972585',_binary '\0','/project/task/38',0,3,'2026-01-25 11:11:22.972585'),(3,'admin@taskflow.com assigned you to task: Lỗi hiển thị font chữ','2026-01-25 11:11:48.065329',_binary '\0','/project/task/37',0,2,'2026-01-25 11:11:48.065329'),(4,'admin@taskflow.com assigned you to task: test','2026-01-25 11:16:47.927062',_binary '','/project/task/42',0,1,'2026-01-25 11:17:22.184092'),(5,'admin@taskflow.com assigned you to task: Thiết kế database','2026-01-25 11:16:58.547302',_binary '','/project/task/33',0,1,'2026-01-25 11:17:21.609315'),(6,'admin@taskflow.com assigned you to task: Dựng khung Project Spring Boot','2026-01-25 11:19:09.962465',_binary '','/project/task/34',0,1,'2026-01-29 09:51:02.177460');
/*!40000 ALTER TABLE `tbl_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_project`
--

DROP TABLE IF EXISTS `tbl_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_project` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `project_key` varchar(255) DEFAULT NULL,
  `project_status` tinyint DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `owner_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKo46tyxiermi8iqq9mnx2cjeon` (`owner_id`),
  CONSTRAINT `FKo46tyxiermi8iqq9mnx2cjeon` FOREIGN KEY (`owner_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `tbl_project_chk_1` CHECK ((`project_status` between 0 and 2))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_project`
--

LOCK TABLES `tbl_project` WRITE;
/*!40000 ALTER TABLE `tbl_project` DISABLE KEYS */;
INSERT INTO `tbl_project` VALUES (6,'2026-01-15 12:08:58.851370','dsdsds','2026-01-17','Test 4','T3',0,'2026-01-15',1,NULL),(7,'2026-01-17 15:22:59.980769','Test 1','2026-01-25','Test 1','T1',0,'2026-01-17',1,NULL),(8,'2026-01-21 23:06:40.292372','Hihih','2026-01-23','Test 2','T2',0,'2026-01-21',5,'2026-01-24 17:26:02.541563'),(9,'2026-01-24 23:22:59.678916','TaskFLow','2026-01-31','TaskFLow','T',0,'2025-10-01',1,'2026-01-24 23:22:59.834015');
/*!40000 ALTER TABLE `tbl_project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_project_member`
--

DROP TABLE IF EXISTS `tbl_project_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_project_member` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `joined_at` datetime(6) DEFAULT NULL,
  `project_role` tinyint DEFAULT NULL,
  `project_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa62ur8qsvudfyl7d29e9fgu4r` (`project_id`),
  KEY `FKo9ijkxct10akv3y0oyaomngpg` (`user_id`),
  CONSTRAINT `FKa62ur8qsvudfyl7d29e9fgu4r` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`),
  CONSTRAINT `FKo9ijkxct10akv3y0oyaomngpg` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `tbl_project_member_chk_1` CHECK ((`project_role` between 0 and 3))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_project_member`
--

LOCK TABLES `tbl_project_member` WRITE;
/*!40000 ALTER TABLE `tbl_project_member` DISABLE KEYS */;
INSERT INTO `tbl_project_member` VALUES (8,'2026-01-24 17:26:02.419549',1,8,1,'2026-01-24 17:26:02.445869','2026-01-24 17:26:02.445869'),(9,'2026-01-25 10:40:13.268799',1,9,2,'2026-01-25 10:40:13.284947','2026-01-25 10:40:13.284947'),(10,'2026-01-25 10:40:17.775560',1,9,3,'2026-01-25 10:40:17.775560','2026-01-25 10:40:17.775560'),(11,'2026-01-25 10:40:22.289890',1,9,4,'2026-01-25 10:40:22.289890','2026-01-25 10:40:22.289890'),(12,'2026-01-25 10:40:25.967855',1,9,5,'2026-01-29 10:05:48.924162','2026-01-25 10:40:25.967855');
/*!40000 ALTER TABLE `tbl_project_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_role`
--

DROP TABLE IF EXISTS `tbl_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `role_name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_qvw73edihjmt5dyeajs846rs0` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_role`
--

LOCK TABLES `tbl_role` WRITE;
/*!40000 ALTER TABLE `tbl_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_sprint`
--

DROP TABLE IF EXISTS `tbl_sprint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_sprint` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `completed_at` datetime(6) DEFAULT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `status` enum('PLANNING','ACTIVE','COMPLETED') DEFAULT NULL,
  `board_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK33n2j9b99ryrjkxebry6pxts1` (`board_id`),
  CONSTRAINT `FK33n2j9b99ryrjkxebry6pxts1` FOREIGN KEY (`board_id`) REFERENCES `tbl_board` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_sprint`
--

LOCK TABLES `tbl_sprint` WRITE;
/*!40000 ALTER TABLE `tbl_sprint` DISABLE KEYS */;
INSERT INTO `tbl_sprint` VALUES (3,'2026-01-15 23:23:00.690417','2026-01-29 12:13:28.604774','Sprint 1','2026-01-15 12:13:28.604774','2026-01-15 12:15:40.901841','COMPLETED',2,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(4,'2026-01-16 20:41:05.993488','2026-01-29 23:23:08.119866','Sprint 2','2026-01-15 23:23:08.119866','2026-01-15 23:31:01.053888','COMPLETED',2,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(5,'2026-01-16 20:41:35.718340','2026-01-30 20:41:19.687936','Sprint 3','2026-01-16 20:41:19.687936','2026-01-16 20:41:24.995017','COMPLETED',2,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(6,'2026-01-16 20:42:02.864888','2026-01-30 20:41:46.694502','Sprint 4','2026-01-16 20:41:46.694502','2026-01-16 20:41:53.866175','COMPLETED',2,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(7,NULL,'2026-01-30 20:56:13.218780','Sprint 5','2026-01-16 20:56:13.218780','2026-01-16 20:56:17.298183','ACTIVE',2,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(8,NULL,'2026-01-31 15:34:50.087792','Sprint 1','2026-01-17 15:34:50.087792','2026-01-17 15:34:55.713746','ACTIVE',3,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(9,'2026-01-23 02:07:03.469097','2026-02-04 23:23:32.959568','Sprint 1','2026-01-21 23:23:32.959568','2026-01-21 23:23:37.949977','COMPLETED',4,'2026-01-23 02:07:03.583624','2026-01-22 18:44:09.000000'),(10,'2026-01-23 02:07:08.655436','2026-02-06 02:07:05.528312','Sprint 2','2026-01-23 02:07:05.528312','2026-01-23 02:07:07.172112','COMPLETED',4,'2026-01-23 02:07:08.655436','2026-01-23 02:07:05.522047'),(11,'2026-01-23 03:00:28.036885','2026-02-06 02:07:09.961959','Sprint 3','2026-01-23 02:07:09.961959','2026-01-23 02:09:46.086092','COMPLETED',4,'2026-01-23 03:00:28.042747','2026-01-23 02:07:09.961297'),(12,NULL,'2026-02-06 03:00:40.959965','Sprint 4','2026-01-23 03:00:40.959965','2026-01-24 16:51:06.349682','ACTIVE',4,'2026-01-24 16:51:06.367426','2026-01-23 03:00:40.959965'),(13,'2026-01-25 00:46:03.928304','2026-02-07 23:23:39.267205','Sprint 1','2026-01-24 23:23:39.267205','2026-01-24 23:23:40.609067','COMPLETED',5,'2026-01-25 00:46:03.933433','2026-01-24 23:23:39.258204'),(14,'2026-01-25 00:50:01.329261','2026-02-08 00:46:09.244474','Sprint 2','2026-01-25 00:46:09.244474','2026-01-25 00:49:41.212706','COMPLETED',5,'2026-01-25 00:50:01.330985','2026-01-25 00:46:09.244474'),(15,'2026-01-25 01:09:52.020135','2026-02-08 00:59:06.571376','Sprint 3','2026-01-25 00:59:06.571376','2026-01-25 01:00:19.874407','COMPLETED',5,'2026-01-25 01:09:52.059032','2026-01-25 00:59:05.900282'),(16,'2026-01-25 01:36:56.405038','2026-02-08 01:09:56.492902','Sprint 4','2026-01-25 01:09:56.492902','2026-01-25 01:10:21.528367','COMPLETED',5,'2026-01-25 01:36:56.579036','2026-01-25 01:09:56.489978'),(17,'2026-01-25 01:38:51.440953','2026-02-08 01:10:18.360096','Sprint 5','2026-01-25 01:10:18.360096','2026-01-25 01:36:59.198816','COMPLETED',5,'2026-01-25 01:38:51.582103','2026-01-25 01:10:18.360096'),(18,'2026-01-25 11:17:33.494084','2026-02-07 00:00:00.000000','Sprint 6','2026-01-24 00:00:00.000000','2026-01-25 01:45:26.689481','COMPLETED',5,'2026-01-25 11:17:33.526864','2026-01-25 01:41:52.748470'),(19,'2026-01-25 11:17:52.847580','2026-02-07 00:00:00.000000','Sprint 7','2026-01-24 00:00:00.000000','2026-01-25 11:17:47.698987','COMPLETED',5,'2026-01-25 11:17:52.847580','2026-01-25 11:17:36.091096'),(20,NULL,'2026-02-07 00:00:00.000000','Sprint 8','2026-01-24 00:00:00.000000','2026-01-25 11:18:39.093744','ACTIVE',5,'2026-01-25 11:18:39.094812','2026-01-25 11:17:54.383965');
/*!40000 ALTER TABLE `tbl_sprint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_sprint_history`
--

DROP TABLE IF EXISTS `tbl_sprint_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_sprint_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `completed_hours` double DEFAULT NULL,
  `record_date` date NOT NULL,
  `remaining_hours` double DEFAULT NULL,
  `sprint_id` bigint NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnie8xgp2iuy697rc3fpxctutg` (`sprint_id`,`record_date`),
  CONSTRAINT `FK3vkgc0x19saosya7r66qej7jq` FOREIGN KEY (`sprint_id`) REFERENCES `tbl_sprint` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_sprint_history`
--

LOCK TABLES `tbl_sprint_history` WRITE;
/*!40000 ALTER TABLE `tbl_sprint_history` DISABLE KEYS */;
INSERT INTO `tbl_sprint_history` VALUES (2,0,'2026-01-23',3,11,'2026-01-23 02:17:51.625917','2026-01-23 02:17:51.625917'),(5,0,'2026-01-24',0,12,'2026-01-24 16:52:13.782827','2026-01-24 16:52:13.782827'),(6,0,'2026-01-24',0,13,'2026-01-24 23:23:40.734835','2026-01-24 23:23:40.734835'),(7,0,'2026-01-24',0,7,'2026-01-24 23:59:01.259811','2026-01-24 23:59:01.259811'),(8,0,'2026-01-24',0,8,'2026-01-24 23:59:01.382021','2026-01-24 23:59:01.382021'),(9,0,'2026-01-25',0,14,'2026-01-25 00:49:41.239872','2026-01-25 00:49:41.239872'),(10,0,'2026-01-25',5,15,'2026-01-25 00:59:58.291151','2026-01-25 00:59:58.291151'),(15,0,'2026-01-25',0,7,'2026-01-25 01:02:59.774019','2026-01-25 01:02:59.774019'),(16,0,'2026-01-25',0,8,'2026-01-25 01:02:59.797447','2026-01-25 01:02:59.797447'),(17,0,'2026-01-25',0,12,'2026-01-25 01:02:59.817267','2026-01-25 01:02:59.817267'),(20,0,'2026-01-25',10,16,'2026-01-25 01:10:11.843894','2026-01-25 01:10:21.592811'),(24,0,'2026-01-25',3,17,'2026-01-25 01:36:59.677878','2026-01-25 01:36:59.677878'),(25,0,'2026-01-25',0,18,'2026-01-25 01:45:26.824506','2026-01-25 01:45:26.824506'),(35,0,'2026-01-25',0,19,'2026-01-25 11:17:47.747956','2026-01-25 11:17:47.747956'),(36,0,'2026-01-25',14,20,'2026-01-25 11:18:25.306561','2026-01-25 11:18:39.104973');
/*!40000 ALTER TABLE `tbl_sprint_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_subtask`
--

DROP TABLE IF EXISTS `tbl_subtask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_subtask` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `completed` bit(1) NOT NULL,
  `title` varchar(255) NOT NULL,
  `task_id` bigint DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6rump38f33rwmspug9fsjak75` (`task_id`),
  CONSTRAINT `FK6rump38f33rwmspug9fsjak75` FOREIGN KEY (`task_id`) REFERENCES `tbl_task` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_subtask`
--

LOCK TABLES `tbl_subtask` WRITE;
/*!40000 ALTER TABLE `tbl_subtask` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_subtask` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_task`
--

DROP TABLE IF EXISTS `tbl_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_task` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `due_date` datetime(6) DEFAULT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `estimate_hours` double DEFAULT NULL,
  `position` double DEFAULT NULL,
  `priority` enum('LOW','MEDIUM','HIGH') DEFAULT NULL,
  `remaining_hours` double DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `status` enum('TODO','DOING','DONE') DEFAULT NULL,
  `task_key` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `assignee_id` bigint DEFAULT NULL,
  `board_id` bigint NOT NULL,
  `board_column_id` bigint DEFAULT NULL,
  `creator_id` bigint DEFAULT NULL,
  `sprint_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKha877vvy0n92s8qw1d9kp13tx` (`assignee_id`),
  KEY `FKqqiq9t75l1snyxgl4sbddqjg2` (`board_id`),
  KEY `FKplnlkbwjxgl8bd3ui2vm3me3r` (`board_column_id`),
  KEY `FKm0tpmxdcoovoiry7e86j3f0o9` (`creator_id`),
  KEY `FKja69fj58i364jrx23hcdlobxo` (`sprint_id`),
  CONSTRAINT `FKha877vvy0n92s8qw1d9kp13tx` FOREIGN KEY (`assignee_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `FKja69fj58i364jrx23hcdlobxo` FOREIGN KEY (`sprint_id`) REFERENCES `tbl_sprint` (`id`),
  CONSTRAINT `FKm0tpmxdcoovoiry7e86j3f0o9` FOREIGN KEY (`creator_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `FKplnlkbwjxgl8bd3ui2vm3me3r` FOREIGN KEY (`board_column_id`) REFERENCES `tbl_board_column` (`id`),
  CONSTRAINT `FKqqiq9t75l1snyxgl4sbddqjg2` FOREIGN KEY (`board_id`) REFERENCES `tbl_board` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_task`
--

LOCK TABLES `tbl_task` WRITE;
/*!40000 ALTER TABLE `tbl_task` DISABLE KEYS */;
INSERT INTO `tbl_task` VALUES (3,NULL,NULL,NULL,NULL,50000,'MEDIUM',NULL,NULL,'DONE',NULL,'dsds',NULL,2,5,NULL,6,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(7,NULL,NULL,NULL,NULL,40000,'MEDIUM',NULL,NULL,'DONE',NULL,'dsd',NULL,2,5,NULL,3,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(8,NULL,NULL,NULL,NULL,10000,'MEDIUM',NULL,NULL,'DONE',NULL,'Task 3',NULL,2,5,NULL,3,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(9,NULL,NULL,NULL,NULL,60000,'MEDIUM',NULL,NULL,'DONE',NULL,'Task 4',NULL,2,5,NULL,6,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(11,NULL,NULL,NULL,NULL,1000,'MEDIUM',NULL,NULL,NULL,NULL,'fdfd',NULL,2,4,NULL,7,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(12,NULL,NULL,NULL,NULL,21000,'MEDIUM',NULL,NULL,'DOING',NULL,'hihi',NULL,3,8,NULL,8,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(13,NULL,NULL,NULL,NULL,31000,'MEDIUM',NULL,NULL,'DOING',NULL,'dfsdsdddddddd',NULL,3,8,NULL,8,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(14,NULL,NULL,NULL,NULL,20000,'MEDIUM',NULL,NULL,'DONE',NULL,'task 1',5,4,12,NULL,9,'2026-01-22 18:44:09.000000','2026-01-22 18:44:09.000000'),(15,NULL,NULL,NULL,4,30000,'HIGH',4,NULL,'DONE',NULL,'task 2',5,4,12,1,11,'2026-01-23 03:00:20.932965','2026-01-22 18:44:09.000000'),(16,NULL,NULL,NULL,NULL,3000,'MEDIUM',NULL,NULL,'TODO',NULL,'sddsd',NULL,4,11,1,NULL,'2026-01-23 02:09:41.558160','2026-01-23 02:09:41.558160'),(17,NULL,NULL,NULL,3,30000,'MEDIUM',3,NULL,'DONE',NULL,'dsds',5,4,12,1,11,'2026-01-23 03:00:20.932965','2026-01-23 02:09:49.182528'),(18,NULL,NULL,NULL,NULL,4000,'MEDIUM',NULL,NULL,'TODO',NULL,'dsds',5,4,11,1,12,'2026-01-24 16:57:54.238846','2026-01-24 16:51:09.307220'),(19,NULL,NULL,NULL,0,5000,'MEDIUM',0,NULL,'TODO',NULL,'hehe',NULL,4,11,1,12,'2026-01-24 16:52:13.802625','2026-01-24 16:51:11.960091'),(20,NULL,NULL,NULL,NULL,1000,'MEDIUM',NULL,NULL,'TODO',NULL,'hehe1',NULL,4,10,1,12,'2026-01-24 16:57:40.373857','2026-01-24 16:57:40.373857'),(21,NULL,NULL,NULL,NULL,2000,'MEDIUM',NULL,NULL,'TODO',NULL,'hehe2',NULL,4,10,1,12,'2026-01-24 17:01:41.983792','2026-01-24 17:01:41.983792'),(22,NULL,'2026-01-30 00:00:00.000000',NULL,NULL,3000,'MEDIUM',NULL,NULL,'TODO',NULL,'hehe3',5,4,10,1,12,'2026-01-24 17:10:58.412937','2026-01-24 17:10:58.412937'),(23,NULL,'2026-01-30 00:00:00.000000',NULL,NULL,4000,'MEDIUM',NULL,'2026-01-24 17:21:01.886952','TODO',NULL,'heheh',NULL,4,10,1,12,'2026-01-24 17:21:07.939014','2026-01-24 17:21:01.911285'),(24,NULL,'2026-01-26 00:00:00.000000',NULL,NULL,41000,'LOW',NULL,'2026-01-24 23:23:35.074461','DONE',NULL,'Use Case',NULL,5,15,1,14,'2026-01-25 00:49:55.838392','2026-01-24 23:23:35.088738'),(25,NULL,NULL,NULL,NULL,21000,'HIGH',NULL,'2026-01-24 23:23:57.638824','DONE',NULL,'Activity Diagram',NULL,5,15,1,13,'2026-01-25 00:45:38.131769','2026-01-24 23:23:57.638824'),(26,NULL,NULL,NULL,NULL,31000,'MEDIUM',NULL,'2026-01-24 23:24:05.674420','DONE',NULL,'ERD',NULL,5,15,1,13,'2026-01-25 00:45:58.317821','2026-01-24 23:24:05.674420'),(27,NULL,'2026-01-26 00:00:00.000000',NULL,NULL,51000,'MEDIUM',NULL,'2026-01-25 00:49:35.977714','DONE',NULL,'Test 2',NULL,5,15,1,14,'2026-01-25 00:49:57.130981','2026-01-25 00:49:35.979727'),(28,NULL,NULL,NULL,5,91000,'MEDIUM',5,'2026-01-25 00:59:53.575224','DONE',NULL,'task 1',NULL,5,15,1,16,'2026-01-25 01:14:25.659588','2026-01-25 00:59:53.587985'),(29,NULL,NULL,NULL,6,71000,'MEDIUM',6,'2026-01-25 01:00:06.372471','DONE',NULL,'task 2',NULL,5,15,1,15,'2026-01-25 01:03:29.620901','2026-01-25 01:00:06.372471'),(30,NULL,NULL,NULL,4,81000,'MEDIUM',4,'2026-01-25 01:08:26.205356','DONE',NULL,'task 3',NULL,5,15,1,15,'2026-01-25 01:08:38.842626','2026-01-25 01:08:26.471921'),(31,NULL,NULL,NULL,2,101000,'MEDIUM',2,'2026-01-25 01:10:03.577205','DONE',NULL,'task 2',NULL,5,15,1,16,'2026-01-25 01:14:27.272088','2026-01-25 01:10:03.577736'),(33,'Vẽ ERD cho các bảng User, Project, Task',NULL,NULL,3,31000,'HIGH',2,'2026-01-31 00:00:00.000000','TODO',NULL,'Thiết kế database',1,5,13,1,20,'2026-01-25 11:17:59.290162','2026-01-25 10:35:19.680746'),(34,'Init project với các dependencies cần thiết','2026-01-30 00:00:00.000000',NULL,2,121000,'MEDIUM',1,'2026-01-25 10:35:31.105887','DONE',NULL,'Dựng khung Project Spring Boot',1,5,15,1,20,'2026-01-25 11:19:13.473566','2026-01-25 10:35:31.105887'),(35,'Sử dụng JWT để xác thực',NULL,NULL,3,53000,'HIGH',1,'2026-01-29 00:00:00.000000','DOING',NULL,'Viết API Login/Register',3,5,14,1,20,'2026-01-25 11:18:02.717951','2026-01-25 10:35:38.769443'),(36,'Họp với khách hàng để chốt tính năng','2026-01-28 00:00:00.000000',NULL,1,111000,'LOW',1,'2026-01-25 10:35:54.008906','DONE',NULL,'Thu thập yêu cầu',NULL,5,15,1,20,'2026-01-25 11:19:05.874471','2026-01-25 10:35:54.008906'),(37,'Font chữ bị lỗi trên trình duyệt Safari','2026-01-31 00:00:00.000000',NULL,3,84000,'HIGH',1,'2026-01-25 10:36:06.215200','DOING',NULL,'Lỗi hiển thị font chữ',2,5,14,1,20,'2026-01-25 11:18:04.221662','2026-01-25 10:36:06.215200'),(38,NULL,NULL,NULL,2,63000,'MEDIUM',2,'2026-01-25 10:46:12.669735','DOING',NULL,'Dựng khung Project React',3,5,14,1,20,'2026-01-25 11:18:25.290777','2026-01-25 10:46:12.669735');
/*!40000 ALTER TABLE `tbl_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_task_history`
--

DROP TABLE IF EXISTS `tbl_task_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_task_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `field` varchar(255) DEFAULT NULL,
  `new_value` varchar(1000) DEFAULT NULL,
  `old_value` varchar(1000) DEFAULT NULL,
  `task_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrllo1ejcx9glen85qbuhm8fvv` (`task_id`),
  KEY `FK2c1fk05lyvpcp28e7864rk91s` (`user_id`),
  CONSTRAINT `FK2c1fk05lyvpcp28e7864rk91s` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `FKrllo1ejcx9glen85qbuhm8fvv` FOREIGN KEY (`task_id`) REFERENCES `tbl_task` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_task_history`
--

LOCK TABLES `tbl_task_history` WRITE;
/*!40000 ALTER TABLE `tbl_task_history` DISABLE KEYS */;
INSERT INTO `tbl_task_history` VALUES (1,'2026-01-17 15:30:26.354031','status','DONE','TODO',12,1,NULL),(2,'2026-01-17 15:35:01.868683','status','DOING','DONE',12,1,NULL),(3,'2026-01-17 15:35:14.607088','title','dfsdsdddddddd','dfsds',13,1,NULL),(4,'2026-01-21 23:05:49.596303','status','DOING','TODO',13,1,NULL),(5,'2026-01-21 23:23:44.294549','assignee','Nguyễn Ngự Đăng','Unassigned',14,1,NULL),(6,'2026-01-21 23:27:49.323890','assignee','Nguyễn Ngự Đăng','Unassigned',15,1,NULL),(7,'2026-01-21 23:35:19.048186','status','DONE','TODO',14,1,NULL),(8,'2026-01-23 02:17:51.657816','estimateHours','3.0','0',17,1,'2026-01-23 02:17:51.653444'),(9,'2026-01-23 02:17:57.320584','estimateHours','4.0','0',15,1,'2026-01-23 02:17:57.320584'),(10,'2026-01-23 02:18:03.514281','priority','HIGH','MEDIUM',15,1,'2026-01-23 02:18:03.514281'),(11,'2026-01-23 02:18:38.556960','status','DOING','TODO',15,1,'2026-01-23 02:18:38.556960'),(12,'2026-01-23 02:18:41.802072','status','TODO','DOING',15,1,'2026-01-23 02:18:41.802072'),(13,'2026-01-23 02:18:42.454052','status','DOING','TODO',15,1,'2026-01-23 02:18:42.454052'),(14,'2026-01-23 02:18:46.700249','status','DOING','TODO',17,1,'2026-01-23 02:18:46.700249'),(15,'2026-01-23 02:31:44.170813','assignee','Nguyễn Ngự Đăng','Unassigned',17,1,'2026-01-23 02:31:44.161669'),(16,'2026-01-23 03:00:20.860493','status','DONE','DOING',17,1,'2026-01-23 03:00:20.858842'),(17,'2026-01-23 03:00:20.860493','status','DONE','DOING',15,1,'2026-01-23 03:00:20.858842'),(19,'2026-01-24 16:52:13.757398','estimateHours','0.0','0',19,1,'2026-01-24 16:52:13.753467'),(20,'2026-01-24 16:57:54.177604','assignee','Nguyễn Ngự Đăng','Unassigned',18,1,'2026-01-24 16:57:54.177604'),(21,'2026-01-24 17:21:07.939014','dueDate','2026-01-30','None',23,1,'2026-01-24 17:21:07.939014'),(22,'2026-01-24 23:24:18.552449','priority','HIGH','MEDIUM',25,1,'2026-01-24 23:24:18.551449'),(23,'2026-01-24 23:24:26.120632','priority','LOW','MEDIUM',24,1,'2026-01-24 23:24:26.120632'),(24,'2026-01-25 00:45:38.089343','status','DONE','TODO',25,1,'2026-01-25 00:45:38.085146'),(25,'2026-01-25 00:45:38.541897','status','DOING','TODO',24,1,'2026-01-25 00:45:38.541897'),(26,'2026-01-25 00:45:58.317310','status','DONE','TODO',26,1,'2026-01-25 00:45:58.317310'),(27,'2026-01-25 00:49:48.942829','dueDate','2026-01-26','None',27,1,'2026-01-25 00:49:48.942829'),(28,'2026-01-25 00:49:53.543705','dueDate','2026-01-26','None',24,1,'2026-01-25 00:49:53.543705'),(29,'2026-01-25 00:49:55.838392','status','DONE','DOING',24,1,'2026-01-25 00:49:55.838392'),(30,'2026-01-25 00:49:57.127281','status','DONE','TODO',27,1,'2026-01-25 00:49:57.127281'),(31,'2026-01-25 00:59:58.286275','estimateHours','5.0','0',28,1,'2026-01-25 00:59:58.284837'),(33,'2026-01-25 01:00:10.142615','estimateHours','6.0','0',29,1,'2026-01-25 01:00:10.142615'),(35,'2026-01-25 01:02:57.411990','status','DONE','TODO',28,1,'2026-01-25 01:02:57.411469'),(36,'2026-01-25 01:03:29.615783','status','DONE','TODO',29,1,'2026-01-25 01:03:29.615274'),(37,'2026-01-25 01:04:05.806039','status','TODO','DONE',28,1,'2026-01-25 01:04:05.806039'),(39,'2026-01-25 01:08:31.715575','estimateHours','4.0','0',30,1,'2026-01-25 01:08:31.713342'),(40,'2026-01-25 01:08:38.836282','status','DONE','TODO',30,1,'2026-01-25 01:08:38.836282'),(41,'2026-01-25 01:10:11.818269','estimateHours','2.0','0',31,1,'2026-01-25 01:10:11.817691'),(45,'2026-01-25 01:14:25.636870','status','DONE','TODO',28,1,'2026-01-25 01:14:25.634760'),(46,'2026-01-25 01:14:27.265322','status','DONE','TODO',31,1,'2026-01-25 01:14:27.265322'),(48,'2026-01-25 10:36:14.823656','description','New Description','Empty',33,1,'2026-01-25 10:36:14.823656'),(49,'2026-01-25 10:36:23.830791','priority','HIGH','MEDIUM',33,1,'2026-01-25 10:36:23.830791'),(50,'2026-01-25 10:36:42.479526','description','New Description','Empty',34,1,'2026-01-25 10:36:42.479526'),(51,'2026-01-25 10:36:54.116864','priority','HIGH','MEDIUM',35,1,'2026-01-25 10:36:54.116864'),(52,'2026-01-25 10:36:55.192236','description','New Description','Empty',35,1,'2026-01-25 10:36:55.192236'),(53,'2026-01-25 10:37:11.145099','description','New Description','Empty',36,1,'2026-01-25 10:37:11.145099'),(54,'2026-01-25 10:37:15.600881','description','New Description','Old Description',36,1,'2026-01-25 10:37:15.600881'),(55,'2026-01-25 10:37:21.066247','priority','LOW','MEDIUM',36,1,'2026-01-25 10:37:21.066247'),(56,'2026-01-25 10:37:36.469686','description','New Description','Empty',37,1,'2026-01-25 10:37:36.469686'),(57,'2026-01-25 10:37:39.510517','priority','HIGH','MEDIUM',37,1,'2026-01-25 10:37:39.510517'),(58,'2026-01-25 10:41:24.465108','dueDate','2026-01-28','None',36,1,'2026-01-25 10:41:24.465108'),(59,'2026-01-25 10:41:31.653349','dueDate','2026-01-30','None',34,1,'2026-01-25 10:41:31.653349'),(60,'2026-01-25 10:41:37.768979','startDate','2026-01-29','2026-01-25',35,1,'2026-01-25 10:41:37.768979'),(61,'2026-01-25 10:41:43.018740','startDate','2026-01-30','2026-01-25',33,1,'2026-01-25 10:41:43.018740'),(62,'2026-01-25 10:41:44.964824','startDate','2026-01-31','2026-01-30',33,1,'2026-01-25 10:41:44.964824'),(63,'2026-01-25 10:41:49.717342','dueDate','2026-01-31','None',37,1,'2026-01-25 10:41:49.717342'),(64,'2026-01-25 10:41:54.592296','estimateHours','1.0','0',37,1,'2026-01-25 10:41:54.592296'),(65,'2026-01-25 10:41:57.190773','estimateHours','2.0','0',33,1,'2026-01-25 10:41:57.190773'),(66,'2026-01-25 10:41:59.165995','estimateHours','1.0','0',34,1,'2026-01-25 10:41:59.165995'),(67,'2026-01-25 10:42:01.212970','estimateHours','1.0','0',35,1,'2026-01-25 10:42:01.212445'),(68,'2026-01-25 10:42:03.282119','estimateHours','1.0','0',36,1,'2026-01-25 10:42:03.282119'),(69,'2026-01-25 10:42:10.388545','estimateHours','3.0','1.0',37,1,'2026-01-25 10:42:10.388545'),(70,'2026-01-25 10:42:14.194680','estimateHours','3.0','1.0',35,1,'2026-01-25 10:42:14.194680'),(71,'2026-01-25 10:42:17.746496','estimateHours','3.0','2.0',33,1,'2026-01-25 10:42:17.745978'),(72,'2026-01-25 10:42:23.344981','estimateHours','2.0','1.0',34,1,'2026-01-25 10:42:23.344981'),(73,'2026-01-25 10:45:46.837535','status','DONE','TODO',36,1,'2026-01-25 10:45:46.837535'),(74,'2026-01-25 10:47:23.305070','status','DONE','TODO',35,1,'2026-01-25 10:47:23.305070'),(75,'2026-01-25 10:47:24.042018','status','DOING','DONE',35,1,'2026-01-25 10:47:24.042018'),(76,'2026-01-25 10:47:31.496280','status','DOING','TODO',37,1,'2026-01-25 10:47:31.496280'),(77,'2026-01-25 10:47:32.287873','status','TODO','DOING',37,1,'2026-01-25 10:47:32.287873'),(78,'2026-01-25 10:47:34.067580','status','DOING','TODO',33,1,'2026-01-25 10:47:34.067580'),(79,'2026-01-25 10:47:34.763836','status','TODO','DOING',33,1,'2026-01-25 10:47:34.763836'),(80,'2026-01-25 10:47:40.480017','status','DOING','DONE',36,1,'2026-01-25 10:47:40.480017'),(81,'2026-01-25 10:47:41.233111','status','DONE','DOING',36,1,'2026-01-25 10:47:41.233111'),(82,'2026-01-25 10:47:49.720171','status','DONE','TODO',34,1,'2026-01-25 10:47:49.720171'),(83,'2026-01-25 10:47:50.418014','status','DOING','DONE',34,1,'2026-01-25 10:47:50.418014'),(84,'2026-01-25 10:47:53.544154','status','DONE','DOING',35,1,'2026-01-25 10:47:53.544154'),(85,'2026-01-25 10:47:54.117397','status','DOING','DONE',35,1,'2026-01-25 10:47:54.117397'),(86,'2026-01-25 10:47:57.578220','status','DONE','TODO',38,1,'2026-01-25 10:47:57.573947'),(87,'2026-01-25 10:47:58.196739','status','DOING','DONE',38,1,'2026-01-25 10:47:58.196739'),(90,'2026-01-25 11:11:07.243552','assignee','Trần Backend','Unassigned',35,1,'2026-01-25 11:11:07.242470'),(91,'2026-01-25 11:11:22.969573','assignee','Trần Backend','Unassigned',38,1,'2026-01-25 11:11:22.969573'),(92,'2026-01-25 11:11:48.063249','assignee','Lê Frontend','Unassigned',37,1,'2026-01-25 11:11:48.063249'),(93,'2026-01-25 11:11:50.762813','status','DONE','TODO',37,1,'2026-01-25 11:11:50.762813'),(94,'2026-01-25 11:11:51.777352','status','DONE','DOING',34,1,'2026-01-25 11:11:51.777352'),(96,'2026-01-25 11:16:58.540877','assignee','Nguyễn Quản Trị','Unassigned',33,1,'2026-01-25 11:16:58.540877'),(97,'2026-01-25 11:17:05.697008','status','DOING','DONE',36,1,'2026-01-25 11:17:05.697008'),(98,'2026-01-25 11:17:06.495155','status','DOING','DONE',37,1,'2026-01-25 11:17:06.495155'),(99,'2026-01-25 11:17:07.468501','status','DOING','DONE',34,1,'2026-01-25 11:17:07.467954'),(100,'2026-01-25 11:18:25.289065','estimateHours','2.0','0',38,1,'2026-01-25 11:18:25.289065'),(102,'2026-01-25 11:19:05.865895','status','DONE','DOING',36,1,'2026-01-25 11:19:05.865895'),(103,'2026-01-25 11:19:09.959112','assignee','Nguyễn Quản Trị','Unassigned',34,1,'2026-01-25 11:19:09.959112'),(104,'2026-01-25 11:19:13.469973','status','DONE','DOING',34,1,'2026-01-25 11:19:13.469973');
/*!40000 ALTER TABLE `tbl_task_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_task_user`
--

DROP TABLE IF EXISTS `tbl_task_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_task_user` (
  `task_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`task_id`,`user_id`),
  KEY `FKl54ed7dbbh26kh0gladtjcqpl` (`user_id`),
  CONSTRAINT `FK3p0svb3brj29x5nrmy5ejfw27` FOREIGN KEY (`task_id`) REFERENCES `tbl_task` (`id`),
  CONSTRAINT `FKl54ed7dbbh26kh0gladtjcqpl` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_task_user`
--

LOCK TABLES `tbl_task_user` WRITE;
/*!40000 ALTER TABLE `tbl_task_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_task_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user`
--

DROP TABLE IF EXISTS `tbl_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user`
--

LOCK TABLES `tbl_user` WRITE;
/*!40000 ALTER TABLE `tbl_user` DISABLE KEYS */;
INSERT INTO `tbl_user` VALUES (1,'Tuy Hòa, Phú Yên','https://res.cloudinary.com/dho4t8an4/image/upload/v1768753656/avatar/1.png','Bio 1','admin@taskflow.com','Nguyễn Quản Trị','$2a$10$ldCg8rKNN576FcppyM5nDOGp34EY3tWHobZczgO9SovrHdvQeDUPu','0352785821',NULL,NULL),(2,NULL,'https://ui-avatars.com/api/?name=FE&background=random','ReactJS Developer','fe@taskflow.com','Lê Frontend','$2a$10$ldCg8rKNN576FcppyM5nDOGp34EY3tWHobZczgO9SovrHdvQeDUPu',NULL,NULL,NULL),(3,NULL,'https://ui-avatars.com/api/?name=BE&background=random','Java Spring Boot Expert','be@taskflow.com','Trần Backend','$2a$10$ldCg8rKNN576FcppyM5nDOGp34EY3tWHobZczgO9SovrHdvQeDUPu',NULL,NULL,NULL),(4,NULL,'https://ui-avatars.com/api/?name=QA&background=random','QA Engineer','test@taskflow.com','Phạm Tester','$2a$10$ldCg8rKNN576FcppyM5nDOGp34EY3tWHobZczgO9SovrHdvQeDUPu',NULL,NULL,NULL),(5,NULL,NULL,NULL,'dq0202345@gmail.com','Nguyễn Ngự Đăng','$2a$10$ldCg8rKNN576FcppyM5nDOGp34EY3tWHobZczgO9SovrHdvQeDUPu',NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbl_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_has_roles`
--

DROP TABLE IF EXISTS `tbl_user_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_has_roles` (
  `user_id` bigint NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKoktpf1n0uccprr8qyo0vfotvp` (`role_id`),
  CONSTRAINT `FKhd3kfrckp3vwl5613s1r3tu8g` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `FKoktpf1n0uccprr8qyo0vfotvp` FOREIGN KEY (`role_id`) REFERENCES `tbl_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_has_roles`
--

LOCK TABLES `tbl_user_has_roles` WRITE;
/*!40000 ALTER TABLE `tbl_user_has_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_user_has_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-29 10:08:33
