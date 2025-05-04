-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2025 at 07:33 PM
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
(29, 1, 1, 1, '2025-05-03 16:23:53'),
(31, 7, 1, 1, '2025-05-03 23:44:56');

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
(51, 21, 'asdfa', NULL, 'fasdfdasdfadsf', NULL, NULL),
(52, 22, 'asdfa', NULL, 'asdfda', NULL, NULL),
(53, 23, 'asdf', NULL, 'asdfa', NULL, NULL),
(54, 24, 'ads', NULL, 'Poctol, Pilar Sorsohgon', NULL, NULL),
(55, 25, 'ghg', NULL, 'asdfasdf', NULL, NULL),
(56, 26, 'andy', NULL, 'Poctol, Pilar Sorsogon', NULL, NULL),
(57, 27, 'nga', NULL, 'Poctol, Pilar Sorsohgon', NULL, NULL),
(58, 28, 'asdf', NULL, 'legazpi', NULL, NULL),
(59, 29, 'asdf', NULL, 'asfd', NULL, NULL),
(60, 30, 'asdf', NULL, 'sadfas', NULL, NULL),
(61, 31, 'dfas', NULL, 'fasdfasd', NULL, NULL),
(62, 32, 'asdfasd', NULL, 'asdfa', NULL, NULL),
(63, 33, 'sdgfs', NULL, 'sgsd', NULL, NULL),
(64, 34, 'dsaas', NULL, 'fadsasd', NULL, NULL),
(65, 35, 'asda', NULL, 'dadasdd', NULL, NULL),
(66, 36, 'new', NULL, 'adfasdf', NULL, NULL),
(67, 37, 'asdfasd', NULL, 'sdfad', NULL, NULL);

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
  `status` enum('sent','read','deleted') DEFAULT 'sent'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 1, 1, '', 2, 8.00, '2025-05-03 20:19:07', 'pending'),
(2, 1, 1, '', 2, 8.00, '2025-05-03 20:25:58', 'pending'),
(3, 1, 1, '', 1, 4.00, '2025-05-03 20:29:07', 'cancelled'),
(4, 1, 1, 'sdfg', 1, 4.00, '2025-05-03 21:04:08', 'cancelled'),
(5, 1, 1, 'sdfg', 1, 4.00, '2025-05-03 21:13:15', 'shipped'),
(6, 1, 1, 'sdfg', 1, 4.00, '2025-05-03 21:14:47', 'cancelled'),
(7, 7, 26, 'Lenovo Legion', 2, 60000.00, '2025-05-03 23:05:40', 'pending'),
(8, 1, 30, 'Samsung Note 24 ultra', 1, 24000.00, '2025-05-04 07:19:16', 'pending'),
(9, 7, 30, 'Samsung Note 24 ultra', 1, 24000.00, '2025-05-04 07:45:07', 'delivered');

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
(1, 'sdfg', 'sdfg', 4.00, 1, 0x363831373965633434316138365f315f30326164616332332d316630392d346666332d396563662d6538613137616566336630315f3130323478313032342e77656270, '2025-04-21 21:41:20', 13, 'Lenovo', 'Monitor'),
(2, 'dfas', 'dsdf', 33.00, 1, 0x363830613765356434366434355f736f6c6f2e6a7067, '2025-04-21 21:42:18', 0, 'Lenovo', 'Laptop'),
(3, 'asdf', 'asdfasd', 3243.00, 1, 0x363831373965646238336665375f4c656e6f766f2d4732342d32302d32332d335f3130323478313032342e77656270, '2025-04-21 21:50:00', 0, 'Lenovo', 'Monitor'),
(4, 'afdas', 'asdf', 433.00, 1, 0x363831373966313434643834335f68706465736b746f702e77656270, '2025-04-21 22:01:00', 1, 'HP', 'Desktop'),
(7, 'asd', 'asdfasfdss', 34.00, 1, 0x363831376131396533653964665f733234756c747261612e6a666966, '2025-04-21 23:19:00', 4, 'Samsung', 'Smartphone'),
(9, 'baby', 'hehe', 33.00, 1, 0x363831373966343536633063325f68702069372e6a7067, '2025-04-22 16:17:00', 2, 'HP', 'Desktop'),
(11, 'asdf2', 'asdf', 3323.00, 1, 0x363831373965346365383530335f315f30326164616332332d316630392d346666332d396563662d6538613137616566336630315f3130323478313032342e77656270, '2025-04-22 16:20:00', 0, 'HP', 'Monitor'),
(17, 'sgfs', 'sdfgsd', 344.00, 1, 0x363831373966393763626561395f6c656e6f766f20696465617061642e77656270, '2025-04-24 18:17:00', 1, 'Lenovo', 'Laptop'),
(18, 'adfa', 'adf', 222.00, 1, 0x363830613831636364393034355f6861682e6a7067, '2025-04-24 18:24:00', 1, '', ''),
(20, 'sfd', 'sdf', 33.00, 1, 0x363831376130313737326130645f696465617061642e77656270, '2025-04-24 18:28:00', 2, 'Lenovo', 'Laptop'),
(21, 'asdf', 'asdasd', 30.00, 1, 0x363831376130636531303030615f7265616c6d652e6a666966, '2025-04-24 18:36:00', 2, 'Realme', 'Smartphone'),
(22, 'sdfg', 'sdfgsd', 453.00, 1, 0x363830613834653931376137375f6861682e6a7067, '2025-04-24 18:37:00', 3, 'Lenovo', ''),
(23, 'asdf', 'asdf', 33.00, 1, 0x363831376130653837663232375f64656c6c32372e6a666966, '2025-04-25 05:36:00', 2, 'Dell', 'Monitor'),
(24, 'df', 'adsfasd', 33333.00, 1, 0x363830623166383964323330615f6261636b6965652d35303232372d6c616e6473636170652e6a7067, '2025-04-25 05:37:00', 1, 'HP', ''),
(25, 'adf', 'asdf', 333.00, 1, 0x363830623231626664623432305f6861682e6a7067, '2025-04-25 05:46:00', 0, 'Dell', ''),
(26, 'Lenovo Legion', 'deymm', 80000.00, 1, 0x363831376130356538396433395f6c6567696f6e20352e77656270, '2025-04-25 12:55:00', 5, 'Lenovo', 'Laptop'),
(27, 'sdfgsd', 'fgsdgsdfgsd', 4444.00, 1, 0x363831376131363934393735335f617375736c6170746f702e6a666966, '2025-05-03 22:49:00', 4, 'Others', 'Laptop'),
(28, 'Legion 5', 'Best laptop', 50000.00, 1, 0x363831373966666338663535645f7468696e6b7061642e77656270, '2025-05-03 23:02:00', 5, 'Lenovo', 'Laptop'),
(29, 'Infinix note 50 pro', 'best budget phone', 10000.00, 1, 0x363831373966656164343132305f78363835365f6e6f7465353070726f5f35675f62617365315f362e706e67, '2025-05-03 23:04:00', 5, 'Infinix', 'Smartphone'),
(30, 'Samsung S24 ultra', 'Best smartphone', 94000.00, 1, 0x363831376131333533626437665f733234756c747261612e6a666966, '2025-05-03 23:15:00', 3, 'Samsung', 'Smartphone'),
(34, 'asdfas', 'dasfasdfsad', 3.00, 1, 0x363831376130373631353831655f6c656e6f766f20696465617061642e77656270, '2025-05-04 16:23:00', 2, 'Lenovo', 'Laptop'),
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
  `status` enum('open','closed','pending') DEFAULT 'open',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(3, 'asdfad', 'asdfasd@fagda', '$2y$10$RtUZct66BmZAfCiAiRhY9e362ZN2mN6qUb6vdtQ1NCx4JCYiHhOe.', 'customer', 'active', '2025-04-22 05:21:00', 'andy', 0, 'adadfa'),
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
(21, 'asdfasd', 'dfasfasdf@gdasas', '$2y$10$nXE79JPlO/dvbWYGn6i4.ee8oL6s1eUuhmvCmi5bWE/CHS1Hfxr1C', 'customer', 'active', '2025-05-01 17:37:19', 'asdfa', 0, 'fasdfdasdfadsf'),
(22, 'adsf', 'asdfa@fdadfa', '$2y$10$ZOX6C63cG33gF7kpJGUetO7x7VxOv5WTS76knRDNetTFGoEGc44KO', 'customer', 'active', '2025-05-01 17:46:39', 'asdfa', 0, 'asdfda'),
(23, 'asdfa', 'asdf@dasfa', '$2y$10$hfMBo1VQ8EdymBw907ulQe9gIL5NavWB7MvIZ1sgNqOba4NEmJ7WW', 'customer', 'active', '2025-05-01 17:52:37', 'asdf', 0, 'asdfa'),
(24, 'sdas', 'adfad@dfsafd', '$2y$10$tIO9cCOuexDHeTGSYu1VX.gQZbUWXy9BjRC63SSMF69xuegu2JlPa', 'customer', 'active', '2025-05-01 17:55:00', 'ads', 0, 'Poctol, Pilar Sorsohgon'),
(25, 'asdfasdf', 'asdfas@fdas', '$2y$10$F3aR0AGHcMOS1DPh8Wre6e3qJfaobYlTbPwS/9Z1xdUXkyezOJkyi', 'customer', 'active', '2025-05-01 18:21:49', 'ghg', 0, 'asdfasdf'),
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
(37, 'sdfs', 'asdfsa@raefa', '$2y$10$WJ5l4OOLtYpYSMX7dAZLlO2jwaIQFs2QTQop9NVVtgEr/EgrcdMyW', 'customer', 'active', '2025-05-04 12:58:36', 'asdfasd', 0, 'sdfad');

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
  ADD PRIMARY KEY (`ticket_id`),
  ADD KEY `customer_id` (`customer_id`);

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
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
