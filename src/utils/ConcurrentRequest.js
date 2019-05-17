export function ConcurrentRequest(dispatch, requests, pri_callback, that) {
  var responses = [];
  for (let i = 0; i < requests.length; i++) {
    responses.push({});
  }
  var successRequestCount = 0;
  for (let i = 0; i < requests.length; i++) {
    if (requests[i].type && requests[i].payload) {
      dispatch({
        type: requests[i].type,
        payload: requests[i].payload,
        callback: response => {
          responses[i] = response;
          successRequestCount++;
          if (requests.length == successRequestCount) {
            if (pri_callback) pri_callback(responses, that);
          }
        },
      });
    }
  }
}
