import { Modal } from "./modal.js"
import { Visit, VisitTherapist, VisitCardiologist, VisitDentist, createNewVisit } from "./visit_patient.js"
import { showSpinner, hideSpinner } from "./hideSpinner.js"
import { checkCardsExist } from "./exist_cards.js"
import { customHttp } from "./token.js"
import { checkStatusResponse } from "./status_card.js"
import { deleteFromHtml } from "./delete_elem.js"
import { renderSpecialDetails } from "./render_element.js"
import { deleteModalConfirmBtnEdit, createModalConfirmBtnEdit } from "./modal_confirm_inf.js"
import { filterByKeyWord } from "./filter_words.js"
import { doctorsList, filterByDoctor } from "./filter_doctor.js"
import { urgencyList, filterByUrgency } from "./filter_urgency.js"
import { clearInputFields, clearSelectFields } from './form.js'

async function postCards({ nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age,
  bodyMassIndex, bloodPressure, pastDiseasesCardiovascularSystem, dateOfLastVisit }) {
  try {
    showSpinner()
    const { API_TOKEN, API_URL } = customHttp();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        nameClient: nameClient,
        doctor: doctor,
        purposeOfTheVisit: purposeOfTheVisit,
        briefVisitDescr: briefVisitDescr,
        urgency: urgency,
        age: age ,
        bodyMassIndex: bodyMassIndex ,
        bloodPressure: bloodPressure ,
        pDCSystem: pastDiseasesCardiovascularSystem ,
        dateOfLastVisit: dateOfLastVisit
      })
    });

    const card = await checkStatusResponse(response);
    const newCard = filterCardByDoctor(card);
    newCard.renderCard();
    newCard.addSpecialDetails();

  }

  catch (error) {
    console.error(error);
  }
  finally {
    hideSpinner()
    checkCardsExist();
  }
};

async function getCards() {
  try {
    showSpinner()
    const { API_TOKEN, API_URL } = customHttp();
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
    });
    const cards = await checkStatusResponse(response);

    cards.forEach(card => {
      const newCard = filterCardByDoctor(card);
      newCard.renderCard();
      newCard.addSpecialDetails();
    });

  }

  catch (error) {
    console.error(error);
  }
  finally {
    hideSpinner()
    checkCardsExist();
  }
};

function filterCardByDoctor(cardData) {
  if (cardData.doctor === "cardiologist") {
    return new CardiologistCard(cardData);
  }
  else if (cardData.doctor === "dentist") {
    return new DentistCard(cardData);
  }
  else if (cardData.doctor === "therapist") {
    return new TherapistCard(cardData)
  }
  else {
    return new Card(cardData)
  }
};

class Card {
  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr }) {
    this.id = id;
    this.nameClient = nameClient;
    this.doctor = doctor;
    this.urgency = urgency;
    this.purposeVisit = purposeOfTheVisit,
    this.visitDescr = briefVisitDescr;
  }

  async deleteCard() {
    try {
      showSpinner()
      const { API_TOKEN, API_URL } = customHttp();
      const API_URL_ID = `${API_URL}/${this.id}`;
      const response = await fetch(API_URL_ID, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        },
      });
      if (response.ok) {
        deleteFromHtml(this.id)

      }
    }
    catch (error) {
      console.error(error);
    }
    finally {
      hideSpinner()
      checkCardsExist()
    }
  }

  addSpecialDetails() {
    console.log(" ");
  }

  editCard() {

    createModalConfirmBtnEdit()
    const editVisitConfirmBtn = document.getElementById("edit-visit-confirm")

    editVisitConfirmBtn.addEventListener('click', (e) => {
      e.preventDefault();

      this.updateCard(createNewVisit())
      deleteModalConfirmBtnEdit()
      clearForm();
    })
  }

  async updateCard({ nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age,
    bodyMassIndex, bloodPressure, pastDiseasesCardiovascularSystem, dateOfLastVisit }) {

    try {
      showSpinner()
      const { API_TOKEN, API_URL } = customHttp();
      const API_URL_ID = `${API_URL}/${this.id}`;

      const responsePut = await fetch(API_URL_ID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          nameClient: nameClient || this.nameClient,
          doctor: doctor || this.doctor,
          purposeOfTheVisit: purposeOfTheVisit || this.purposeVisit,
          briefVisitDescr: briefVisitDescr || this.visitDescr,
          urgency: urgency || this.urgency,
          age: age || this.age || "",
          bodyMassIndex: bodyMassIndex || this.bodyMassIndex || "",
          bloodPressure: bloodPressure || this.bloodPressure || "",
          pDCSystem: pastDiseasesCardiovascularSystem || this.pDCSystem || "",
          dateOfLastVisit: dateOfLastVisit || this.dateOfLastVisit || ""
        })
      });

      const updatedCardServer = await checkStatusResponse(responsePut);
      const updatedCardHtml = filterCardByDoctor(updatedCardServer);
      deleteFromHtml(this.id)
      updatedCardHtml.renderCard();
      updatedCardHtml.addSpecialDetails();
  }

    catch (error) {
      console.error(error);
    }
    finally {
      hideSpinner()
    };
  }

  templateCard() {
    const card = `
      <div class="card-element mb-1" class="card_green" style="max-width: 32rem" id="${this.id}" data-doctor='${this.doctor}' data-urgency='${this.urgency}'>
        <div class="card text-center col-xl" style=" margin-bottom: 30px;">
          <div class="card-header bg-success">
              <h2 class="card-title mb-4 text-light">#Візит</h2>
              <button type="button" class="btn-close btn-close-white" id="delete-${this.id}"></button>
          </div>
          <div class="card-body">
            <p class="text1-cards">${this.nameClient}</p>
            <p class="text2-cards">${this.doctor}</p>
            <button class="btn bg-success" id="edit-${this.id}" data-bs-toggle="modal"
            data-bs-target="#createVisitModal">
              <span class="bg-success">Виправити картку</span>
            </button>
            <button class="btn bg-secondary text-white" type="button" data-bs-toggle="collapse"
                data-bs-target="#c${this.id}" aria-controls="c${this.id}">
                <span>Детальніше</span>
            </button>
            <div id="c${this.id}" class="collapse">
              <ul class="card-details mt-2 text-start">
                <li>
                  <span>Терміновість:</span>
                  <span>${this.urgency}</span>
                </li>
                <li>
                  <span>Мета візиту:</span>
                  <span>${this.purposeVisit}</span>
                </li>
                <li>
                  <span>Опис:</span>
                  <span>${this.visitDescr}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `
    return card;
  };


  renderCard() {
    const cardsContent = document.querySelector(".cards-content");
    let fragment = this.templateCard();
    cardsContent.insertAdjacentHTML("afterbegin", fragment);
    this.addEventListener();
  };


  addEventListener() {
    const deleteBtn = document.getElementById(`delete-${this.id}`);
    deleteBtn.addEventListener('click', this.deleteCard.bind(this));

    const editBtn = document.getElementById(`edit-${this.id}`);
    editBtn.addEventListener('click', this.editCard.bind(this));

  }
};

class CardiologistCard extends Card {
  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr, bodyMassIndex, bloodPressure, pDCSystem, age }) {
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.bodyMassIndex = bodyMassIndex;
    this.bloodPressure = bloodPressure;
    this.pDCSystem = pDCSystem;
    this.age = age;
  };
  addSpecialDetails() {
    const detailsElements = [
      { text: "Вік: ", value: this.age },
      { text: "Індекс маси тіла: ", value: this.bodyMassIndex },
      { text: "Тиск: ", value: this.bloodPressure },
      { text: "Серцево-судинна система: ", value: this.pDCSystem }
    ];
    renderSpecialDetails(detailsElements);
  }
};


class DentistCard extends Card {
  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr, dateOfLastVisit }) {
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.dateOfLastVisit = dateOfLastVisit;
  };
  addSpecialDetails() {
    const detailsElements = [
      { text: "Дата останнього візиту: ", value: this.dateOfLastVisit },
    ];
    renderSpecialDetails(detailsElements);
  }
};

class TherapistCard extends Card {
  constructor({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr, age }) {
    super({ id, nameClient, doctor, urgency, purposeOfTheVisit, briefVisitDescr })
    this.age = age;
  };
  addSpecialDetails() {
    const detailsElements = [
      { text: "Вік: ", value: this.age },
    ];
    renderSpecialDetails(detailsElements);
  }
};

const logIn = new Modal('logInModal', 'log-in-btn-modal');
const logInModal = logIn.getModalContent();
const logInModalInputs = logIn.getModalInputs();
const logInModalBtn = logIn.getModalConfirmBtn();
const logInDiv = document.querySelector('#log-in-div');
const createVisitDiv = document.querySelector('#create-visit-div');
const admin = {
    email: '123123@gmail.com',
    password: '123'
}

logIn.listenToInputs(logInModal, logInModalInputs, logInModalBtn);
logInModalBtn.addEventListener('click', (ev) => {
    ev.preventDefault();

    if(logIn.checkInputs(logInModalInputs, logInModalBtn) && isValid(adminEmail.value, admin.email) && isValid(adminPassword.value, admin.password)) {
        logInDiv.classList.toggle('hidden-element');
        createVisitDiv.classList.toggle('hidden-element');
        document.getElementById('filter-conditions').style.display = 'flex';

        getCards();
    } else {
        if (!logIn.checkInputs(logInModalInputs, logInModalBtn)) {
            logIn.addWarning('Введіть електронну пошту та пароль');
        } else if (!isValid(adminEmail.value, admin.email)) {
            logIn.addWarning('Електронна пошта не зареєстрована');
        } else if (!isValid(adminPassword.value, admin.password)) {
            logIn.addWarning('Пароль не вірний');
        }
    }
})

function isValid(inputValue, value) {
    return (inputValue === value)
}

const adminEmail = document.getElementById('user-email');
const adminPassword = document.getElementById('user-password');

logInModal.addEventListener('input', onAllInputs);
function onAllInputs() {
    if(isValid(adminEmail.value, admin.email) && isValid(adminPassword.value, admin.password)) {
        logInModalBtn.setAttribute('data-bs-dismiss', 'modal');
        logInModal.querySelector('.warning') ? logInModal.querySelector('.warning').remove() : '';
    } else {
        logInModalBtn.removeAttribute('data-bs-dismiss', 'modal');
    }
}


const createVisit = new Modal('createVisitModal', 'create-visit-confirm');
const createVisitModal = createVisit.getModalContent();
const createVisitInputs = createVisit.getModalInputs();
const createVisitConfirmBtn = createVisit.getModalConfirmBtn();
const doctorSelect = document.getElementById('doctor');
const selectDoctorBtn = document.getElementById('select-doctor-btn');
const visitForm = document.getElementById('visit-form');
const visitAddInfo = document.querySelector('.visit-add-info');

selectDoctorBtn.addEventListener('click', (ev) => {
  ev.preventDefault();
  showForm();
  selectDoctorBtn.classList.add('disabled');
})

function showForm() {
  let formAddFields = '';

  if (doctorSelect.value === 'therapist') {
    formAddFields = `
            <div class="mb-1">
                <label for="visit-age" class="col-form-label">Вік пацієнта:</label>
                <input type="text" class="form-control" id="visit-age">
            </div>        `
  }

  if (doctorSelect.value === 'dentist') {
    formAddFields = `
            <div class="mb-1">
                <label for="visit-last" class="col-form-label">Останній візит:</label>
                <input type="date" class="form-control" id="visit-last">
            </div>  `
  }

  if (doctorSelect.value === 'cardiologist') {
    formAddFields = `
            <div class="mb-1">
                <label for="visit-normal-pressure" class="col-form-label">Тиск:</label>
                <input type="text" class="form-control" id="visit-normal-pressure">
            </div>
            <div class="mb-1">
                <label for="visit-BMI" class="col-form-label">Індекс маси тіла:</label>
                <input type="text" class="form-control" id="visit-BMI">
            </div>
            <div class="mb-1">
                <label for="visit-heart-diseases" class="col-form-label">Перенесені захворювання серцево-судинної системи:</label>
                <input type="text" class="form-control" id="visit-heart-diseases">
            </div>
            <div class="mb-1">
                <label for="visit-age" class="col-form-label">Вік пацієнта:</label>
                <input type="text" class="form-control" id="visit-age">
            </div>
        `
  }

  visitAddInfo.insertAdjacentHTML('afterbegin', formAddFields);
  visitForm.classList.remove('hidden-element')
}

doctorSelect.addEventListener('change', () => {
  clearForm();
  const urgencySelect = document.getElementById('urgency');
  urgencySelect.value = urgencySelect.children[0].value;
})

createVisit.listenToInputs(createVisitModal, createVisitInputs, createVisitConfirmBtn);

createVisitConfirmBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (createVisit.checkInputs(createVisitInputs, createVisitConfirmBtn)) {
    postCards(createNewVisit());
    clearForm();
    clearSelectFields();
    createVisitConfirmBtn.removeAttribute('data-bs-dismiss', 'modal');
  } else {
    createVisit.addWarning('Всі поля повинні бути заповнені!');
  }
})

const createVisitCancelBtn = document.getElementById('create-visit-cancel');
createVisitCancelBtn.addEventListener('click', (e) => {
  e.preventDefault();

  clearForm();
  clearSelectFields();

  deleteModalConfirmBtnEdit()
})

function clearForm() {
  hideForm();
  deleteAddInfo();
  deleteWarning();
  clearInputFields();

  selectDoctorBtn.classList.remove('disabled');
}

function hideForm() {
  visitForm.classList.add('hidden-element');
}

function deleteAddInfo() {
  Array.from(visitAddInfo.children).forEach(child => {
    child.remove();
  });
  createVisitModal.querySelector('.warning') ? createVisitModal.querySelector('.warning').remove() : '';
}

function deleteWarning() {
  document.querySelector('.warning') ? document.querySelector('.warning').remove() : '';
}

document.addEventListener('click', (ev) => {
  if (ev.target.classList.contains('modal')) {
    clearForm();
    clearSelectFields();

    deleteModalConfirmBtnEdit()
  }
})


doctorsList.addEventListener('change', filterByDoctor);
urgencyList.addEventListener('change', filterByUrgency);

const autocompleteInput = document.getElementById("autocomplete-input");
autocompleteInput.addEventListener("input", function() {
  filterByKeyWord(autocompleteInput);
});
