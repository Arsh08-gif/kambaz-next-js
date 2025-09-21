export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name">Assignment Name</label>
            <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
            <textarea id="wd-description">
                The assignment is available online Submit a link to the landing page of
            </textarea>
            <br />
            <table>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-points">Points</label>
                    </td>
                    <td>
                        <input id="wd-points" defaultValue={100} />
                    </td>
                </tr><br />
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-group">Assignment Group</label>
                    </td>
                    <td>
                        <select id="wd-group">
                            <option value="assignment">ASSIGNMENTS</option>
                        </select>
                    </td>
                </tr><br />
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-submission-type">Submission Type</label>
                    </td>
                    <td>
                        <select id="wd-submission-type">
                            <option value="online">Online</option>
                        </select><br />

                        <label>Online Entry Options</label><br />

                        <input type="checkbox" name="check-genre" id="wd-text-entry" />
                        <label htmlFor="wd-chkbox-comedy">Text Entry</label><br />

                        <input type="checkbox" name="check-genre" id="wd-website-url" />
                        <label htmlFor="wd-chkbox-drama">Website URL</label><br />

                        <input type="checkbox" name="check-genre" id="wd-media-recordings" />
                        <label htmlFor="wd-chkbox-scifi">Media Recordings</label><br />

                        <input type="checkbox" name="check-genre" id="wd-student-annotation" />
                        <label htmlFor="wd-chkbox-fantasy">Student Annotation</label><br />

                        <input type="checkbox" name="check-genre" id="wd-file-upload" />
                        <label htmlFor="wd-chkbox-fantasy">File Uploads</label><br />
                    </td>
                </tr><br />
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-assign-to">Assign</label>
                    </td>
                    <td>
                        <tr>
                            <td><label htmlFor="wd-assign-to">Assign To</label></td><br/>
                            <td align="right" valign="top">
                                <input id="wd-points" defaultValue="Everyone" />
                            </td>
                        </tr>
                    </td>

                </tr><br />
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-due-date">Due</label>
                    </td>
                    <td>
                        <input type="date"
                            defaultValue="2024-05-13"
                            id="wd-due-date" />
                    </td>
                </tr><br />
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-available-from">Available from</label>
                    </td>
                    <td>
                        <input type="date"
                            defaultValue="2024-05-06"
                            id="wd-available-from" />
                    </td>
                </tr><br />
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-available-until">Until</label>
                    </td>
                    <td>
                        <input type="date"
                            defaultValue="2024-05-20"
                            id="wd-available-until" />
                    </td>
                </tr>
            </table>
        </div>
    );
}

