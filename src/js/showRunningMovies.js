const moviesSection = document.querySelector("section")

const movies = [
    {
        id: 1,
        title: "The Dark Knight",
        description: "Dark Knight description",
        director: "Christopher Nolan",
        premiere: "2025-05-10",
        imgHref : "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug",
        rating : 15,
        genres : ["ACTION", "DRAMA"]
    }
];

movies.push({
    id: 2,
    title: "The Mask",
    description: "A shy bank clerk discovers a magical mask.",
    director: "Chuck Russell",
    premiere: "1994-07-29",
    imgHref: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiR8_9_An2NlR4qpZE_eSXf0AMYLVX7G9gzRDRqWoyq8axhIhA",
    rating: 11,
    genres: ["COMEDY"]
});

movies.forEach(movie => {
    const article = document.createElement("article");
    article.innerHTML = `
<h2>${movie.title}</h2>
<p>${movie.description}</p>
<p>Director: ${movie.director}</p>
<p>Aldersgrænse: ${movie.rating}</p>
<p>Premiere: ${new Date(movie.premiere).toLocaleDateString()}</p>
<img src="${movie.imgHref}" alt="${movie.title}">
`;
    moviesSection.appendChild(article);
})
