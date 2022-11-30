import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

const Professor = () => {
    const { professorName } = useParams()
    const [state, setState] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            const meetings = await axios.get(`http://localhost:3001/instructor/${professorName}/meetings`)
            setState({ meetings: meetings.data[0] })
        }

        fetchData()
    }, [])

    if (state.meetings) {
        return (
            <>
                <h1>Professors Name: {professorName} </h1>
                <p>Currently instructor for {state.meetings.length} meetings</p>

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
    } else return (<h1>Loading</h1>)
}

export default Professor