import Avatar from "../../../../../assets/images/avatar.svg";
import _ from "lodash";
import "./Task.scss";
import DragWrapper from "../../../../../context/DragWrapper";
import FormInput from "../../../../../component/formInput/FormInput";
import useTask from "./useTask";

export default function Task({
  parentID,
  tasks,
  findItem,
  moveItem,
  isAddTask,
  setIsAddTask,
  setCards,
  openTaskDetail,
}) {
  const { addTask, addTaskRef } = useTask(
    parentID,
    isAddTask,
    setIsAddTask,
    setCards
  );
  return (
    <>
      {!_.isEmpty(tasks) &&
        tasks.map((task, index) => (
          <DragWrapper
            type="task"
            item={{ ...task, index }}
            parentID={parentID}
            index={index}
            id={"task_" + task.id}
            key={"task_" + task.id}
            findItem={findItem}
            moveItem={moveItem}
          >
            <div
              className="d-flex justify-content-between task"
              onClick={() => openTaskDetail()}
            >
              <div className="task-header">{task.title}</div>
              <div className="task-content">
                {!task?.members || task.members.length === 0 ? (
                  <img src={Avatar} alt="" />
                ) : (
                  task.members
                    .slice(0, Math.min(2, task.members.length))
                    .map((member) => <img src={Avatar} alt="" />)
                )}
              </div>
            </div>
          </DragWrapper>
        ))}
      {isAddTask && (
        <div ref={addTaskRef}>
          <FormInput
            id="addTaskForm"
            initialValues={{ title: "" }}
            onSubmit={(value) => {
              if (value.title) {
                addTask(value);
              }
              setIsAddTask(false);
            }}
          >
            <FormInput.Text name="title" placeholder="Enter task title" />
          </FormInput>
        </div>
      )}
    </>
  );
}
