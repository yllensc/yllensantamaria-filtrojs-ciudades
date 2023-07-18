import {
  viewDptos,
  tableContent,
  tableDptos,
  modalCities,
  formAddCity,
  createDpto,
  modalDpto,
  formAddDpto,
  modalDetails,
  modalContentDetail,
  modalCitiesEdit,
  btnSaveEditCity,
  weatherBox,
  tableTem,
  btnChangeTem,
} from "./selectors.js";
import {
  getDptos,
  getCities,
  postData,
  patchData,
  deleteData,
} from "./fetchApiMetodos.js";

import { getWeather } from "./apiWeather.js";

//cambiar tema jeje
export function changeTem(current) {
  const tem = tableTem.classList.toggle("table-dark");
  localStorage.setItem("theme", tem);
}
btnChangeTem.addEventListener("click", function () {
  var savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    changeTem(savedTheme);
  }
});

// Mostrar la tabla de departamentos
export function showDptos(dptos) {
  tableDptos.innerHTML = "";
  dptos.forEach((dpto) => {
    let rowHTML = `
            <tr>
              <th scope="row"><img class="img-dpto" src="/img/city.avif" alt="iconCity"></th>
              <td class="nameDpto" data-dpto-id=${dpto.id}>${dpto.nomDepartamento}</td>
              <td><div class="iconCity" data-id-addCity=${dpto.id}><i class="fa-solid fa-circle-plus"></i></div></td>
              <td><button class="viewButton" data-id="${dpto.id}"><i class="fa-solid fa-circle-info"></i></button></td>
              <td><button class="editButtonDpto" data-id-edit="${dpto.id}"><i class="fa-solid fa-pen"></i></button></td>
              <td><button class="delButtonDpto" data-id-del="${dpto.id}"><i class="fa-solid fa-trash-can"></i></button></td>
            </tr>`;
    tableDptos.insertAdjacentHTML("afterbegin", rowHTML);
  });

  //agregar nueva ciudad
  const iconCities = document.querySelectorAll(".iconCity");
  iconCities.forEach((iconCity) => {
    iconCity.addEventListener("click", function () {
      const dptoId = this.getAttribute("data-id-addCity");
      const modalCity = new bootstrap.Modal(modalCities);
      modalCity.show();

      formAddCity.addEventListener("submit", function (e) {
        e.preventDefault();
         
        const data = {
          nomCiudad: nameInput.value,
          departamentoId: parseInt(dptoId),
          imagen: imageInput.value,
          coordenadas: {
            lat: parseInt(latitudInput.value),
            lon: parseInt(longitudInput.value),
          },
        };
        postData(data, "Ciudades");
        modalCity.hide();
      });
    });
  });

  //ver las ciudades del departamento seleccionado
  const viewButtons = document.querySelectorAll(".viewButton");
  // Asignar eventos a cada botón y al icono
  viewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const dptoId = this.dataset.id;
      showCities(dptoId);
    });
  });

  //editar la ruta directamente, sin modal
  const editDptoBtn = document.querySelectorAll(".editButtonDpto");
  editDptoBtn.forEach((dptoBtn) => {
    dptoBtn.addEventListener("click", function (e) {
      const row = dptoBtn.closest("tr");
      const nameCell = row.querySelector(".nameDpto");
      nameCell.setAttribute("contentEditable", true);
      nameCell.focus();

      nameCell.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
          const dptoId = nameCell.getAttribute("data-dpto-id");
          console.log(dptoId);
          nameCell.setAttribute("contentEditable", false);
          const dataName = {
            nomDepartamento: nameCell.innerText,
          };
          console.log(nameCell.innerText);
          patchData(dataName, dptoId, "Departamentos");
        }
      });
    });
  });

  //Eliminar el departamento
  const delRouteBtns = document.querySelectorAll(".delButtonDpto");
  delRouteBtns.forEach((delBtn) => {
    delBtn.addEventListener("click", function () {
       
      const dptoId = this.getAttribute("data-id-del");
      deleteData(dptoId, "Departamentos");
    });
  });
}
//Modal de el detalle de las ciudades
export async function showCities(dptoId) {
   
  const dataCities = await getCities();
   
  if (dataCities.length > 0) {
    let html = "";
    dataCities.forEach((city) => {
      if (city.departamentoId == dptoId) {
         
        html += `
          <div class="container-cities-route">
            <div class="cityInfo">
             <img class="img-detail" src="${city.imagen}" alt="">
              <p class="labelDetail">Ciudad:</p>
              <p class="nom">${city.nomCiudad}</p>
              <p class="labelDetail">Latitud:</p>
              <p class="lat">${city.coordenadas.lat}</p>
              <p class="labelDetail">Longitud:</p>
              <p class="lon">${city.coordenadas.lon}</p>
            </div>
            <div class="buttons">
              <button class="editBtnCities" id="editButton" data-edit="${city.id}" data-dptoId="${city.departamentoId}"><i class="fa-solid fa-pen"></i></button>
              <button class="delBtnCities" id="deleteButton" data-delete="${city.id}"><i class="fa-solid fa-trash-can"></i></button>
              <button class="weatherBtnCities" id="weatherButton" data-lat="${city.coordenadas.lat}" data-lon="${city.coordenadas.lon}"><i class="fa-solid fa-cloud-moon"></i></button>
              </div>
          </div>
        `;
      }
    });

    // Actualiza el contenido del modal con los stops encontrados
    modalContentDetail.innerHTML = html;
  } else {
    // Muestra un mensaje en el modal indicando que no hay paradas todavía
    modalContentDetail.innerHTML = "<p>No hay paradas disponibles</p>";
  }

  const modalDetail = new bootstrap.Modal(modalDetails);
  modalDetail.show();

  //editar cada ciudad
  const editBtnCities = document.querySelectorAll(".editBtnCities");
  editBtnCities.forEach((editBtn) => {
    editBtn.addEventListener("click", function () {
       
      const container = this.parentNode.parentNode;
      const nameCity = container.querySelector(".cityInfo p.nom").innerHTML;
      const image = container
        .querySelector(".cityInfo img")
        .getAttribute("src");
      const latCoor = container.querySelector(".cityInfo p.lat").innerHTML;
      const lonCoor = container.querySelector(".cityInfo p.lon").innerHTML;

      // Mostrar los datos en el modal
      const nameEditCity = document.getElementById("nameInputEdit");
      const imageEditCity = document.getElementById("imageInputEdit");
      const latEdit = document.getElementById("latitudInputEdit");
      const lonEdit = document.getElementById("longitudInputEdit");
      nameEditCity.value = nameCity;
      imageEditCity.value = image;
      latEdit.value = latCoor;
      lonEdit.value = lonCoor;

      // Mostrar el modal
      modalDetail.hide();

      const modalEdit = new bootstrap.Modal(modalCitiesEdit);
      modalEdit.show();

      const editId = editBtn.getAttribute("data-edit"); // Almacenar el valor de data-edit en una variable, para el patch
      const editDptoId = editBtn.getAttribute("data-dptoId");
       
      btnSaveEditCity.addEventListener("click", function (e) {
        e.preventDefault();
         
        // Obtener los nuevos valores editados del formulario
        const newName = nameEditCity.value;
        const newImage = imageEditCity.value;
        const newLat = parseInt(latEdit.value);
        const newLon = parseInt(lonEdit.value);
        const dataCity = {
          nomCiudad: newName,
          departamentoId: parseInt(editDptoId),
          imagen: newImage,
          coordenadas: { lat: newLat, lon: newLon },
        };
        patchData(dataCity, editId, "Ciudades");
      });
    });
  });

  //eliminar cada ciudad
  const delBtnStops = document.querySelectorAll(".delBtnCities");
  delBtnStops.forEach((delBtn) => {
    delBtn.addEventListener("click", function () {
      const container = this.parentNode.parentNode;
      const cityId = container
        .querySelector(".editBtnCities")
        .getAttribute("data-edit");
      deleteData(cityId, "Ciudades");
    });
  });

  //clima de cada ciudad
  const weatherBtn = document.querySelectorAll(".weatherBtnCities");
  weatherBtn.forEach((wBtn) => {
    wBtn.addEventListener("click", function () {
       
      const container = this.parentNode.parentNode;
      const nameCity = container.querySelector(".cityInfo p.nom").innerText;
      getWeather(nameCity);
      weatherBox.style.display = "block";
    });
  });
}

//Mostrar la tabla departamentos desde el nav
viewDptos.addEventListener("click", function () {
  getDptos();
  tableContent.style.display = "block";
});

//botón para crear nuevo departamento
createDpto.addEventListener("click", function (e) {
  e.preventDefault();
  const modalD = new bootstrap.Modal(modalDpto);
  modalD.show();

  formAddDpto.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      nomDepartamento: nameInputDpto.value,
    };

    postData(data, "Departamentos");
    modalD.hide();
  });
});
