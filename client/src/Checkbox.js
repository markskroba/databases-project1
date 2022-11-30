import { useState } from "react"

const Checkbox = ({ toggle, day, dayChar }) => {
    const [checked, setChecked] = useState(false)

    const handleChange = () => {
        setChecked(!checked)
        toggle(dayChar)
    }

    return (
        <>
            <input type="checkbox" onChange={handleChange}></input>
            <label>{day}</label>
        </>
    )
}

export default Checkbox;