import { showDptos } from "./functions.js";

const URL = "http://localhost:3000";
const headers = new Headers({ "Content-Type": "application/json" });

//metodo GET
//dptos
export async function getDptos() {
  try {
    let response = await (await fetch(`${URL}/Departamentos`)).json();
    showDptos(response);
  } catch (error) {
    console.log("Error de conexión:", error);
  }
}
//ciudades
export async function getCities() {
  try {
     
    let response = await (await fetch(`${URL}/Ciudades`)).json();
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
}

//Metodo POST
export async function postData(formData, nameJson) {
   
  let config = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(formData),
  };
  try {
    let response = await fetch(`${URL}/${nameJson}`, config);
    let responseJson = await response.json();
    getDptos();
  } catch (error) {
    console.log("Error de conexión:", error);
  }
}

//Metodo Delete
export async function deleteData(dataId, nameJson) {
  try {
    let config = {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify({ id: dataId }),
    };
    let del = await (
      await fetch(`${URL}/${nameJson}/${dataId}`, config)
    ).json();
  } catch (error) {
    console.log("Error de conexión:", error);
  }
}

//Metodo Patch
export async function patchData(dataEdit, id, nameJson) {
   
  let config = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(dataEdit),
  };
  let act = await (await fetch(`${URL}/${nameJson}/${id}`, config)).json();
}
