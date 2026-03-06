async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.status !== 204) { // No Content
        return await response.json();
    }
    return response.json();
}

//Calls made to the apiRequest
//GET
/*
    const movies = await apiRequest('/api/movies')
*/
//POST
/*
    const newMovie = {
        title: 'Inception',
        director: 'Christopher Nolan',
        releaseYear: 2010
    };
    const createdMovie = await apiRequest('/api/movies', 'POST', newMovie);
*/
//PUT
/*
    const updatedMovie = {
        title: 'Inception',
        director: 'Christopher Nolan',
        releaseYear: 2010
    };
    const result = await apiRequest('/api/movies/1', 'PUT', updatedMovie);
*/
//DELETE
/*
    await apiRequest('/api/movies/1', 'DELETE');
*/