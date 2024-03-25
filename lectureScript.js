const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-MT-WEB-PT/recipes';

const state = {
  recipes: [],
};

const recipesList = document.querySelector('#recipes');

const addRecipeForm = document.querySelector('#addRecipe');
addRecipeForm.addEventListener('submit', addRecipe);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getRecipes();
  renderRecipes();
}
render();

/**
 * Update state with recipes from API
 */
async function getRecipes() {
  // This is almost identical to the example code in slides;
  // point out that we're using the response to update state
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.recipes = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Handle form submission for adding a recipe
 * @param {Event} event
 */
async function addRecipe(event) {
  // This function is essentially just a wrapper around `createRecipe`,
  // so you can move through it quickly.
  // You can discuss why we might want to have a separate function
  // or you can just put all the logic in here instead - your preference!
  event.preventDefault();

  await createRecipe(
    addRecipeForm.title.value,
    addRecipeForm.imageUrl.value,
    addRecipeForm.instructions.value
  );
}

/**
 * Ask API to create a new recipe and rerender
 * @param {string} name name of recipe
 * @param {string} imageUrl url of recipe image
 * @param {string} description description of the recipe
 */
async function createRecipe(name, imageUrl, description) {
  try {
    // Take some time to explain the arguments being passed to `fetch`
    // since this is the first time students are seeing this.
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, imageUrl, description }),
    });
    const json = await response.json();

    // This is a good time to explain how we're handling errors.
    // Refer to the API documentation!
    // Differentiate between a network error and an API error.
    if (json.error) {
      throw new Error(json.message);
    }

    // Explain that making a call to the API doesn't actually change
    // the client state, so we'll need to refetch the data.
    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask API to update an existing recipe and rerender
 * NOTE: This is not currently used in the app, but it's here for reference.
 * @param {number} id id of the recipe to update
 * @param {string} name new name of recipe
 * @param {string} imageUrl new url of recipe image
 * @param {string} description new description for recipe
 */
async function updateRecipe(id, name, imageUrl, description) {
  // This is almost identical to `createRecipe`; here, you can spend some time
  // talking about REST principles and different HTTP methods.
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, imageUrl, description }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask API to delete a recipe and rerender
 * @param {number} id id of recipe to delete
 */
async function deleteRecipe(id) {
  // This is much simpler than `createRecipe` so you can move through it quickly.
  // Instead, focus on how the event listener is attached to a rendered button
  // so that the correct recipe is deleted.
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    // Explain that we're handling errors differently here, since
    // a successful deletion only sends back a status code.
    if (!response.ok) {
      throw new Error('Recipe could not be deleted.');
    }

    render();
  } catch (error) {
    console.log(error);
  }
}

/**
 * Render recipes from state
 */
function renderRecipes() {
  if (!state.recipes.length) {
    recipesList.innerHTML = `<li>No recipes found.</li>`;
    return;
  }
  // This uses a combination of `createElement` and `innerHTML`;
  // point out that you can use either one, but `createElement` is
  // more flexible and `innerHTML` is more concise.
  const recipeCards = state.recipes.map((recipe) => {
    const recipeCard = document.createElement('li');
    recipeCard.classList.add('recipe');
    recipeCard.innerHTML = `
      <h2>${recipe.name}</h2>
      <img src="${recipe.imageUrl}" alt="${recipe.name}" />
      <p>${recipe.description}</p>
    `;

    // We use createElement because we need to attach an event listener.
    // If we used `innerHTML`, we'd have to use `querySelector` as well.
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Recipe';
    recipeCard.append(deleteButton);

    // Explain how closure allows us to access the correct recipe id
    deleteButton.addEventListener('click', () => deleteRecipe(recipe.id));

    return recipeCard;
  });
  recipesList.replaceChildren(...recipeCards);
}