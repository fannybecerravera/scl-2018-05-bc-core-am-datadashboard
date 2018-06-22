window.computeUsersStats = (users, progress, courses) => {
  users.forEach(user => {
    courses.forEach(course => {
      // Si la usuaria tiene progresos en el curso
      if (progress[user.id][course]) {
        // Se crea el atributo stats en el user y se le asigna un objeto con las estadisticas
        user.stats = {
          percent: progress[user.id][course].percent,
          exercises: {
            total: 0,
            completed: 0
          },
          quizzes: {
            total: 0,
            completed: 0,
            scoreSum: 0
          },
          reads: {
            total: 0,
            completed: 0
          },
        };

        // Se obtiene el arreglo de los valores de units (la lista de unidades) y lo recorre
        Object.values(progress[user.id][course].units).forEach(unit => {
          // Se obtiene el arreglo de los valores de parts (la lista de unidades) y lo recorre
          Object.values(unit.parts).forEach(part => {
            // Si la parte es una practice
            if (part.type === 'practice') {
              // Suma uno al total
              user.stats.exercises.total++;
              // Como completed es un entero que vale 0 o 1, simplemente lo acumula
              user.stats.exercises.completed += part.completed;
            }
            // Si la parte es una quiz
            if (part.type === 'quiz') {
              user.stats.quizzes.total++;
              user.stats.quizzes.completed += part.completed;
              // Si el quiz fue completado se acumula su puntuacion
              if (part.completed) {
                user.stats.quizzes.scoreSum += part.score;
              }
            }
            // Si la parte es un read
            if (part.type === 'read') {
              user.stats.reads.total++;
              user.stats.reads.completed += part.completed;
            }
          });
        });

        // Se calculan los promedios basados en los totales y acumuladores
        user.stats.exercises.percent = Math.round(user.stats.exercises.completed / user.stats.exercises.total * 100);
        user.stats.quizzes.percent = Math.round(user.stats.quizzes.completed / user.stats.quizzes.total * 100);
        user.stats.quizzes.scoreAvg = Math.round(user.stats.quizzes.scoreSum / user.stats.quizzes.completed);
        user.stats.reads.percent = Math.round(user.stats.reads.completed / user.stats.reads.total * 100);
      } else {
        user.stats = {
          percent: 0,
          exercises: {},
          quizzes: {},
          reads: {},
        };

      }
    });
  });

  return users;
};

window.sortUsers = (users, orderBy, orderDirection) => {
  switch (orderBy) {
    case 'name':
      return users.sort((a, b) => {
        if (orderDirection === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    case 'percent':
      return users.sort((a, b) => {
        if (a.stats && b.stats) {
          if (orderDirection === 'asc') {
            return a.stats.percent - b.stats.percent;
          } else {
            return b.stats.percent - a.stats.percent;
          }
        } else {
          return -1;
        }
      });
    default:
      break;
  }
};

window.filterUsers = (users, search) => {
  //guardando en una variable el nuevo arreglo 
  let newArrUsers = [];
<<<<<<< HEAD
  //users pasa por un filtrado al cual le paso cada elemento del arreglo que recorrera
  return users.filter(element => {
    //si el search coincide con el usuario y este es >= a 0
    return element.users.toLowerCase().indexOf(search.toLowerCase()) >= 0;
=======
  //users pasa por un filtrado el cual
  return users.filter(element => {
    //si el search coincide con el nombre de usuario y este es >= a 0
    return element.name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
>>>>>>> 962fa43f5d203cd55d3ee8cb686d88cd0f098600
  });
  //entonces nos entregara el nuevo array
  return newArrUsers;
};

window.processCohortData = (options, cohortData, users, progress, orderBy, sortUsers, orderDirection, search) => {

};


