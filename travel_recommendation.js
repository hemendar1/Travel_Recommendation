function fetchandSearch() {
    const inputVal = document.getElementById('searchvalue').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
            
    resultsContainer.innerHTML = '';

    if(inputVal === ""){
        alert("Please enter a keyword");
        return;
    }

    fetch('travel_recommendation_api.json')
        .then(response => {
            if(!response.ok){
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let matches = [];

            
            if (inputVal === "country" || inputVal === "countries") {
                
                for (let i = 0; i < data.countries.length; i++) {
                    for (let j = 0; j < data.countries[i].cities.length; j++) {
                        if (matches.length < 2) {
                            matches.push(data.countries[i].cities[j]);
                        }
                    }
                }
            } 
            
            else if (inputVal === "temple" || inputVal === "temples") {
                
                matches = data.temples.slice(0, 2);
            } 
            else if (inputVal === "beach" || inputVal === "beaches") {
                matches = data.beaches.slice(0, 2);
            } 
            else {
                if(data.countries){
                    data.countries.forEach(country => {
                        if (country.name.toLowerCase().includes(inputVal)) {
                            country.cities.forEach(city => matches.push(city));
                        } else {
                            country.cities.forEach(city => {
                                if (city.name.toLowerCase().includes(inputVal)) {
                                    matches.push(city);
                                }
                            });
                        }
                    });
                }

                if(data.temples){
                    data.temples.forEach(temple => {
                        if (temple.name.toLowerCase().includes(inputVal)) {
                            matches.push(temple);
                        }
                    });
                }

                if(data.beaches){
                    data.beaches.forEach(beach => {
                        if (beach.name.toLowerCase().includes(inputVal)) {
                            matches.push(beach);
                        }
                    });
                }
            }

            if(matches.length > 0){
                matches.forEach(place => {
                    const cardHTML = `
                        <div class="result-card">
                            <img src="${place.imageUrl}" alt="${place.name}" class="result-img">
                            <div class="result-body">
                                <h3 class="result-title">${place.name}</h3>
                                <p class="result-desc">${place.description}</p>
                                <button class="btn-visit">Visit</button>
                            </div>
                        </div>
                    `;
                    resultsContainer.innerHTML += cardHTML;
                });
            } else {
                resultsContainer.innerHTML = `
                    <div class="red-border-box" style="background: rgba(0,0,0,0.8); color: white; padding: 20px;">
                        <h3>No results found for "${inputVal}"</h3>
                    </div>`;
            }
        })
        .catch(error => {
            console.error(error);
            resultsContainer.innerHTML = `<div class="red-border-box" style="color: white;"><h3>Error: Ensure your local server is running to load JSON data.</h3></div>`;
        });
}

function clearSearch() {
    document.getElementById('searchvalue').value = "";
    document.getElementById('searchResults').innerHTML = "";
}