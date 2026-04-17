//step 1: Build auth token
const username = 'coalition';
const password = 'skills-test';
const authToken = btoa(username + ':' + password);


//step 2:  fetch all patients 
// async function getAllPatients(){
//   try{

//     const response =  await fetch(
//       'https://fedskillstest.coalitiontechnologies.workers.dev',
//       {

//         method : 'GET',
//         headers : {
//           'Authorization' : 'Basic ' + authToken
//         }
//       }
//     );

//     //step 3: convert to json
//     const patients = await response.json();

//     //step 4: display patients in console
//     console.log('total patients :',patients.length);
//     console.log('All Patients', patients);
//     return patients;

//   }
//   catch(error)
//   {
//     console.error('Error fetching patients:', error);
//   }
// }

//getAllPatients();


async function getPatientData(){
  try{
    // make the fetch request to the API endpoint
    const response = await fetch(
      'https://fedskillstest.coalitiontechnologies.workers.dev',
      {
        method : 'GET',
        headers : {
          'Authorization' : 'Basic ' + authToken
        }
      }
    );

    // parse the response as JSON
    const patients = await response.json();

    //find Jessica's record
    const jessicaRecord = patients.find(patient => patient.name === 'Jessica Taylor');
    console.log(jessicaRecord);
    return jessicaRecord;

  }catch(error){
    console.log('Error fetching patients :',error);
  }
}

getPatientData();