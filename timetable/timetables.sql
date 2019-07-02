--
-- Table structure for table `timetables`
--

CREATE TABLE IF NOT EXISTS `timetables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL,
  `date` varchar(10) NOT NULL,
  `day` varchar(10) NOT NULL,
  `start_time` varchar(10) CHARACTER SET latin1 NOT NULL,
  `end_time` varchar(10) CHARACTER SET latin1 NOT NULL,
  `color` int(11) NOT NULL,
  `description` text NOT NULL,
  `state` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5;

--
-- Dumping data for table `timetables`
--

INSERT INTO `timetables` (`id`, `name`, `image`, `date`, `day`, `start_time`, `end_time`, `color`, `description`, `state`) VALUES
(1, 'Roger Hodgson', 'roger_hodgson.jpg', '14-09-2016', 'wednesday', '08:00', '09:30', 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non ornare eros. Ut pharetra ornare lorem, sit amet bibendum quam imperdiet ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non ornare eros. Ut pharetra ornare lorem, sit amet bibendum quam imperdiet ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non ornare eros.', 1),
(2, 'Lucha Libre', 'lucha_libre.jpg', '13-09-2016', 'thursday', '09:00', '11:00', 2, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non ornare eros. Ut pharetra ornare lorem, sit amet bibendum quam imperdiet ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non ornare eros. Ut pharetra ornare lorem, sit amet bibendum quam imperdiet ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non ornare eros.', 1),
(3, 'Musiq SoulChild - Grown & Sexy 16', 'musiq_soulchild.jpg', '27-09-2016', 'saturday', '13:00', '14:30', 4, 'Grown & Sexy 16\r\nMusiq SoulChild and Avant\r\n\r\nTickets:\r\n$55.00 - Row 1-5\r\n$45.00 - Row 6-13\r\n$35.00 - Row 14-20\r\n$20.00 - Row 21-25', 1),
(4, 'Festival of Praise Tour', 'festival_of_praise_tour.jpg', '05-09-2016', 'monday', '10:00', '12:00', 3, 'HEZEKIAH WALKER , ISRAEL HOUGHTON, REGINA BELLE, FRED HAMMOND, CASEY J, KAREN - CLARKE - SHEARD, COMEDIAN EARTHQUAKE\r\n\r\nTickets:\r\n$52.50 Row 1-5\r\n$47.50 Row 6-13\r\n$37.50 Row 14-20\r\n$27.50 Row 21-25', 1);