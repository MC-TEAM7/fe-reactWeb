import classes from './Layout.module.css'

export default function Layout(props) {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        {props.headerTitle}
      </div>
      <div className={classes.contentContainer}>{props.children}</div>
    </div>
  );
}