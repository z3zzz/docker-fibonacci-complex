import axios from 'axios';

const { protocol, hostname } = window.location;
const backendPort = process.env.REACT_APP_BACKEND_PORT || 5000;
const baseUrl = `${protocol}//${hostname}:${backendPort}`;

async function get(endpoint: string) {
  return axios.get(baseUrl + endpoint);
}

async function post(endpoint: string, data: any) {
  const bodyData = JSON.stringify(data);

  return axios.post(baseUrl + endpoint, bodyData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function patch(endpoint: string, data: any) {
  const bodyData = JSON.stringify(data);

  return axios.put(baseUrl + endpoint, bodyData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function del(endpoint: string) {
  return axios.delete(baseUrl + endpoint);
}

export { get, post, patch, del as delete };
