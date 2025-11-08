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
  //const [event, setEvent] = useState(null);
  const [event, setEvent] = useState<EventState | null>(null);
  // const handleClick = (e: SetStateAction<null> | MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.target = e.target.outerHTML;
  //   delete e.view;
  //   setEvent(e);
  // };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // const eventCopy: any = { ...e };
    // eventCopy.target = (e.target as HTMLButtonElement).outerHTML;
    // delete eventCopy.view;
    const eventCopy:EventState = {
      type: e.type,
      target: (e.target as HTMLButtonElement).outerHTML,
      currentTarget: e.currentTarget.outerHTML,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      pageX: e.pageX,
      pageY: e.pageY,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      button: e.button,
      buttons: e.buttons,
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      defaultPrevented: e.defaultPrevented,
      timeStamp: e.timeStamp,
    };
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
      <hr />
    </div>
  );
}

