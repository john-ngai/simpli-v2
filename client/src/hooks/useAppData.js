import { useState, useEffect } from "react";
import axios from "axios";
import authHeader from '../services/authHeader';
// import users from "../../../server/routes/users";

export default function useAppData() {
  // Container for the state and all helper functions.
  const appData = {};

  // Empty state structure.
  const [state, setState] = useState({
    project: null,
    projects: {},
    deliverable: null,
    deliverables: {},
    task: null,
    tasks: {},
    scheduleItem: null,
    schedule: {},
    showDelivForm: false,
    showTaskForm: false,
    users: {},
    teams: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get('/projects', { headers: authHeader() }),
      axios.get('/deliverables', { headers: authHeader() }),
      axios.get('/tasks', { headers: authHeader() }),
      axios.get('/schedule') /* Missing JWT authentication!! */,
      axios.get('/users'),
      axios.get('/teams')
    ])
      .then(all => {
        const [projects, deliverables, tasks, schedule, users, teams] = all;
        setState(prev => ({
          ...prev,
          projects: projects.data,
          deliverables: deliverables.data,
          tasks: tasks.data,
          schedule: schedule.data,
          users: users.data,
          teams: teams.data
        }));
      })
  }, [])
  appData.state = state;

  // Set the currently selected user .
  const setUser = user => setState({ ...state, user });
  appData.setUser = setUser;

  // Set the currently selected project id.
  const setProject = project => setState({ ...state, project });
  appData.setProject = setProject;

  // Save a new project.
  const saveProject = newProject => {
    const project = newProject.id;
    const projects = {
      ...state.projects,
      [newProject.id]: newProject
    };
    setState({ ...state, project, projects });
  }
  appData.saveProject = saveProject;

  // Edit an existing project.
  const editProject = project => {
    const { id, name, description, team_id } = project;
    const projects = {
      ...state.projects,
      [id]: {
        ...state.projects[project.id], // Get the missing count key.
        id,
        name,
        description,
        team_id
      }
    }
    setState({ ...state, projects });
  }
  appData.editProject = editProject;

  // Delete the currently selected project id.
  const deleteProject = project_id => {
    // Declare a new projects object to hold the updated projects data.
    const projects = {};
    // Loop through each project from state,
    for (const project of Object.values(state.projects)) {
      // If the project's id is not equal to the selected project id,
      if (project.id !== project_id) {
        // Add the project to the projects object.
        projects[project.id] = project;
      }
    }
    return axios.delete(`/projects/${project_id}`)
      .then(() => setState({ ...state, projects }));
  }
  appData.deleteProject = deleteProject;

  // Save new deliverable
  const saveDeliverable = (newDeliverable) => {
    const deliverable = newDeliverable.id;
    const deliverables = {
      ...state.deliverables,
      [newDeliverable.id]: newDeliverable,
    };
    const values = Object.values(state.projects)
    const updateCounter = values.map((project) => {
      if (newDeliverable.project_id === project.id) {
        return { ...project, count: project.count++ };
      }
      return project
    });
    setState({ ...state, deliverable, deliverables, updateCounter });
  }
  appData.saveDeliverable = saveDeliverable;

  // Set the currently selected deliverable id.
  const setDeliverable = deliverable => setState({ ...state, deliverable });
  appData.setDeliverable = setDeliverable;

  // Set showDelivForm 
  const setShowDelivForm = showDelivForm => setState({ ...state, showDelivForm });
  const showDelivForm = () => {
    setShowDelivForm(!state.showDelivForm)
  }
  appData.showDelivForm = showDelivForm

  // Set showTaskForm 
  const setShowTaskForm = showTaskForm => setState({ ...state, showTaskForm });
  const showTaskForm = () => {
    setShowTaskForm(!state.showTaskForm)
  }
  appData.showTaskForm = showTaskForm

  // Return selected project object.
  const getSelectedProject = state => {
    const project_id = state.project;
    const projects = Object.values(state.projects);
    for (const project of projects) {
      if (project.id === project_id) {
        return project;
      }
    }
  }
  appData.getSelectedProject = getSelectedProject;

  // Return an array of deliverables matching the selected project id.
  const getDeliverables = (state, project_id) => {
    const allDeliverables = Object.values(state.deliverables);
    const selectedDeliverables = [];
    // Loop through each deliverable from state,
    for (const deliverable of allDeliverables) {
      // If the deliverable's project id matches the current project_id,
      if (deliverable.project_id === project_id) {
        // Add the deliverable to the selectedDeliverables array.
        selectedDeliverables.push(deliverable);
      }
    }
    return selectedDeliverables;
  }
  appData.getDeliverables = getDeliverables;

  // Return the selected deliverable object.
  const getSelectedDeliverable = state => {
    const deliverable_id = state.deliverable;
    const deliverables = Object.values(state.deliverables);
    for (const deliverable of deliverables) {
      if (deliverable.id === state.deliverable) {
        return deliverable;
      }
    }
  }
  appData.getSelectedDeliverable = getSelectedDeliverable;

  // Return the selected task object.
  const getSelectedTask = state => {
    const task_id = state.task;
    const tasks = Object.values(state.tasks);
    // return tasks.find(task => task.id === task_id);
    for (const task of tasks) {
      if (task.id === state.task) {
        return task;
      }
    }
  }
  appData.getSelectedTask = getSelectedTask;

  // Delete the currently selected deliverable id.
  const deleteDeliverable = deliverable_id => {
    // Declare a new deliverables object to hold the updated deliverables data.
    const deliverables = {};
    // Loop through each deliverable from state,
    for (const deliverable of Object.values(state.deliverables)) {
      // If the deliverable's id is not equal to the selected deliverable id,
      if (deliverable.id !== deliverable_id) {
        // Add the deliverable to the deliverables object.
        deliverables[deliverable.id] = deliverable;
      } else if (deliverable.id === deliverable_id) {
        const values = Object.values(state.projects)
        values.map((project) => {
          if (deliverable.project_id === project.id) {
            return { ...project, count: project.count-- };
          }
          return project
        });
      }
    }
    return axios.delete(`/deliverables/${deliverable_id}`)
      .then(() => setState({ ...state, deliverables }));
  }
  appData.deleteDeliverable = deleteDeliverable;

  // Edit an existing deliverable.
  const editDeliverable = deliverable => {
    const { id, name, description, project_id, priority, status } = deliverable;
    const deliverables = {
      ...state.deliverables,
      [id]: {
        ...state.deliverables[deliverable.id], // Get the missing count key.
        id,
        name,
        description,
        project_id,
        priority,
        status
      }
    }
    setState({ ...state, deliverables });
  }
  appData.editDeliverable = editDeliverable;

  // toggle task complete
  const completeTask = (id) => {
    const allTasks = Object.values(state.tasks);
    const allDelivs = Object.values(state.deliverables)
    const allProj = Object.values(state.projects)
    let updTask;
    let updDeliv;
    let updProj;
    let delivID;
    let projID;
    allTasks.forEach(task => {
      if (task.id === id) {
        task.status = !task.status;
        updTask = task;
        allDelivs.forEach(deliverable => {
          if (deliverable.id === task.deliverable_id) {
            delivID = deliverable.id
            updDeliv = deliverable
            if (task.status === true) {
              deliverable['completed_tasks']++
            } else if (task.status === false) {
              deliverable['completed_tasks']--
            }
          }
        })
      }
    });

    if (updDeliv['completed_tasks'] === Number(updDeliv.count)) {
      updDeliv.status = true
      allProj.forEach(project => {
        if (project.id === updDeliv.project_id) {
          updProj = project
          projID = project.id
          project['completed_deliverables']++
        }
      })
    } else {
      allProj.forEach(project => {
        if (project.id === updDeliv.project_id) {
          updProj = project
          projID = project.id
          if (updDeliv.status === true) {
            project['completed_deliverables']--
          }
        }
      })
      updDeliv.status = false
    }

    const tasks = {
      ...state.tasks,
      [id]: updTask
    }

    const deliverables = {
      ...state.deliverables,
      [delivID]: updDeliv
    }

    const projects = {
      ...state.projects,
      [projID]: updProj
    }

    axios.put(`/tasks/${id}`, updTask)
      .then(() => {
        setState({ ...state, tasks });
      })
      .catch(err => console.log(err));

    axios.put(`/deliverables/${delivID}`, updDeliv)
      .then(() => {
        setState({ ...state, deliverables });
      })
      .catch(err => console.log(err));

    axios.put(`/projects/${projID}`, updProj)
      .then(() => {
        setState({ ...state, projects });
      })
      .catch(err => console.log(err));
  }
  appData.completeTask = completeTask;

  // toggle deliverables priority
  const setDeliverablesPriority = (id) => {
    const allDeliverables = Object.values(state.deliverables);
    let updDeliverable;
    allDeliverables.forEach(deliverable => {
      if (deliverable.id === id) {
        deliverable.priority = !deliverable.priority;
        updDeliverable = deliverable;
      }
    });
    const deliverables = {
      ...state.deliverables,
      [id]: updDeliverable
    }
    axios.put(`/deliverables/${id}`, updDeliverable)
      .then(() => {
        setState({ ...state, deliverables });
      })
      .catch(err => console.log(err));
  }
  appData.setDeliverablesPriority = setDeliverablesPriority;

  // Return an array of tasks matching the selected deliverable id.
  const getTasks = (state, deliverable_id) => {
    const allTasks = Object.values(state.tasks);
    const selectedTasks = [];
    // Loop through each task from state,
    for (const task of allTasks) {
      // If the task's deliverable id matches the current deliverable_id,
      if (task.deliverable_id === deliverable_id) {
        // Add the task to the selectedTasks array.
        selectedTasks.push(task);
      }
    }
    return selectedTasks;
  }
  appData.getTasks = getTasks;

  // Set the currently selected task id.
  const setTask = task => setState({ ...state, task });
  appData.setTask = setTask;

  // Delete the currently selected task id.
  const deleteTask = task_id => {
    // Declare a new tasks object to hold the updated tasks data.
    const tasks = {};
    // Loop through each task from state,
    for (const task of Object.values(state.tasks)) {
      // If the deliverable's id is not equal to the selected deliverable id,
      if (task.id !== task_id) {
        // Add the deliverable to the deliverables object.
        tasks[task.id] = task;
      } else if (task.id === task_id) {
        const values = Object.values(state.deliverables)
        values.map((deliverable) => {
          if (task.deliverable_id === deliverable.id) {
            return { ...deliverable, count: deliverable.count-- };
          }
          return deliverable
        });
      }
    }
    return axios.delete(`/tasks/${task_id}`)
      .then(() => setState({ ...state, tasks }));
  }
  appData.deleteTask = deleteTask;

  // Edit an existing task.
  const editTask = task => {
    const { id, name, description, deliverable_id, priority, status } = task;
    const tasks = {
      ...state.tasks,
      [id]: {
        ...state.tasks[task.id], // Get the missing count key.
        id,
        name,
        description,
        deliverable_id,
        priority,
        status
      }
    }
    setState({ ...state, tasks });
  }
  appData.editTask = editTask;

  const setTaskPriority = (id) => {
    const allTasks = Object.values(state.tasks);
    // new task data with the priority set to the opposite of what it is
    let updateTask;
    allTasks.forEach(task => {
      if (task.id === id) {
        task.priority = !task.priority;
        updateTask = task;
      }
    });
    const tasks = {
      ...state.tasks,
      [id]: updateTask
    }

    // make an axios PUT req to update the task data
    axios.put(`/tasks/${id}`, updateTask)
      .then(() => {
        setState({ ...state, tasks });
      })
      .catch(err => console.log("ERROR:", err));
  }
  appData.setTaskPriority = setTaskPriority;

  // Save new task
  const saveTask = newTask => {
    const task = newTask.id;
    const tasks = {
      ...state.tasks,
      [newTask.id]: newTask
    };
    const values = Object.values(state.deliverables)
    const updateCounter = values.map((deliverable) => {
      if (newTask.deliverable_id === deliverable.id) {
        return { ...deliverable, count: deliverable.count++ };
      }
      return deliverable
    });
    setState({ ...state, task, tasks, updateCounter });
  }
  appData.saveTask = saveTask;

  const percentComplete = (state, project) => {
    const selectedDelivs = getDeliverables(state, project)
    let numCompleted = 0;
    let total = 0;
    selectedDelivs.forEach(deliv => {
      total++
      if (deliv.status === true) {
        numCompleted++;
      }
    })
    return Math.round((numCompleted / total) * 100)
  }
  appData.percentComplete = percentComplete

  const deliverablePercentComplete = (state, deliverable) => {
    const selectedTasks = getTasks(state, deliverable)
    let numCompleted = 0;
    let total = 0;
    selectedTasks.forEach(task => {
      total++
      if (task.status === true) {
        numCompleted++;
      }
    })
    return Math.round((numCompleted / total) * 100);
  }
  appData.deliverablePercentComplete = deliverablePercentComplete

  const completedDeliverables = (state, project) => {
    let numCompleted = 0
    const selectedDelivs = getDeliverables(state, project)
    selectedDelivs.forEach(deliv => {
      if (deliv.status === true) {
        numCompleted++;
      }
    })
    return numCompleted;
  }
  appData.completedDeliverables = completedDeliverables

  const completedTasks = (state, deliverable) => {
    const selectedTasks = getTasks(state, deliverable)
    let numCompleted = 0;
    selectedTasks.forEach(task => {
      if (task.status === true) {
        numCompleted++;
      }
    })
    return numCompleted;
  }
  appData.completedTasks = completedTasks

  // Return the schedule for the selected project id.
  const getProjectSchedule = (project, schedule) => {
    const projectSchedule = {};
    Object.values(schedule).forEach(item => {
      if (item['project_id'] === project) {
        projectSchedule[item.id] = item;
      }
    })
    return projectSchedule;
  }
  appData.getProjectSchedule = getProjectSchedule;

  const saveSchedule = newScheduleItem => {
    const scheduleItem = newScheduleItem.id;
    const schedule = {
      ...state.schedule,
      [newScheduleItem.id]: newScheduleItem
    };
    setState({ ...state, scheduleItem, schedule })
  }
  appData.saveSchedule = saveSchedule;


  const completedTasksForProject = (state, project) => {
    let finishedTasks = 0;
    const selectedDelivs = getDeliverables(state, project)
    const allTasks = Object.values(state.tasks);
    selectedDelivs.forEach(deliverable => {
      allTasks.forEach(task => {
        if (task.deliverable_id === deliverable.id) {
          if (task.status === true) {
            finishedTasks++
          }
        }
      })
    })
    return finishedTasks;
  }
  appData.completedTasksForProject = completedTasksForProject;

  const totalTasksForProject = (state, project) => {
    let totalTasks = 0;
    const selectedDelivs = getDeliverables(state, project);
    const allTasks = Object.values(state.tasks);
    selectedDelivs.forEach(deliverable => {
      allTasks.forEach(task => {
        if (task.deliverable_id === deliverable.id) {
          totalTasks++
        }
      })
    })
    return totalTasks;
  }
  appData.totalTasksForProject = totalTasksForProject

  const getUsers = (state, user) => {
    const allUsers = Object.values(state.users);
    const selectedUsers = [];
    const teamID = user.team_id;

    for (const user of allUsers) {
      if (user.team_id === teamID) {
        selectedUsers.push(user);
      }
    }
    return selectedUsers;
  }
  appData.getUsers = getUsers

  // Set the currently selected deliverable, task, & scheduleItem id.
  const setScheduleItem = (deliverable, task, scheduleItem) => {
    setState({
      ...state, deliverable, task, scheduleItem
    });
  }
  appData.setScheduleItem = setScheduleItem;

  const deleteScheduleItem = scheduleItem => {
    const schedule = {};
    Object.values(state.schedule).forEach(item => {
      if (item.id !== scheduleItem) {
        schedule[item.id] = item;
      }

    });
    axios.delete(`/schedule/${scheduleItem}`)
      .then(() => {
        setState({ ...state, schedule });
      });
  }
  appData.deleteScheduleItem = deleteScheduleItem;

  const toggleComplete = (schedule, scheduleItemDetails) => {
    const item = scheduleItemDetails;
    const newStatus = !scheduleItemDetails.task.completed;
    item.task.completed = newStatus;
    const selectedTask = getSelectedTask(state);
    selectedTask.status = newStatus;
    axios.put(`/tasks/${selectedTask.id}`, selectedTask)
      .then(() => {
        setState({
          ...state,
          schedule,
          [item.id]: item
        });
      })
  }
  appData.toggleComplete = toggleComplete;

  return appData;
}
