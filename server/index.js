const mysql = require('mysql2')
const cors = require('cors')
const app = require('express')()
app.use(cors())

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD,
    database: "project1"
})


app.get("/courses", (req, res) => {
    pool.query(
        'select * from Courses',
        function (err, results) {
            res.json([results]);
        }
    );
})

app.get("/course/:courseId", (req, res) => {
    pool.query(
        `select * from Courses where CourseID = ?`, [req.params.courseId],
        function (err, results) {
            res.json([results[0]]);
        }
    );
})

app.get("/course/:courseId/meetings", (req, res) => {
    pool.query(
        `select * from Meetings where CourseID = ?`, [req.params.courseId],
        function (err, results) {
            res.json([results[0]]);
        }
    );
})

app.get("/instructor/:instructorName/meetings", (req, res) => {
    pool.query(
        `select * from Meetings where MeetingInstructor = ?`, [req.params.instructorName],
        function (err, results) {
            res.json([results]);
        }
    );
})

app.get("/instructors/top", (req, res) => {
    pool.query(
        `select MeetingInstructor, count(*) as c FROM Meetings GROUP BY MeetingInstructor order by c desc;`,
        function (err, results) {
            res.json(results);
        }
    );
})

app.get("/meetings/average", (req, res) => {
    pool.query(
        `select avg(c) from (select count(*) as c from Meetings group by MeetingInstructor) as counts`,
        function (err, results) {
            res.json(results);
        }
    );
})

app.get("/course/:courseId/attributes", (req, res) => {
    pool.query(
        `select c.CourseID, a.CourseAttribute from Courses c, CourseAttributes a where c.CourseID = a.CourseID and c.CourseID = ?;`, [req.params.courseId],
        function (err, results) {
            res.json(results);
        }
    );
})

app.get("/attribute/:attribute_name/courses", (req, res) => {
    pool.query(
        `select c.CourseID, c.CourseTitle, c.CourseTag, c.CourseSection from Courses c, CourseAttributes a where c.CourseID = a.CourseID and a.CourseAttribute=?;`, [req.params.attribute_name],
        function (err, results) {
            res.json(results);
        }
    );
})

app.get("/course/:courseId/levels", (req, res) => {
    pool.query(
        `select c.CourseID, l.CourseLevel from Courses c, CourseLevels l where c.CourseID = l.CourseID and c.CourseID = ?;`, [req.params.courseId],
        function (err, results) {
            res.json(results);
        }
    );
})

app.get("/level/:level_name/courses", (req, res) => {
    pool.query(
        `select c.CourseID, c.CourseTitle, c.CourseTag, c.CourseSection from Courses c, CourseLevels l where c.CourseID = l.CourseID and l.CourseLevel=?;`, [req.params.level_name],
        function (err, results) {
            res.json(results);
        }
    );
})

app.get("/meetings/:days", (req, res) => {
    pool.query(
        `select * from Courses c, Meetings m where c.CourseID = m.CourseID and m.MeetingDays like "%M%"`, [req.params.days],

        function (err, results, fields) {

            console.log(results)
            res.json(results);
        }
    );
})

app.get("/level/:level_name/count", (req, res) => {
    pool.query(
        `select count(c.CourseID) from Courses c, CourseLevels l where c.CourseID = l.CourseID and l.CourseLevel=?`, [req.params.level_name],
        function (err, results) {
            res.json(results);
        }
    );
})

app.listen(3001, () => {
    console.log("Server is running")
})
