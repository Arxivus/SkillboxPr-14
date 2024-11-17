document.querySelector('#film-form').addEventListener('submit', handleformSubmit);

renderTable()

const sortButton = document.querySelector('.sort-table');
sortButton.onclick = sortList


function sortList() {
    const list = document.querySelector('.sort-params');
    const parameter = list.value
    let films = JSON.parse(localStorage.getItem('films') || [])

    if (films == []) {
        return
    }

    switch (parameter) {
        case 'Название': 
            films = films.sort((f1, f2) => f1.title.toLowerCase().localeCompare(f2.title.toLowerCase()))
            break
        case 'Жанр': 
            films = films.sort((f1, f2) => f1.genre.toLowerCase().localeCompare(f2.genre.toLowerCase()))
            break
        case 'Год': 
            films = films.sort((f1, f2) => f1.releaseYear - f2.releaseYear)
            break
    }
    localStorage.setItem('films', JSON.stringify(films)) 
    localStorage.setItem('sortParameter', JSON.stringify(parameter))
    renderTable()
}


function handleformSubmit(e) {
    e.preventDefault()
    const title = document.querySelector('#title').value;
    const genre = document.querySelector('#genre').value;
    const releaseYear = document.querySelector('#releaseYear').value;
    const isWatched = document.querySelector('input[type="checkbox"]').checked;

    const film = {
        title: title,
        genre: genre,
        releaseYear: releaseYear,
        isWatched: isWatched,
    }
    addFilmToLocalStorage(film)
}

function removeFilm(film) {
    const films = JSON.parse(localStorage.getItem('films'))
    const index = films.findIndex(stored => stored.title === film.title)
    films.splice(index, 1)
    localStorage.setItem('films', JSON.stringify(films)) 
    renderTable()
}

function updateFilm(film) {
    const title = document.querySelector('#title');
    const genre = document.querySelector('#genre');
    const releaseYear = document.querySelector('#releaseYear');
    const isWatched = document.querySelector('#isWatched');

    title.value = film.title
    genre.value = film.genre
    releaseYear.value = film.releaseYear
    isWatched.checked = film.isWatched

    const addButton = document.querySelector('.add-button');
    addButton.style.display = 'none'
    const updateButton = document.querySelector('.update'); 
    const stopButton = document.querySelector('.stop-edit'); 
    updateButton.style.display = 'block'
    stopButton.style.display = 'block'

    const films = JSON.parse(localStorage.getItem('films'))

    updateButton.onclick = () => {
        const updatedFilm = {
            title: document.querySelector('#title').value,
            genre: document.querySelector('#genre').value,
            releaseYear: document.querySelector('#releaseYear').value,
            isWatched: document.querySelector('#isWatched').checked
        }
        const index = films.findIndex(stored => stored.title === film.title)
        films[index] = updatedFilm
        localStorage.setItem('films', JSON.stringify(films)) 

        updateButton.style.display = 'none'
        stopButton.style.display = 'none'
        addButton.style.display = 'block'
        renderTable()
    }

    stopButton.onclick = () => {
        title.value = ''
        genre.value = ''
        releaseYear.value = ''
        isWatched.checked = false
        renderTable()
    }
}

function addFilmToLocalStorage(film) {
    const films = JSON.parse(localStorage.getItem('films')) || []
    films.push(film)
    localStorage.setItem('films', JSON.stringify(films))

    renderTable();
}

function renderTable() {
    const films = JSON.parse(localStorage.getItem('films')) || []
    const filmTableBody = document.querySelector('#film-tbody')
    const filmSortSelector = document.querySelector('.sort-params')
    filmSortSelector.value = JSON.parse(localStorage.getItem('sortParameter')) || 'Год'
    filmTableBody.innerHTML = ''

    
    films.forEach((film)=> {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${film.title}</td>
            <td>${film.genre}</td>
            <td>${film.releaseYear}</td>
            <td>${film.isWatched ? 'Да' : 'Нет'}</td>
        `;
        filmTableBody.appendChild(row);

        const editFilmButtons = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button')
        editButton.textContent = 'Редактировать'
        editButton.onclick = () => {
            updateFilm(film)
        }

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button')
        deleteButton.textContent = 'Удалить'
        deleteButton.onclick = () => {
            removeFilm(film)
        }
        editFilmButtons.append(editButton, deleteButton)
        row.append(editFilmButtons)
    });   
}

