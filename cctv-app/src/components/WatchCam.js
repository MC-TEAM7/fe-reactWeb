import classes from './WatchCam.module.css';

export default function WatchCam(props) {

    return (
        <div>
            <article className={classes.container}>
                <img src={props.image} classes={classes.imgSize} />
            </article>

        </div>
    )
}
