import { MouseEvent, SetStateAction, useState } from "react";
interface EventState {
  target?: string;
  currentTarget?: string;
  type?: string;
  bubbles?: boolean;
  cancelable?: boolean;
  defaultPrevented?: boolean;
  timeStamp?: number;
  clientX?: number;
  clientY?: number;
  screenX?: number;
  screenY?: number;
  pageX?: number;
  pageY?: number;
  button?: number;
  buttons?: number;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
}
export default function EventObject() {
  const [event, setEvent] = useState(null);
  // const handleClick = (e: SetStateAction<null> | MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.target = e.target.outerHTML;
  //   delete e.view;
  //   setEvent(e);
  // };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  const eventCopy: any = { ...e };
  eventCopy.target = (e.target as HTMLButtonElement).outerHTML;
  delete eventCopy.view;
  setEvent(eventCopy);
};
  return (
    <div>
      <h2>Event Object</h2>
      <button onClick={(e) => handleClick(e)}
        className="btn btn-primary"
        id="wd-display-event-obj-click">
        Display Event Object
      </button>
      <pre>{JSON.stringify(event, null, 2)}</pre>
      <hr/>
    </div>
);}

