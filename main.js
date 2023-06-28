async function process_argv() {
  let { argv } = process;
  argv = argv.slice(2);
  const result = await studentActivitiesRegistration(argv);

  return result;
}

async function getStudentActivities() {
  const response = await fetch("http://localhost:3001/activities");
  const data = await response.json();
  return data; // TODO: replace this
}

async function studentActivitiesRegistration(data) {
  const [method, name, day] = data;

  switch (method) {
    case "CREATE":
      const student = await addStudent(name, day);
      return student;
    case "DELETE":
      const result = await deleteStudent(name);
      return result;
  }
}

async function addStudent(name, day) {
  const activitiesData = await getStudentActivities();
  const selectedActivities = activitiesData
    .filter((activity) => {
      return activity.days.includes(day);
    })
    .map((activity) => ({
      name: activity.name,
      desc: activity.desc,
    }));

  const response = await fetch("http://localhost:3001/students", {
    method: "POST",
    body: JSON.stringify({
      name,
      activities: selectedActivities,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return data; // TODO: replace this
}

async function deleteStudent(id) {
  const response = await fetch(`http://localhost:3001/students/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  // if (!response.ok) {
  //   throw new Error(data.message);
  // }
  return {
    message: `Successfully deleted student data with id ${id}`,
  };
}

process_argv()
  .then((data) => {
    console.log(data);
  })

  .catch((err) => {
    console.log(err);
  });

module.exports = {
  studentActivitiesRegistration,
  getStudentActivities,
  addStudent,
  deleteStudent,
};
