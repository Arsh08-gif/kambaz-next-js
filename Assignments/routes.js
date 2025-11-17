import AssignemtDao from "./dao"

export default function AssignementRoutes(app, db) {
  const dao = AssignemtDao(db);
  const findAssignementForCourse = (req, res) => {
    const { courseId } = req.params;
    const modules = dao.findAssignementForCourse(courseId);
    res.json(modules);
  }
  const createAssingmentForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignement = {
      ...req.body,
      course: courseId,
    };
    const newAssignment = dao.createAssignement(assignement);
    console.log("new assign " + newAssignment);

    res.send(newAssignment);
  }
  const updateAssignement = async (req, res) => {
    const { assignementId } = req.params;
    const assignementUpdates = req.body;
    const status = await dao.updateAssignement(assignementId, assignementUpdates);
    res.send(status);
  }
  const deleteAssignement = (req, res) => {
    const { assignementId } = req.params;
    const status = dao.deleteAssignment(assignementId);
    res.send(status);
  }
  app.delete("/api/assignements/:assignementId", deleteAssignement);
  app.put("/api/assignements/:assignementId", updateAssignement);
  app.post("/api/courses/:courseId/assignements", createAssingmentForCourse);
  app.get("/api/courses/:courseId/assignements", findAssignementForCourse);
}