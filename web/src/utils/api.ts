import axios from 'axios';

async function get(endpoint: string) {
  return axios.get(endpoint);
}

async function post(endpoint: string, data: any) {
  const bodyData = JSON.stringify(data);

  return axios.post(endpoint, bodyData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function patch(endpoint: string, data: any) {
  const bodyData = JSON.stringify(data);

  return axios.put(endpoint, bodyData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function del(endpoint: string) {
  return axios.delete(endpoint);
}

export { get, post, patch, del as delete };
