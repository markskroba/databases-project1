import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

const Home = () => {
    console.log("test")
    // let averageMeetings, topProfessors;
    const [state, setState] = useState({})
    // const [topProfessors, setTopProfessors] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const averageMeetingsData = await axios.get("http://localhost:3001/meetings/average")
            const averageMeetings = averageMeetingsData.data[0]["avg(c)"]
            console.log(averageMeetings)
            const topProfessorsData = await axios.get("http://localhost:3001/instructors/top")
            const topProfessors = topProfessorsData.data
            setState({ averageMeetings, topProfessors })

        }
        fetchData()
    }, [])


    if (state.topProfessors) {
        return (
            <>
                <h2>Professors with Most Sections</h2>
                <h5>average among all professors: {state.averageMeetings}</h5>

                {state.topProfessors.map((value) => { return <p><Link to={`professor/${value.MeetingInstructor}`}>{value.MeetingInstructor}</Link>: {value.c}</p> })}

            </>
        )
    } else { return <h1>Loading</h1> }
}

export default Home