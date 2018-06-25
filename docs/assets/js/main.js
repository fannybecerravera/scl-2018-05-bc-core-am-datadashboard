// remueve la clase active del elemento HTML y de sus hijos.
const cleanActives = (tag) => {
  // obtiene la lista de hijos que tienen la clase active.
  const activeChildren = tag.getElementsByClassName('active');
  // recorre a los hijos activos del tag.
  for (let i = 0; i < activeChildren.length; i++) {
    // para cada hijo activo se ejecuta la misma funcion cleanActives.
    cleanActives(activeChildren[i]);
  }
  tag.classList.remove('active'); // remueve la clase active del elemento HTML pasado como parametro
};


const toggle = (event) => {
  // se obtienen todos los nodos del mismo nivel del tag que disparo el evento.
  let brothers = event.currentTarget.parentNode.children;
  // se recorre los brothers para desactivar los hermanos que esten activos.
  for (let i = 0; i < brothers.length; i++) {
    // se crea una variable con el segundo hijo del hermano actual
    let whiteCard = brothers[i].children[1];
    // si el hermano no es el que recibio el click o ya tiene la clase active se le limpia la clase active del el y de todos sus hijos.
    if (brothers[i] !== event.currentTarget || whiteCard.classList.contains('active')) {
      cleanActives(whiteCard);
    } else { // si no le agrega la clase active.
      event.currentTarget.children[1].classList.add('active');
    }
  }
  // evita la propagacion del evento al los tags padres.
  event.stopPropagation();
};

const getData = (url) => {
  req.open('GET', url, false);
  req.send(null);
  if (req.status === 200) {
    return JSON.parse(req.responseText);
  }

  return [];
};

const loadUsers = (cohort, studentsDivId) => {
  let studentP;
  let studentDiv;
  let progressDiv;
  const studentsDiv = document.getElementById(studentsDivId);
  const filter = document.getElementById('input-' + cohort.id).value.toUpperCase().toUpperCase();

  let fc = studentsDiv.getElementsByClassName('student').item(0);

  while (fc) {
    studentsDiv.removeChild(fc);
    fc = studentsDiv.getElementsByClassName('student').item(0);
  }
  
  if (!cohort.users) {
    cohort.users = getData(`https://api.laboratoria.la/cohorts/${cohort.id}/users`);
    let progress = getData(`https://api.laboratoria.la/cohorts/${cohort.id}/progress`);
    cohort.users = computeUsersStats(cohort.users, progress, Object.keys(cohort.coursesIndex));
  }
  
  cohort.users.forEach((student) => {
    if (student.role === 'student' && student.name.toUpperCase().indexOf(filter) >= 0) {
      studentP = document.createElement('p');
      studentP.append(document.createTextNode(student.name + ' ' + student.stats.percent + '%'));
  
      progressDiv = document.createElement('div');
      progressDiv.classList.add('studentProgress');
      progressDiv.style.width = student.stats.percent + '%';
      
      studentDiv = document.createElement('div');
      studentDiv.classList.add('student', 'tag');
      studentDiv.append(studentP);
      studentDiv.append(progressDiv);
  
      studentsDiv.append(studentDiv);        
    }
  });
};

const tags = document.getElementsByClassName('tag');
const sitesDiv = document.getElementById('sites');
let siteDiv;
let siteP;
let generationsDiv;
let generationDiv;
let generationP;
let cohortsDiv;
let cohortDiv;
let cohortP;
let cohortName;
let studentsDiv;
let studentsFilter;
let idAlumnas;

// objeto que se encarga de hacer los llamados al API
const req = new XMLHttpRequest();
// se define metodo y url para obtener los sites del API de manera sincrona
req.open('GET', 'https://api.laboratoria.la/campuses', false);
// se hace llamado sin contenido en el body
req.send(null);
// se instancia un array vacio para poder ir acumulando los sites
const sites = [];
// si el API respondio de manera correcta
if (req.status === 200) {
  // parsea JSON que viene como string dentro de responseText y recorre los sites
  JSON.parse(req.responseText).forEach(site => {
    // si el site esta activo
    if (site.active) {
      // se crea un array vacio de generaciones para ir acumulandolos
      site.generations = [];
      // agrega un objeto al array de site con el nombre y un conjunto donde se iran agegando las generaciones
      sites.push(site);
    }
  });
}

// se define metodo y url para obtener los cohorts del API de manera sincrona
req.open('GET', 'https://api.laboratoria.la/cohorts', false);
req.send(null);
if (req.status === 200) {
  //split elimina el guion del id
  let siteId;
  let year;
  // parsea json que viene como string dentro de responseText y recorre los cohorts
  JSON.parse(req.responseText).forEach(cohort => {
    siteId = cohort.id.split('-')[0];
    year = cohort.id.split('-')[1];
    // para cada cohort recorre todos los sites antes creados
    sites.forEach(site => {
      // si el id del cohort empieza con el nombre del site
      if (siteId === site.id) {
        // se agrega el año que viene en el id del cohort a la generacion
        if (site.generations[year]) {
          site.generations[year].push(cohort);
        } else {
          site.generations[year] = [cohort];
        }
      }
    });
  });
}

// se recorre los sites
sites.forEach(site => {
  // se le asigna a siteP un nuevo elemento HTML del tipo parrafo
  siteP = document.createElement('p');
  // al elemento creado se l agrega la clase 'icon-triangle-down'
  siteP.classList.add('icon-triangle-down');
  // le agrega como ultimo hijo de P un nodo de texto con el nombre del site en mayuscula
  siteP.append(document.createTextNode(site.name.toUpperCase()));

  siteDiv = document.createElement('div');
  siteDiv.classList.add('site', 'tag');
  siteDiv.append(siteP);

  generationsDiv = document.createElement('div');
  generationsDiv.classList.add('generations', 'whiteCard');

  siteDiv.append(generationsDiv);
  sitesDiv.append(siteDiv);

  site.generations.forEach((generation, year) => {
    generationP = document.createElement('p');
    generationP.classList.add('icon-triangle-down');
    generationP.append(document.createTextNode(year));

    generationDiv = document.createElement('div');
    generationDiv.classList.add('generation', 'tag');
    generationDiv.append(generationP);

    cohortsDiv = document.createElement('div');
    cohortsDiv.classList.add('turns', 'whiteCard');

    generationDiv.append(cohortsDiv);

    generationsDiv.append(generationDiv);

    generation.forEach((cohort) => {
      cohortP = document.createElement('p');
      cohortP.classList.add('icon-triangle-down');
      cohortName = cohort.id.split('-').slice(4).join(' ');
      cohortP.append(document.createTextNode(cohortName));

      cohortDiv = document.createElement('div');
      cohortDiv.classList.add('turn', 'tag');
      cohortDiv.append(cohortP);

      studentsDiv = document.createElement('div');
      studentsDiv.classList.add('students', 'whiteCard');
      studentsDiv.id = 'students-' + cohort.id;

      studentsFilter = document.createElement('input');
      studentsFilter.setAttribute('type', 'text');
      studentsFilter.setAttribute('id', 'input-' + cohort.id);
      studentsFilter.setAttribute('placeholder', 'Filtrar ' + cohortName);
      
      studentsDiv.append(studentsFilter);
      cohortDiv.append(studentsDiv);

      studentsFilter.addEventListener('click', (event) => {
        event.stopPropagation();
      });
      studentsFilter.addEventListener('keyup', () => {
        loadUsers(cohort, 'students-' + cohort.id);
      });
      cohortDiv.addEventListener('click', () => {
        loadUsers(cohort, 'students-' + cohort.id);
      });

      cohortsDiv.append(cohortDiv);
    });
  });
});

// asigna a todos los tags el evento click con la funcion toggle.
for (let i = 0; i < tags.length; i++) {
  tags[i].addEventListener('click', toggle);
}

