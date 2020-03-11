import axios, { AxiosResponse } from 'axios';
import Dog from '@/models/dog';

const a = axios.create({
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  baseURL: process.env.VUE_APP_BACKEND_PATH,
});

function getDogList(): Promise<AxiosResponse<Dog[]>> {
  return a.get('/api/dog/list');
}

function getDog(id: string): Promise<AxiosResponse<Dog>> {
  return a.get(`/api/dog/${id}`);
}

function postDog(dog: Dog): Promise<AxiosResponse<Dog>> {
  return a.post('api/dog', dog);
}

function delDog(id: string): Promise<AxiosResponse<Dog>> {
  return a.delete(`/api/dog/${id}`);
}

function putDog(id: string, dog: Dog): Promise<AxiosResponse<Dog>> {
  return a.put(`/api/dog/${id}`, dog);
}
export default {
  getDogList,
  getDog,
  postDog,
  delDog,
  putDog,
};
