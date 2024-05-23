const version = '2401-FTB-MT-WEB-PT'
const APIURL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${version}/events`;

//State
const state = {
    parties: [],
};

const partyList = document.querySelector('#partyList');
const addPartyForm = document.querySelector('#addParty');

addPartyForm.addEventListener('submit', addParty);


//Site should populate with a view of scheduled parties

async function getParties() {
    try {
        const response = await fetch(APIURL)
        const json = await response.json()
        console.log(json);
        if (json.success) {
            state.parties = json.data;
            renderParties();
        } else {
            console.error(json.error);
        }
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
            throw new Error('Party could not be deleted.');
        }
        state.parties = state.parties.filter((party) => party.id !== id);
        renderParties();
    } catch (error) {
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
        addPartyForm.name.value,
        addPartyForm.date.value,
        addPartyForm.location.value,
        addPartyForm.description.value,
    );
    addPartyForm.reset();
}

//Ask API to create a new event and rerender
async function createParty(name, date, location, description) {
    try {
        const isoDate = new Date(date).toISOString();
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, date: isoDate, location, description })
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error(`Failed to add event: ${data.message}`);
        }
        state.parties.push(data.data);
        renderParties();
    } catch (error) {
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
    console.log(state.parties);
    const partyCards = state.parties.map((party) => {
        const partyCard = document.createElement('li');
        partyCard.classList.add('event');
        partyCard.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.location}</p>
        <p>${party.description}</p>
        <p>${party.date}</p>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Event';
        partyCard.append(deleteButton);

        deleteButton.addEventListener('click', () => deleteParty(party.id));

        return partyCard;
    });
    partyList.replaceChildren(...partyCards);
}

getParties();