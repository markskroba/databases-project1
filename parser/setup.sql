CREATE DATABASE IF NOT EXISTS project1;
USE project1;

create table Courses (
	CourseID int,
	CourseTitle varchar(80),
	CourseTag varchar(15),
	CourseSection varchar(5),
	CourseTerm varchar(20),
	CourseLocation varchar(50),
	CourseScheduleType varchar(50),
	CourseMeetings varchar(50),
	CourseCredits varchar(15),
	PRIMARY KEY (CourseID)
);

create table Meetings (
	CourseID int,
	MeetingType varchar(10),
	MeetingDateStart varchar(20),
	MeetingDateEnd varchar(20),
	MeetingTimeStart varchar(10),
	MeetingTimeEnd varchar(10),
	MeetingDays varchar(5),
	MeetingLocation varchar(50),
	MeetingScheduleType varchar(30),
	MeetingInstructor varchar(50),
	foreign key (CourseID) references Courses(CourseID)
);

create table CourseLevels (
	CourseID int,
	CourseLevel varchar(50),
	foreign key (CourseID) references Courses(CourseID)
);

create table CourseAttributes (
	CourseID int,
	CourseAttribute varchar(50),
	foreign key (CourseID) references Courses(CourseID)
);
