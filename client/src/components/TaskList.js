import React from 'react';

import './TaskList.scss';
import TaskListItem from './TaskListItem';
import NewTask from './NewTask';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useAppData from '../hooks/useAppData';
import useVisualMode from '../hooks/useVisualMode';
import LinearProgressWithLabel from './MUI/LinearProgress';

// Modes
const NEW_TASK = 'NEW_TASK';
const EDIT_TASK = 'EDIT_TASK';

export default function TaskList(props) {
  const { state, deliverablePercentComplete, completedTasks } = useAppData();
  const { mode, transition } = useVisualMode(null);
  const taskInfo = props.tasks.map(task => {
    return (
      <TaskListItem
        key={task.id}
        id={task.id}
        task={task}
        name={task.name}
        selected={task.priority}
        status={task.status}
        description={task.description}
        onToggle={props.onToggle}
        onClick={props.completeTask}
        transition={transition}
        showTaskForm={props.showTaskForm}
        setTask={() => props.onChange(task.id)}
        editTask={props.editTask}
        deleteTask={() => props.deleteTask(task.id)}
      />
    )
  })

  return (
    <section>
      <div id="deliverable_details">
        <span id="deliverable_name">
          {props.selectedProject.name}: {props.selectedDeliverable.name}
        </span>
        <span id="deliverable_description">{props.selectedDeliverable.description}</span>
        <span id="deliverable_stats">{completedTasks(state, props.deliverable)} of {props.selectedDeliverable.count} Tasks Completed
        </span>

        <span className="task_progress"><LinearProgressWithLabel value={deliverablePercentComplete(state, props.deliverable)} /></span>

        <AddCircleIcon id="new_task" className="mui_icons"
          onClick={() => {
            // onClick={props.showTaskForm} // Change to transition
            if (!mode) {
              transition(NEW_TASK);
            } else {
              transition(null);
            }
          }}
        />
      </div>

      {mode === NEW_TASK &&
        <NewTask
          deliverable={props.deliverable}
          transition={transition}
          saveTask={props.saveTask}
          priority={props.priority}
          status={props.status}
          editTask={props.editTask}
        />
      }

      {mode === EDIT_TASK &&
        <NewTask
          deliverable={props.deliverable}
          transition={transition}
          status={props.selectedTask.status}
          editTask={props.editTask}
          id={props.selectedTask.id}
          name={props.selectedTask.name}
          description={props.selectedTask.description}
          priority={props.selectedTask.priority}
        />
      }

      {taskInfo}
      <button onClick={() => { props.transition('DELIVERABLES') }}>Back</button>
    </section>
  );
}
