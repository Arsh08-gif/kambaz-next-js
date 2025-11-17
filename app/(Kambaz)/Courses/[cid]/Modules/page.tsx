"use client"
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import * as client from "../../client";
import { v4 as uuidv4 } from "uuid";
import { setModules, addModule, editModule, updateModule, deleteModule }
    from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";


import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";

interface Lesson {
    _id: string;
    name: string;
    description?: string;
    module: string;
}
interface Module {
    _id: string;
    name: string;
    description?: string;
    course: string;
    lessons?: Lesson[];
    editing?: boolean;
}


export default function Modules() {
    const { cid } = useParams();
    //const [modules, setModules] = useState<any[]>(db.modules);
    const [moduleName, setModuleName] = useState("");
    const { modules } = useSelector((state: RootState) => state.modulesReducer);
    const dispatch = useDispatch();


    // const addModule = () => {
    //     setModules([...modules, { _id: uuidv4(), name: moduleName, course: cid, lessons: [] }]);
    //     setModuleName("");
    // };
    // const deleteModule = (moduleId: string) => {
    //     setModules(modules.filter((m) => m._id !== moduleId));
    // };

    // const editModule = (moduleId: string) => {
    //     setModules(modules.map((m) => (m._id === moduleId ? { ...m, editing: true } : m)));
    // };
    // const updateModule = (module: any) => {
    //     setModules(modules.map((m) => (m._id === module._id ? module : m)));
    // };


    // console.log("cid module : " + cid)
    // const modules = db.modules;

    const fetchModules = async () => {
        console.log(cid);
        const modules = await client.findModulesForCourse(cid as string);
        dispatch(setModules(modules));
    };
    useEffect(() => {
        fetchModules();
    }, []);

    const onCreateModuleForCourse = async () => {
        if (!cid) return;
        const newModule = { _id: Date.now().toString(), name: moduleName, course: cid as string };
        console.log(JSON.stringify(newModule));
        const responseMod = await client.createModuleForCourse(cid as string, newModule);
        dispatch(setModules([...modules, responseMod]));
    };
    const onRemoveModule = async (moduleId: string) => {
        await client.deleteModule(moduleId);
        dispatch(setModules(modules.filter((m: Module) => m._id !== moduleId)));
    };

    const onUpdateModule = async (module: Module) => {
        await client.updateModule(module);
        const newModules = modules.map((m: Module) => m._id === module._id ? module : m);
        dispatch(setModules(newModules));
    };



    return (
        <div>
            {/* <ModulesControls setModuleName={setModuleName}
                moduleName={moduleName} addModule={addModule} /><br /><br /><br /><br /> */}
            <ModulesControls setModuleName={setModuleName}
                moduleName={moduleName} addModule={onCreateModuleForCourse} /><br /><br /><br /><br />
            <ListGroup className="rounded-0" id="wd-modules">
                {modules
                    // .filter((module) => module.course === cid)
                    .map((module) => (
                        <ListGroupItem key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary">
                                <BsGripVertical className="me-2 fs-3" />
                                {!module?.editing && module.name}
                                {module?.editing && (
                                    <FormControl className="w-50 d-inline-block"
                                        onChange={(e) =>
                                            dispatch(
                                                updateModule({ ...module, name: e.target.value })
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                onUpdateModule({ ...module, editing: false });

                                            }
                                        }}
                                        value={module.name} />
                                )}

                                <ModuleControlButtons
                                    moduleId={module._id}
                                    deleteModule={(moduleId) => onRemoveModule(moduleId)}

                                    editModule={(moduleId) => dispatch(editModule(moduleId))}
                                />

                            </div>
                            {module.lessons && (
                                <ListGroup className="wd-lessons rounded-0">
                                    {module.lessons.map((lesson: Lesson) => (
                                        <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                                            <BsGripVertical className="me-2 fs-3" /> {lesson.name}
                                            <LessonControlButtons assignmentId={lesson._id} />
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroupItem>
                    ))}
            </ListGroup>
        </div>
    );
}
