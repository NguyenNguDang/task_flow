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
  PRIMARY KEY (`id`),
  KEY `FKtqrfhdctdg89al55w8udcksu1` (`project_id`),
  CONSTRAINT `FKtqrfhdctdg89al55w8udcksu1` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_board`
--

LOCK TABLES `tbl_board` WRITE;
/*!40000 ALTER TABLE `tbl_board` DISABLE KEYS */;
INSERT INTO `tbl_board` VALUES (1,NULL,NULL,NULL,'Scrum Board',1),(2,'2026-01-15 05:09:12.156274','2323','2026-01-15 05:09:12.156274','Board 1',6);
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
  PRIMARY KEY (`id`),
  KEY `FKj73nnp7bn08t88lkjyjm4wg68` (`board_id`),
  CONSTRAINT `FKj73nnp7bn08t88lkjyjm4wg68` FOREIGN KEY (`board_id`) REFERENCES `tbl_board` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_board_column`
--

LOCK TABLES `tbl_board_column` WRITE;
/*!40000 ALTER TABLE `tbl_board_column` DISABLE KEYS */;
INSERT INTO `tbl_board_column` VALUES (1,1,'Todo',1),(2,2,'Done',1),(3,0,'TODO',2),(4,1,'DOING',2),(5,2,'DONE',2);
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
  PRIMARY KEY (`id`),
  KEY `FK17xlvi4d2o1r18carkq5kmd3c` (`user_id`),
  CONSTRAINT `FK17xlvi4d2o1r18carkq5kmd3c` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `tbl_notification_chk_1` CHECK ((`type` between 0 and 2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_notification`
--

LOCK TABLES `tbl_notification` WRITE;
/*!40000 ALTER TABLE `tbl_notification` DISABLE KEYS */;
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
  PRIMARY KEY (`id`),
  KEY `FKo46tyxiermi8iqq9mnx2cjeon` (`owner_id`),
  CONSTRAINT `FKo46tyxiermi8iqq9mnx2cjeon` FOREIGN KEY (`owner_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `tbl_project_chk_1` CHECK ((`project_status` between 0 and 2))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_project`
--

LOCK TABLES `tbl_project` WRITE;
/*!40000 ALTER TABLE `tbl_project` DISABLE KEYS */;
INSERT INTO `tbl_project` VALUES (1,'2026-01-14 21:45:23.000000','Dự án phát triển hệ thống quản lý công việc Kanban',NULL,'Task Flow Development',NULL,NULL,NULL,1),(2,'2026-01-14 21:45:23.000000','Dự án bán hàng trực tuyến cho khách hàng ABC',NULL,'Website E-commerce',NULL,NULL,NULL,1),(3,'2026-01-14 22:11:38.293480','dsds','2026-01-17','Test 1','T1',0,'2026-01-14',1),(4,'2026-01-14 22:24:06.562579','dsds','2026-01-17','Test 1','T1-409',0,'2026-01-14',1),(5,'2026-01-14 22:24:12.930529','dsds','2026-01-17','Test 1','T1-930',0,'2026-01-14',1),(6,'2026-01-15 12:08:58.851370','dsdsds','2026-01-17','Test 3','T3',0,'2026-01-15',1);
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
  PRIMARY KEY (`id`),
  KEY `FKa62ur8qsvudfyl7d29e9fgu4r` (`project_id`),
  KEY `FKo9ijkxct10akv3y0oyaomngpg` (`user_id`),
  CONSTRAINT `FKa62ur8qsvudfyl7d29e9fgu4r` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`),
  CONSTRAINT `FKo9ijkxct10akv3y0oyaomngpg` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`id`),
  CONSTRAINT `tbl_project_member_chk_1` CHECK ((`project_role` between 0 and 3))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_project_member`
--

LOCK TABLES `tbl_project_member` WRITE;
/*!40000 ALTER TABLE `tbl_project_member` DISABLE KEYS */;
INSERT INTO `tbl_project_member` VALUES (1,NULL,NULL,1,1),(2,NULL,NULL,1,2),(3,NULL,NULL,1,3),(4,NULL,NULL,1,4),(5,NULL,NULL,2,1),(6,NULL,NULL,2,2);
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
  PRIMARY KEY (`id`),
  KEY `FK33n2j9b99ryrjkxebry6pxts1` (`board_id`),
  CONSTRAINT `FK33n2j9b99ryrjkxebry6pxts1` FOREIGN KEY (`board_id`) REFERENCES `tbl_board` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_sprint`
--

LOCK TABLES `tbl_sprint` WRITE;
/*!40000 ALTER TABLE `tbl_sprint` DISABLE KEYS */;
INSERT INTO `tbl_sprint` VALUES (1,NULL,'2026-01-21 21:47:26.000000','Sprint 1: MVP Release','2026-01-11 21:47:26.000000','2026-01-11 21:47:26.000000','ACTIVE',1),(2,NULL,'2026-02-01 21:47:26.000000','Sprint 2: Advanced Features','2026-01-22 21:47:26.000000',NULL,'PLANNING',1),(3,NULL,'2026-01-29 12:13:28.604774','Sprint 1','2026-01-15 12:13:28.604774','2026-01-15 12:15:40.901841','ACTIVE',2);
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnie8xgp2iuy697rc3fpxctutg` (`sprint_id`,`record_date`),
  CONSTRAINT `FK3vkgc0x19saosya7r66qej7jq` FOREIGN KEY (`sprint_id`) REFERENCES `tbl_sprint` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_sprint_history`
--

LOCK TABLES `tbl_sprint_history` WRITE;
/*!40000 ALTER TABLE `tbl_sprint_history` DISABLE KEYS */;
INSERT INTO `tbl_sprint_history` VALUES (1,0,'2026-01-15',4,1);
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
INSERT INTO `tbl_subtask` VALUES (1,_binary '\0','Sub test 1',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_task`
--

LOCK TABLES `tbl_task` WRITE;
/*!40000 ALTER TABLE `tbl_task` DISABLE KEYS */;
INSERT INTO `tbl_task` VALUES (1,'',NULL,NULL,2,10000,'HIGH',2,NULL,NULL,NULL,'Test 1',2,1,2,NULL,1),(2,NULL,NULL,NULL,4,11000,'LOW',4,NULL,NULL,NULL,'Test 2 ',3,1,2,NULL,1),(3,NULL,NULL,NULL,NULL,1000,'MEDIUM',NULL,NULL,NULL,NULL,'dsds',NULL,2,4,NULL,NULL),(4,NULL,NULL,NULL,NULL,1000,NULL,NULL,NULL,NULL,NULL,'sấ',NULL,1,1,NULL,3),(5,NULL,NULL,NULL,NULL,2000,NULL,NULL,NULL,NULL,NULL,'dssd',NULL,1,1,NULL,3),(6,NULL,NULL,NULL,NULL,500,'MEDIUM',NULL,NULL,NULL,NULL,'dsds',NULL,2,4,NULL,3);
/*!40000 ALTER TABLE `tbl_task` ENABLE KEYS */;
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
  `lastname` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user`
--

LOCK TABLES `tbl_user` WRITE;
/*!40000 ALTER TABLE `tbl_user` DISABLE KEYS */;
INSERT INTO `tbl_user` VALUES (1,NULL,'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff','Project Manager chuyên nghiệp','admin@taskflow.com',NULL,'Nguyễn Quản Trị','$2a$10$ldCg8rKNN576FcppyM5nDOGp34EY3tWHobZczgO9SovrHdvQeDUPu',NULL),(2,NULL,'https://ui-avatars.com/api/?name=FE&background=random','ReactJS Developer','fe@taskflow.com',NULL,'Lê Frontend','$2a$10$ldCg8rKNN576FcppyM5nDOGp34EY3tWHobZczgO9SovrHdvQeDUPu',NULL),(3,NULL,'https://ui-avatars.com/api/?name=BE&background=random','Java Spring Boot Expert','be@taskflow.com',NULL,'Trần Backend','$2a$10$ldCg8rKNN576FcppyM5nDOGp34EY3tWHobZczgO9SovrHdvQeDUPu',NULL),(4,NULL,'https://ui-avatars.com/api/?name=QA&background=random','QA Engineer','test@taskflow.com',NULL,'Phạm Tester','$2a$10$ldCg8rKNN576FcppyM5nDOGp34EY3tWHobZczgO9SovrHdvQeDUPu',NULL),(5,NULL,NULL,NULL,'dq0202345@gmail.com',NULL,'Nguyễn Ngự Đăng','$2a$10$ldCg8rKNN576FcppyM5nDOGp34EY3tWHobZczgO9SovrHdvQeDUPu',NULL);
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

-- Dump completed on 2026-01-15 12:44:34
