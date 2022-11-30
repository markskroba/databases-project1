import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Course = () => {
    const { courseID } = useParams()
    const [state, setState] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const course_data = await axios.get(`http://localhost:3001/course/${courseID}`)
            const meetings = await axios.get(`http://localhost:3001/course/${courseID}/meetings`)
            const attributes = await axios.get(`http://localhost:3001/course/${courseID}/attributes`)
            const levels = await axios.get(`http://localhost:3001/course/${courseID}/levels`)

            setState({ course_data: course_data.data[0], meetings: meetings.data, attributes: attributes.data, levels: levels.data })
        }

        fetchData()
    }, [])

    if (state.course_data && state.meetings && state.attributes && state.levels) {
        console.log(state.attributes)
        return (
            <>
                <h1>{courseID} - {state.course_data.CourseTag} - {state.course_data.CourseTitle} - {state.course_data.CourseSection}</h1>
                <p>Term: {state.course_data.CourseTerm}</p>
                <p>Location: {state.course_data.CourseLocation}</p>
                <p>Schedule Type: {state.course_data.CourseScheduleType}</p>
                <p>Meeting Type: {state.course_data.CourseMeetings}</p>
                <p>Credits: {state.course_data.CourseCredits}</p>
                <h3>Attributes</h3>
                {state.attributes.map((value) => { return (<h5><Link to={`/attribute/${value.CourseAttribute}`}>{value.CourseAttribute}</Link></h5>) })}
                <h3>Levels</h3>
                {state.levels.map((value) => { return (<h5><Link to={`/level/${value.CourseLevel}`}>{value.CourseLevel}</Link></h5>) })}
                <h3>Levels</h3>
                <h3>Meetings for this course:</h3>


                <table>
                    <tr>
                        <th>Course ID</th>
                        <th>Meeting Type</th>
                        <th>Meeting Location</th>
                        <th>Meeting Time</th>
                        <th>Meeting Days</th>
                        <th>Instructor</th>
                    </tr>
                    {state.meetings.map((i) => {
                        return (
                            <tr>
                                <th><Link to={`/course/${i.CourseID}`}>{i.CourseID}</Link></th>
                                <th>{i.MeetingType}</th>
                                <th>{i.MeetingLocation}</th>
                                <th>{`${i.MeetingTimeStart} - ${i.MeetingTimeEnd}`}</th>
                                <th>{i.MeetingDays}</th>
                                <th><Link to={`/professor/${i.MeetingInstructor}`}>{i.MeetingInstructor}</Link></th>
                            </tr>
                        )
                    })}
                </table>
            </>

        )
    } else { return <h1>Loading</h1> }
}

export default Course;