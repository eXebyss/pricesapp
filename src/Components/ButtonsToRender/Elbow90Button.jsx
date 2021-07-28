import Elbow90Table from "../TablesToRender/Elbow90Table";
import Button from "../Button";

const Elbow90Button = (props) => {
  return (
    <div>
      <div className="clickButton">
        <Button onClick={props.onClick} label="2. Elbow90"></Button>
      </div>
      <div>{props.state3 ? <Elbow90Table /> : ""}</div>
    </div>
  );
};

export default Elbow90Button;
