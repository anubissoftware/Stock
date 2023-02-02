-- --------------------------------------------------------
-- Host:                         database.gdlplabs.com
-- Server version:               10.5.15-MariaDB-0+deb11u1 - Raspbian 11
-- Server OS:                    debian-linux-gnueabihf
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for stock
CREATE DATABASE IF NOT EXISTS `stock` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `stock`;

-- Dumping structure for table stock.appPermission
CREATE TABLE IF NOT EXISTS `appPermission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT 0,
  `appId` int(11) DEFAULT 0,
  `validated` int(1) DEFAULT 0,
  `token` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_appPermission_users` (`userId`),
  KEY `FK_appPermission_apps` (`appId`),
  CONSTRAINT `FK_appPermission_apps` FOREIGN KEY (`appId`) REFERENCES `apps` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_appPermission_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.appPermission: ~1 rows (approximately)
REPLACE INTO `appPermission` (`id`, `userId`, `appId`, `validated`, `token`) VALUES
	(1, 1, 1, 1, 'eyJpZCI6MSwibmFtZSI6IkZhYmnDoW4gIiwibmlja25hbWUiOiJmaWJpYWFuIiwiaXNBZG1pbiI6IjAiLCJlbnRlcnByaXNlIjoxLCJleHAiOjE2NzE3MjQzOTF9');

-- Dumping structure for table stock.apps
CREATE TABLE IF NOT EXISTS `apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.apps: ~1 rows (approximately)
REPLACE INTO `apps` (`id`, `name`) VALUES
	(1, 'restaurant');

-- Dumping structure for table stock.boughts
CREATE TABLE IF NOT EXISTS `boughts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `value` float NOT NULL DEFAULT 0,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `registered_by` int(11) NOT NULL DEFAULT 0,
  `enterprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_sales_users` (`registered_by`) USING BTREE,
  KEY `FK_boughts_enterprise` (`enterprise`),
  CONSTRAINT `FK_boughts_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `boughts_ibfk_2` FOREIGN KEY (`registered_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table stock.boughts: ~55 rows (approximately)
REPLACE INTO `boughts` (`id`, `description`, `value`, `date`, `registered_by`, `enterprise`) VALUES
	(92, '', 12500, '2022-11-23 10:43:42', 2, 1),
	(93, '', 400000, '2022-11-23 10:45:00', 2, 1),
	(94, '', 1500, '2022-11-24 08:24:03', 2, 1),
	(95, '', 40000, '2022-11-24 08:26:50', 1, 1),
	(96, '', 80000, '2022-11-25 10:39:30', 1, 1),
	(97, '', 80000, '2022-11-25 10:40:11', 1, 1),
	(98, '', 40000, '2022-11-25 10:40:39', 1, 1),
	(99, '', 16000, '2022-11-25 10:40:57', 1, 1),
	(100, '', 16000, '2022-11-25 10:41:52', 1, 1),
	(101, '', 8000, '2022-11-25 10:42:47', 1, 1),
	(102, '', 8000, '2022-11-25 10:43:29', 1, 1),
	(103, '', 16000, '2022-11-25 10:45:06', 1, 1),
	(104, '', 25000, '2022-11-26 14:30:07', 1, 1),
	(105, '', 800000, '2022-11-26 14:30:13', 1, 1),
	(106, '', 60000, '2022-11-26 14:30:21', 1, 1),
	(107, '', 5000, '2022-11-26 20:04:34', 1, 1),
	(108, '', 80000, '2022-11-26 20:05:25', 1, 1),
	(109, '', 320000, '2022-11-27 08:18:16', 1, 1),
	(110, '', 3000000, '2022-11-27 08:27:14', 1, 1),
	(111, '', 15000, '2022-11-27 08:28:44', 1, 1),
	(112, '', 600000, '2022-11-27 08:28:55', 1, 1),
	(113, '', 30000000, '2022-11-27 08:30:35', 1, 1),
	(114, '', 36000000, '2022-11-27 08:33:00', 1, 1),
	(115, '', 28000, '2022-11-27 08:33:44', 1, 1),
	(116, '', 50000, '2022-11-27 09:38:44', 1, 1),
	(117, '', 50000, '2022-11-28 08:41:39', 1, 1),
	(118, '', 30000000, '2022-11-28 19:17:05', 1, 1),
	(119, '', 18000, '2022-12-22 19:28:48', 1, 1),
	(120, '', 3000, '2022-12-22 19:30:37', 1, 1),
	(121, '', 2500, '2022-12-23 10:40:12', 1, 1),
	(122, '', 180000, '2022-12-23 10:40:19', 1, 1),
	(123, '', 180000, '2022-12-23 10:43:45', 1, 1),
	(124, '', 1200000, '2022-12-25 14:11:35', 3, 2),
	(125, '', 4920000, '2022-12-26 18:42:36', 3, 2),
	(126, '', 350000, '2022-12-29 21:31:50', 1, 1),
	(127, '', 150000000, '2022-12-31 18:19:05', 1, 1),
	(128, '', 10, '2023-01-11 21:18:47', 4, 2),
	(129, '', 200, '2023-01-11 21:20:14', 4, 2),
	(130, '', 10, '2023-01-11 21:20:33', 4, 2),
	(131, '', 500, '2023-01-11 21:22:53', 4, 2),
	(132, '', 100, '2023-01-12 14:37:18', 4, 2),
	(133, '', 90000000, '2023-01-12 21:12:23', 1, 1),
	(134, '', 5000, '2023-01-12 21:54:58', 1, 1),
	(135, '', 10000, '2023-01-12 21:55:05', 1, 1),
	(136, '', 15000, '2023-01-14 11:56:45', 1, 1),
	(137, '', 5000, '2023-01-14 11:58:44', 2, 1),
	(138, '', 80000, '2023-01-17 08:14:46', 4, 2),
	(139, '', 7920000, '2023-01-17 08:14:55', 4, 2),
	(140, '', 3640000, '2023-01-17 08:15:03', 4, 2),
	(141, '', 4000000, '2023-01-22 18:13:35', 4, 2),
	(142, '', 20000, '2023-01-22 18:14:13', 4, 2),
	(143, '', 1980000, '2023-01-22 18:14:39', 4, 2),
	(144, '', 800000, '2023-01-23 16:11:22', 4, 2),
	(145, '', 200000, '2023-01-23 19:57:26', 4, 2),
	(146, '', 80000, '2023-01-28 09:46:33', 3, 2);

-- Dumping structure for table stock.boughtsDetail
CREATE TABLE IF NOT EXISTS `boughtsDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item` int(11) NOT NULL DEFAULT 0,
  `extras` text DEFAULT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  `value` float NOT NULL DEFAULT 0,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `bought_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_sales_products` (`item`) USING BTREE,
  KEY `FK_salesDetail_sales` (`bought_id`) USING BTREE,
  CONSTRAINT `FK_boughtsDetail_boughts` FOREIGN KEY (`bought_id`) REFERENCES `boughts` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `boughtsDetail_ibfk_2` FOREIGN KEY (`item`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=167 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table stock.boughtsDetail: ~55 rows (approximately)
REPLACE INTO `boughtsDetail` (`id`, `item`, `extras`, `amount`, `value`, `date`, `bought_id`) VALUES
	(112, 1, '', 25, 12500, '2022-11-23 10:43:42', 92),
	(113, 5, '', 50, 400000, '2022-11-23 10:45:00', 93),
	(114, 1, '', 3, 1500, '2022-11-24 08:24:03', 94),
	(115, 5, '', 5, 40000, '2022-11-24 08:26:50', 95),
	(116, 5, '', 10, 80000, '2022-11-25 10:39:30', 96),
	(117, 5, '', 10, 80000, '2022-11-25 10:40:11', 97),
	(118, 5, '', 5, 40000, '2022-11-25 10:40:39', 98),
	(119, 5, '', 2, 16000, '2022-11-25 10:40:57', 99),
	(120, 5, '', 2, 16000, '2022-11-25 10:41:52', 100),
	(121, 5, '', 1, 8000, '2022-11-25 10:42:47', 101),
	(122, 5, '', 1, 8000, '2022-11-25 10:43:29', 102),
	(123, 5, '', 2, 16000, '2022-11-25 10:45:06', 103),
	(124, 1, '', 50, 25000, '2022-11-26 14:30:07', 104),
	(125, 5, '', 100, 800000, '2022-11-26 14:30:13', 105),
	(126, 2, '', 200, 60000, '2022-11-26 14:30:21', 106),
	(127, 1, '', 10, 5000, '2022-11-26 20:04:34', 107),
	(128, 5, '', 10, 80000, '2022-11-26 20:05:25', 108),
	(129, 5, '', 40, 320000, '2022-11-27 08:18:16', 109),
	(130, 23, '', 50, 150000000, '2022-11-27 08:27:14', 110),
	(131, 24, '', 1, 15000, '2022-11-27 08:28:44', 111),
	(132, 24, '', 40, 600000, '2022-11-27 08:28:55', 112),
	(133, 23, '', 10, 30000000, '2022-11-27 08:30:35', 113),
	(134, 25, '', 30, 36000000, '2022-11-27 08:33:01', 114),
	(135, 6, '', 40, 28000, '2022-11-27 08:33:44', 115),
	(136, 26, '', 5, 50000, '2022-11-27 09:38:44', 116),
	(137, 26, '', 5, 50000, '2022-11-28 08:41:39', 117),
	(138, 23, '', 10, 30000000, '2022-11-28 19:17:05', 118),
	(139, 27, '', 1, 18000, '2022-12-22 19:28:48', 119),
	(140, 28, '', 1, 3000, '2022-12-22 19:30:37', 120),
	(141, 1, '', 5, 2500, '2022-12-23 10:40:12', 121),
	(142, 27, '', 10, 180000, '2022-12-23 10:40:19', 122),
	(143, 27, '', 10, 180000, '2022-12-23 10:43:45', 123),
	(144, 29, '', 30, 1200000, '2022-12-25 14:11:35', 124),
	(145, 29, '', 123, 4920000, '2022-12-26 18:42:36', 125),
	(146, 1, '', 700, 350000, '2022-12-29 21:31:50', 126),
	(147, 23, '', 50, 150000000, '2022-12-31 18:19:05', 127),
	(148, 30, '', 1, 10, '2023-01-11 21:18:47', 128),
	(149, 31, '', 20, 200, '2023-01-11 21:20:14', 129),
	(150, 32, '', 1, 10, '2023-01-11 21:20:33', 130),
	(151, 30, '', 50, 500, '2023-01-11 21:22:53', 131),
	(152, 32, '', 10, 100, '2023-01-12 14:37:18', 132),
	(153, 23, '', 30, 90000000, '2023-01-12 21:12:23', 133),
	(154, 1, '', 10, 5000, '2023-01-12 21:54:58', 134),
	(155, 1, '', 20, 10000, '2023-01-12 21:55:05', 135),
	(156, 1, '', 30, 15000, '2023-01-14 11:56:45', 136),
	(157, 1, '', 10, 5000, '2023-01-14 11:58:44', 137),
	(158, 33, '', 1, 80000, '2023-01-17 08:14:46', 138),
	(159, 33, '', 99, 7920000, '2023-01-17 08:14:55', 139),
	(160, 29, '', 91, 3640000, '2023-01-17 08:15:03', 140),
	(161, 34, '', 100, 4000000, '2023-01-22 18:13:36', 141),
	(162, 35, '', 1, 20000, '2023-01-22 18:14:13', 142),
	(163, 35, '', 99, 1980000, '2023-01-22 18:14:39', 143),
	(164, 34, '', 20, 800000, '2023-01-23 16:11:22', 144),
	(165, 29, '', 5, 200000, '2023-01-23 19:57:26', 145),
	(166, 29, '', 2, 80000, '2023-01-28 09:46:33', 146);

-- Dumping structure for table stock.category
CREATE TABLE IF NOT EXISTS `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `color` varchar(8) NOT NULL DEFAULT '0',
  `enterprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_category_enterprise` (`enterprise`),
  CONSTRAINT `FK_category_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.category: ~11 rows (approximately)
REPLACE INTO `category` (`id`, `name`, `color`, `enterprise`) VALUES
	(1, 'Enlatados', '#FFFF00', 1),
	(2, 'Empaquetados', '#850000', 1),
	(3, 'Productos Naturales', '#e9c4e9', 1),
	(4, 'Bebidas Frías', '#991133', 1),
	(5, 'Fast Foods', '#ff0000', 1),
	(6, 'SmartPhones', '#1111FF', 1),
	(19, 'Belleza', '#687873', 1),
	(20, 'Computadores', '#b73df0', 1),
	(26, 'Reactive test', '#387f2f', 1),
	(27, 'Láminas', '#8b894b', 2),
	(28, 'asdasd', '#000000', 2);

-- Dumping structure for table stock.clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `type` varchar(50) NOT NULL DEFAULT '0',
  `nit` varchar(50) NOT NULL DEFAULT '0',
  `rut` int(11) DEFAULT NULL,
  `cv` varchar(50) NOT NULL DEFAULT '0',
  `email` varchar(50) NOT NULL DEFAULT '0',
  `registro` datetime NOT NULL DEFAULT current_timestamp(),
  `contact_name` varchar(50) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `contact_email` varchar(50) DEFAULT NULL,
  `enterprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_clients_enterprise` (`enterprise`),
  KEY `FK_clients_media` (`rut`),
  CONSTRAINT `FK_clients_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_clients_media` FOREIGN KEY (`rut`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.clients: ~5 rows (approximately)
REPLACE INTO `clients` (`id`, `name`, `type`, `nit`, `rut`, `cv`, `email`, `registro`, `contact_name`, `contact_phone`, `contact_email`, `enterprise`) VALUES
	(1, 'Fabiaan', '2', '1005338906', 71, '0', 'fibianmejia@hotmail.com', '2023-01-13 09:13:42', 'Fabián Mejía', '3125677288', 'fibianmejia@hotmail.com', 2),
	(2, 'Cesar', '1', '1071584903', 72, '0', 'cesarphernandez09@gmail.com', '2023-01-13 12:47:21', 'Cesar Peña', '31374839', 'cesarphernandez09@gmail.com', 2),
	(72, 'Encocol', '2', '123456789', 74, '0', 'encocol@gmail.com', '2023-01-14 13:51:44', 'Diego Castillo', '317052809', 'diegogo@gmail.com', 2),
	(73, 'Encocol2', '2', '123456789', 75, '0', 'encocol@gmail.com', '2023-01-16 08:33:12', 'Diego Castillo', '317052809', 'diegogo@gmail.com', 2),
	(74, 'Blu', '1', '123456789', 76, '0', 'blu@gmail.com', '2023-01-21 08:34:23', 'Blu', '123', 'blu@gmail.com', 2);

-- Dumping structure for table stock.customer
CREATE TABLE IF NOT EXISTS `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cellphone` bigint(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `activated` tinyint(1) NOT NULL DEFAULT 0,
  `token` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `update_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_email_idx` (`email`) USING BTREE,
  UNIQUE KEY `customer_cellphone_idx` (`cellphone`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.customer: ~2 rows (approximately)
REPLACE INTO `customer` (`id`, `name`, `email`, `cellphone`, `password`, `activated`, `token`, `created_at`, `update_at`) VALUES
	(2, 'Cesar', 'test@example.com', 31567888888, '202cb962ac59075b964b07152d234b70', 0, NULL, '2022-12-24 15:55:53', '2022-12-24 15:55:53'),
	(3, 'Xxxx', 'xx@gmail.com', 3000000000, '202cb962ac59075b964b07152d234b70', 1, 'eyJpZCI6MywibmFtZSI6Ilh4eHgiLCJlbWFpbCI6Inh4QGdtYWlsLmNvbSIsImNlbGxwaG9uZSI6MzAwMDAwMDAwMCwicGFzc3dvcmQiOiIyMDJjYjk2MmFjNTkwNzViOTY0YjA3MTUyZDIzNGI3MCIsImFjdGl2YXRlZCI6MSwidG9rZW4iOiIiLCJjcmVhdGVkX2F0IjoiMjAyMi0xMi0yNFQxNjowNDo0Ni4wMDBaIiwidXBkYXRlX2F0IjoiMjAyMy0wMS0yMlQwMTo0MTo1NC4wMDBaIiwiZXhwIjoxNjc0MzU1NDU4fQ==', '2022-12-24 16:04:46', '2023-01-22 01:44:18');

-- Dumping structure for table stock.dispatching
CREATE TABLE IF NOT EXISTS `dispatching` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `out_store` datetime DEFAULT NULL,
  `received` datetime DEFAULT NULL,
  `quotation_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `quotation_id` (`quotation_id`),
  CONSTRAINT `dispatching_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `dispatching_ibfk_2` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.dispatching: ~5 rows (approximately)
REPLACE INTO `dispatching` (`id`, `out_store`, `received`, `quotation_id`, `created_at`, `created_by`) VALUES
	(40, '2023-02-01 10:42:07', '2023-02-01 11:27:53', 77, '2023-02-01 10:42:24', 3),
	(41, '2023-02-01 10:44:35', NULL, 77, '2023-02-01 10:44:42', 3),
	(42, '2023-02-01 10:46:51', NULL, 77, '2023-02-01 10:46:57', 3),
	(43, '2023-02-01 10:48:15', NULL, 77, '2023-02-01 10:48:23', 3),
	(44, '2023-02-01 11:20:37', '2023-02-01 11:23:56', 77, '2023-02-01 10:48:38', 3);

-- Dumping structure for table stock.dispatchingDetail
CREATE TABLE IF NOT EXISTS `dispatchingDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quotation_detail_id` int(11) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `dispatch_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quotation_detail_id` (`quotation_detail_id`),
  KEY `dispatch_id` (`dispatch_id`),
  CONSTRAINT `dispatchingDetail_ibfk_1` FOREIGN KEY (`quotation_detail_id`) REFERENCES `quotationDetail` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dispatchingDetail_ibfk_2` FOREIGN KEY (`dispatch_id`) REFERENCES `dispatching` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.dispatchingDetail: ~5 rows (approximately)
REPLACE INTO `dispatchingDetail` (`id`, `quotation_detail_id`, `amount`, `dispatch_id`) VALUES
	(45, 77, 1, 40),
	(46, 77, 1, 41),
	(47, 77, 1, 42),
	(48, 77, 1, 43),
	(49, 77, 1, 44);

-- Dumping structure for table stock.enterprise
CREATE TABLE IF NOT EXISTS `enterprise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `logo` int(11) DEFAULT NULL,
  `shortcut` varchar(50) NOT NULL DEFAULT '',
  `renting` int(1) NOT NULL DEFAULT 0,
  `quoting` int(11) DEFAULT 0,
  `prefix_quote` varchar(50) DEFAULT NULL,
  `prefix_invoice` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shortcut` (`shortcut`),
  KEY `FK_enterprise_media` (`logo`),
  CONSTRAINT `FK_enterprise_media` FOREIGN KEY (`logo`) REFERENCES `media` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.enterprise: ~2 rows (approximately)
REPLACE INTO `enterprise` (`id`, `name`, `logo`, `shortcut`, `renting`, `quoting`, `prefix_quote`, `prefix_invoice`) VALUES
	(1, 'Fibiaan', 1, 'fibiaan', 0, 0, NULL, NULL),
	(2, 'Cimbras', 2, 'cimbras', 1, 1, NULL, NULL);

-- Dumping structure for table stock.enterpriseModules
CREATE TABLE IF NOT EXISTS `enterpriseModules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.enterpriseModules: ~0 rows (approximately)

-- Dumping structure for table stock.history
CREATE TABLE IF NOT EXISTS `history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.history: ~0 rows (approximately)

-- Dumping structure for table stock.losses
CREATE TABLE IF NOT EXISTS `losses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `value` float NOT NULL DEFAULT 0,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `registered_by` int(11) NOT NULL DEFAULT 0,
  `enterprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_sales_users` (`registered_by`) USING BTREE,
  KEY `FK_boughts_enterprise` (`enterprise`) USING BTREE,
  CONSTRAINT `losses_ibfk_1` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `losses_ibfk_2` FOREIGN KEY (`registered_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table stock.losses: ~2 rows (approximately)
REPLACE INTO `losses` (`id`, `description`, `value`, `date`, `registered_by`, `enterprise`) VALUES
	(95, '', 6500, '2022-11-23 10:45:17', 2, 1),
	(96, '', 30000000, '2023-01-12 21:55:23', 1, 1);

-- Dumping structure for table stock.lossesDetail
CREATE TABLE IF NOT EXISTS `lossesDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item` int(11) NOT NULL DEFAULT 0,
  `extras` text DEFAULT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  `value` float NOT NULL DEFAULT 0,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `losses_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_sales_products` (`item`) USING BTREE,
  KEY `FK_salesDetail_sales` (`losses_id`) USING BTREE,
  CONSTRAINT `FK_lossesDetail_losses` FOREIGN KEY (`losses_id`) REFERENCES `losses` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `lossesDetail_ibfk_2` FOREIGN KEY (`item`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table stock.lossesDetail: ~2 rows (approximately)
REPLACE INTO `lossesDetail` (`id`, `item`, `extras`, `amount`, `value`, `date`, `losses_id`) VALUES
	(113, 1, '', 13, 6500, '2022-11-23 10:45:17', 95),
	(114, 23, '', 10, 30000000, '2023-01-12 21:55:23', 96);

-- Dumping structure for table stock.media
CREATE TABLE IF NOT EXISTS `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` text DEFAULT NULL,
  `filename` varchar(50) DEFAULT NULL,
  `host` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.media: ~7 rows (approximately)
REPLACE INTO `media` (`id`, `path`, `filename`, `host`) VALUES
	(1, 'http://localhost:8012/public/logos/fibiaan.png', 'fibiaan.png', 'http://localhost:8012/public/'),
	(2, '', 'encocol.png', 'http://localhost:8012/public/'),
	(71, '/clients/2/', 'Fabiaan_2023-01.pdf', 'http://localhost:8012/public'),
	(72, '/clients/2/', 'Cesar_2023-01.png', 'http://localhost:8012/public'),
	(74, '/clients/2/', 'Encocol_2023-01.pdf', 'http://localhost:8012/public'),
	(75, '/clients/2/', 'Encocol2_2023-01.png', 'http://localhost:8012/public'),
	(76, '/clients/2/', 'Blu_2023-01.jpeg', 'http://localhost:8012/public');

-- Dumping structure for table stock.modules
CREATE TABLE IF NOT EXISTS `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `url` varchar(50) DEFAULT NULL,
  `depends` int(11) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `order` int(1) DEFAULT NULL,
  `active` int(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.modules: ~17 rows (approximately)
REPLACE INTO `modules` (`id`, `name`, `url`, `depends`, `icon`, `order`, `active`) VALUES
	(1, 'nomina', '', NULL, NULL, NULL, 0),
	(2, 'MyStock', '/dashboard/mystock', NULL, 'inventory', 2, 1),
	(3, 'Config', '/dashboard/config', NULL, 'settings', 9, 1),
	(4, 'Stats', '/dashboard/statistics', NULL, 'query_stats', NULL, 1),
	(5, 'Home', '/dashboard', NULL, 'home', 1, 1),
	(6, 'Account', NULL, NULL, 'expand_more', NULL, 0),
	(7, 'Store', NULL, NULL, 'expand_more', NULL, 0),
	(8, 'Production Order', '/dashboard/production', NULL, 'engineering', NULL, 1),
	(9, 'Active Renting', '/dashboard/renting', NULL, 'confirmation_number', 0, 1),
	(10, 'Quotation', '/dashboard/quote', NULL, 'request_quote', 4, 1),
	(11, 'Clients', '/dashboard/clients', NULL, 'diversity_3', 3, 1),
	(12, 'Reports', '/dashboard/reports', NULL, 'summarize', NULL, 1),
	(13, 'Invoices', '/dashboard/invoices', NULL, 'payments', 5, 1),
	(14, 'MyStore', '/dashboard/mystore', NULL, 'store', NULL, 1),
	(15, 'Dispatch', '/dashboard/dispatch', NULL, 'ios_share', 6, 1),
	(16, 'Return', '/dashboard/return', NULL, 'place_item', 7, 1),
	(17, 'Partners', '/dashboard/partners', NULL, 'handshake', 8, 1);

-- Dumping structure for table stock.partners
CREATE TABLE IF NOT EXISTS `partners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `nit` varchar(50) DEFAULT NULL,
  `sigla` varchar(50) DEFAULT NULL,
  `creation` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sigla` (`sigla`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.partners: ~0 rows (approximately)

-- Dumping structure for table stock.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `description` varchar(50) DEFAULT NULL,
  `unit` int(11) DEFAULT NULL,
  `stock` int(11) unsigned NOT NULL DEFAULT 0,
  `rented` int(11) unsigned NOT NULL DEFAULT 0,
  `sold` int(11) unsigned NOT NULL DEFAULT 0,
  `toCraft` int(11) unsigned NOT NULL DEFAULT 0,
  `expired` int(11) unsigned NOT NULL DEFAULT 0,
  `currency` varchar(4) NOT NULL DEFAULT 'COP',
  `price` double unsigned NOT NULL DEFAULT 1,
  `cost` double unsigned NOT NULL DEFAULT 1,
  `wholesale` double NOT NULL DEFAULT 0,
  `rent` double DEFAULT 0,
  `onSales` double NOT NULL DEFAULT 0,
  `onBuying` double NOT NULL DEFAULT 0,
  `onLosses` double NOT NULL DEFAULT 0,
  `onRenting` double NOT NULL DEFAULT 0,
  `isRecipe` char(1) NOT NULL DEFAULT '0',
  `categories` text DEFAULT '{values: []}',
  `creation` date DEFAULT curdate(),
  `enterprise` int(11) DEFAULT NULL,
  `published` char(1) NOT NULL DEFAULT '0',
  `removed` char(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_products_enterprise` (`enterprise`),
  KEY `FK_products_units` (`unit`),
  CONSTRAINT `FK_products_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_products_units` FOREIGN KEY (`unit`) REFERENCES `units` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.products: ~17 rows (approximately)
REPLACE INTO `products` (`id`, `name`, `description`, `unit`, `stock`, `rented`, `sold`, `toCraft`, `expired`, `currency`, `price`, `cost`, `wholesale`, `rent`, `onSales`, `onBuying`, `onLosses`, `onRenting`, `isRecipe`, `categories`, `creation`, `enterprise`, `published`, `removed`) VALUES
	(1, 'Product 1', 'Tomates', 1, 56, 0, 794, 0, 13, 'COP', 700, 500, 600, NULL, 555800, 431500, 6500, 0, '0', '{"values":[1]}', '2022-11-02', 1, '0', '0'),
	(2, 'Product 2', 'cebollas', 1, 26, 0, 174, 0, 0, 'COP', 2000, 300, 0, NULL, 348000, 60000, 0, 0, '0', '{"values":[1]}', '2022-11-02', 1, '1', '0'),
	(5, 'Product 3', 'Pasta usada para la salsa de tomate. 250ml', 1, 6, 0, 232, 0, 0, 'COP', 15000, 8000, 12000, NULL, 3480000, 1904000, 0, 0, '1', '{"values":[1]}', '2022-11-17', 1, '1', '0'),
	(6, 'Product 4', 'empaque de 5g', 1, 39, 0, 1, 0, 0, 'COP', 1000, 700, 800, NULL, 1000, 28000, 0, 0, '1', '{"values":[5]}', '2022-11-21', 1, '0', '0'),
	(23, 'Product 5', '', 1, 2, 0, 138, 0, 10, 'COP', 4000000, 3000000, 3400000, NULL, 552000000, 450000000, 30000000, 0, '0', '{"values":[6]}', '2022-11-27', 1, '0', '0'),
	(24, 'Product 6', 'pdto', 1, 37, 0, 4, 0, 0, 'COP', 30000, 15000, 0, NULL, 120000, 615000, 0, 0, '0', '{"values":[1]}', '2022-11-27', 1, '0', '0'),
	(25, 'Product 7', '', 1, 0, 0, 30, 0, 0, 'COP', 1600000, 1200000, 0, NULL, 48000000, 36000000, 0, 0, '0', '{"values":[6]}', '2022-11-27', 1, '0', '0'),
	(26, 'Product 8', 'a', 1, 4, 0, 6, 0, 0, 'COP', 15000, 10000, 0, NULL, 90000, 100000, 0, 0, '0', '{"values":[1]}', '2022-11-27', 1, '0', '0'),
	(27, 'Product 9', 'Crema', 1, 0, 0, 21, 0, 0, 'COP', 23000, 18000, 21000, NULL, 483000, 378000, 0, 0, '0', '{"values":[19]}', '2022-12-22', 1, '0', '0'),
	(28, 'Product 10', 'Crema', 1, 1, 0, 0, 0, 0, 'COP', 5000, 3000, 4000, NULL, 0, 3000, 0, 0, '0', '{"values":[19]}', '2022-12-22', 1, '0', '0'),
	(29, 'Product 11', 'Lámina de aluminios', 1, 95, 5, 152, 0, 0, 'COP', 37000, 4000, 53005, 1000, 9097000, 10040000, 0, 12500, '0', '{"values":[27]}', '2022-12-25', 2, '0', '0'),
	(30, 'Product 12', 'a', 1, 41, 0, 10, 0, 0, 'COP', 10, 10, 10, NULL, 100, 510, 0, 0, '0', '{"values":[27]}', '2023-01-11', 2, '0', '1'),
	(31, 'Product 13', 'b', 1, 20, 0, 0, 0, 0, 'COP', 0, 10, 10, 20, 0, 200, 0, 0, '0', '{"values":[27]}', '2023-01-11', 2, '0', '1'),
	(32, 'Product 14', 'c', 1, 8, 0, 3, 0, 0, 'COP', 20, 10, 0, 20, 60, 110, 0, 0, '0', '{"values":[27]}', '2023-01-11', 2, '0', '1'),
	(33, 'Product 15', '10kg de purina para perro', 1, 100, 0, 0, 0, 0, 'COP', 100000, 80000, 90000, NULL, 0, 8000000, 0, 0, '0', '{"values":[28]}', '2023-01-17', 2, '0', '0'),
	(34, 'Product 16', 'Varilla', 1, 114, 0, 6, 0, 0, 'COP', 70000, 40000, 5, NULL, 420000, 4800000, 0, 0, '0', '{"values":[28]}', '2023-01-22', 2, '0', '0'),
	(35, 'Product 17', '', 1, 100, 0, 0, 0, 0, 'COP', 40000, 20000, 345000, NULL, 0, 2000000, 0, 0, '0', '{"values":[27]}', '2023-01-22', 2, '0', '0');

-- Dumping structure for table stock.projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `address` varchar(50) NOT NULL DEFAULT '',
  `contact_name` varchar(50) NOT NULL DEFAULT '',
  `contact_phone` varchar(50) NOT NULL DEFAULT '',
  `contact_email` varchar(50) NOT NULL DEFAULT '',
  `client_id` int(11) NOT NULL DEFAULT 0,
  `register` datetime DEFAULT current_timestamp(),
  `budget` int(11) DEFAULT NULL,
  `renting` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__clients` (`client_id`),
  CONSTRAINT `FK__clients` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.projects: ~6 rows (approximately)
REPLACE INTO `projects` (`id`, `name`, `address`, `contact_name`, `contact_phone`, `contact_email`, `client_id`, `register`, `budget`, `renting`) VALUES
	(1, 'Diego Building', 'Kra 22 # 13', 'Diego Castillo', '315743289', 'diegogo@gmail.com', 72, '2023-01-15 16:49:28', 65000000, 1),
	(3, 'Camila Apartments', 'Cll 11 # 11 - 60 Villabel', 'Diego Castillo', '315743289', 'diegogo@gmail.com', 72, '2023-01-16 16:49:28', 30000000, 1),
	(4, 'Blu Skytower', 'Kra 27', 'Camila Mejía', '313562780', 'emily@gmail.com', 72, '2023-01-16 07:28:42', 127000000, 1),
	(6, 'WhareHouse', 'Cll 11 # 11 - 60', 'Fabián Mejía ', '3125677288', 'fibianmejia@gmail.com', 72, '2023-01-16 22:44:15', 1700000000, 0),
	(7, 'Anubis Software Project', 'Cll 11 # 11 - 60', 'Fabián Mejía ', '3125677288', 'fibianmejia@gmail.com', 1, '2023-01-18 21:01:49', 300000000, 0),
	(8, 'Hola', 'Cll 11 # 11 - 60', 'Fabián Mejía ', '3125677288', 'fibianmejia@gmail.com', 2, '2023-01-18 21:10:25', 30000000, 0);

-- Dumping structure for table stock.quotation
CREATE TABLE IF NOT EXISTS `quotation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serial` int(11) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `value` float NOT NULL,
  `discount` float DEFAULT 0,
  `taxing` float DEFAULT 0,
  `client_id` int(11) NOT NULL DEFAULT 0,
  `email` varchar(50) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `enterprise_id` int(11) DEFAULT NULL,
  `min_validity` date DEFAULT NULL,
  `user` int(11) NOT NULL,
  `max_validity` date DEFAULT NULL,
  `isRenting` int(1) NOT NULL DEFAULT 0,
  `one_day` int(1) NOT NULL DEFAULT 1,
  `from` date DEFAULT NULL,
  `to` date DEFAULT NULL,
  `creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted` int(1) DEFAULT 0,
  `stage` int(11) DEFAULT 0 COMMENT 'pending, rejected, approved, dispatching, dispatched, returning, invoicing, invoiced',
  PRIMARY KEY (`id`),
  KEY `FK_quotation_clients` (`client_id`),
  KEY `FK_quotation_projects` (`project_id`),
  KEY `FK_quotation_users` (`user`),
  KEY `FK_quotation_quotationStages` (`stage`),
  KEY `FK_quotation_users_2` (`updated_by`),
  KEY `FK_quotation_enterprise` (`enterprise_id`),
  CONSTRAINT `FK_quotation_clients` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_quotation_enterprise` FOREIGN KEY (`enterprise_id`) REFERENCES `enterprise` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_quotation_projects` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_quotation_quotationStages` FOREIGN KEY (`stage`) REFERENCES `quotationStages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_quotation_users` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_quotation_users_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.quotation: ~4 rows (approximately)
REPLACE INTO `quotation` (`id`, `serial`, `description`, `value`, `discount`, `taxing`, `client_id`, `email`, `project_id`, `enterprise_id`, `min_validity`, `user`, `max_validity`, `isRenting`, `one_day`, `from`, `to`, `creation`, `updated_by`, `deleted`, `stage`) VALUES
	(75, 1, NULL, 6250, 0, 0, 1, 'fibianmejia@hotmail.com', NULL, 2, '2023-01-30', 3, '2023-01-31', 1, 1, NULL, NULL, '2023-01-30 21:02:16', NULL, 0, 2),
	(76, 2, NULL, 450000, 0, 0, 1, 'fibianmejia@hotmail.com', NULL, 2, '2023-01-30', 3, '2023-01-31', 0, 0, NULL, NULL, '2023-01-30 21:12:38', 3, 0, 2),
	(77, 3, NULL, 6250, 0, 19, 1, 'fibianmejia@hotmail.com', NULL, 2, '2023-02-01', 3, '2023-02-02', 1, 1, NULL, NULL, '2023-02-01 14:26:08', NULL, 0, 5),
	(78, 4, NULL, 525000, 5, 15, 2, 'fibianmejia@hotmail.com', NULL, 2, '2023-02-01', 3, '2023-02-02', 0, 0, '2023-02-01', '2023-02-02', '2023-02-01 16:29:04', NULL, 0, 2);

-- Dumping structure for table stock.quotationDetail
CREATE TABLE IF NOT EXISTS `quotationDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `extras` varchar(50) DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `value` float NOT NULL,
  `quotation_id` int(11) NOT NULL,
  `from` date DEFAULT NULL,
  `to` date DEFAULT NULL,
  `days` int(11) DEFAULT NULL,
  `dispatching` int(11) DEFAULT 0,
  `returning` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `FK_quotationDetail_products` (`item_id`),
  KEY `FK_quotationDetail_quotation` (`quotation_id`),
  CONSTRAINT `FK_quotationDetail_products` FOREIGN KEY (`item_id`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_quotationDetail_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.quotationDetail: ~4 rows (approximately)
REPLACE INTO `quotationDetail` (`id`, `item_id`, `extras`, `amount`, `value`, `quotation_id`, `from`, `to`, `days`, `dispatching`, `returning`) VALUES
	(75, 29, NULL, 5, 1250, 75, '2023-01-31', '2023-02-01', 1, 0, 0),
	(76, 29, NULL, 10, 45000, 76, NULL, NULL, 1, 0, 0),
	(77, 29, NULL, 5, 1250, 77, '2023-02-02', '2023-02-03', 1, 5, 2),
	(78, 33, NULL, 5, 105000, 78, NULL, NULL, NULL, 0, 0);

-- Dumping structure for table stock.quotationInfo
CREATE TABLE IF NOT EXISTS `quotationInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quotation_id` int(11) DEFAULT NULL,
  `action` varchar(50) NOT NULL DEFAULT '0',
  `user` int(11) DEFAULT NULL,
  `done` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_quotationInfo_users` (`user`),
  KEY `FK_quotationInfo_quotation` (`quotation_id`),
  CONSTRAINT `FK_quotationInfo_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_quotationInfo_users` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=314 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.quotationInfo: ~35 rows (approximately)
REPLACE INTO `quotationInfo` (`id`, `quotation_id`, `action`, `user`, `done`) VALUES
	(279, 75, '0', 3, '2023-01-30 16:02:16'),
	(280, 75, '0', 3, '2023-01-30 16:02:40'),
	(281, 75, '0', 3, '2023-01-30 16:03:16'),
	(282, 75, '0', 3, '2023-01-30 16:05:40'),
	(283, 75, '0', 3, '2023-01-30 16:06:06'),
	(284, 75, '2', NULL, '2023-01-30 16:06:34'),
	(285, 76, '0', 3, '2023-01-30 16:12:38'),
	(286, 76, '2', 3, '2023-01-30 16:12:54'),
	(287, 77, '0', 3, '2023-02-01 09:26:08'),
	(288, 77, '2', NULL, '2023-02-01 09:26:54'),
	(289, 77, '3', NULL, '2023-02-01 09:36:40'),
	(290, 77, '2', NULL, '2023-02-01 09:38:42'),
	(291, 77, '3', NULL, '2023-02-01 09:39:19'),
	(292, 77, '2', NULL, '2023-02-01 09:39:54'),
	(293, 77, '3', NULL, '2023-02-01 09:40:16'),
	(294, 77, '2', NULL, '2023-02-01 09:44:08'),
	(295, 77, '3', NULL, '2023-02-01 09:50:12'),
	(296, 77, '3', NULL, '2023-02-01 09:51:41'),
	(297, 77, '3', NULL, '2023-02-01 09:55:53'),
	(298, 77, '3', NULL, '2023-02-01 10:27:41'),
	(299, 77, '4', NULL, '2023-02-01 10:29:45'),
	(300, 77, '2', NULL, '2023-02-01 10:31:01'),
	(301, 77, '3', NULL, '2023-02-01 10:33:45'),
	(302, 77, '3', NULL, '2023-02-01 10:34:22'),
	(303, 77, '3', NULL, '2023-02-01 10:35:18'),
	(304, 77, '3', NULL, '2023-02-01 10:37:04'),
	(305, 77, '3', NULL, '2023-02-01 10:42:24'),
	(306, 77, '3', NULL, '2023-02-01 10:44:42'),
	(307, 77, '3', NULL, '2023-02-01 10:46:57'),
	(308, 77, '3', NULL, '2023-02-01 10:48:24'),
	(309, 77, '4', NULL, '2023-02-01 10:48:38'),
	(310, 78, '0', 3, '2023-02-01 11:29:04'),
	(311, 78, '0', 3, '2023-02-01 11:33:07'),
	(312, 78, '2', NULL, '2023-02-01 11:34:58'),
	(313, 77, '5', NULL, '2023-02-01 12:00:35');

-- Dumping structure for table stock.quotationMessages
CREATE TABLE IF NOT EXISTS `quotationMessages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.quotationMessages: ~0 rows (approximately)

-- Dumping structure for table stock.quotationStages
CREATE TABLE IF NOT EXISTS `quotationStages` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.quotationStages: ~8 rows (approximately)
REPLACE INTO `quotationStages` (`id`, `name`) VALUES
	(0, 'Created'),
	(1, 'Rejected'),
	(2, 'Approved'),
	(3, 'Dispatching'),
	(4, 'dispatched'),
	(5, 'returning'),
	(6, 'invoicing'),
	(7, 'invoiced');

-- Dumping structure for table stock.recipes
CREATE TABLE IF NOT EXISTS `recipes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `result` int(11) NOT NULL DEFAULT 0,
  `required` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `extras` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_recipes_products` (`result`),
  KEY `FK_recipes_products_2` (`required`),
  CONSTRAINT `FK_recipes_products` FOREIGN KEY (`result`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_recipes_products_2` FOREIGN KEY (`required`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.recipes: ~2 rows (approximately)
REPLACE INTO `recipes` (`id`, `result`, `required`, `amount`, `extras`) VALUES
	(50, 5, 1, 2, 'Se debe remover la cáscara y cocinar por 20 minutos'),
	(51, 6, 2, 2, 'Se debe pelar y cocinar');

-- Dumping structure for table stock.returning
CREATE TABLE IF NOT EXISTS `returning` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `return_date` datetime DEFAULT NULL,
  `quotation_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `quotation_id` (`quotation_id`),
  CONSTRAINT `returning_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `returning_ibfk_2` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.returning: ~1 rows (approximately)
REPLACE INTO `returning` (`id`, `return_date`, `quotation_id`, `created_by`, `created_at`) VALUES
	(17, '2023-02-01 12:00:22', 77, 3, '2023-02-01 12:00:35');

-- Dumping structure for table stock.returningDetail
CREATE TABLE IF NOT EXISTS `returningDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quotation_detail_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `return_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `return_id` (`return_id`),
  KEY `quotation_detail_id` (`quotation_detail_id`),
  CONSTRAINT `returningDetail_ibfk_1` FOREIGN KEY (`return_id`) REFERENCES `returning` (`id`) ON DELETE CASCADE,
  CONSTRAINT `returningDetail_ibfk_2` FOREIGN KEY (`quotation_detail_id`) REFERENCES `quotationDetail` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.returningDetail: ~1 rows (approximately)
REPLACE INTO `returningDetail` (`id`, `quotation_detail_id`, `amount`, `return_id`) VALUES
	(20, 77, 2, 17);

-- Dumping structure for table stock.rol
CREATE TABLE IF NOT EXISTS `rol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `enterprise` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_rol_enterprise` (`enterprise`),
  CONSTRAINT `FK_rol_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.rol: ~2 rows (approximately)
REPLACE INTO `rol` (`id`, `name`, `enterprise`, `description`) VALUES
	(1, 'Admin', 1, 'fibiaan administration'),
	(2, 'Gerencia', 2, 'Cimbras');

-- Dumping structure for table stock.rolPermitions
CREATE TABLE IF NOT EXISTS `rolPermitions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rol` int(11) DEFAULT NULL,
  `read` int(11) DEFAULT 0,
  `write` int(11) DEFAULT 0,
  `edit` int(11) DEFAULT 0,
  `module` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_rolPermitions_rol` (`rol`) USING BTREE,
  KEY `FK_rolPermitions_modules` (`module`),
  CONSTRAINT `FK_rolPermitions_modules` FOREIGN KEY (`module`) REFERENCES `modules` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_rolPermitions_rol` FOREIGN KEY (`rol`) REFERENCES `rol` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.rolPermitions: ~18 rows (approximately)
REPLACE INTO `rolPermitions` (`id`, `rol`, `read`, `write`, `edit`, `module`) VALUES
	(1, 1, 1, 1, 0, 1),
	(2, 1, 1, 0, 1, 2),
	(3, 1, 1, 1, 0, 3),
	(4, 1, 1, 1, 0, 4),
	(5, 1, 1, 1, 0, 5),
	(6, 1, 1, 1, 0, 6),
	(7, 1, 1, 1, 0, 7),
	(8, 2, 1, 1, 1, 5),
	(9, 2, 1, 1, 1, 2),
	(10, 2, 1, 1, 1, 11),
	(11, 2, 1, 1, 1, 12),
	(12, 2, 1, 1, 1, 10),
	(13, 2, 1, 1, 1, 13),
	(14, 1, 1, 1, 1, 14),
	(15, 2, 1, 1, 1, 15),
	(16, 2, 1, 1, 1, 16),
	(17, 2, 1, 1, 1, 17),
	(18, 2, 1, 1, 1, 3);

-- Dumping structure for table stock.sales
CREATE TABLE IF NOT EXISTS `sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `value` float NOT NULL DEFAULT 0,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `client_name` varchar(50) NOT NULL,
  `registered_by` int(11) NOT NULL DEFAULT 0,
  `client_id` int(11) DEFAULT NULL,
  `enterprise` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `payment` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `FK_sales_users` (`registered_by`),
  KEY `FK_sales_customer` (`client_id`),
  KEY `FK_sales_enterprise` (`enterprise`),
  KEY `FK_sales_projects` (`project_id`),
  CONSTRAINT `FK_sales_customer` FOREIGN KEY (`client_id`) REFERENCES `customer` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_sales_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_sales_projects` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_sales_users` FOREIGN KEY (`registered_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.sales: ~0 rows (approximately)

-- Dumping structure for table stock.salesDetail
CREATE TABLE IF NOT EXISTS `salesDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item` int(11) NOT NULL DEFAULT 0,
  `extras` text DEFAULT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  `value` float NOT NULL DEFAULT 0,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `sales_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_sales_products` (`item`) USING BTREE,
  KEY `FK_salesDetail_sales` (`sales_id`),
  CONSTRAINT `FK_salesDetail_sales` FOREIGN KEY (`sales_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `salesDetail_ibfk_2` FOREIGN KEY (`item`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table stock.salesDetail: ~0 rows (approximately)

-- Dumping structure for table stock.units
CREATE TABLE IF NOT EXISTS `units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notation` varchar(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.units: ~3 rows (approximately)
REPLACE INTO `units` (`id`, `notation`) VALUES
	(1, 'u'),
	(2, 'g'),
	(3, 'ml');

-- Dumping structure for table stock.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `rol` int(11) DEFAULT 0,
  `nickname` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(50) NOT NULL DEFAULT '',
  `registered` datetime NOT NULL DEFAULT current_timestamp(),
  `enterprise` int(11) DEFAULT NULL,
  `token` text DEFAULT NULL,
  `isAdmin` char(50) DEFAULT '0',
  `socketId` text DEFAULT NULL,
  `language` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nickname` (`nickname`),
  KEY `FK_users_enterprise` (`enterprise`),
  KEY `FK_users_rol` (`rol`),
  KEY `unique_email` (`email`) USING BTREE,
  CONSTRAINT `FK_users_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`),
  CONSTRAINT `FK_users_rol` FOREIGN KEY (`rol`) REFERENCES `rol` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.users: ~4 rows (approximately)
REPLACE INTO `users` (`id`, `name`, `rol`, `nickname`, `password`, `registered`, `enterprise`, `token`, `isAdmin`, `socketId`, `language`, `email`, `email_verified`) VALUES
	(1, 'Fabián ', 1, 'fibiaan', '81dc9bdb52d04dc20036dbd8313ed055', '2022-10-14 16:23:48', 1, 'eyJpZCI6MSwibmFtZSI6IkZhYmnDoW4gIiwibmlja25hbWUiOiJmaWJpYWFuIiwiZW1haWwiOm51bGwsImVtYWlsX3ZlcmlmaWVkIjpudWxsLCJpc0FkbWluIjoiMCIsImVudGVycHJpc2VfaWQiOjEsImVudGVycHJpc2VfbmFtZSI6IkZpYmlhYW4iLCJlbnRlcnByaXNlX3BhdGgiOiJodHRwOi8vbG9jYWxob3N0OjgwMTIvcHVibGljL2xvZ29zL2ZpYmlhYW4ucG5nIiwic2hvcnRjdXQiOiJmaWJpYWFuIiwicm9sIjoxLCJyZW50aW5nIjowLCJxdW90aW5nIjowLCJleHAiOjE2NzUwMzY5MTh9', '0', 'x_0gvGkQbMV-heVbAAAb', NULL, NULL, NULL),
	(2, 'César', 1, 'cesarp', '81dc9bdb52d04dc20036dbd8313ed055', '2022-10-22 23:21:05', 1, 'eyJpZCI6MiwibmFtZSI6IkPDqXNhciIsIm5pY2tuYW1lIjoiY2VzYXJwIiwiZW1haWwiOiJjZXNhcnBoZXJuYW5kZXowOUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6IjEiLCJpc0FkbWluIjoiMCIsImVudGVycHJpc2VfaWQiOjEsImVudGVycHJpc2VfbmFtZSI6IkZpYmlhYW4iLCJlbnRlcnByaXNlX3BhdGgiOiJodHRwOi8vbG9jYWxob3N0OjgwMTIvcHVibGljL2xvZ29zL2ZpYmlhYW4ucG5nIiwic2hvcnRjdXQiOiJmaWJpYWFuIiwicm9sIjoxLCJyZW50aW5nIjowLCJxdW90aW5nIjowLCJleHAiOjE2NzUwNTAzNTJ9', '0', '_ovVTeWyP4pAULZNAABG', NULL, 'cesarphernandez09@gmail.com', '1'),
	(3, 'Jerdirlson', 2, 'yeye', '81dc9bdb52d04dc20036dbd8313ed055', '2022-11-23 10:58:59', 2, 'eyJpZCI6MywibmFtZSI6IkplcmRpcmxzb24iLCJuaWNrbmFtZSI6InlleWUiLCJlbWFpbCI6bnVsbCwiZW1haWxfdmVyaWZpZWQiOm51bGwsImlzQWRtaW4iOiIwIiwiZW50ZXJwcmlzZV9pZCI6MiwiZW50ZXJwcmlzZV9uYW1lIjoiQ2ltYnJhcyIsImVudGVycHJpc2VfcGF0aCI6IiIsInNob3J0Y3V0IjoiY2ltYnJhcyIsInJvbCI6MiwicmVudGluZyI6MSwicXVvdGluZyI6MSwiZXhwIjoxNjc1MjcyNDY2fQ==', '0', '7Z-QtCiF0NXaKIVuAAAX', NULL, NULL, NULL),
	(4, 'Diego', 2, 'diegogo', '81dc9bdb52d04dc20036dbd8313ed055', '2023-01-11 18:51:11', 2, 'eyJpZCI6NCwibmFtZSI6IkRpZWdvIiwibmlja25hbWUiOiJkaWVnb2dvIiwiZW1haWwiOm51bGwsImVtYWlsX3ZlcmlmaWVkIjpudWxsLCJpc0FkbWluIjoiMCIsImVudGVycHJpc2VfaWQiOjIsImVudGVycHJpc2VfbmFtZSI6IkNpbWJyYXMiLCJlbnRlcnByaXNlX3BhdGgiOiIiLCJzaG9ydGN1dCI6ImNpbWJyYXMiLCJyb2wiOjIsInJlbnRpbmciOjEsInF1b3RpbmciOjEsImV4cCI6MTY3NTI3NDE0NX0=', '0', 'oVy33rdGeyjd6jCfAAAV', NULL, NULL, NULL);

-- Dumping structure for table stock.validationCodes
CREATE TABLE IF NOT EXISTS `validationCodes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` int(11) DEFAULT NULL,
  `exp` varchar(255) DEFAULT NULL,
  `fk_customer` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_customer` (`fk_customer`),
  CONSTRAINT `validationcodes_ibfk_1` FOREIGN KEY (`fk_customer`) REFERENCES `customer` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.validationCodes: ~2 rows (approximately)
REPLACE INTO `validationCodes` (`id`, `code`, `exp`, `fk_customer`) VALUES
	(1, 248629, '1671900953', 2),
	(2, 996827, '1671901486', 3);

-- Dumping structure for trigger stock.quotationInfoInsert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `quotationInfoInsert` AFTER INSERT ON `quotation` FOR EACH ROW BEGIN
	INSERT INTO quotationInfo (quotation_id, `action`, `user`) VALUES
	(NEW.id, 0, NEW.`user`);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger stock.quotationInfoUpdate
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `quotationInfoUpdate` AFTER UPDATE ON `quotation` FOR EACH ROW BEGIN
	INSERT INTO quotationInfo (quotation_id, `action`, `user`) VALUES
	(NEW.id, NEW.stage, NEW.updated_by);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
