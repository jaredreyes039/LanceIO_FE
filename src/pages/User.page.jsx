import { TextInput } from "../components/ui/inputs/Input.component";
import PageBodyLayout from "../layouts/PageBody.layout";
import ToolBar from "../layouts/Toolbar.component";
import Cookies from "universal-cookie";
import { useState } from "react";

export default function User(props) {

    let cookies = new Cookies(null, { path: "/" });
    const [username, setUsername] = useState(cookies.get("username"))

    const handleUpdateUsername = (e) => {
        e.preventDefault();
        setUsername(e.currentTarget.value)
    }

    const updateUsername = (e) => {
        e.preventDefault();
        //Update username in next update
    }

    const clearUsername = (e) => {
        e.preventDefault();
        setUsername("")
    }

    return (
        <>
            <div className="flex">
                <ToolBar />
                <PageBodyLayout settings>
                    {/*<div className="flex flex-col">
                        <div className="settings-header-bar">
                            <h1>User Information</h1>
                        </div>
                        <ul className="flex flex-col">
                            <li className="settings-bar">
                                <h2>Change Username</h2>
                                <TextInput
                                    value={username}
                                    changeHandler={handleUpdateUsername}
                                    label="none"
                                    placeholder="Enter new username..."
                                    inputName="usernameUpdate"
                                />
                                <button className="btn" type="button" onClick={(e) => { updateUsername(e) }}>Save</button>
                                <button className="btn btn-warn" type="button" onClick={(e) => {
                                    clearUsername(e)
                                }}>Clear</button>
                            </li>
                        </ul>
                    </div>*/}
                </PageBodyLayout>
            </div>

        </>
    )
}
