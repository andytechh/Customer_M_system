-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2025 at 07:05 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(20) DEFAULT NULL,
  `roles` enum('admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `user_id`, `email`, `password_hash`, `roles`) VALUES
(1, 2, 'admin@example1', 'admin123', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`cart_id`, `user_id`, `product_id`, `quantity`, `added_at`) VALUES
(1, 2, 1, 1, '2025-04-27 02:07:04'),
(2, 2, 26, 1, '2025-04-27 02:07:52'),
(13, 24, 11, 1, '2025-05-01 18:12:18'),
(33, 75, 1, 1, '2025-05-19 00:05:30'),
(36, 7, 1, 1, '2025-05-19 01:29:07');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `uname` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `uaddress` text DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `user_id`, `uname`, `phone`, `uaddress`, `date_of_birth`, `profile_pic`) VALUES
(2, 4, NULL, NULL, NULL, NULL, NULL),
(33, 3, 'andy', NULL, 'adadfa', NULL, NULL),
(34, 6, 'andy', NULL, 'poctol', NULL, NULL),
(37, 7, 'andy22', NULL, 'Poctol, Pilar Sorsogon', NULL, NULL),
(38, 8, 'adsf', NULL, 'sdfsa', NULL, NULL),
(39, 9, 'asdf', NULL, 'asd', NULL, NULL),
(40, 10, 'adfa', NULL, '2asdfaasd', NULL, NULL),
(41, 11, 'sdASDa', NULL, '1aSDsd', NULL, NULL),
(42, 12, 'DFASD', NULL, 'SDFASDFASDF', NULL, NULL),
(43, 13, 'ADSF', NULL, 'ADF', NULL, NULL),
(44, 14, 'ASDFASD', NULL, 'FDSAA', NULL, NULL),
(45, 15, 'sfgs', NULL, 'sdfgsd', NULL, NULL),
(46, 16, 'asdfas', NULL, 'afadf', NULL, NULL),
(47, 17, 'adfasd', NULL, 'asdf,adfasdf', NULL, NULL),
(48, 18, 'asdfa', NULL, 'asdfasd', NULL, NULL),
(49, 19, 'adfa', NULL, 'dfasdfasdfasdfasdfasd', NULL, NULL),
(50, 20, 'asdfasdfa', NULL, 'asdfdasfas', NULL, NULL),
(54, 24, 'ads', NULL, 'Poctol, Pilar Sorsohgon', NULL, NULL),
(59, 29, 'asdf', NULL, 'asfd', NULL, NULL),
(60, 30, 'asdf', NULL, 'sadfas', NULL, NULL),
(61, 31, 'dfas', NULL, 'fasdfasd', NULL, NULL),
(62, 32, 'asdfasd', NULL, 'asdfa', NULL, NULL),
(63, 33, 'sdgfs', NULL, 'sgsd', NULL, NULL),
(64, 34, 'dsaas', NULL, 'fadsasd', NULL, NULL),
(65, 35, 'asda', NULL, 'dadasdd', NULL, NULL),
(66, 36, 'new', NULL, 'adfasdf', NULL, NULL),
(67, 37, 'asdfasd', NULL, 'sdfad', NULL, NULL),
(68, 38, 'me', NULL, 'us', NULL, NULL),
(69, 39, 'tes', NULL, 'testing', NULL, NULL),
(70, 40, 'umay', NULL, 'adfadf', NULL, NULL),
(71, 41, 'sad', NULL, 'asdfa', NULL, NULL),
(72, 42, 'fasdf', NULL, 'asdf', NULL, NULL),
(73, 43, 'da', NULL, 'adsf', NULL, NULL),
(74, 44, 'sdf', NULL, 'adfa', NULL, NULL),
(75, 45, 'dfasd', NULL, 'asdfas', NULL, NULL),
(76, 46, 'dsfg', NULL, 'sdf', NULL, NULL),
(77, 47, 'sd', NULL, 'asdasd', NULL, NULL),
(78, 48, 'afd', NULL, 'sdfa', NULL, NULL),
(79, 49, 'asdfasda', NULL, 'sdfasdf', NULL, NULL),
(80, 50, 'asdfa', NULL, 'asdfa', NULL, NULL),
(81, 51, 'adfa', NULL, 'sadfa', NULL, NULL),
(82, 52, 'asdfasd', NULL, 'asdf', NULL, NULL),
(83, 53, 'asdf', NULL, 'aasd', NULL, NULL),
(84, 54, 'dA', NULL, 'ASDAS', NULL, NULL),
(85, 55, 'ASDF', NULL, 'ASDFAS', NULL, NULL),
(86, 56, 'ADFASDF', NULL, 'ASDFASDF', NULL, NULL),
(87, 57, 'asfdas', NULL, 'dsdas', NULL, NULL),
(88, 58, 'asdf', NULL, 'adsasd', NULL, NULL),
(89, 21, 'adss', NULL, 'asdfas3', NULL, NULL),
(90, 22, 'adsfa', NULL, 'dda', NULL, NULL),
(91, 23, 'aasd', NULL, 'asfdsadfa', NULL, NULL),
(92, 25, 'asdfas', NULL, 'asdsd', NULL, NULL),
(93, 59, 'asf', NULL, 'fsdsdf', NULL, NULL),
(94, 60, 'dfd', NULL, 'adsf', NULL, NULL),
(95, 61, 'asdf', NULL, 'asdfasdf44', NULL, NULL),
(96, 62, 'asdf', NULL, 'adsasdf', NULL, NULL),
(97, 63, 'asdfas', NULL, 'asdfasdfsadf', NULL, NULL),
(98, 64, 'asdfa', NULL, 'fdsadf', NULL, NULL),
(99, 65, 'asdfas', NULL, 'asdfasdf', NULL, NULL),
(100, 66, 'asdfsad', NULL, 'fdfadf', NULL, NULL),
(101, 67, 'fgdsgds', NULL, 'fgdsfgdsfg', NULL, NULL),
(102, 68, 'zxc', NULL, 'dasdfsadf', NULL, NULL),
(103, 69, 'asdfa', NULL, 'asfdadsdf', NULL, NULL),
(104, 70, 'sd', NULL, 'fasdfasdf', NULL, NULL),
(105, 71, 'asdfas', NULL, 'dfdf', NULL, NULL),
(106, 72, 'asdfa', NULL, 'fsaf', NULL, NULL),
(107, 73, 'sdfgsdf', NULL, 'dfgsd', NULL, NULL),
(108, 74, 'asdf', NULL, 'ffadf', NULL, NULL),
(109, 75, 'reynold', NULL, 'taysan', NULL, NULL),
(110, 76, 'asdf', NULL, 'fasdfas', NULL, NULL),
(111, 77, 'asdfa', NULL, 'asfdasdf', NULL, NULL),
(112, 78, 'asdfa', NULL, 'asdfasdas', NULL, NULL),
(113, 79, 'asdfas', NULL, 'asdfssadf', NULL, NULL),
(114, 80, 'asdfasdf', NULL, 'sadfsadfsa', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sent_at` datetime DEFAULT current_timestamp(),
  `status` enum('sent','read','deleted') DEFAULT 'sent',
  `intent` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `message`, `sent_at`, `status`, `intent`) VALUES
(59, 1, 1, 'hello', '2025-05-18 13:13:34', 'sent', NULL),
(60, 1, 1, 'ji', '2025-05-18 13:13:39', 'sent', NULL),
(61, 1, 1, 'f', '2025-05-18 13:15:53', 'sent', NULL),
(62, 1, 1, 'e', '2025-05-18 13:15:59', 'sent', NULL),
(63, 7, 1, 'hello', '2025-05-18 13:16:41', 'sent', NULL),
(64, 1, 7, 'what can i help you?', '2025-05-18 13:18:42', 'sent', NULL),
(65, 7, 1, 'give me money', '2025-05-18 13:19:01', 'sent', NULL),
(66, 38, 1, 'hee', '2025-05-18 13:23:49', 'sent', NULL),
(67, 1, 38, 'hii', '2025-05-18 13:25:27', 'sent', NULL),
(68, 1, 1, 'hello', '2025-05-18 13:32:19', 'sent', NULL),
(69, 3, 1, 'Connecting you with a live agent...', '2025-05-18 13:50:05', 'sent', 'admin_ticket'),
(70, 3, 1, 'hello', '2025-05-18 13:50:08', 'sent', NULL),
(71, 7, 1, 'hello', '2025-05-18 18:43:04', 'sent', NULL),
(72, 1, 7, 'hey', '2025-05-18 18:43:15', 'sent', NULL),
(73, 7, 1, 'dumbass', '2025-05-18 18:43:27', 'sent', NULL),
(74, 1, 7, 'fck this system', '2025-05-18 18:44:06', 'sent', NULL),
(75, 1, 3, 'hey', '2025-05-19 00:09:15', 'sent', NULL),
(82, 1, 1, 'asdfasd', '2025-05-19 11:39:29', 'sent', NULL),
(83, 1, 1, 'asdfadf', '2025-05-19 11:39:36', 'sent', NULL),
(90, 1, 1, 'sdfgsdfg', '2025-05-19 11:49:11', 'sent', NULL),
(91, 1, 7, 'umay', '2025-05-19 11:49:28', 'sent', NULL),
(93, 2, 7, 'asdfsdf', '2025-05-19 11:59:53', 'sent', NULL),
(94, 1, 7, 'asdfasdf', '2025-05-19 12:00:23', 'sent', NULL),
(95, 7, 1, 'Connecting you with an agent...', '2025-05-19 12:00:28', 'sent', 'admin_ticket'),
(103, 1, 1, 'Connecting you with an agent...', '2025-05-19 12:11:17', 'sent', 'admin_ticket');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_date` datetime NOT NULL,
  `order_status` enum('pending','processing','shipped','delivered','cancelled','returned','refunded') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `product_id`, `product_name`, `quantity`, `total_price`, `order_date`, `order_status`) VALUES
(10, 75, 4, 'afdas', 1, 433.00, '2025-05-19 08:05:48', 'cancelled'),
(11, 7, 3, '27\' Lenovo Monitor', 1, 5243.00, '2025-05-19 09:13:59', 'cancelled'),
(12, 1, 1, '27\' Hp Monitor', 1, 5000.00, '2025-05-19 09:42:59', 'pending'),
(13, 78, 1, '27\' Hp Monitor', 1, 5000.00, '2025-05-19 09:49:51', 'pending'),
(14, 7, 4, 'i7 Hp Desktop', 1, 14533.00, '2025-05-19 10:13:05', 'pending'),
(15, 1, 1, '27\' Hp Monitor', 1, 5000.00, '2025-05-19 10:27:46', 'pending'),
(16, 7, 1, '27\' Hp Monitor', 1, 5000.00, '2025-05-19 10:35:28', 'pending'),
(17, 80, 1, '27\' Hp Monitor', 1, 5000.00, '2025-05-19 10:37:01', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `pname` varchar(100) NOT NULL,
  `pdescription` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1,
  `p_image` longblob NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `stocks` int(100) NOT NULL,
  `brand` enum('Dell','HP','Lenovo','Asus','Infinix','Realme','Samsung','Others') NOT NULL DEFAULT 'Lenovo',
  `category` enum('Laptop','Smartphone','Tablet','Headphone','Monitor','Accessories','Others','Desktop') NOT NULL DEFAULT 'Laptop'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `pname`, `pdescription`, `price`, `available`, `p_image`, `created_at`, `stocks`, `brand`, `category`) VALUES
(1, '27\' Hp Monitor', 'the beast', 5000.00, 1, 0x363831373965633434316138365f315f30326164616332332d316630392d346666332d396563662d6538613137616566336630315f3130323478313032342e77656270, '2025-04-21 21:41:20', 10, 'HP', 'Monitor'),
(3, '27\' Lenovo Monitor', 'the beast', 5243.00, 1, 0x363831373965646238336665375f4c656e6f766f2d4732342d32302d32332d335f3130323478313032342e77656270, '2025-04-21 21:50:00', 3, 'Lenovo', 'Monitor'),
(4, 'i7 Hp Desktop', 'the beast', 14533.00, 1, 0x363831373966313434643834335f68706465736b746f702e77656270, '2025-04-21 22:01:00', 0, 'HP', 'Desktop'),
(7, 'Samsung S24 ultra', 'asdfasfdss', 24000.00, 1, 0x363831376131396533653964665f733234756c747261612e6a666966, '2025-04-21 23:19:00', 4, 'Samsung', 'Smartphone'),
(9, 'i7 Hp System unit', 'hehe', 13000.00, 1, 0x363831373966343536633063325f68702069372e6a7067, '2025-04-22 16:17:00', 2, 'HP', 'Desktop'),
(11, 'Hp monitor', 'asdf', 4323.00, 1, 0x363831373965346365383530335f315f30326164616332332d316630392d346666332d396563662d6538613137616566336630315f3130323478313032342e77656270, '2025-04-22 16:20:00', 5, 'HP', 'Monitor'),
(17, 'Lenovo Laptop', 'sdfgsd', 30994.00, 1, 0x363831373966393763626561395f6c656e6f766f20696465617061642e77656270, '2025-04-24 18:17:00', 1, 'Lenovo', 'Laptop'),
(20, 'Lenovo Ideapad', 'sdf', 43333.00, 1, 0x363831376130313737326130645f696465617061642e77656270, '2025-04-24 18:28:00', 2, 'Lenovo', 'Laptop'),
(21, 'Realme 8pro', 'asdasd', 10000.00, 1, 0x363831376130636531303030615f7265616c6d652e6a666966, '2025-04-24 18:36:00', 2, 'Realme', 'Smartphone'),
(23, 'Hp monitor 24\'', 'asdf', 4000.00, 1, 0x363831376130653837663232375f64656c6c32372e6a666966, '2025-04-25 05:36:00', 2, 'HP', 'Monitor'),
(26, 'Lenovo Legion', 'deymm', 80000.00, 1, 0x363831376130356538396433395f6c6567696f6e20352e77656270, '2025-04-25 12:55:00', 5, 'Lenovo', 'Laptop'),
(27, 'Lenovo Legion', 'fgsdgsdfgsd', 4444.00, 1, 0x363831376131363934393735335f617375736c6170746f702e6a666966, '2025-05-03 22:49:00', 4, 'Lenovo', 'Laptop'),
(28, 'Legion 5', 'Best laptop', 50000.00, 1, 0x363831373966666338663535645f7468696e6b7061642e77656270, '2025-05-03 23:02:00', 5, 'Lenovo', 'Laptop'),
(29, 'Infinix note 50 pro', 'best budget phone', 10000.00, 1, 0x363831373966656164343132305f78363835365f6e6f7465353070726f5f35675f62617365315f362e706e67, '2025-05-03 23:04:00', 5, 'Infinix', 'Smartphone'),
(30, 'Samsung S24 ultra', 'Best smartphone', 94000.00, 1, 0x363831376131333533626437665f733234756c747261612e6a666966, '2025-05-03 23:15:00', 3, 'Samsung', 'Smartphone'),
(34, 'lenovo', 'dasfasdfsad', 20023.00, 1, 0x363831376130373631353831655f6c656e6f766f20696465617061642e77656270, '2025-05-04 16:23:00', 2, 'Lenovo', 'Laptop'),
(35, 'sadf', 'sdfsd', 3333.00, 1, 0x363831373965396336663562355f687032372e706e67, '2025-05-04 16:25:00', 3, 'HP', 'Monitor'),
(36, 'dsafdfas', 'dfasdfsdf', 33.00, 1, 0x363831376130613864303238385f7265616c6d65332e6a666966, '2025-05-04 16:26:00', 2, 'Realme', 'Smartphone'),
(37, 'Samsung Tab', 'asdfdad', 333.00, 1, 0x363831376132666432653462615f70682d67616c6178792d7461622d7331302d66652d706c75732d736d2d783632362d736d2d78363236626c62617874632d7468756d622d3534363332303734312e77656270, '2025-05-04 17:24:00', 3, 'Samsung', 'Tablet');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `ticket_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`ticket_id`, `customer_id`, `subject`, `message`, `status`, `created_at`) VALUES
(1, 1, 'afda', 'dfasdf', 'in_progress', '2025-05-18 10:08:16'),
(2, 7, 'hello', 'tangina mo', 'in_progress', '2025-05-18 10:28:38'),
(3, 1, 'Account Problem', 'Dang the recommendation is sucks', 'open', '2025-05-18 12:10:05'),
(4, 1, 'tae', 'nyo', 'in_progress', '2025-05-18 12:53:18'),
(5, 1, 'asdfsa', 'asdfsa', 'open', '2025-05-19 03:00:55');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_messages`
--

CREATE TABLE `ticket_messages` (
  `message_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket_messages`
--

INSERT INTO `ticket_messages` (`message_id`, `ticket_id`, `sender_id`, `message`, `created_at`) VALUES
(1, 1, 1, 'asdfsa', '2025-05-18 11:22:54'),
(2, 1, 1, 'adfasd', '2025-05-18 12:00:13'),
(3, 1, 1, 'ss', '2025-05-18 12:03:05'),
(4, 2, 1, 'sgfds', '2025-05-18 12:35:35'),
(5, 3, 1, 'hr', '2025-05-18 12:36:05'),
(6, 4, 1, 'asdfaf', '2025-05-19 01:35:50'),
(7, 5, 1, 'asdfasdf', '2025-05-19 03:01:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `roles` enum('customer','admin') NOT NULL,
  `ustatus` enum('active','inactive','banned') DEFAULT 'active',
  `created_at` datetime DEFAULT current_timestamp(),
  `uname` varchar(255) NOT NULL,
  `contacts` bigint(50) NOT NULL,
  `uaddress` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `roles`, `ustatus`, `created_at`, `uname`, `contacts`, `uaddress`) VALUES
(1, 'asdasdf', 'andy2@gmail.com', '$2y$10$i5pEd73VabUxB4iBTeBjoOFABRuf7GfJMEwvZMF/VhHmH5PpiPAaS', 'customer', 'active', '2025-04-07 00:02:35', 'Andy Lazarte', 3434343343, ''),
(2, 'admin', 'admin@example', '$2y$10$qySl03sHdPzyn1OdpYeJheCg0YrXd.WfOBEOaIVoEdZaTfYuxPTqO', 'admin', 'active', '2025-04-07 00:35:07', 'admin', 0, ''),
(3, 'asdfad', 'asdfasd@fagda', '$2y$10$i5pEd73VabUxB4iBTeBjoOFABRuf7GfJMEwvZMF/VhHmH5PpiPAaS', 'customer', 'active', '2025-04-22 05:21:00', 'andy', 0, 'adadfa'),
(4, 'SDFGSDF', 'sdfg@fadsf', '$2y$10$HxxORcoq/.YEI2rO4QhABO1Dhp4MjM90zh0r7F0YtksQlzkdYifnS', 'customer', 'active', '2025-04-08 15:55:15', 'SDFG', 324234, ''),
(5, 'SDFGSD2', 'SDFGSDFG@gmaga', '$2y$10$fSE.LZZEoz55wT0CywnE3OW6E847TDkPDoDcsL/pSGG4k8WeVmfRy', 'customer', 'active', '2025-04-08 22:26:48', 'SDFG', 34234, ''),
(6, 'lazarte', 'andy3@ddag', '$2y$10$WUVoUvNykMm8Eal7.0n.D.U6KSOFB.3mxCF7521dYIj6Yr6TxIjHK', 'customer', 'active', '2025-04-25 02:39:00', 'andy', 0, 'poctol'),
(7, 'andy22', 'andy12@gmail.com', '$2y$10$ysLN/yfx9xJHNU0rMZ/lTuPEaKy7CIBKgfwehzPytBLQ17TkvgnLe', 'customer', 'active', '2025-04-27 01:03:03', 'andy22', 0, 'Poctol, Pilar Sorsogon'),
(8, 'asd', 'sdfsa@fadsf', '$2y$10$nSq5m7K5uc9L36LCzbT1veljpIGuMQaNg6fkyLuQ4.zx86mOYxmoG', 'customer', 'active', '2025-05-01 16:42:19', 'adsf', 0, 'sdfsa'),
(9, 'asdf', 'as@fedsasd', '$2y$10$ceDC3qmuj4NTk4E03RsmLuNpqa3vuvwFfTFMZg64lBzGMnOzLPxVG', 'customer', 'active', '2025-05-01 16:43:17', 'asdf', 0, 'asd'),
(10, 'dadad', 'adfadasf@gmail.com', '$2y$10$9NzlQZkLHSJ3qW5TfdFmAOV6Kgbo8UUu7VVcDIq5vEhS0MqQuHJ2e', 'customer', 'active', '2025-05-01 16:43:38', 'adfa', 0, '2asdfaasd'),
(11, 'SDasd22', 'adsfaAAsd@gmail.com', '$2y$10$d4PZgTLUxsqBA5fOOxbB4OAUokFM52AO2J/eUG3eTU6TOsLf3I766', 'customer', 'active', '2025-05-01 16:46:37', 'sdASDa', 0, '1aSDsd'),
(12, 'FASDFA', 'ASDFASDFSDF@GADFGADF', '$2y$10$qiqoYUKNRx3EsrP4obr4DO9k3k7T/zP/4ZGJrykxvYk3ojXMTIuoe', 'customer', 'active', '2025-05-01 16:47:52', 'DFASD', 0, 'SDFASDFASDF'),
(13, 'ADF', 'ADF@FDADFA', '$2y$10$XFG8XwLovLTPXJH/livZ/eeJ/enr2f4kJMcZn94z4mvhtKdBA0gLO', 'customer', 'active', '2025-05-01 16:48:36', 'ADSF', 0, 'ADF'),
(14, 'DASDFAS', 'gdfsadaf@gfadf', '$2y$10$4Yqn4Bp94AuCqujCD0a8KensncfbyQ2TJdjhEZpwDrtriRc3zf6CS', 'customer', 'active', '2025-05-01 16:49:33', 'ASDFASD', 0, 'FDSAA'),
(15, 'fgsdfg', 'fg@adfgadf', '$2y$10$uixB.LKofG3EKmnCPzOIneJniLpxzBTvUFoDZNL6ylqCHJccuNTpq', 'customer', 'active', '2025-05-01 16:51:32', 'sfgs', 0, 'sdfgsd'),
(16, 'fasf', 'asdfasdf@fadsfasd', '$2y$10$u2xgjq/irBpJGTaTRSIAxONARy9r1Wf73.2CvOrkKHpD2XIyD8yJO', 'customer', 'active', '2025-05-01 16:53:32', 'asdfas', 0, 'afadf'),
(17, 'fasfas', 'asdfa@adfasdf', '$2y$10$zx/OhbqfcxSBkYtKRL7JVeKwly9SDqHhFxMXwHvwTsqxS9oZQm7.K', 'customer', 'active', '2025-05-01 16:55:21', 'adfasd', 0, 'asdf,adfasdf'),
(18, 'sdfa', 'asdfsadf@fadsf', '$2y$10$27ffWK55Fl5xxbCLST5SReJf8cqhMIBhXqRvdlpe7MS88um4GeBay', 'customer', 'active', '2025-05-01 16:56:27', 'asdfa', 0, 'asdfasd'),
(19, 'sdfasdfas', 'fasdfasdf@fadsf', '$2y$10$BzDRSHCGwqrV/Wr.b0jpzuIE8RZ/DZ4nbiFnE2./v7pv5FF03tV/C', 'customer', 'active', '2025-05-01 16:59:30', 'adfa', 0, 'dfasdfasdfasdfasdfasd'),
(20, 'sdfasf', 'adfasdf@fsasa', '$2y$10$d/BBxlkYoJUoflPyFzxoUORHryXt/k2jLuBl5cfk4Ypzv48QzzLmS', 'customer', 'active', '2025-05-01 17:00:32', 'asdfasdfa', 0, 'asdfdasfas'),
(21, 'asdf333', 'sadf@fdasasd', '$2y$10$6ymnlQqwnJ/.5UyVOUxg9u732RqM3KguLwqyWBt8MIGJsE1F7D4z.', 'customer', 'active', '2025-05-18 18:07:42', 'adss', 0, 'asdfas3'),
(22, 'asd33', 'ds@FGa', '$2y$10$JtM.GbfNVIVrV5GlvZcRluy.sPMdDS7aSx.wrlXhi.Ftk4dyxqgzi', 'customer', 'active', '2025-05-18 22:24:45', 'adsfa', 0, 'dda'),
(23, '343fasd', 'sfd@fdasfasdf', '$2y$10$s1fdNqPBZRT5KI7alUJKxu58APW7g36/6bbOzbO0.ag8.BohQLrFK', 'customer', 'active', '2025-05-18 22:30:23', 'aasd', 0, 'asfdsadfa'),
(24, 'sdas', 'adfad@dfsafd', '$2y$10$tIO9cCOuexDHeTGSYu1VX.gQZbUWXy9BjRC63SSMF69xuegu2JlPa', 'customer', 'active', '2025-05-01 17:55:00', 'ads', 0, 'Poctol, Pilar Sorsohgon'),
(25, 'dasdfa3', 'asdf2@sds', '$2y$10$9ZtspU1SEH1UJoB.MTX7DuFTgL9PJocLaQFrAiIjd2bjsHQLI21bq', 'customer', 'active', '2025-05-18 22:35:16', 'asdfas', 0, 'asdsd'),
(26, 'andy1232', 'andy1@gmail.com', '$2y$10$u9Dm/YmZGHa.cMBd/rW.5O3rbv2/HxsV.mrVrojdwdZMfSigoSIWy', 'customer', 'active', '2025-05-03 13:43:05', 'andy', 0, 'Poctol, Pilar Sorsogon'),
(27, 'nga', 'nganga1@gmai.com', '$2y$10$PGmdyP/.4hn0ft1b5sRGP.9.ys6K2KCMdU7lZMQ8aZC7L.9D2vPLy', 'customer', 'active', '2025-05-03 13:44:03', 'nga', 0, 'Poctol, Pilar Sorsohgon'),
(28, 'adda', 'asdfas@gmail.com', '$2y$10$rv9FfwVaTUWxQ7T7uAVmYe3nb8kADELXvZWtqa4bCL2ldyswU5GtC', 'customer', 'active', '2025-05-03 13:45:50', 'asdf', 0, 'legazpi'),
(29, 'sdfaf', 'asdf@asdf', '$2y$10$5lQ.44Qt27aJJ7TzF4.6vO9ZQro5EzWpFMOg3hJIEx8e0.pMprT7C', 'customer', 'active', '2025-05-03 15:33:31', 'asdf', 0, 'asfd'),
(30, 'ass', 'asdf@gadadsa', '$2y$10$shhz624Dz1RG4Ck3BUubw.775.MtXP9ZTJ4AqfLoGsxDTd6TAoX3C', 'customer', 'active', '2025-05-03 16:37:28', 'asdf', 0, 'sadfas'),
(31, 'dfasd', 'daa@adsfadf', '$2y$10$0Lzm7SaMwXVFwiMo9StQleAkglIyYWbj6y7inIljTuzuqwynf2m9m', 'customer', 'active', '2025-05-03 16:38:18', 'dfas', 0, 'fasdfasd'),
(32, 'fasdf', 'asdf@gasfas', '$2y$10$wo.uXUta/M/BBUBDdU2Qkee10TH4SnlRma1nST2l9UanRASnGfqda', 'customer', 'active', '2025-05-03 16:45:15', 'asdfasd', 0, 'asdfa'),
(33, 'fggg', 'fgsdfg@adfa', '$2y$10$.MOBhA80ocYBouWC6Z//N.Pm8mD72PBvWQ9EZ8Z3127CnlmrsGIWu', 'customer', 'active', '2025-05-03 16:45:33', 'sdgfs', 0, 'sgsd'),
(34, 'asdfas', 'asd@fasdfas', '$2y$10$p4seMXPVxWSoIfosMCDCFeUN6lYxCR3SP3GIQgD/L/ZKAq7grJa06', 'customer', 'active', '2025-05-03 16:49:24', 'dsaas', 0, 'fadsasd'),
(35, 'ada', 'adsfads@gmail.com', '$2y$10$4CqGEB.5YyGzrZycguGgAOynjYH1esq0Ly1LEiL.kLNGTU3fgHn6u', 'customer', 'active', '2025-05-03 21:41:03', 'asda', 0, 'dadasdd'),
(36, 'newme', 'new@gmail.com', '$2y$10$KKUOAgZjHOt4E/qWkc6SMeWlXG8FEwIf42PiizE8cHhmFDn097iwa', 'customer', 'active', '2025-05-04 12:56:02', 'new', 0, 'adfasdf'),
(37, 'sdfs', 'asdfsa@raefa', '$2y$10$WJ5l4OOLtYpYSMX7dAZLlO2jwaIQFs2QTQop9NVVtgEr/EgrcdMyW', 'customer', 'active', '2025-05-04 12:58:36', 'asdfasd', 0, 'sdfad'),
(38, 'u', 'us@gmail.com', '$2y$10$7oV1BoYcu7GT7N/bDPK4tOb.nDU.8MvUFlgLru6O3BAGFGX6MM6O.', 'customer', 'active', '2025-05-18 05:23:33', 'me', 0, 'us'),
(39, 'test', 'test@gmail.com', '$2y$10$2TlbPhCzoZLN7Qe4eykoM.DfAXNdFNUXHUC4TPJ/512/QCDIZVpEK', 'customer', 'active', '2025-05-18 16:28:11', 'tes', 0, 'testing'),
(40, 'na33', 'umay@gmail.coma', '$2y$10$KiJNslUTy.zHfkiCQlGiKOtbpqulaIxqURJ3hlkA7XcIOsYzOCCPa', 'customer', 'active', '2025-05-18 16:39:22', 'umay', 0, 'adfadf'),
(41, 'afdasdf', 'sdfasdf@fdasf', '$2y$10$g73evdwpV3/hN30g3KbU1OYUtzHgG/1GfG/Qki3OIJdhY3yFw9fVS', 'customer', 'active', '2025-05-18 16:44:21', 'sad', 0, 'asdfa'),
(42, 'asdfsa', 'SFds@fgdas', '$2y$10$9w9yl6TmMqszzpcCAUDYUeVP0ucVymG3sYVz2eOFnA/6q4dK14jne', 'customer', 'active', '2025-05-18 16:50:00', 'fasdf', 0, 'asdf'),
(43, 'dade', 'adad@gmail.com', '$2y$10$HwfA5./N1DanbeAwooX1xO8cW31MxlsbBXj/MfhfyoTAfbXhIdnV.', 'customer', 'active', '2025-05-18 16:51:07', 'da', 0, 'adsf'),
(44, 'sdfas', 'asd@gmail.com', '$2y$10$7IHVYv1PfsbEqwjgHRtAC.aI2Nh1XfwISOwvGnVdpfwS9LcE5c8UG', 'customer', 'active', '2025-05-18 16:52:33', 'sdf', 0, 'adfa'),
(45, 'asddfas', 'asdgad@gmail.com', '$2y$10$b6Sm5S9JMRNi69kytluqRuR8w4q3itC74n5Q7xLl5NQ/TPVsvwBD.', 'customer', 'active', '2025-05-18 16:54:31', 'dfasd', 0, 'asdfas'),
(46, 'sdfg', 'fsf@gasdg', '$2y$10$yC6uS9UGjGxSxuzFwB9cX.PiXwwMOo88fBayR4XtMTOotPQdJRPYq', 'customer', 'active', '2025-05-18 16:55:03', 'dsfg', 0, 'sdf'),
(47, 'sdASD', 'ASDADS@FSS', '$2y$10$vNVyXYAdxNpdh/YdAtrGQOdu60Baz8QsUQ1XzPk8j4kLoZF9Nvn4G', 'customer', 'active', '2025-05-18 17:00:44', 'sd', 0, 'asdasd'),
(48, 'das', 'adfssaadasf@gmail.com', '$2y$10$piqMuhFYl0jeCXHnbnAmCO8M6djnPgS7MBUH5wW29wytZB4V9nwOq', 'customer', 'active', '2025-05-18 17:16:59', 'afd', 0, 'sdfa'),
(49, 'dsf', 'Fsdws@adsfa', '$2y$10$NdBbL4QODRo/AerKjgyfK.qkni1d3TgJJeIOR7b83vMXvOqBLqmwq', 'customer', 'active', '2025-05-18 17:17:41', 'asdfasda', 0, 'sdfasdf'),
(50, 'fdasf', 'adsfa@rsadfa', '$2y$10$.0chSnzx3Masi/3AfDywQuQ51fpt6isf64PvEffRp3kOn4onY6N4i', 'customer', 'active', '2025-05-18 17:18:26', 'asdfa', 0, 'asdfa'),
(51, 'dsfasd', 'sdf@fas', '$2y$10$zYMJC0PeW8ZaohnFWEADGeDfcu9bxxDQJyGXH9.q.BgXq.N.RIU/e', 'customer', 'active', '2025-05-18 17:19:21', 'adfa', 0, 'sadfa'),
(52, 'fasdfsss', 'fsdafgas@fdasde', '$2y$10$7thMTkhJQC8CIjv.RyeeL.HgShvrZuqPGKGA6PchKXTcBIsqSNO4C', 'customer', 'active', '2025-05-18 17:20:58', 'asdfasd', 0, 'asdf'),
(53, 'asdf232', 'sfa@fdsa', '$2y$10$xvlr3g6rGW.8E2bpC2TRD.8xmxHA22.2QJfhzvx.KcdDCYsP3gjrK', 'customer', 'active', '2025-05-18 17:27:13', 'asdf', 0, 'aasd'),
(54, 'DASSA', 'DD@SDFDS', '$2y$10$aqJnSYULU0rtowRy9aG85.knVf.J6xsGoCuMr6TVWqmJiYbKZKJbu', 'customer', 'active', '2025-05-18 17:36:25', 'dA', 0, 'ASDAS'),
(55, 'SFD3E', 'ADSF@FASDFA', '$2y$10$7CLshxSBiZCkJm8w0tNjn.aQrHFG236yhmeqhnk04Kk7bT9qrdN02', 'customer', 'active', '2025-05-18 17:39:36', 'ASDF', 0, 'ASDFAS'),
(56, 'ASDFASDFASDF', 'ASDF@FADSFASDF', '$2y$10$9G2jQ.IGNmK4Eh6Y0iqMxOX6LuP7XUJXgKeRs.4uIg.LFQmrWI2Sq', 'customer', 'active', '2025-05-18 17:40:52', 'ADFASDF', 0, 'ASDFASDF'),
(57, 'dfasdfee', 'sdfasd@saasd', '$2y$10$y0/G83LT7UrrGAufnIWcc.NnWPuyeJpcuyV30FbswA244DsQqee5W', 'customer', 'active', '2025-05-18 17:46:02', 'asfdas', 0, 'dsdas'),
(58, 'adsa3e', 'asf2@fdasfasdf', '$2y$10$SjQq4dgcJ.XfLEzqPyHHjubEJz/AR2eWXp.OvRzoAkz3jsi1sL4sa', 'customer', 'active', '2025-05-18 18:05:26', 'asdf', 0, 'adsasd'),
(59, 'asdfsd', 'asdf@asdf3', '$2y$10$YCOri.HdeYX0BUJEzpYKLO.4GQAirE3RUumLXO93Z2KFPNiQe0PUS', 'customer', 'active', '2025-05-18 22:35:55', 'asf', 0, 'fsdsdf'),
(60, 'asffdf', 'asdfsdf@fsad', '$2y$10$3FOTDZXqVnqAqEkyiNInLOWAtt1Ls6caku2dF2DIZJUPhViI6afN6', 'customer', 'active', '2025-05-18 22:39:24', 'dfd', 0, 'adsf'),
(61, 'asdfasdf4', 'asdfads@sda', '$2y$10$TItAha6ig3XLhhJZul5L/euEtJmBZ5THCZYv05O356rdzlfqOB7Rm', 'customer', 'active', '2025-05-18 22:41:43', 'asdf', 0, 'asdfasdf44'),
(62, 'sdfsadf', 'afdfds@gdad', '$2y$10$Y2bz9r4bsKtPx7o1d3uqUurU2ZBhZ.GJedxILykqqvi7BvPLHC23G', 'customer', 'active', '2025-05-18 22:43:45', 'asdf', 0, 'adsasdf'),
(63, 'dfasdfasdf', 'fasdf@fdsa', '$2y$10$01mUAxoRkwh2kXTZvFRRqeAspfQVSNOYn5e8Y6YUtumlJ0FKWjHlu', 'customer', 'active', '2025-05-18 22:45:24', 'asdfas', 0, 'asdfasdfsadf'),
(64, 'sdfas33', 'asdf@fadsfas', '$2y$10$rECriIqL6J8zntlabVdMieNrITvRrvTppHFsHPAZxF/Q9C5JFX7Oe', 'customer', 'active', '2025-05-18 22:45:50', 'asdfa', 0, 'fdsadf'),
(65, 'dfasdf', 'fsadfadsa@gdfa', '$2y$10$fhxlqnvBEK8XvvDN7qw3au8K198HPTPfLDh5BGWl/.OlwXt1waukS', 'customer', 'active', '2025-05-18 22:46:32', 'asdfas', 0, 'asdfasdf'),
(66, 'sadfad', 'asdfa@sdfdas', '$2y$10$Ng71iQqUbEFJZc4dITnB5eJl12RZoDv5FEe7FPM40JarSBp5/l.i.', 'customer', 'active', '2025-05-18 22:47:21', 'asdfsad', 0, 'fdfadf'),
(67, 'fgdsfgsd', 'sgfg@gfsadas', '$2y$10$iJ90obtLO/zJXUlWpoadHuePrOeiAoXLl3q7oeCDYEtNfZ.htbuVW', 'customer', 'active', '2025-05-18 22:49:06', 'fgdsgds', 0, 'fgdsfgdsfg'),
(68, 'asdfas33', 'asdfsaf@dfas', '$2y$10$dkNL00DbUnKDf12OaGh.VODo6lRyOCFQxWHXbvPYF7h1myMdppphu', 'customer', 'active', '2025-05-18 23:05:47', 'zxc', 0, 'dasdfsadf'),
(69, 'dfasdfs43a4', 'afdfadffa@fafd', '$2y$10$BvelBnFup0hZxuA6iC9vb.O0Zqez7FoG5JzfTsN1r3rW/9ss3/1i2', 'customer', 'active', '2025-05-18 23:08:10', 'asdfa', 0, 'asfdadsdf'),
(70, 'fasfasd3', 'asdfadf@adsf', '$2y$10$w7fQ9tDPGi0qbrrCa/T9pO5Aa7pXy2RM5YPXKT4b4RGgYfai1foeO', 'customer', 'active', '2025-05-18 23:19:21', 'sd', 0, 'fasdfasdf'),
(71, 'dfsads', 'ds@fasdfsa', '$2y$10$bY8dXgfx4hM26S0KrGXxiuT9/aTYPOEQ9Te/jSDCXn4kVXDy/AjuS', 'customer', 'active', '2025-05-18 23:20:02', 'asdfas', 0, 'dfdf'),
(72, 'dasfasd43', 'afdfa@sdfg', '$2y$10$u51HuClK8/yctkOV4/9bMurG3asJaYs./ex7XSVWeHHehzUHnS62u', 'customer', 'active', '2025-05-18 23:24:26', 'asdfa', 0, 'fsaf'),
(73, 'gsdfg4', 'dsfgdsfg@df', '$2y$10$cuBRA2U6bZg7R0uUgrji5ufWGuQk69uZ3EquAR3z8g0r6LdrkovYa', 'customer', 'active', '2025-05-18 23:25:12', 'sdfgsdf', 0, 'dfgsd'),
(74, 'asdfsad', 'asdf@aasdf', '$2y$10$OJTbPf.JyTma7UEtbbxN6umki1t/BKnx6QekZK8BAOg89eYdBNg7W', 'customer', 'active', '2025-05-18 23:52:48', 'asdf', 0, 'ffadf'),
(75, 'venyas', 'venyas123@gmail.com', '$2y$10$69ABSl15RHB1lbJBeHfJa.SmCtbO90tuuLnU2dqjfmRgu9KhIHTTK', 'customer', 'active', '2025-05-18 23:54:45', 'reynold', 0, 'taysan'),
(76, 'asdfasasda', 'dfasd@fasdfa', '$2y$10$e77MM4pzL6QSimSY2XEwzOeMRqXRIVg0TkzcOEprwsOkU4mL4i3yG', 'customer', 'active', '2025-05-19 00:10:31', 'asdf', 0, 'fasdfas'),
(77, 'fdsdf322', 'asdfas@fads', '$2y$10$icxz3SokZnSvH1XhxD/vD.RgNLzKKlfTBGdUv0iVdUvZm94ex9zru', 'customer', 'active', '2025-05-19 00:34:07', 'asdfa', 0, 'asfdasdf'),
(78, 'sdfasdf', 'dfasdf@fdas', '$2y$10$BBvLYz6WnFkKeNI/Uv3.mewfA1t84pOVJE1CkKMMZBu.2CjCik3ei', 'customer', 'active', '2025-05-19 01:44:43', 'asdfa', 0, 'asdfasdas'),
(79, 'dfasdfe', 'asdfasd@fdas', '$2y$10$bfMSPsQ0sK8VhPpOuKv8tOBlgdgVQBQ79tByswmjm8Fj.B42zFILu', 'customer', 'active', '2025-05-19 02:13:38', 'asdfas', 0, 'asdfssadf'),
(80, 'asdf3', 'dfasdfas@adfas', '$2y$10$PSe3NZuTUumLZcZ7arBTh.Zhp3HAEr4cK/BiMZONr.3cdwxbCYHSi', 'customer', 'active', '2025-05-19 02:36:38', 'asdfasdf', 0, 'sadfsadfsa');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_id`);

--
-- Indexes for table `ticket_messages`
--
ALTER TABLE `ticket_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ticket_messages`
--
ALTER TABLE `ticket_messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `ticket_messages`
--
ALTER TABLE `ticket_messages`
  ADD CONSTRAINT `ticket_messages_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`),
  ADD CONSTRAINT `ticket_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
