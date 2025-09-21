import { redirect } from "next/navigation";
import Link from "next/link";


export default function Kambaz() {
  redirect("/Account/Signin");

  // return (
  //   <div id="wd-labs">
  //     <h1>Kambaz</h1>
  //     <ul>
  //       <li>
  //         <Link href="/Labs" id="wd-labs-link">
  //           Lab Exercises </Link>
  //       </li>
  //     </ul>
  //   </div>
  // );
}

