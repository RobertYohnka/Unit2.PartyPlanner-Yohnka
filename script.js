const version = '2401-FTB-MT-WEB-PT'
const APIURL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${version}/events`;

//State
const state = {
    parties: [],
};

const partyList = document.querySelector('#party');
const addPartyForm = document.querySelector('#addParty');
addPartyForm.addEventListener('submit', addParty);
// deleteButton.addEventListener('click', () => deleteParty(recipe.id));

//Site should populate with a view of scheduled parties

async function getParties() {
    try {
        const response = await fetch(APIURL)
        const json = await response.json()
        state.parties = json.data;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Prepare to delete events as needed
 * Ask API to delete an event and rerender
 */
async function deleteParty(id) {
    try {
        const response = await fetch(`${APIURL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Recipe could not be deleted.');
        }

        render();
    }   catch (error) {
        console.log(error);
    }
}


/**
 * Handle form submission for adding an event...so many "events"!
 * @param {Event} event
 */
async function addParty(event) {
    event.preventDefault();

    await createParty(
        addPartyForm.title.value,
        addPartyForm.date.value,
        addPartyForm.location.value,
        addPartyForm.description.value,
    );
}

//Ask API to create a new event and rerender
async function createParty(title, date, location, description) {
    try {
        const isoDate = new Date(date).toISOString();
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, date: isoDate, location, description })
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error(`Failed to add event: ${data.message}`);
        }
        render();
    }   catch (error) {
        console.error(error);
    }
}

//Render events from state - Notes from class...
// This uses a combination of `createElement` and `innerHTML`;
// point out that you can use either one, but `createElement` is
// more flexible and `innerHTML` is more concise.
function renderParties() {
    if (!state.parties.length) {
        partyList.innerHTML = `<li>No events found.</li>`;
    return;
    }
    const partyCards = state.parties.map((party) => {
        const partyCard = document.createElement('li');
        partyCard.classList.add('event');
        partyCard.innerHTML = `
        <h2>${party.title}</h2>
        <p>${party.date}</p>
        <p>${party.location}</p>
        <p>${party.description}</p>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Event';
        partyCard.append(deleteButton);

        deleteButton.addEventListener('click', () => deleteParty(parties.id));

        return partyCard;
    });
    partyList.replaceChildren(...partyCards);
}