import React from "react";

export default function Home({ onButtonClick }) {
    return (
        <div>
            Home
            <ul>
                <li className="bd_b"><button onClick={onButtonClick}>Click me to `Test`!</button></li>
            </ul>
        </div>
    );
}
