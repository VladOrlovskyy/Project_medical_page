class Visit {
    constructor(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency) {
        this.nameClient = nameClient,
        this.doctor = doctor,
        this.purposeOfTheVisit = purposeOfTheVisit,
        this.briefVisitDescr = briefVisitDescr,
        this.urgency = urgency
    }
}

class VisitCardiologist extends Visit {
    constructor(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age, bodyMassIndex, bloodPressure, pastDiseasesCardiovascularSystem) {
        super(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency),
        this.age = age,
        this.bodyMassIndex = bodyMassIndex,
        this.bloodPressure = bloodPressure,
        this.pastDiseasesCardiovascularSystem = pastDiseasesCardiovascularSystem
    }
}

class VisitDentist extends Visit {
    constructor(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, dateOfLastVisit) {
        super(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency),
        this.dateOfLastVisit = dateOfLastVisit
    }
}

class VisitTherapist extends Visit {
    constructor(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age) {
        super(nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency),
        this.age = age
    }
}


function createNewVisit() {
    let newVisit;
    const doctorSelect = document.getElementById('doctor');


        if (doctorSelect.value === 'cardiologist') {
            newVisit = new VisitCardiologist(
                document.getElementById('visit-patient').value,
                document.getElementById('doctor').value,
                document.getElementById('visit-purpose').value,
                document.getElementById('visit-description').value,
                document.getElementById('urgency').value,
                document.getElementById('visit-age').value,
                document.getElementById('visit-BMI').value,
                document.getElementById('visit-normal-pressure').value,
                document.getElementById('visit-heart-diseases').value
            )
        }


    if (doctorSelect.value === 'dentist') {
        newVisit = new VisitDentist(
            document.getElementById('visit-patient').value,
            document.getElementById('doctor').value,
            document.getElementById('visit-purpose').value,
            document.getElementById('visit-description').value,
            document.getElementById('urgency').value,
            document.getElementById('visit-last').value
        )
    }

        if (doctorSelect.value === 'therapist') {
            newVisit = new VisitTherapist(
                document.getElementById('visit-patient').value,
                document.getElementById('doctor').value,
                document.getElementById('visit-purpose').value,
                document.getElementById('visit-description').value,
                document.getElementById('urgency').value,
                document.getElementById('visit-age')?.value
            )
        }



    const {nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age, bodyMassIndex, bloodPressure, pastDiseasesCardiovascularSystem, dateOfLastVisit} = newVisit;
    return {nameClient, doctor, purposeOfTheVisit, briefVisitDescr, urgency, age, bodyMassIndex, bloodPressure, pastDiseasesCardiovascularSystem, dateOfLastVisit}
}

export { Visit, VisitDentist, VisitCardiologist, VisitTherapist, createNewVisit }
