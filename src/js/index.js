/* 
kind of a controller in MVC architecture logic
*/

import axios from "axios";

async function getResult(query) {
  try {
    const res = await axios(
      `https://forkify-api.herokuapp.com/api/search?&q=${query}`
    );
    const recipes = res.data.recipes;
    console.log(recipes);
  } catch (err) {
    console.log(err);
  }
}

getResult("pasta");
