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
                            <td>detecting</td>
                            <td>{props.detecting}</td>
                        </tr>
                        <tr>
                            <td>Accuracy</td>
                            <td>{props.accuracy}</td>
                        </tr>
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