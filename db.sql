CREATE TABLE `profile` (
  `USER_ID` int(11) NOT NULL AUTO_INCREMENT,
  `USER_NAME` varchar(20) NOT NULL,
  `PASSWORD` varchar(20) NOT NULL,
  `FIRST_NAME` varchar(20) NOT NULL,
  `LAST_NAME` varchar(20) NOT NULL,
  `GENDER` varchar(60) DEFAULT NULL,
  `USER_TYPE` varchar(30) NOT NULL,
  `EMAIL` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`USER_ID`),
  UNIQUE KEY `id_UNIQUE` (`USER_ID`),
  UNIQUE KEY `USER_ID` (`USER_NAME`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

commit;

INSERT INTO `employee`.`profile` (`USER_ID`, `USER_NAME`, `PASSWORD`, `FIRST_NAME`, `LAST_NAME`, `GENDER`, `USER_TYPE`, `EMAIL`)
VALUES
(100, 'dpatil', 'sample', 'Dhanashree', 'Patil', 'Male', 'ADMIN', 'rishanimates@gmail.com');
INSERT INTO `employee`.`profile` (`USER_ID`, `USER_NAME`, `PASSWORD`, `FIRST_NAME`, `LAST_NAME`, `GENDER`, `USER_TYPE`, `EMAIL`)
VALUES
(101, 'dpradnya', 'sample', 'Pradnya', 'Donge', 'Feale', 'ADMIN', 'd.pradnya@gmail.com');

commit;