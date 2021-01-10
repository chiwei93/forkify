import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    //check if uploadData exist
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            //telling the API that we will send the data in json format
            'Content-Type': 'application/json',
          },
          //the data you want to send
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    //Promise.race is used to have the fetch race against the timeout function so that the fetch will not run forever
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    //this will return the result of the res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    //Promise.race is used to have the fetch race against the timeout function so that the fetch will not run forever
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    //this will return the result of the res.json();
    return data;
  } catch (err) {
    //rethrowing the error so that the model can detect it and use it for error handling
    throw err;
  }
};
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        //telling the API that we will send the data in json format
        'Content-Type': 'application/json',
      },
      //the data you want to send
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    //this will return the result of the res.json();
    return data;
  } catch (err) {
    //rethrowing the error so that the model can detect it and use it for error handling
    throw err;
  }
};
*/
