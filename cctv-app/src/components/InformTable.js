import classes from './InformTable.module.css';


export default function InformTable(props) {
    return (
        <div>
            <div className={classes.container}>
                <table>
                    <tbody>
                        {/* <tr>
                            <td>Camera No</td>
                            <td>{props.id}</td>
                        </tr> */}
                        <tr>
                            <td>Date</td>
                            <td>{props.date}</td>
                        </tr>
                        <tr>
                            <td>Location</td>
                            <td>{props.location}</td>
                        </tr>
                        {/* <tr>
                            <td>Time</td>
                            <td>{props.time}</td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
            <div className={classes.container}>
                <table>
                    <body>other contents</body>
                </table>
            </div>
        </div>

    )
}