-- --------------------------------------------------------
-- Host:                         anubisapps.com
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

-- Dumping data for table stock.appPermission: ~0 rows (approximately)
DELETE FROM `appPermission`;
INSERT INTO `appPermission` (`id`, `userId`, `appId`, `validated`, `token`) VALUES
	(1, 1, 1, 1, 'eyJpZCI6MSwibmFtZSI6IkZhYmnDoW4gIiwibmlja25hbWUiOiJmaWJpYWFuIiwiaXNBZG1pbiI6IjAiLCJlbnRlcnByaXNlIjoxLCJleHAiOjE2NzE3MjQzOTF9');

-- Dumping structure for table stock.apps
CREATE TABLE IF NOT EXISTS `apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.apps: ~0 rows (approximately)
DELETE FROM `apps`;
INSERT INTO `apps` (`id`, `name`) VALUES
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
  CONSTRAINT `FK_boughts_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `boughts_ibfk_2` FOREIGN KEY (`registered_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table stock.boughts: ~64 rows (approximately)
DELETE FROM `boughts`;
INSERT INTO `boughts` (`id`, `description`, `value`, `date`, `registered_by`, `enterprise`) VALUES
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
	(146, '', 80000, '2023-01-28 09:46:33', 3, 2),
	(147, '', 400000, '2023-02-05 21:38:57', 4, 2),
	(148, '', 0, '2023-02-09 12:36:57', 3, 2),
	(149, '', 3000000, '2023-02-09 14:28:18', 4, 2),
	(150, '', 3000000, '2023-02-09 14:29:48', 4, 2),
	(151, '', 3000000, '2023-02-09 14:30:21', 4, 2),
	(152, '', 3000000, '2023-02-09 14:32:09', 4, 2),
	(153, '', 3000000, '2023-02-09 14:33:35', 4, 2),
	(154, '', 30, '2023-02-09 14:37:04', 4, 2),
	(155, '', 1, '2023-02-09 14:40:54', 4, 2),
	(156, '', 790, '2023-02-09 14:41:49', 4, 2),
	(157, '', 1020, '2023-02-09 14:42:21', 4, 2),
	(158, '', 1185000, '2023-02-09 16:42:27', 4, 2),
	(159, '', 160000, '2023-02-09 16:42:36', 4, 2),
	(160, '', 80000, '2023-02-10 00:15:51', 4, 2),
	(161, '', 80000, '2023-02-10 00:16:28', 3, 2),
	(162, '', 400000, '2023-02-10 00:18:39', 4, 2),
	(163, '', 200000, '2023-02-10 00:40:16', 3, 2),
	(164, '', 480000, '2023-02-10 00:40:42', 4, 2),
	(165, '', 200000, '2023-02-10 08:41:07', 4, 2),
	(166, '', 320000, '2023-02-10 08:41:40', 3, 2),
	(167, '', 160000, '2023-02-10 10:42:09', 4, 2),
	(168, '', 1200000, '2023-02-10 10:44:33', 4, 2),
	(169, '', 4200000, '2023-02-10 10:45:22', 3, 2),
	(170, '', 600000, '2023-02-10 13:42:57', 4, 2),
	(171, '', 400000, '2023-02-11 22:41:22', 4, 2);

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
  CONSTRAINT `boughtsDetail_ibfk_2` FOREIGN KEY (`item`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table stock.boughtsDetail: ~0 rows (approximately)
DELETE FROM `boughtsDetail`;

-- Dumping structure for table stock.category
CREATE TABLE IF NOT EXISTS `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `color` varchar(8) NOT NULL DEFAULT '0',
  `enterprise` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_category_enterprise` (`enterprise`),
  CONSTRAINT `FK_category_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.category: ~11 rows (approximately)
DELETE FROM `category`;
INSERT INTO `category` (`id`, `name`, `color`, `enterprise`) VALUES
	(1, 'Enlatados', '#FFFF00', 1),
	(2, 'Empaquetados', '#850000', 1),
	(3, 'Productos Naturales', '#e9c4e9', 1),
	(4, 'Bebidas Frías', '#991133', 1),
	(5, 'Fast Foods', '#ff0000', 1),
	(6, 'SmartPhones', '#1111FF', 1),
	(19, 'Belleza', '#687873', 1),
	(20, 'Computadores', '#b73df0', 1),
	(26, 'Reactive test', '#387f2f', 1),
	(27, 'Láminas', '#d13333', 2),
	(28, 'asdasd', '#f6d32d', 2),
	(29, 'Mantenimiento', '#e2ff00', NULL),
	(30, 'Fabián Mejia', '#e01b24', 2),
	(31, 'Comida animales ', '#00ff00', 2);

-- Dumping structure for table stock.clientProduct
CREATE TABLE IF NOT EXISTS `clientProduct` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `clientProduct_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `clientProduct_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1356 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.clientProduct: ~267 rows (approximately)
DELETE FROM `clientProduct`;
INSERT INTO `clientProduct` (`id`, `client_id`, `product_id`, `amount`) VALUES
	(1089, 226, 461, 1),
	(1090, 227, 461, 6),
	(1091, 228, 461, 24),
	(1092, 229, 461, 4),
	(1093, 227, 462, 27),
	(1094, 230, 462, 4),
	(1095, 231, 462, 8),
	(1096, 228, 462, 16),
	(1097, 226, 463, 8),
	(1098, 227, 463, 40),
	(1099, 230, 463, 1),
	(1100, 228, 463, 18),
	(1101, 229, 463, 4),
	(1102, 226, 464, 1),
	(1103, 232, 464, 2),
	(1104, 228, 464, 25),
	(1105, 229, 464, 1),
	(1106, 226, 465, 11),
	(1107, 227, 465, 77),
	(1108, 230, 465, 2),
	(1109, 228, 465, 3),
	(1110, 229, 465, 4),
	(1111, 233, 465, 5),
	(1112, 234, 465, 12),
	(1113, 228, 466, 19),
	(1114, 229, 466, 1),
	(1115, 226, 467, 14),
	(1116, 227, 467, 12),
	(1117, 228, 467, 26),
	(1118, 227, 468, 3),
	(1119, 226, 469, 5),
	(1120, 228, 469, 8),
	(1121, 226, 470, 13),
	(1122, 227, 470, 16),
	(1123, 232, 470, 22),
	(1124, 230, 470, -2),
	(1125, 231, 470, 9),
	(1126, 228, 470, 21),
	(1127, 229, 470, 2),
	(1128, 235, 470, 5),
	(1129, 236, 470, 6),
	(1130, 227, 471, 34),
	(1131, 228, 471, 2),
	(1132, 227, 472, 34),
	(1133, 228, 472, 2),
	(1134, 226, 473, 120),
	(1135, 227, 473, 87),
	(1136, 228, 473, 108),
	(1137, 237, 473, 14),
	(1138, 234, 473, 24),
	(1139, 226, 474, 40),
	(1140, 228, 474, 10),
	(1141, 238, 474, 30),
	(1142, 234, 474, 15),
	(1143, 236, 474, 112),
	(1144, 226, 475, 60),
	(1145, 228, 475, 6),
	(1146, 238, 475, 68),
	(1147, 239, 475, 2),
	(1148, 234, 475, 7),
	(1149, 236, 475, 56),
	(1150, 240, 475, 1),
	(1151, 241, 476, 11),
	(1152, 226, 476, 80),
	(1153, 227, 476, 129),
	(1154, 228, 476, 80),
	(1155, 237, 476, 16),
	(1156, 234, 476, 24),
	(1157, 234, 477, 4),
	(1158, 241, 478, 2),
	(1159, 230, 478, 5),
	(1160, 234, 478, 3),
	(1161, 236, 478, 2),
	(1162, 234, 479, 10),
	(1163, 230, 480, -4),
	(1164, 242, 480, 1),
	(1165, 233, 480, 5),
	(1166, 234, 480, 3),
	(1167, 236, 480, 26),
	(1168, 230, 481, 1),
	(1169, 235, 483, 4),
	(1170, 235, 484, 2),
	(1171, 243, 487, 10),
	(1172, 244, 490, 1),
	(1173, 239, 492, 150),
	(1174, 228, 495, 60),
	(1175, 228, 496, 9),
	(1176, 228, 498, 46),
	(1177, 241, 500, 10),
	(1178, 226, 500, 2000),
	(1179, 227, 500, 6122),
	(1180, 245, 500, 72),
	(1181, 231, 500, 390),
	(1182, 228, 500, 4640),
	(1183, 238, 500, 1500),
	(1184, 239, 500, 251),
	(1185, 229, 500, 130),
	(1186, 234, 500, 650),
	(1187, 236, 500, 1400),
	(1188, 243, 500, 190),
	(1189, 246, 500, 39),
	(1190, 240, 500, 28),
	(1191, 230, 502, 5),
	(1192, 231, 502, 36),
	(1193, 228, 502, 3),
	(1194, 239, 502, 20),
	(1195, 229, 502, 1),
	(1196, 234, 502, 7),
	(1197, 236, 502, 15),
	(1198, 243, 502, 4),
	(1199, 241, 503, 9),
	(1200, 227, 503, 170),
	(1201, 230, 503, 38),
	(1202, 231, 503, 24),
	(1203, 228, 503, 15),
	(1204, 239, 503, 10),
	(1205, 247, 503, 17),
	(1206, 234, 503, 56),
	(1207, 248, 503, 1),
	(1208, 236, 503, 20),
	(1209, 243, 503, 4),
	(1210, 249, 503, 6),
	(1211, 240, 503, 7),
	(1212, 226, 504, 100),
	(1213, 228, 504, 14),
	(1214, 229, 504, 5),
	(1215, 250, 504, 1),
	(1216, 236, 504, 57),
	(1217, 243, 504, 4),
	(1218, 230, 505, 23),
	(1219, 239, 505, 1),
	(1220, 250, 505, 12),
	(1221, 243, 505, 4),
	(1222, 226, 506, 100),
	(1223, 246, 506, 180),
	(1224, 240, 506, 1),
	(1225, 239, 508, 200),
	(1226, 227, 509, 23),
	(1227, 228, 509, 38),
	(1228, 229, 509, 4),
	(1229, 251, 509, 99),
	(1230, 227, 510, 1),
	(1231, 229, 510, 4),
	(1232, 251, 510, 42),
	(1233, 227, 511, 34),
	(1234, 252, 512, 14),
	(1235, 234, 512, 1),
	(1236, 228, 513, 7),
	(1237, 252, 513, 12),
	(1238, 239, 515, 6),
	(1239, 229, 515, 8),
	(1240, 234, 515, 1),
	(1241, 236, 515, 6),
	(1242, 240, 515, 6),
	(1243, 239, 516, 6),
	(1244, 229, 516, 8),
	(1245, 236, 516, 6),
	(1246, 240, 516, 6),
	(1247, 227, 518, 34),
	(1248, 239, 519, 1),
	(1249, 246, 519, 2),
	(1250, 227, 520, 21),
	(1251, 228, 520, 11),
	(1252, 229, 520, 8),
	(1253, 234, 520, 5),
	(1254, 227, 521, 51),
	(1255, 253, 522, 10),
	(1256, 227, 522, 12),
	(1257, 228, 522, 6),
	(1258, 254, 522, 11),
	(1259, 234, 522, 35),
	(1260, 255, 522, 2),
	(1261, 227, 523, 70),
	(1262, 228, 523, 32),
	(1263, 229, 523, 8),
	(1264, 227, 524, 38),
	(1265, 228, 524, 16),
	(1266, 254, 524, 4),
	(1267, 234, 524, 55),
	(1268, 226, 525, 8),
	(1269, 227, 525, 2),
	(1270, 256, 525, 30),
	(1271, 227, 526, 57),
	(1272, 228, 526, 72),
	(1273, 229, 526, 1),
	(1274, 246, 526, 2),
	(1275, 253, 527, 7),
	(1276, 226, 527, 31),
	(1277, 227, 527, 34),
	(1278, 228, 527, 17),
	(1279, 228, 528, 4),
	(1280, 227, 529, 28),
	(1281, 230, 529, 24),
	(1282, 228, 529, 46),
	(1283, 229, 529, 2),
	(1284, 227, 530, 6),
	(1285, 228, 530, 20),
	(1286, 229, 530, 4),
	(1287, 227, 531, 368),
	(1288, 230, 531, 12),
	(1289, 228, 531, 218),
	(1290, 229, 531, 11),
	(1291, 241, 532, 2),
	(1292, 227, 533, 3),
	(1293, 230, 535, 1),
	(1294, 231, 535, 20),
	(1295, 228, 535, 1),
	(1296, 239, 535, 5),
	(1297, 234, 535, 11),
	(1298, 236, 535, 61),
	(1299, 228, 536, 1),
	(1300, 239, 536, 13),
	(1301, 228, 537, 1),
	(1302, 230, 538, 1),
	(1303, 228, 538, 1),
	(1304, 226, 539, 104),
	(1305, 231, 539, 20),
	(1306, 226, 540, 28),
	(1307, 226, 541, 18),
	(1308, 252, 542, 5),
	(1309, 228, 544, 1),
	(1310, 238, 544, 263),
	(1311, 234, 544, 3),
	(1312, 236, 544, 10),
	(1313, 234, 546, 2),
	(1314, 230, 548, 3),
	(1315, 231, 548, 60),
	(1316, 228, 548, 3),
	(1317, 238, 548, 200),
	(1318, 252, 548, 3),
	(1319, 236, 548, 165),
	(1320, 246, 548, 2),
	(1321, 227, 550, 1),
	(1322, 234, 550, 2),
	(1323, 228, 551, 6),
	(1324, 239, 551, 17),
	(1325, 234, 551, 1),
	(1326, 228, 552, 2),
	(1327, 228, 553, 102),
	(1328, 252, 553, 2),
	(1329, 234, 553, 4),
	(1330, 257, 553, 1),
	(1331, 227, 554, 2),
	(1332, 228, 555, 2),
	(1333, 230, 556, 1),
	(1334, 231, 556, 20),
	(1335, 228, 556, 1),
	(1336, 234, 556, 48),
	(1337, 257, 556, 2),
	(1338, 228, 557, 2),
	(1339, 253, 560, 6),
	(1340, 239, 560, 4),
	(1341, 229, 560, 6),
	(1342, 258, 560, 1),
	(1343, 250, 560, 2),
	(1344, 236, 560, 1),
	(1345, 249, 560, 8),
	(1346, 240, 560, 4),
	(1347, 226, 561, 172),
	(1348, 227, 561, 692),
	(1349, 232, 561, 21),
	(1350, 231, 561, 140),
	(1351, 228, 561, 504),
	(1352, 229, 561, 2),
	(1353, 233, 561, 39),
	(1354, 236, 561, 18),
	(1355, 246, 561, 1);

-- Dumping structure for table stock.clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `type` varchar(50) NOT NULL DEFAULT '2',
  `nit` varchar(50) NOT NULL DEFAULT '0',
  `rut` int(11) DEFAULT NULL,
  `cv` varchar(50) NOT NULL DEFAULT '0',
  `email` varchar(50) NOT NULL DEFAULT '0',
  `registro` datetime NOT NULL DEFAULT current_timestamp(),
  `contact_name` varchar(50) DEFAULT '''''',
  `contact_phone` varchar(50) DEFAULT '''''',
  `contact_email` varchar(50) DEFAULT '''''',
  `enterprise` int(11) DEFAULT NULL,
  `stage` int(1) DEFAULT 2,
  PRIMARY KEY (`id`),
  KEY `FK_clients_enterprise` (`enterprise`),
  KEY `FK_clients_media` (`rut`),
  KEY `FK_clients_clientStage` (`stage`),
  CONSTRAINT `FK_clients_clientStage` FOREIGN KEY (`stage`) REFERENCES `clientStage` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_clients_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_clients_media` FOREIGN KEY (`rut`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=259 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.clients: ~38 rows (approximately)
DELETE FROM `clients`;
INSERT INTO `clients` (`id`, `name`, `type`, `nit`, `rut`, `cv`, `email`, `registro`, `contact_name`, `contact_phone`, `contact_email`, `enterprise`, `stage`) VALUES
	(1, 'Fabiaan Enterprise S.A.S.', '2', '1005338906', 71, '0', 'fibianmejia@hotmail.com', '2023-01-13 09:13:42', 'Fabián Mejía', '3125677288', 'fibianmejia@hotmail.com', 2, 2),
	(2, 'Cesar', '1', '1071584903', 72, '0', 'cesarphernandez09@gmail.com', '2023-01-13 12:47:21', 'Cesar Peña', '31374839', 'cesarphernandez09@gmail.com', 2, 2),
	(72, 'Encocol', '2', '123456789', 74, '0', 'encocol@gmail.com', '2023-01-14 13:51:44', 'Diego Castillo', '317052809', 'diegogo@gmail.com', 2, 2),
	(73, 'Encocol2', '2', '123456789', 75, '0', 'encocol@gmail.com', '2023-01-16 08:33:12', 'Diego Castillo', '317052809', 'diegogo@gmail.com', 2, 2),
	(74, 'Blu', '1', '123456789', 76, '0', 'blu@gmail.com', '2023-01-21 08:34:23', 'Blu', '123', 'blu@gmail.com', 2, 2),
	(226, 'ASGLOBAL', '2', '0', NULL, '0', '0', '2023-02-12 22:35:59', '\'\'', '\'\'', '\'\'', 2, 2),
	(227, 'CASAS ING.', '2', '0', NULL, '0', '0', '2023-02-12 22:35:59', '\'\'', '\'\'', '\'\'', 2, 2),
	(228, 'CONSORCIO PATRIA', '2', '0', NULL, '0', '0', '2023-02-12 22:35:59', '\'\'', '\'\'', '\'\'', 2, 2),
	(229, 'IGLESIA MINIS.', '2', '0', NULL, '0', '0', '2023-02-12 22:35:59', '\'\'', '\'\'', '\'\'', 2, 2),
	(230, 'COMPUSER', '2', '0', NULL, '0', '0', '2023-02-12 22:35:59', '\'\'', '\'\'', '\'\'', 2, 2),
	(231, 'CONDISVIAL', '2', '0', NULL, '0', '0', '2023-02-12 22:35:59', '\'\'', '\'\'', '\'\'', 2, 2),
	(232, 'CLEMENTE', '2', '0', NULL, '0', '0', '2023-02-12 22:36:00', '\'\'', '\'\'', '\'\'', 2, 2),
	(233, 'INGESAB', '2', '0', NULL, '0', '0', '2023-02-12 22:36:01', '\'\'', '\'\'', '\'\'', 2, 2),
	(234, 'JHON LOPEZ', '2', '0', NULL, '0', '0', '2023-02-12 22:36:01', '\'\'', '\'\'', '\'\'', 2, 2),
	(235, 'METALISA', '2', '0', NULL, '0', '0', '2023-02-12 22:36:02', '\'\'', '\'\'', '\'\'', 2, 2),
	(236, 'PEDRO PEREZ', '2', '0', NULL, '0', '0', '2023-02-12 22:36:02', '\'\'', '\'\'', '\'\'', 2, 2),
	(237, 'FYJ', '2', '0', NULL, '0', '0', '2023-02-12 22:36:03', '\'\'', '\'\'', '\'\'', 2, 2),
	(238, 'CONSTRUCTORA MARDEL', '2', '0', NULL, '0', '0', '2023-02-12 22:36:03', '\'\'', '\'\'', '\'\'', 2, 2),
	(239, 'EDILMA', '2', '0', NULL, '0', '0', '2023-02-12 22:36:04', '\'\'', '\'\'', '\'\'', 2, 2),
	(240, 'VILLABEL', '2', '0', NULL, '0', '0', '2023-02-12 22:36:04', '\'\'', '\'\'', '\'\'', 2, 2),
	(241, 'ARNULFO VECINO', '2', '0', NULL, '0', '0', '2023-02-12 22:36:04', '\'\'', '\'\'', '\'\'', 2, 2),
	(242, 'DOUGLAS', '2', '0', NULL, '0', '0', '2023-02-12 22:36:05', '\'\'', '\'\'', '\'\'', 2, 2),
	(243, 'UFRABE', '2', '0', NULL, '0', '0', '2023-02-12 22:36:06', '\'\'', '\'\'', '\'\'', 2, 2),
	(244, 'CONSORCIO FRJ', '2', '0', NULL, '0', '0', '2023-02-12 22:36:06', '\'\'', '\'\'', '\'\'', 2, 2),
	(245, 'CENTRO INMOBILIARIO', '2', '0', NULL, '0', '0', '2023-02-12 22:36:07', '\'\'', '\'\'', '\'\'', 2, 2),
	(246, 'UNION ELECTRICA', '2', '0', NULL, '0', '0', '2023-02-12 22:36:07', '\'\'', '\'\'', '\'\'', 2, 2),
	(247, 'GRUPO KOI', '2', '0', NULL, '0', '0', '2023-02-12 22:36:09', '\'\'', '\'\'', '\'\'', 2, 2),
	(248, 'JAIRO PORTILLA', '2', '0', NULL, '0', '0', '2023-02-12 22:36:09', '\'\'', '\'\'', '\'\'', 2, 2),
	(249, 'URBA. MARTINEZ', '2', '0', NULL, '0', '0', '2023-02-12 22:36:09', '\'\'', '\'\'', '\'\'', 2, 2),
	(250, 'NESTOR PINZON', '2', '0', NULL, '0', '0', '2023-02-12 22:36:10', '\'\'', '\'\'', '\'\'', 2, 2),
	(251, 'LEGF CONSTRUCCIONES', '2', '0', NULL, '0', '0', '2023-02-12 22:36:11', '\'\'', '\'\'', '\'\'', 2, 2),
	(252, 'GARCIA VEGA', '2', '0', NULL, '0', '0', '2023-02-12 22:36:11', '\'\'', '\'\'', '\'\'', 2, 2),
	(253, 'ALQUIOBRAS', '2', '0', NULL, '0', '0', '2023-02-12 22:36:13', '\'\'', '\'\'', '\'\'', 2, 2),
	(254, 'FREDY', '2', '0', NULL, '0', '0', '2023-02-12 22:36:13', '\'\'', '\'\'', '\'\'', 2, 2),
	(255, 'PARMO ING.', '2', '0', NULL, '0', '0', '2023-02-12 22:36:14', '\'\'', '\'\'', '\'\'', 2, 2),
	(256, 'CHEPE ', '2', '0', NULL, '0', '0', '2023-02-12 22:36:14', '\'\'', '\'\'', '\'\'', 2, 2),
	(257, 'RUBEN DARIO', '2', '0', NULL, '0', '0', '2023-02-12 22:36:20', '\'\'', '\'\'', '\'\'', 2, 2),
	(258, 'LUZ AMPARO', '2', '0', NULL, '0', '0', '2023-02-12 22:36:21', '\'\'', '\'\'', '\'\'', 2, 2);

-- Dumping structure for table stock.clientStage
CREATE TABLE IF NOT EXISTS `clientStage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.clientStage: ~3 rows (approximately)
DELETE FROM `clientStage`;
INSERT INTO `clientStage` (`id`, `name`) VALUES
	(1, 'pendiente'),
	(2, 'activo'),
	(3, 'inactivo'),
	(4, 'rechazado');

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
DELETE FROM `customer`;
INSERT INTO `customer` (`id`, `name`, `email`, `cellphone`, `password`, `activated`, `token`, `created_at`, `update_at`) VALUES
	(2, 'Cesar', 'test@example.com', 31567888888, '202cb962ac59075b964b07152d234b70', 0, NULL, '2022-12-24 15:55:53', '2022-12-24 15:55:53'),
	(3, 'Xxxx', 'xx@gmail.com', 3000000000, '202cb962ac59075b964b07152d234b70', 1, 'eyJpZCI6MywibmFtZSI6Ilh4eHgiLCJlbWFpbCI6Inh4QGdtYWlsLmNvbSIsImNlbGxwaG9uZSI6MzAwMDAwMDAwMCwicGFzc3dvcmQiOiIyMDJjYjk2MmFjNTkwNzViOTY0YjA3MTUyZDIzNGI3MCIsImFjdGl2YXRlZCI6MSwidG9rZW4iOiIiLCJjcmVhdGVkX2F0IjoiMjAyMi0xMi0yNFQxNjowNDo0Ni4wMDBaIiwidXBkYXRlX2F0IjoiMjAyMy0wMS0yMlQwMTo0MTo1NC4wMDBaIiwiZXhwIjoxNjc0MzU1NDU4fQ==', '2022-12-24 16:04:46', '2023-01-22 01:44:18');

-- Dumping structure for table stock.dispatching
CREATE TABLE IF NOT EXISTS `dispatching` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `out_store` datetime DEFAULT NULL,
  `received` datetime DEFAULT NULL,
  `quotation_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `quotation_id` (`quotation_id`),
  CONSTRAINT `dispatching_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `dispatching_ibfk_2` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.dispatching: ~3 rows (approximately)
DELETE FROM `dispatching`;
INSERT INTO `dispatching` (`id`, `out_store`, `received`, `quotation_id`, `created_at`, `created_by`) VALUES
	(141, '2023-02-12 15:27:31', '2023-02-12 15:27:31', 110, '2023-02-12 15:27:31', 4),
	(142, '2023-02-12 15:34:59', '2023-02-12 15:34:59', 111, '2023-02-12 15:34:59', 4),
	(143, '2023-02-12 15:35:45', '2023-02-12 15:35:45', 112, '2023-02-12 15:35:45', 4);

-- Dumping structure for table stock.dispatchingDetail
CREATE TABLE IF NOT EXISTS `dispatchingDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quotation_detail_id` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `dispatch_id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quotation_detail_id` (`quotation_detail_id`),
  KEY `dispatch_id` (`dispatch_id`),
  CONSTRAINT `dispatchingDetail_ibfk_1` FOREIGN KEY (`quotation_detail_id`) REFERENCES `quotationDetail` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dispatchingDetail_ibfk_2` FOREIGN KEY (`dispatch_id`) REFERENCES `dispatching` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.dispatchingDetail: ~0 rows (approximately)
DELETE FROM `dispatchingDetail`;

-- Dumping structure for table stock.enterprise
CREATE TABLE IF NOT EXISTS `enterprise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `nit` varchar(50) NOT NULL DEFAULT '',
  `logo` int(11) DEFAULT NULL,
  `shortcut` varchar(50) NOT NULL DEFAULT '',
  `renting` int(1) NOT NULL DEFAULT 0,
  `quoting` int(1) DEFAULT 0,
  `cart` int(1) DEFAULT 0,
  `selling` int(1) DEFAULT 0,
  `projects` int(1) DEFAULT 0,
  `prefix_quote` varchar(50) DEFAULT NULL,
  `prefix_invoice` varchar(50) DEFAULT NULL,
  `colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`colors`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `shortcut` (`shortcut`),
  KEY `FK_enterprise_media` (`logo`),
  CONSTRAINT `FK_enterprise_media` FOREIGN KEY (`logo`) REFERENCES `media` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.enterprise: ~2 rows (approximately)
DELETE FROM `enterprise`;
INSERT INTO `enterprise` (`id`, `name`, `nit`, `logo`, `shortcut`, `renting`, `quoting`, `cart`, `selling`, `projects`, `prefix_quote`, `prefix_invoice`, `colors`) VALUES
	(1, 'Fibiaan', '', 1, 'fibiaan', 0, 0, 0, 0, 0, NULL, NULL, NULL),
	(2, 'Cimbras de Colombia S.A.S.', '900371951', 2, 'cimbras', 1, 0, 0, 1, 1, 'CCB', 'CIB', '[{"value":"#583739"},{"value":"#0000ff"},{"value":"#000000"}]');

-- Dumping structure for table stock.enterpriseModules
CREATE TABLE IF NOT EXISTS `enterpriseModules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enterprise_id` int(11) DEFAULT NULL,
  `module_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_enterpriseModules_enterprise` (`enterprise_id`),
  KEY `FK_enterpriseModules_modules` (`module_id`),
  CONSTRAINT `FK_enterpriseModules_enterprise` FOREIGN KEY (`enterprise_id`) REFERENCES `enterprise` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_enterpriseModules_modules` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.enterpriseModules: ~3 rows (approximately)
DELETE FROM `enterpriseModules`;
INSERT INTO `enterpriseModules` (`id`, `enterprise_id`, `module_id`) VALUES
	(1, 2, 3),
	(2, 2, 5),
	(3, 2, 2),
	(4, 2, 11),
	(5, 2, 15);

-- Dumping structure for table stock.history
CREATE TABLE IF NOT EXISTS `history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.history: ~0 rows (approximately)
DELETE FROM `history`;

-- Dumping structure for table stock.invoicing
CREATE TABLE IF NOT EXISTS `invoicing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `quotation_id` int(11) NOT NULL,
  `serial` varchar(50) NOT NULL,
  `subtotal` float NOT NULL DEFAULT 0,
  `discount` float NOT NULL DEFAULT 0,
  `taxing` float NOT NULL DEFAULT 0,
  `total` float NOT NULL DEFAULT 0,
  `stage` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `deleted` int(11) NOT NULL DEFAULT 0,
  `creation` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_invoicing_clients` (`client_id`),
  KEY `FK_invoicing_quotation` (`quotation_id`),
  KEY `FK_invoicing_invoicingStages` (`stage`),
  KEY `FK_invoicing_users` (`created_by`),
  CONSTRAINT `FK_invoicing_clients` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_invoicing_invoicingStages` FOREIGN KEY (`stage`) REFERENCES `invoicingStages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_invoicing_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_invoicing_users` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.invoicing: ~1 rows (approximately)
DELETE FROM `invoicing`;

-- Dumping structure for table stock.invoicingDetail
CREATE TABLE IF NOT EXISTS `invoicingDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoicing_id` int(11) NOT NULL,
  `quotation_detail_id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `value` float NOT NULL,
  `amount` float NOT NULL,
  `dscp` varchar(50) DEFAULT NULL,
  `date_from` datetime DEFAULT NULL,
  `date_to` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_invoicingDetail_invoicing` (`invoicing_id`),
  KEY `FK_invoicingDetail_quotationDetail` (`quotation_detail_id`),
  CONSTRAINT `FK_invoicingDetail_invoicing` FOREIGN KEY (`invoicing_id`) REFERENCES `invoicing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_invoicingDetail_quotationDetail` FOREIGN KEY (`quotation_detail_id`) REFERENCES `quotationDetail` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.invoicingDetail: ~0 rows (approximately)
DELETE FROM `invoicingDetail`;

-- Dumping structure for table stock.invoicingStages
CREATE TABLE IF NOT EXISTS `invoicingStages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.invoicingStages: ~2 rows (approximately)
DELETE FROM `invoicingStages`;
INSERT INTO `invoicingStages` (`id`, `name`) VALUES
	(1, 'draft'),
	(2, 'settlement'),
	(3, 'invoicing');

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
  CONSTRAINT `losses_ibfk_1` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `losses_ibfk_2` FOREIGN KEY (`registered_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table stock.losses: ~4 rows (approximately)
DELETE FROM `losses`;
INSERT INTO `losses` (`id`, `description`, `value`, `date`, `registered_by`, `enterprise`) VALUES
	(95, '', 6500, '2022-11-23 10:45:17', 2, 1),
	(96, '', 30000000, '2023-01-12 21:55:23', 1, 1),
	(97, '', 20000, '2023-02-09 10:41:20', 4, 2),
	(98, '', 12000, '2023-02-09 10:57:07', 3, 2),
	(99, '', 400000, '2023-02-10 00:40:28', 4, 2);

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
  CONSTRAINT `lossesDetail_ibfk_2` FOREIGN KEY (`item`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table stock.lossesDetail: ~0 rows (approximately)
DELETE FROM `lossesDetail`;

-- Dumping structure for table stock.media
CREATE TABLE IF NOT EXISTS `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` text DEFAULT NULL,
  `filename` varchar(50) DEFAULT NULL,
  `host` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.media: ~7 rows (approximately)
DELETE FROM `media`;
INSERT INTO `media` (`id`, `path`, `filename`, `host`) VALUES
	(1, 'https://stockapi.anubisapps.com/public/logos/fibiaan.png', 'fibiaan.png', 'https://stockapi.anubisapps.com/public/'),
	(2, 'https://stockapi.anubisapps.com/public/logos/encocol.png', 'encocol.png', 'https://stockapi.anubisapps.com/public/'),
	(71, '/clients/2/', 'Fabiaan_2023-01.pdf', 'https://stockapi.anubisapps.com/public/'),
	(72, '/clients/2/', 'Cesar_2023-01.png', 'https://stockapi.anubisapps.com/public/'),
	(74, '/clients/2/', 'Encocol_2023-01.pdf', 'https://stockapi.anubisapps.com/public/'),
	(75, '/clients/2/', 'Encocol2_2023-01.png', 'https://stockapi.anubisapps.com/public/'),
	(76, '/clients/2/', 'Blu_2023-01.jpeg', 'https://stockapi.anubisapps.com/public/');

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

-- Dumping data for table stock.modules: ~14 rows (approximately)
DELETE FROM `modules`;
INSERT INTO `modules` (`id`, `name`, `url`, `depends`, `icon`, `order`, `active`) VALUES
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
DELETE FROM `partners`;

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
) ENGINE=InnoDB AUTO_INCREMENT=562 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.products: ~101 rows (approximately)
DELETE FROM `products`;
INSERT INTO `products` (`id`, `name`, `description`, `unit`, `stock`, `rented`, `sold`, `toCraft`, `expired`, `currency`, `price`, `cost`, `wholesale`, `rent`, `onSales`, `onBuying`, `onLosses`, `onRenting`, `isRecipe`, `categories`, `creation`, `enterprise`, `published`, `removed`) VALUES
	(461, 'ALINEADOR 1.00 mts', NULL, NULL, 101, 35, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(462, 'ALINEADOR 1.50 mts', NULL, NULL, 46, 55, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(463, 'ALINEADOR 2.00 mts', NULL, NULL, 28, 71, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(464, 'ALINEADOR 2.50 mts', NULL, NULL, 17, 29, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(465, 'ALINEADOR 3.00 mts', NULL, NULL, 1, 114, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(466, 'ALINEADOR 3.50 mts', NULL, NULL, 1, 20, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(467, 'ALINEADOR 4.00 mts', NULL, NULL, 22, 52, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(468, 'ALINEADOR 4.50 mts', NULL, NULL, 0, 3, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(469, 'ALINEADOR 5.00 mts', NULL, NULL, 0, 13, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(470, 'ALINEADOR 6.00 mts', NULL, NULL, 6, 92, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(471, 'ANDAMIO FORMALETA / BARANDA ', NULL, NULL, 15, 36, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(472, 'ANDAMIO FORMALETA / SOPORTE ', NULL, NULL, 0, 36, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(473, 'ANGULO 1200 mm', NULL, NULL, 0, 353, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(474, '"ANGULO 24"""', NULL, NULL, 0, 207, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(475, '"ANGULO 48"""', NULL, NULL, 0, 200, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(476, 'ANGULO 600 mm', NULL, NULL, 0, 340, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(477, 'CERCHA METALICA 1.00 mts ', NULL, NULL, 7, 4, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(478, 'CERCHA METALICA 2.00 mts', NULL, NULL, 21, 12, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(479, 'CERCHA METALICA 2.50 mts', NULL, NULL, 0, 10, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(480, 'CERCHA METALICA 3.00 mts', NULL, NULL, 90, 31, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(481, 'CERCHA METALICA 4.00 mts', NULL, NULL, 1, 1, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(482, '"CIRCULAR MEDIA DIAM .  250 X 48"" Cal.12"', NULL, NULL, 4, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(483, 'CIRCULAR MEDIA DIAM 500 X 1200 mm', NULL, NULL, 2, 4, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(484, 'CIRCULAR MEDIA DIAM 500 X 600 mm', NULL, NULL, 0, 2, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(485, 'CIRCULAR MEDIA DIAM 700 X 1200 mm', NULL, NULL, 10, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(486, 'CIRCULAR MEDIA DIAM 700 X 600 mm', NULL, NULL, 4, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(487, 'CIRCULAR MEDIA DIAM 800 X 1200 mm', NULL, NULL, 0, 10, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(488, 'CIRCULAR MEDIA DIAM 800 X 600 mm', NULL, NULL, 4, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(489, 'CONO SLUMP ACERO + VARIILLA 5/8 ', NULL, NULL, 1, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(490, 'CORONA POZO INSPECCION JUEGO X 4 UNI', NULL, NULL, 0, 1, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(491, '"DISTANCIADOR / CORBARA PARA MURO 12"""', NULL, NULL, 65, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(492, 'DISTANCIADOR / CORBATA PARA MURO  100 mm ', NULL, NULL, 0, 150, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(493, 'DISTANCIADOR / CORBATA PARA MURO  150 mm', NULL, NULL, 28, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(494, 'DISTANCIADOR / CORBATA PARA MURO  200 mm', NULL, NULL, 457, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(495, 'DISTANCIADOR / CORBATA PARA MURO  300 mm', NULL, NULL, 50, 60, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(496, 'DISTANCIADOR / CORBATA PARA MURO  400 mm', NULL, NULL, 147, 9, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(497, '"DISTANCIADOR / CORBATA PARA MURO 10"""', NULL, NULL, 25, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(498, 'DISTANCIADOR / CORBATA PARA MURO 250 mm', NULL, NULL, 258, 46, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(499, 'DISTANCIADOR / CORBATA PARA MURO 350 mm', NULL, NULL, 9, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(500, 'GRAPA / CHAPETA ', NULL, NULL, 6835, 17952, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(501, 'MARTILLO EXTRACTOR DISTANCIADOR ', NULL, NULL, 1, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(502, 'PARAL METALICO CORRIENTE 1.00 mts', NULL, NULL, 31, 91, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(503, 'PARAL METALICO CORRIENTE 3.00 mts', NULL, NULL, 235, 389, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(504, 'PARAL METALICO CORRIENTE 4.00 mts', NULL, NULL, 385, 181, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(505, 'PARAL METALICO CORRIENTE 6.00 mts', NULL, NULL, 34, 40, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(506, 'PIN DOBLE ', NULL, NULL, 471, 281, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(507, 'PIN EXTERNO ', NULL, NULL, 191, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(508, 'PIN SENCILLO ', NULL, NULL, 987, 200, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(509, 'RINC. METALICA 100 X 100 X 1200 mm', NULL, NULL, 0, 164, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(510, 'RINC. METALICA 100 X 100 X 600 mm', NULL, NULL, 0, 47, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(511, 'RINC. METALICA 100 X 150 X 1200 mm', NULL, NULL, 17, 34, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(512, '"RINC. METALICA 4"" X 4"" X 24"""', NULL, NULL, 140, 15, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(513, '"RINC. METALICA 4"" X 4"" X 48"""', NULL, NULL, 201, 19, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(514, '"RINC. METALICA 6"" X 6"" X 48"""', NULL, NULL, 10, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(515, 'SECCION ANDAMIO / CRUCETA ', NULL, NULL, 5, 27, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(516, 'SECCION ANDAMIO / MARCO ', NULL, NULL, 0, 26, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(517, 'SELLO ANTIGOTEO ', NULL, NULL, 1300, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(518, 'SOPORTE FACHADA PARA ANDAMIO  ', NULL, NULL, 7, 34, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(519, 'TAB. MADERA  700 X 1400 mm', NULL, NULL, 49, 3, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(520, 'TAB. METALICO  100 X 1200 mm', NULL, NULL, 26, 45, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(521, 'TAB. METALICO  150 X 1200 mm', NULL, NULL, 0, 51, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(522, 'TAB. METALICO  200 X 1200 mm', NULL, NULL, 12, 76, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(523, 'TAB. METALICO  250 X 1200 mm', NULL, NULL, 64, 110, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(524, 'TAB. METALICO  300 X 1200 mm', NULL, NULL, 0, 113, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(525, 'TAB. METALICO  350 X 1200 mm', NULL, NULL, 0, 40, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(526, 'TAB. METALICO  400 X 1200 mm', NULL, NULL, 38, 132, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(527, 'TAB. METALICO  450 X 1200 mm', NULL, NULL, 3, 89, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(528, 'TAB. METALICO  50 X 1200 mm', NULL, NULL, 1, 4, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(529, 'TAB. METALICO  500 X 1200 mm', NULL, NULL, 21, 100, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(530, 'TAB. METALICO  550 X 1200 mm', NULL, NULL, 13, 30, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(531, 'TAB. METALICO  600 X 1200 mm', NULL, NULL, 199, 609, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(532, '"TAB. METALICO 10"" X 48"""', NULL, NULL, 122, 2, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(533, 'TAB. METALICO 100 X 600 mm', NULL, NULL, 10, 3, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(534, '"TAB. METALICO 11"" X 48"""', NULL, NULL, 44, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(535, '"TAB. METALICO 12"" X 48"""', NULL, NULL, 3, 99, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(536, '"TAB. METALICO 13"" X 48"""', NULL, NULL, 1, 14, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(537, '"TAB. METALICO 14"" X 48"""', NULL, NULL, 38, 1, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(538, '"TAB. METALICO 15"" X 48"""', NULL, NULL, 21, 2, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(539, '"TAB. METALICO 16"" X 48"""', NULL, NULL, 16, 124, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(540, '"TAB. METALICO 17"" X 48"""', NULL, NULL, 0, 28, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(541, '"TAB. METALICO 18"" X 48"""', NULL, NULL, 30, 18, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(542, '"TAB. METALICO 19"" X 48"""', NULL, NULL, 7, 5, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(543, '"TAB. METALICO 2"" X 48"""', NULL, NULL, 4, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(544, '"TAB. METALICO 20"" X 48"""', NULL, NULL, 65, 277, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(545, '"TAB. METALICO 21"" X 48"""', NULL, NULL, 32, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(546, '"TAB. METALICO 22"" X 48"""', NULL, NULL, 18, 2, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(547, '"TAB. METALICO 23"" X 48"""', NULL, NULL, 3, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(548, '"TAB. METALICO 24"" X 48"""', NULL, NULL, 120, 436, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(549, '"TAB. METALICO 3"" X 48"""', NULL, NULL, 23, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(550, 'TAB. METALICO 300 X 600 mm', NULL, NULL, 5, 3, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(551, '"TAB. METALICO 4"" X 48"""', NULL, NULL, 85, 31, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(552, '"TAB. METALICO 5"" X 48"""', NULL, NULL, 43, 2, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(553, '"TAB. METALICO 6"" X 48"""', NULL, NULL, 7, 109, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(554, 'TAB. METALICO 600 X 600 mm', NULL, NULL, 6, 2, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(555, '"TAB. METALICO 7"" X 48"""', NULL, NULL, 36, 2, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(556, '"TAB. METALICO 8"" X 48"""', NULL, NULL, 8, 97, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(557, '"TAB. METALICO 9"" X 48"""', NULL, NULL, 16, 2, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(558, '"TAB. METALICO FLEX 1"" X 48"""', NULL, NULL, 33, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(559, '"TAB. METALICO FLEX 2"" X 48"""', NULL, NULL, 62, 0, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(560, 'TABLON MADERA 3.00 mts', NULL, NULL, 21, 32, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0'),
	(561, 'TENSORES ', NULL, NULL, 419, 1589, 0, 0, 0, 'COP', 1, 1, 0, 0, 0, 0, 0, 0, '0', '{values: []}', '2023-02-12', 2, '0', '0');

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

-- Dumping data for table stock.projects: ~5 rows (approximately)
DELETE FROM `projects`;
INSERT INTO `projects` (`id`, `name`, `address`, `contact_name`, `contact_phone`, `contact_email`, `client_id`, `register`, `budget`, `renting`) VALUES
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
  `enterprise_id` int(11) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.quotation: ~3 rows (approximately)
DELETE FROM `quotation`;
INSERT INTO `quotation` (`id`, `serial`, `description`, `value`, `discount`, `taxing`, `client_id`, `email`, `project_id`, `enterprise_id`, `min_validity`, `user`, `max_validity`, `isRenting`, `one_day`, `from`, `to`, `creation`, `updated_by`, `deleted`, `stage`) VALUES
	(110, NULL, NULL, 1500, 0, 0, 73, NULL, NULL, 2, NULL, 4, NULL, 1, 1, NULL, NULL, '2023-02-12 20:27:31', NULL, 0, 3),
	(111, NULL, NULL, 7500, 0, 0, 73, NULL, NULL, 2, NULL, 4, NULL, 1, 1, NULL, NULL, '2023-02-12 20:34:59', NULL, 0, 3),
	(112, NULL, NULL, 21500, 0, 0, 1, NULL, NULL, 2, NULL, 4, NULL, 1, 1, NULL, NULL, '2023-02-12 20:35:45', NULL, 0, 3);

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
  KEY `FK_quotationDetail_quotation` (`quotation_id`),
  KEY `FK_quotationDetail_products` (`item_id`),
  CONSTRAINT `FK_quotationDetail_products` FOREIGN KEY (`item_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_quotationDetail_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.quotationDetail: ~0 rows (approximately)
DELETE FROM `quotationDetail`;

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
) ENGINE=InnoDB AUTO_INCREMENT=397 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.quotationInfo: ~0 rows (approximately)
DELETE FROM `quotationInfo`;

-- Dumping structure for table stock.quotationMessages
CREATE TABLE IF NOT EXISTS `quotationMessages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.quotationMessages: ~0 rows (approximately)
DELETE FROM `quotationMessages`;

-- Dumping structure for table stock.quotationStages
CREATE TABLE IF NOT EXISTS `quotationStages` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table stock.quotationStages: ~7 rows (approximately)
DELETE FROM `quotationStages`;
INSERT INTO `quotationStages` (`id`, `name`) VALUES
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

-- Dumping data for table stock.recipes: ~0 rows (approximately)
DELETE FROM `recipes`;

-- Dumping structure for table stock.returning
CREATE TABLE IF NOT EXISTS `returning` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `return_date` datetime DEFAULT NULL,
  `quotation_id` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `quotation_id` (`quotation_id`),
  CONSTRAINT `returning_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `returning_ibfk_2` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.returning: ~0 rows (approximately)
DELETE FROM `returning`;

-- Dumping structure for table stock.returningDetail
CREATE TABLE IF NOT EXISTS `returningDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quotation_detail_id` int(11) DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `return_id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `return_id` (`return_id`),
  KEY `quotation_detail_id` (`quotation_detail_id`),
  CONSTRAINT `returningDetail_ibfk_1` FOREIGN KEY (`return_id`) REFERENCES `returning` (`id`) ON DELETE CASCADE,
  CONSTRAINT `returningDetail_ibfk_2` FOREIGN KEY (`quotation_detail_id`) REFERENCES `quotationDetail` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.returningDetail: ~0 rows (approximately)
DELETE FROM `returningDetail`;

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
DELETE FROM `rol`;
INSERT INTO `rol` (`id`, `name`, `enterprise`, `description`) VALUES
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

-- Dumping data for table stock.rolPermitions: ~13 rows (approximately)
DELETE FROM `rolPermitions`;
INSERT INTO `rolPermitions` (`id`, `rol`, `read`, `write`, `edit`, `module`) VALUES
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
  CONSTRAINT `FK_sales_customer` FOREIGN KEY (`client_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_sales_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_sales_projects` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_sales_users` FOREIGN KEY (`registered_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.sales: ~8 rows (approximately)
DELETE FROM `sales`;
INSERT INTO `sales` (`id`, `description`, `value`, `date`, `client_name`, `registered_by`, `client_id`, `enterprise`, `project_id`, `payment`) VALUES
	(164, NULL, 370000, '2023-02-05 21:38:22', '', 4, NULL, 2, NULL, 0),
	(165, NULL, 800000, '2023-02-05 21:42:35', '', 4, NULL, 2, NULL, 0),
	(166, NULL, 630000, '2023-02-09 15:12:33', '', 4, NULL, 2, NULL, 0),
	(167, NULL, 280000, '2023-02-09 15:12:48', '', 4, NULL, 2, NULL, 0),
	(168, NULL, 525000, '2023-02-09 16:03:40', '', 4, NULL, 2, NULL, 0),
	(169, NULL, 20, '2023-02-09 16:42:43', '', 4, NULL, 2, NULL, 0),
	(170, NULL, 1050000, '2023-02-10 00:19:27', '', 3, NULL, 2, NULL, 0),
	(171, NULL, 1050000, '2023-02-10 00:19:44', '', 3, NULL, 2, NULL, 0),
	(172, NULL, 1050000, '2023-02-10 00:35:49', '', 4, NULL, 2, NULL, 0),
	(173, NULL, 1520000, '2023-02-10 08:30:25', '', 3, NULL, 2, NULL, 0),
	(174, NULL, 680000, '2023-02-10 10:42:18', '', 3, NULL, 2, NULL, 0);

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
  CONSTRAINT `salesDetail_ibfk_2` FOREIGN KEY (`item`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table stock.salesDetail: ~0 rows (approximately)
DELETE FROM `salesDetail`;

-- Dumping structure for table stock.toContact
CREATE TABLE IF NOT EXISTS `toContact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `telf` varchar(50) DEFAULT NULL,
  `inscription` datetime DEFAULT current_timestamp(),
  `stage` int(11) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table stock.toContact: ~2 rows (approximately)
DELETE FROM `toContact`;
INSERT INTO `toContact` (`id`, `name`, `telf`, `inscription`, `stage`) VALUES
	(19, 'Fabián Mejía', '3125677288', '2023-02-10 10:25:51', 0),
	(20, 'ARMANDO', '3157109598', '2023-02-10 10:27:53', 0);

-- Dumping structure for table stock.units
CREATE TABLE IF NOT EXISTS `units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notation` varchar(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.units: ~3 rows (approximately)
DELETE FROM `units`;
INSERT INTO `units` (`id`, `notation`) VALUES
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
  UNIQUE KEY `Email` (`email`) USING BTREE,
  KEY `FK_users_enterprise` (`enterprise`),
  KEY `FK_users_rol` (`rol`),
  KEY `unique_email` (`email`) USING BTREE,
  CONSTRAINT `FK_users_enterprise` FOREIGN KEY (`enterprise`) REFERENCES `enterprise` (`id`),
  CONSTRAINT `FK_users_rol` FOREIGN KEY (`rol`) REFERENCES `rol` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Dumping data for table stock.users: ~4 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `name`, `rol`, `nickname`, `password`, `registered`, `enterprise`, `token`, `isAdmin`, `socketId`, `language`, `email`, `email_verified`) VALUES
	(1, 'Fabián ', 2, 'fibiaan', '81dc9bdb52d04dc20036dbd8313ed055', '2022-10-14 16:23:48', 2, 'eyJpZCI6MSwibmFtZSI6IkZhYmnDoW4gIiwibmlja25hbWUiOiJmaWJpYWFuIiwiZW1haWwiOm51bGwsImVtYWlsX3ZlcmlmaWVkIjpudWxsLCJpc0FkbWluIjoiMCIsImVudGVycHJpc2VfaWQiOjIsImVudGVycHJpc2VfbmFtZSI6IkNpbWJyYXMgZGUgQ29sb21iaWEgUy5BLlMuIiwiZW50ZXJwcmlzZV9wYXRoIjoiaHR0cHM6Ly9zdG9ja2FwaS5hbnViaXNhcHBzLmNvbS9wdWJsaWMvbG9nb3MvZW5jb2NvbC5wbmciLCJzaG9ydGN1dCI6ImNpbWJyYXMiLCJyb2wiOjIsInJlbnRpbmciOjEsInF1b3RpbmciOjAsInNlbGxpbmciOjEsInByb2plY3RzIjoxLCJjb2xvcnMiOiJbe1widmFsdWVcIjpcIiM1ODM3MzlcIn0se1widmFsdWVcIjpcIiMwMDAwZmZcIn0se1widmFsdWVcIjpcIiMwMDAwMDBcIn1dIiwiY2FydCI6MCwiZXhwIjoxNjc2MjQxMjk5fQ==', '0', 'vpudjcJ6eGTgdB0hAAAR', NULL, NULL, NULL),
	(2, 'César', 2, 'cesarp', '81dc9bdb52d04dc20036dbd8313ed055', '2022-10-22 23:21:05', 2, 'eyJpZCI6MiwibmFtZSI6IkPDqXNhciIsIm5pY2tuYW1lIjoiY2VzYXJwIiwiZW1haWwiOiJjZXNhcnBoZXJuYW5kZXowOUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6IjEiLCJpc0FkbWluIjoiMCIsImVudGVycHJpc2VfaWQiOjIsImVudGVycHJpc2VfbmFtZSI6IkNpbWJyYXMgZGUgQ29sb21iaWEgUy5BLlMuIiwiZW50ZXJwcmlzZV9wYXRoIjoiaHR0cHM6Ly9zdG9ja2FwaS5hbnViaXNhcHBzLmNvbS9wdWJsaWMvbG9nb3MvZW5jb2NvbC5wbmciLCJzaG9ydGN1dCI6ImNpbWJyYXMiLCJyb2wiOjIsInJlbnRpbmciOjEsInF1b3RpbmciOjAsInNlbGxpbmciOjEsImNvbG9ycyI6Ilt7XCJ2YWx1ZVwiOlwiI2MwMWMyOFwifSx7XCJ2YWx1ZVwiOlwiIzAwMDBmZlwifSx7XCJ2YWx1ZVwiOlwiI2E1MWQyZFwifV0iLCJjYXJ0IjowLCJleHAiOjE2NzYxMjU2OTZ9', '0', 'Vyji_QowsA72TfpVAABb', NULL, 'cesarphernandez09@gmail.com', '1'),
	(3, 'Jerdirlson', 2, 'yeye', 'd93591bdf7860e1e4ee2fca799911215', '2022-11-23 10:58:59', 2, 'eyJpZCI6MywibmFtZSI6IkplcmRpcmxzb24iLCJuaWNrbmFtZSI6InlleWUiLCJlbWFpbCI6bnVsbCwiZW1haWxfdmVyaWZpZWQiOm51bGwsImlzQWRtaW4iOiIwIiwiZW50ZXJwcmlzZV9pZCI6MiwiZW50ZXJwcmlzZV9uYW1lIjoiQ2ltYnJhcyBkZSBDb2xvbWJpYSBTLkEuUy4iLCJlbnRlcnByaXNlX3BhdGgiOiJodHRwczovL3N0b2NrYXBpLmFudWJpc2FwcHMuY29tL3B1YmxpYy9sb2dvcy9lbmNvY29sLnBuZyIsInNob3J0Y3V0IjoiY2ltYnJhcyIsInJvbCI6MiwicmVudGluZyI6MSwicXVvdGluZyI6MCwic2VsbGluZyI6MSwiY29sb3JzIjoiW3tcInZhbHVlXCI6XCIjYzAxYzI4XCJ9LHtcInZhbHVlXCI6XCIjMDAwMGZmXCJ9LHtcInZhbHVlXCI6XCIjYTUxZDJkXCJ9XSIsImNhcnQiOjAsImV4cCI6MTY3NjA0ODUxOH0=', '0', 'hdf5vkXLObsM2y4-AAAu', NULL, NULL, NULL),
	(4, 'Diego', 2, 'diegogo', '81dc9bdb52d04dc20036dbd8313ed055', '2023-01-11 18:51:11', 2, 'eyJpZCI6NCwibmFtZSI6IkRpZWdvIiwibmlja25hbWUiOiJkaWVnb2dvIiwiZW1haWwiOiJmaWJpYW5tZWppYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6IjEiLCJpc0FkbWluIjoiMSIsImVudGVycHJpc2VfaWQiOjIsImVudGVycHJpc2VfbmFtZSI6IkNpbWJyYXMgZGUgQ29sb21iaWEgUy5BLlMuIiwiZW50ZXJwcmlzZV9wYXRoIjoiaHR0cHM6Ly9zdG9ja2FwaS5hbnViaXNhcHBzLmNvbS9wdWJsaWMvbG9nb3MvZW5jb2NvbC5wbmciLCJzaG9ydGN1dCI6ImNpbWJyYXMiLCJyb2wiOjIsInJlbnRpbmciOjEsInF1b3RpbmciOjAsInNlbGxpbmciOjEsImNvbG9ycyI6Ilt7XCJ2YWx1ZVwiOlwiIzU4MzczOVwifSx7XCJ2YWx1ZVwiOlwiIzAwMDBmZlwifSx7XCJ2YWx1ZVwiOlwiIzAwMDAwMFwifV0iLCJjYXJ0IjowLCJleHAiOjE2NzYyNjExODF9', '1', '5i5UaVzJRkkLIZUgAAAV', NULL, 'fibianmejia@gmail.com', '1');

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
DELETE FROM `validationCodes`;
INSERT INTO `validationCodes` (`id`, `code`, `exp`, `fk_customer`) VALUES
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
