-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 18, 2024 at 08:45 AM
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
-- Database: `concussion-manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `gait-results`
--

CREATE TABLE `gait-results` (
  `Test_Num` int(11) NOT NULL,
  `Date` date NOT NULL,
  `Stride_Len` float NOT NULL,
  `Velocity` float NOT NULL,
  `Sway` float NOT NULL,
  `MMSEScore` int(11) NOT NULL,
  `PID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `PID` int(11) NOT NULL,
  `Name` varchar(20) NOT NULL,
  `Gender` varchar(11) NOT NULL,
  `Height` int(11) NOT NULL,
  `Weight` int(11) NOT NULL,
  `Notes` text NOT NULL,
  `TID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `ID` int(11) NOT NULL,
  `Name` varchar(20) NOT NULL,
  `Gender` varchar(20) NOT NULL,
  `Sport` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indexes for table `gait-results`
--
ALTER TABLE `gait-results`
  ADD PRIMARY KEY (`Test_Num`),
  ADD KEY `PID` (`PID`);

--
-- Indexes for table `mmse-results`
--
ALTER TABLE `mmse-results`
  ADD PRIMARY KEY (`test_num`),
  ADD KEY `PID` (`PID`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`PID`),
  ADD KEY `TID` (`TID`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `gait-results`
--
ALTER TABLE `gait-results`
  MODIFY `Test_Num` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mmse-results`
--
ALTER TABLE `mmse-results`
  MODIFY `test_num` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `PID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `gait-results`
--
ALTER TABLE `gait-results`
  ADD CONSTRAINT `gait-results_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `players` (`PID`);

--
-- Constraints for table `mmse-results`
--
ALTER TABLE `mmse-results`
  ADD CONSTRAINT `mmse-results_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `players` (`PID`);

--
-- Constraints for table `players`
--
ALTER TABLE `players`
  ADD CONSTRAINT `players_ibfk_1` FOREIGN KEY (`TID`) REFERENCES `teams` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
