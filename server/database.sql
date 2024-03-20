-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2024 at 09:49 AM
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
  `Date` date NOT NULL DEFAULT current_timestamp(),
  `Stride_Len` text NOT NULL,
  `Velocity` text NOT NULL,
  `Sway` text NOT NULL,
  `MMSEScore` int(11) NOT NULL,
  `PID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gait-results`
--

INSERT INTO `gait-results` (`Test_Num`, `Date`, `Stride_Len`, `Velocity`, `Sway`, `MMSEScore`, `PID`) VALUES
(3, '2024-03-19', '< 1 full stride detected', '0.6198332938634419', '-0.005664940407115586', 24, 3),
(4, '2024-03-19', '< 1 full stride detected', '0.6198332938634419', '-0.005664940407115586', 24, 3),
(5, '2024-03-19', '< 1 full stride detected', '0.6198332938634419', '-0.005664940407115586', 24, 7),
(8, '2024-03-20', '1.2', '2.4', '-0.3', 21, 1),
(9, '2024-03-20', '2.9', '0.4', '0.3', 16, 1),
(10, '2024-03-20', '< 1 full stride detected', '0.6198332938634419', '-0.005664940407115586', 24, 9),
(11, '2024-03-20', '0.64', '1.345', '0.006631', 12, 1),
(12, '2024-03-20', '0.23232', '3.33333', '0.001212', 24, 1),
(13, '2024-03-20', '< 1 full stride detected', '0.6198332938634419', '-0.005664940407115586', 24, 2),
(14, '2024-03-20', '< 1 full stride detected', '0.6198332938634419', '-0.005664940407115586', 24, 1),
(15, '2024-03-20', '< 1 full stride detected', '0.6198332938634419', '-0.005664940407115586', 24, 11),
(16, '2024-03-20', '< 1 full stride detected', '0.6198332938634419', '-0.005664940407115586', 24, 2),
(17, '2024-03-20', '< 1 full stride detected', '0.6198332938634419', '-0.005664940407115586', 24, 1);

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `PID` int(11) NOT NULL,
  `Name` varchar(20) NOT NULL,
  `Gender` varchar(11) NOT NULL,
  `Height` text NOT NULL,
  `Weight` text NOT NULL,
  `Notes` text NOT NULL,
  `TID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`PID`, `Name`, `Gender`, `Height`, `Weight`, `Notes`, `TID`) VALUES
(1, 'Sabraj Bhathal', 'Male', '175', '175', 'Great Player', 4),
(2, 'Moe', 'Male', '55', '55', '', 5),
(3, 'nic', 'female', '33', '33', 'yay', 4),
(6, 'Sample Player', 'Male', '54', '32', 'Have low BP', 6),
(7, 'Sabraj Bhathal', 'Male', '64', '65', 'Great', 7),
(8, 'Sabraj', 'Male', '74', '200', 'Web Dev', 8),
(9, 'Nicole', 'Female', '52', '100', 'UX/UI', 8),
(10, 'Moe', 'Male', '78', '170', 'MLOPS', 8),
(11, 'Baldeep Bhathal', 'Female', '165', '65', 'Plays Centre', 4),
(12, 'Mandeep Bhathal', 'Female', '75', '75', '', 4),
(13, 'Cristiano Ronaldo', 'Male', '187', '91', 'GOAT', 4);

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
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`ID`, `Name`, `Gender`, `Sport`) VALUES
(4, 'Donda FC', 'Male', 'Spikeball'),
(5, 'Rugby B Team', 'Male', 'Rugby '),
(6, 'Real Madrid', 'Female', 'Soccer'),
(7, 'BME 462 Team', 'Female', 'Capstone'),
(8, 'Capstone Sample', 'Male', 'BME 4B');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `gait-results`
--
ALTER TABLE `gait-results`
  ADD PRIMARY KEY (`Test_Num`),
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
  MODIFY `Test_Num` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `PID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `gait-results`
--
ALTER TABLE `gait-results`
  ADD CONSTRAINT `gait-results_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `players` (`PID`);

--
-- Constraints for table `players`
--
ALTER TABLE `players`
  ADD CONSTRAINT `players_ibfk_1` FOREIGN KEY (`TID`) REFERENCES `teams` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
