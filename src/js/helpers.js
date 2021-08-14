// Global Functions that getting reused and reused again
import { TIMEOUT_SEC } from './config.js';
function timeout(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}
export async function AJAX(url, uploadData = undefined) {
  try {
    // Fetch API post

    const fetchPro = (await uploadData)
      ? fetch(url, {
          // The type of the call of the api
          method: 'POST',
          headers: {
            // content type is needed to tell the api the data is the json format
            'Content-Type': 'application/json',
          },
          // The content itself in json format
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC, url)]);
    const data = await res.json();

    // When the repsonse is not ok
    if (!res.ok) throw new Error(`${data.message} (${res.statusText})`);
    return data;
  } catch (error) {
    throw error;
  }
}

// // Get the json from the api and throw error if there is bugged
// // Return array
// export async function getJSON(url) {
//   try {
//     // Loading Recipe

//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC, url)]);

//     const data = await res.json();

//     // When the repsonse is not ok
//     if (!res.ok) throw new Error(`${data.message} (${res.statusText})`);

//     return data;
//   } catch (error) {
//     throw error;
//   }
// }
// export async function sendJSON(url, uploadData) {
//   try {
//     // Fetch API post
//     const fetchPro = await fetch(url, {
//       // The type of the call of the api
//       method: 'POST',
//       headers: {
//         // content type is needed to tell the api the data is the json format
//         'Content-Type': 'application/json',
//       },
//       // The content itself in json format
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC, url)]);
//     const data = await res.json();

//     // When the repsonse is not ok
//     if (!res.ok) throw new Error(`${data.message} (${res.statusText})`);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// }
