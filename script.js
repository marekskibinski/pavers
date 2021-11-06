const formPavers = document.getElementById('form');
const applicantName = document.getElementById('name');
const applicantEmail = document.getElementById('email');
const dateOfApplication = document.getElementById('date');
const aboutYou = document.getElementById('about');
const reasonForApplying = document.getElementById('reason');
const whatYouKnowAboutPavers = document.getElementById('aboutPavers');
const file = document.getElementById('file');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
// const btnsOpenModal = document.querySelector('.show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = 'form-control error';
  const small = formControl.querySelector('small');
  small.innerText = message;
}

//Show success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = 'form-control success';
}

// Check email is valid
function checkEmail(input) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test(input.value.trim())) {
    showSuccess(input);

    return true;
  } else {
    showError(input, 'Email is not valid');
  }

  return false;
}

// Check required fields
function checkRequired(inputArr) {
  inputArr.forEach(function (input) {
    if (input.value.trim() === '') {
      showError(input, `${getFieldName(input)} is required`);
    } else {
      showSuccess(input);
    }
  });
}

// Check date
function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
}

//Get field name
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Check input lenght
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be maximum ${max} characters`
    );
  } else {
    showSuccess(input);

    return true; // Zwraca true jeśli walidacja ok
  }

  return false; // Zwraca false jeśli walidacja nie ok
}

// Check file name
const checkFileName = [
  'image/png',
  'image/jpg',
  'image/gif',
  'image/jpeg',
  'image/bmp',
];
file.accept = checkFileName;
file.addEventListener('change', () => {
  // console.log(file.value);
});

// Event listners
function validateForm() {
  checkRequired([
    applicantName,
    applicantEmail,
    aboutYou,
    reasonForApplying,
    whatYouKnowAboutPavers,
    dateOfApplication,
  ]);
  const isValidApplicantName = checkLength(applicantName, 1, 50);
  const isValidAboutYou = checkLength(aboutYou, 1, 255);
  const isValidReasonForApplying = checkLength(reasonForApplying, 1, 255);
  const isValidWhatYouKnowAboutPavers = checkLength(
    whatYouKnowAboutPavers,
    1,
    255
  );
  const isValidApplicantEmail = checkEmail(applicantEmail);
  const isValiDate = isValidDate(dateOfApplication.value);

  console.log('isValiDate ::: ', isValiDate); // Mozna dodać intro do console.log, zebyś wiedział czego wartość ci wypisuje w konsoli

  const allowSubmit =
    isValidApplicantName &&
    isValidAboutYou &&
    isValidReasonForApplying &&
    isValidWhatYouKnowAboutPavers &&
    isValidApplicantEmail &&
    isValiDate; // allowSubmit is true if all variable are true

  console.log(
    'form value ::: ',
    `${applicantName.value}
    ${applicantEmail.value}
    ${date.value}
    ${aboutYou.value}
    ${reasonForApplying.value}
    ${whatYouKnowAboutPavers.value} `
  );

  return allowSubmit;
}

formPavers.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(e) {
  e.preventDefault();

  const allowSubmit = validateForm();

  if (allowSubmit) {
    // if validation is true the form is sent if not nothing happens
    const form = e.currentTarget;
    const url = form.action;

    try {
      const formData = new FormData(form);
      const response = await postFormDataAsJson({ url, formData });
      console.log('response ::: ', response);

      openModal();
      btnCloseModal.addEventListener('click', closeModal);
      overlay.addEventListener('click', closeModal);

      formPavers.reset();
    } catch (err) {
      console.log('err ::: ', err);
    }
  }
}

async function postFormDataAsJson({ url, formData }) {
  const plainData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainData);
  console.log(plainData);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: formDataJsonString,
  };
  console.log('formDataJsonString ::: ', formDataJsonString);
  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errMessage = await response.text();
    throw new Error(errMessage);
  }
  return response.text();
}
