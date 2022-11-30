import axios from "axios";
import { useState } from "react";
import Checkbox from "./Checkbox"

const Search = () => {
    const [days, setDays] = useState("");
    const [courses, setCourses] = useState({})

    const searchDays = async () => {
        const data = await axios.get(`http://localhost:3001/meetings/${days}`)
        console.log(data.data)
    }

    const handleChangeDays = (e) => {
        setDays(e.target.value)
    }

    const daysInput = (<input type="text" onChange={handleChangeDays} />)
    return (
        <>
            <h1>Course / meeting search</h1>
            <>
                <h3>Days</h3>
                {daysInput}
            </>
            <button onClick={searchDays}>Submit</button>
        </>
    )
}

export default Search