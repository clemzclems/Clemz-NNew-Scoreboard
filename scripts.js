const darkModeToggle = document.getElementById('dark-mode-toggle');

const menuLinks = document.querySelectorAll('.menu a');

menuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    menuToggle.checked = false;
  });
});


darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
});


#banner {
  width: 100%;
  height: 150px; /* adjust the height to your liking */
  background-size: cover;
  background-position: center;
}


// Define the path to the schools folder
const schoolsFolderPath = 'schools';

// Load the schools folder contents
fetch(schoolsFolderPath)
  .then(response => response.text())
  .then(schoolsFolderContent => {
    // Parse the schools folder content
    const schools = parseSchoolsFolderContent(schoolsFolderContent);

    // Generate the result sheet
    generateResultSheet(schools);
  })
  .catch(error => console.error('Error loading schools folder:', error));

// Function to parse the schools folder content
function parseSchoolsFolderContent(schoolsFolderContent) {
  // Split the schools folder content into school names
  const schoolNames = schoolsFolderContent.split('\n');

  // Initialize an empty object to store the schools
  const schools = {};

  // Iterate over each school name
  schoolNames.forEach(schoolName => {
    // Load the student MD files for the current school
    fetch(`${schoolsFolderPath}/${schoolName}`)
      .then(response => response.text())
      .then(studentMdFiles => {
        // Parse the student MD files
        const students = parseStudentMdFiles(studentMdFiles);

        // Add the students to the schools object
        schools[schoolName] = students;
      })
      .catch(error => console.error(`Error loading student MD files for ${schoolName}:`, error));
  });

  return schools;
}

// Function to parse the student MD files
function parseStudentMdFiles(studentMdFiles) {
  // Split the student MD files into individual files
  const studentMdFileNames = studentMdFiles.split('\n');

  // Initialize an empty array to store the students
  const students = [];

  // Iterate over each student MD file name
  studentMdFileNames.forEach(studentMdFileName => {
    // Load the student MD file contents
    fetch(`${schoolsFolderPath}/${studentMdFileName}`)
      .then(response => response.text())
      .then(studentMdFileContent => {
        // Parse the student MD file content
        const student = parseStudentMdFileContent(studentMdFileContent);

        // Add the student to the students array
        students.push(student);
      })
      .catch(error => console.error(`Error loading student MD file ${studentMdFileName}:`, error));
  });

  return students;
}

// Function to parse the student MD file content
function parseStudentMdFileContent(studentMdFileContent) {
  // Split the student MD file content into sections
  const sections = studentMdFileContent.split('##');

  // Initialize an empty object to store the student
  const student = {};

  // Iterate over each section
  sections.forEach(section => {
    // Extract the student information
    const studentInfo = section.match(/^(.*)\n/)[1].trim();

    // Add the student information to the student object
    student[studentInfo.split(':')[0].trim()] = studentInfo.split(':')[1].trim();
  });

  return student;
}

// Function to generate the result sheet
function generateResultSheet(schools) {
  // Create the result sheet table
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Add the table headers
  const headers = ['School', 'Student', 'Score'];
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    thead.appendChild(th);
  });

  // Add the table rows
  Object.keys(schools).forEach(school => {
    schools[school].forEach(student => {
      const row = document.createElement('tr');
      const schoolCell = document.createElement('td');
      const studentCell = document.createElement('td');
      const scoreCell = document.createElement('td');
      schoolCell.textContent = school;
      studentCell.textContent = student.Name;
      scoreCell.textContent = student.Score;
      row.appendChild(schoolCell);
      row.appendChild(studentCell);
      row.appendChild(scoreCell);
      tbody.appendChild(row);
    });
  });

  // Assemble the table
  table.appendChild(thead);
  table.appendChild(tbody);
  document.getElementById('result-sheet').appendChild(table);
}
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("a[href$='.md']");
  
  links.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const mdFile = this.getAttribute("href");

      fetch(mdFile)
        .then(response => response.text())
        .then(mdContent => {
          // Convert Markdown to HTML
          const htmlContent = marked.parse(mdContent);
          document.getElementById("result-sheet").innerHTML = htmlContent;
        })
        .catch(error => console.error("Error loading Markdown file:", error));
    });
  });
});
