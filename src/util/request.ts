import axios, { AxiosRequestConfig } from 'axios';
//import history from './history';
//import { getAuthData } from './storage';

export const BASE_URL = 'https://psjdesenv531:8085/api'
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID ?? 'myclientid';
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET ?? 'myclientsecret';

const basicHeader = () =>
  'Basic ' + window.btoa(CLIENT_ID + ':' + CLIENT_SECRET);

type LoginData = {
  username: string;
  password: string;
};

export const requestBackend = (config: AxiosRequestConfig) => {
  /*const headers = config.withCredentials
    ? {
        Authorization: 'Bearer ' + getAuthData().access_token,
      }
    : config.headers;*/

  return axios({ ...config, baseURL: BASE_URL });
};

//private
export const makePrivateRequest = (params: AxiosRequestConfig) => {
  /*const headers = {
    Authorization: 'Bearer ' + getAuthData().access_token,
  }*/

  return requestBackend({...params})
}

/*axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    if (error.response.status === 401) {
      history.push('/');
    }
    return Promise.reject(error);
  }
);*/