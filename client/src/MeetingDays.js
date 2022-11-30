import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

const MeetingDays = () => {
    const { days } = useParams()
    const [state, setState] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            const meetings = await axios.get(`http://localhost:3001/meetings/${days}`)

            setState({ meetings: meetings.data })
        }

        fetchData()
    }, [])

    if (state.meetings) {
        console.log(state.meetings)
        return (<>
            <h1>Meetings on {days}</h1>
            <table>
                <tr>
                    <th>Course ID</th>
                    <th>Course Title</th>
                    <th>Course Tag</th>
                    <th>Course Section</th>
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
                            <th>{i.CourseTitle}</th>
                            <th>{i.CourseTag}</th>
                            <th>{i.CourseSection}</th>
                            <th>{i.MeetingType}</th>
                            <th>{i.MeetingLocation}</th>
                            <th>{`${i.MeetingTimeStart} - ${i.MeetingTimeEnd}`}</th>
                            <th>{i.MeetingDays}</th>
                            <th><Link to={`/professor/${i.MeetingInstructor}`}>{i.MeetingInstructor}</Link></th>
                        </tr>
                    )
                })}
            </table>
        </>)
    }
}

export default MeetingDays