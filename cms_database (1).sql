-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2025 at 12:30 AM
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
(3, 1, 1, 1, '2025-04-27 03:59:04'),
(5, 1, 25, 2, '2025-04-28 14:22:56'),
(6, 1, 26, 2, '2025-04-28 14:23:00'),
(7, 1, 25, 1, '2025-04-28 14:23:02'),
(8, 1, 24, 1, '2025-04-28 14:23:04');

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
(37, 7, 'andy22', NULL, 'Poctol, Pilar Sorsogon', NULL, NULL);

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
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) GENERATED ALWAYS AS (`quantity` * `price`) STORED,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `order_date` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `category` enum('Laptops') NOT NULL DEFAULT 'Laptops',
  `brand` enum('Dell','HP','Lenovo','Asus') NOT NULL DEFAULT 'Lenovo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `pname`, `pdescription`, `price`, `available`, `p_image`, `created_at`, `stocks`, `category`, `brand`) VALUES
(1, 'sdfg', 'sdfg', 4.00, 1, 0x363830613765383535363535395f6261636b6965652d35303232372d6c616e6473636170652e6a7067, '2025-04-21 21:41:20', 0, 'Laptops', 'Dell'),
(2, 'dfas', 'dsdf', 33.00, 1, 0x363830613765356434366434355f736f6c6f2e6a7067, '2025-04-21 21:42:18', 0, 'Laptops', ''),
(3, 'asdf', 'asdfasd', 3243.00, 1, 0x6165612e6a7067, '2025-04-21 21:50:00', 0, 'Laptops', ''),
(4, 'afdas', 'asdf', 433.00, 1, 0x6861682e6a7067, '2025-04-21 22:01:00', 2, 'Laptops', ''),
(7, 'asd', 'asdfasfdss', 34.00, 1, 0x6d652e6a7067, '2025-04-21 23:19:00', 5, 'Laptops', ''),
(9, 'baby', 'hehe', 33.00, 1, 0x6165612e6a7067, '2025-04-22 16:17:00', 3, 'Laptops', ''),
(11, 'asdf2', 'asdf', 3323.00, 1, 0x363830613765326663663835315f6861682e6a7067, '2025-04-22 16:20:00', 1, 'Laptops', ''),
(17, 'sgfs', 'sdfgsd', 344.00, 1, 0x363830613830326439643333665f6165612e6a7067, '2025-04-24 18:17:00', 2, 'Laptops', ''),
(18, 'adfa', 'adf', 222.00, 1, 0x363830613831636364393034355f6861682e6a7067, '2025-04-24 18:24:00', 1, 'Laptops', ''),
(20, 'sfd', 'sdf', 33.00, 1, 0x363830613832643464633332655f6165612e6a7067, '2025-04-24 18:28:00', 2, 'Laptops', ''),
(21, 'asdf', 'asdasd', 3.00, 1, 0x363830613834636431303537625f6165612e6a7067, '2025-04-24 18:36:00', 2, 'Laptops', ''),
(22, 'sdfg', 'sdfgsd', 453.00, 1, 0x363830613834653931376137375f6861682e6a7067, '2025-04-24 18:37:00', 3, 'Laptops', ''),
(23, 'asdf', 'asdf', 33.00, 1, 0x363830623166343335656238635f6165612e6a7067, '2025-04-25 05:36:00', 2, 'Laptops', 'Dell'),
(24, 'df', 'adsfasd', 33333.00, 1, 0x363830623166383964323330615f6261636b6965652d35303232372d6c616e6473636170652e6a7067, '2025-04-25 05:37:00', 1, 'Laptops', 'HP'),
(25, 'adf', 'asdf', 333.00, 1, 0x363830623231626664623432305f6861682e6a7067, '2025-04-25 05:46:00', 0, 'Laptops', 'Dell'),
(26, 'Lenovo Legion', 'deymm', 30000.00, 1, 0x363830623836356162646466365f6165612e6a7067, '2025-04-25 12:55:00', 5, 'Laptops', 'Lenovo');

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
(7, 'andy22', 'andy12@gmail.com', '$2y$10$ysLN/yfx9xJHNU0rMZ/lTuPEaKy7CIBKgfwehzPytBLQ17TkvgnLe', 'customer', 'active', '2025-04-27 01:03:03', 'andy22', 0, 'Poctol, Pilar Sorsogon');

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
  ADD KEY `user_id` (`user_id`);

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
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

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
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
