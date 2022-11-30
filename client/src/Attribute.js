import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

const Attribute = () => {
    const { attr_name } = useParams()
    const [state, setState] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            const attributes = await axios.get(`http://localhost:3001/attribute/${attr_name}/courses`)
            console.log(`http://localhost:3001/attribute/${attr_name}/courses`)
            setState({ attributes: attributes.data })
        }

        fetchData()
    }, [])

    if (state.attributes) {
        console.log(state.attributes)
        return (<>
            <h1>{attr_name}</h1>
            <table>
                <tr>
                    <th>Course ID</th>
                    <th>Course Title</th>
                    <th>Course Tag</th>
                    <th>Course Section</th>
                </tr>
                {state.attributes.map((i) => {
                    return (
                        <tr>
                            <th><Link to={`/course/${i.CourseID}`}>{i.CourseID}</Link></th>
                            <th>{i.CourseTitle}</th>
                            <th>{i.CourseTag}</th>
                            <th>{i.CourseSection}</th>
                        </tr>
                    )
                })}
            </table>
        </>)
    } else return (<h1>Loading</h1>)
}

export default Attribute